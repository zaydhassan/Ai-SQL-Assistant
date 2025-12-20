"use client";

import React from "react";
import {
  Bar,
  Line,
  Doughnut,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

type Props = {
  rows: any[];
};

export default function ChartRenderer({ rows }: Props) {
  if (!rows || rows.length === 0) return null;

  const columns = Object.keys(rows[0]);

  if (rows.length === 1 && columns.length === 1) {
    const value = rows[0][columns[0]];

    return (
      <div className="kpi-chart glass fade-in">
        <div className="kpi-label">{columns[0]}</div>
        <div className="kpi-big">
          {Number(value).toLocaleString()}
        </div>
      </div>
    );
  }

  if (rows.length === 1 && columns.length > 1) {
    return (
      <div className="kpi-grid fade-in">
        {columns.map((c) => (
          <div key={c} className="kpi glass">
            <div className="kpi-label">{c}</div>
            <div className="kpi-value">
              {Number(rows[0][c]).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const labelCol = columns[0];
  const valueCol = columns[1];

  const labels = rows.map((r) => String(r[labelCol]));
  const values = rows.map((r) => Number(r[valueCol]));

  const COLORS = [
  "#8b5cf6", //purple
  "#6366f1", // indigo
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
];

const data = {
  labels,
  datasets: [
    {
      label: valueCol,
      data: values,
      backgroundColor: labels.map(
        (_, i) => COLORS[i % COLORS.length] + "cc"
      ),
      borderColor: labels.map(
        (_, i) => COLORS[i % COLORS.length]
      ),
      borderWidth: 1,
      tension: 0.35,
    },
  ],
};

  const isTimeSeries =
    labels[0]?.includes("-") || labels[0]?.includes("/");

  return (
    <div className="chart-container glass fade-in">
      {isTimeSeries ? (
        <Line data={data} />
      ) : labels.length <= 6 ? (
        <Doughnut
  data={data}
  options={{
    maintainAspectRatio: false,
    cutout: "55%",
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#c7c7d1",
          boxWidth: 18,
        },
      },
    },
  }}
/>
      ) : (
        <Bar data={data} />
      )}
    </div>
  );
}