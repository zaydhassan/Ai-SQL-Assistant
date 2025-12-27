"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function UploadDatasetForm() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name.replace(".csv", ""));

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/datasets/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, 
        }
      );

      if (!res.ok) {
        let errorMessage = "Upload failed";

        try {
          const err = await res.json();
          errorMessage = err.detail || errorMessage;
          
        } catch {
          console.error("UPLOAD ERROR: No JSON body");
        }

        throw new Error(errorMessage);
      }

      toast.success("Dataset uploaded successfully");
      setFile(null);

      window.dispatchEvent(new Event("dataset-updated"));

    } catch (err: any) {
      toast.error(err.message || "Upload failed");
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

      <button
        onClick={upload}
        disabled={!file || loading}
        className="upload-btn"
      >
        {loading ? "Indexing dataset…" : "Upload Dataset"}
      </button>

      <div className="upload-hint">
        🤖 AI will infer columns, types, and relationships
      </div>
    </div>
  );
}