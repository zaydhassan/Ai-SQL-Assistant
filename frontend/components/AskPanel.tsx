"use client";

import React, { useState } from "react";
import ChartRenderer from "./ChartRenderer";

type Props = {
  datasetId: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export default function AskPanel({ datasetId }: Props) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<any | null>(null);

  async function handleAsk(e?: React.FormEvent) {
    e?.preventDefault();
    if (!question.trim() || loading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not logged in. Please login again.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const res = await fetch(
        `${API_BASE}/api/datasets/${datasetId}/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify({ question }),
        }
      );

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        setError(data?.detail || "Failed to process query");
      } else {
        setAnswer(data);
      }
    } catch {
      setError("Backend not reachable. Is it running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ask-card glass glow fade-in">
      <form onSubmit={handleAsk} className="ask-bar">
        <input
          className="input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about this dataset…"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing…" : "Ask"}
        </button>
      </form>

      {error && <div className="error-banner">{error}</div>}

      {answer && (
        <div className="result-stack">
        
          <div className="sql-card">
            <div className="sql-header">
              <span className="badge">AI Generated SQL</span>
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(answer.sql)}
              >
                Copy
              </button>
            </div>
            <pre className="sql-pre">{answer.sql}</pre>
          </div>

          <div className="kpi-grid">
            {answer.analysis?.rows !== undefined && (
              <div className="kpi">
                <div className="kpi-label">Rows</div>
                <div className="kpi-value">{answer.analysis.rows}</div>
              </div>
            )}
            {answer.analysis?.mean !== undefined && (
              <div className="kpi">
                <div className="kpi-label">Average</div>
                <div className="kpi-value">
                  {Math.round(answer.analysis.mean)}
                </div>
              </div>
            )}
          </div>

          {answer.rows && answer.rows.length > 0 && (
            <>
              <ChartRenderer rows={answer.rows} />

              <div className="table-wrap">
                <table className="simple-table">
                  <thead>
                    <tr>
                      {Object.keys(answer.rows[0]).map((c) => (
                        <th key={c}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {answer.rows.slice(0, 50).map((row: any, i: number) => (
                      <tr key={i}>
                        {Object.keys(answer.rows[0]).map((c) => (
                          <td key={c}>{String(row[c])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}