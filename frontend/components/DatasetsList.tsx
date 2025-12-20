"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GlassCard from "./GlassCard";

type Dataset = {
  id: number;
  name: string;
};

export default function DatasetsList() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/datasets")
      .then((r) => r.json())
      .then(setDatasets)
      .catch(() => setDatasets([]));
  }, []);

  return (
    <GlassCard>
      <h3>Your Datasets</h3>

      {datasets.length === 0 && (
        <p className="muted">No datasets uploaded yet</p>
      )}

      <ul className="dataset-list">
        {datasets.map((d) => (
          <li key={d.id} className="dataset-item">
            <Link href={`/datasets/${d.id}`}>
              <span className="dataset-link">
                📊 {d.name}
              </span>
              <span className="dataset-meta">
                Ready for questions
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}