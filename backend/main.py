from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from db import SessionLocal, engine
from models import Dataset, Query, User
from gemini_client import model
import pandas as pd
import numpy as np
import uuid
import json

app = FastAPI(title="AI SQL Assistant Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.on_event("startup")
def startup():
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == 1).first()
        if not user:
            user = User(id=1, email="demo@example.com", name="Demo User")
            db.add(user)
            db.commit()
    finally:
        db.close()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/datasets/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    name: str = Form("Untitled Dataset"),
    db: Session = Depends(get_db),
):
    user_id = 1
    content = await file.read()
    try:
        df = pd.read_csv(pd.io.common.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV: {e}")
    if df.empty:
        raise HTTPException(status_code=400, detail="CSV is empty")
    table_name = f"dataset_{uuid.uuid4().hex}"
    try:
        df.to_sql(table_name, engine, index=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save dataset: {e}")
    dataset = Dataset(user_id=user_id, name=name, table_name=table_name)
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    return {"dataset_id": dataset.id, "name": dataset.name}


@app.get("/api/datasets")
def list_datasets(db: Session = Depends(get_db)):
    user_id = 1
    datasets = (
        db.query(Dataset)
        .filter(Dataset.user_id == user_id)
        .order_by(Dataset.created_at.desc())
        .all()
    )
    return [
        {
            "id": d.id,
            "name": d.name,
            "created_at": d.created_at.isoformat() if d.created_at else None,
        }
        for d in datasets
    ]


@app.get("/api/datasets/{dataset_id}")
def get_dataset(dataset_id: str, db: Session = Depends(get_db)):
    user_id = 1
    try:
        did = int(dataset_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid dataset id")
    dataset = (
        db.query(Dataset)
        .filter(Dataset.id == did, Dataset.user_id == user_id)
        .first()
    )
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return {
        "id": dataset.id,
        "name": dataset.name,
        "created_at": dataset.created_at.isoformat() if dataset.created_at else None,
    }


@app.post("/api/datasets/{dataset_id}/ask")
async def ask_dataset(
    dataset_id: int,
    payload: dict,
    db: Session = Depends(get_db),
):
    question = payload.get("question")
    if not question:
        raise HTTPException(status_code=400, detail="Question is required")
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    table_name = dataset.table_name
    try:
        sample_df = pd.read_sql_query(
            f'SELECT * FROM "{table_name}" LIMIT 5', engine
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read sample data: {e}")
    schema_desc = ", ".join(
        f"{col} ({dtype})" for col, dtype in zip(sample_df.columns, sample_df.dtypes)
    )
    prompt = f"""
You are an expert data analyst and PostgreSQL SQL generator.

The data is stored in a PostgreSQL table "{table_name}" with columns:
{schema_desc}

Important rules:
- The table was created from a CSV, so date-like columns such as "order_date" are stored as TEXT, not DATE.
- When you need to group, filter, or format dates, always cast the column to DATE first.
  Valid examples:
  - TO_CHAR(order_date::DATE, 'YYYY-MM')
  - DATE_TRUNC('month', order_date::DATE)
- Only generate a single PostgreSQL SELECT statement that answers the user's question.
- Do not wrap the query in markdown or use ``` fences.
- Never use DELETE, UPDATE, INSERT, DROP, ALTER, or TRUNCATE.
- Use double quotes for table and column names when appropriate.

User question: "{question}"
"""
    gemini_resp = model.generate_content(prompt)
    sql = (
        gemini_resp.text
        .replace("```sql", "")
        .replace("```", "")
        .strip()
    )
    if "TO_CHAR(order_date" in sql and "::DATE" not in sql:
        sql = sql.replace("TO_CHAR(order_date", "TO_CHAR(order_date::DATE")
    lowered = sql.lower()
    banned = ["delete ", "update ", "insert ", "drop ", "alter ", "truncate "]
    if any(b in lowered for b in banned):
        raise HTTPException(status_code=400, detail="Unsafe SQL generated")
    try:
        df = pd.read_sql_query(sql, engine)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SQL error: {e}")
    analysis = {}
    if not df.empty:
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        if numeric_cols:
            col = numeric_cols[0]
            analysis = {
                "rows": int(len(df)),
                "column_analyzed": col,
                "min": float(df[col].min()),
                "max": float(df[col].max()),
                "mean": float(df[col].mean()),
            }
    explain_prompt = f"""
You are a data analyst. Here is a result dataframe as JSON:
{df.head(30).to_json(orient="records")}

Based on this, explain the key insight in 2-3 sentences.
Also suggest a chart type to visualize this result.
Chart type must be one of: ["line", "bar", "pie", "table-only"].

Return a JSON like:
{{"explanation": "...", "chartType": "bar"}}
"""
    explain_resp = model.generate_content(explain_prompt)
    try:
        meta = json.loads(explain_resp.text)
    except Exception:
        meta = {"explanation": "", "chartType": "table-only"}
    user_id = 1
    q = Query(
        dataset_id=dataset.id,
        user_id=user_id,
        question=question,
        sql=sql,
        result_json=json.loads(df.to_json(orient="records")),
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return {
        "query_id": q.id,
        "sql": sql,
        "rows": q.result_json,
        "analysis": analysis,
        "meta": meta,
    }