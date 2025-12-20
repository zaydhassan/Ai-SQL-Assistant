"use client";

import { useState } from "react";

export default function UploadDatasetForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("name", file.name.replace(".csv", ""));

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/datasets/upload", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error();

      window.location.reload();
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass upload-card">
      <h3>Upload CSV</h3>
      <p className="muted">
        Drag & drop your CSV. AI will analyze the schema automatically.
      </p>

      {/* DROP ZONE */}
      <label className="drop-zone">
        <input
          type="file"
          accept=".csv"
          hidden
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {!file ? (
          <div className="drop-placeholder">
            ⬆ Drop CSV here or click to browse
          </div>
        ) : (
          <div className="file-preview">
            <strong>{file.name}</strong>
            <span className="muted">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        )}
      </label>

      {/* CTA */}
      <button
        onClick={upload}
        disabled={!file || loading}
        className="upload-btn"
      >
        {loading ? "Indexing dataset…" : "Upload Dataset"}
      </button>

      {/* AI HINT */}
      <div className="upload-hint">
        🤖 AI will infer columns, types, and relationships
      </div>
    </div>
  );
}