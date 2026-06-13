"use client";

import { useState } from "react";
import { AssessmentRecord } from "@/types/health";

type MetricKey = "overall_risk" | "cardiovascular_risk" | "diabetes_risk" | "mental_health_risk";

const METRICS: { key: MetricKey; label: string; color: string; bgColor: string }[] = [
  { key: "overall_risk", label: "Overall", color: "bg-primary-500", bgColor: "bg-primary-100" },
  { key: "cardiovascular_risk", label: "Cardiovascular", color: "bg-red-500", bgColor: "bg-red-100" },
  { key: "diabetes_risk", label: "Diabetes", color: "bg-amber-500", bgColor: "bg-amber-100" },
  { key: "mental_health_risk", label: "Mental Health", color: "bg-purple-500", bgColor: "bg-purple-100" },
];

export default function TrendChart({ history }: { history: AssessmentRecord[] }) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("overall_risk");

  // Show data in chronological order (oldest first)
  const chronological = [...history].reverse();

  const metric = METRICS.find((m) => m.key === activeMetric)!;
  const values = chronological.map((r) => r[activeMetric]);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  // Calculate trend
  const trend = values.length > 1 ? values[values.length - 1] - values[0] : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-semibold text-lg">Progress Trends</h2>
          <p className="text-sm text-gray-500">
            {values.length} data point{values.length > 1 ? "s" : ""} — avg: {avg.toFixed(1)}%
            {values.length > 1 && (
              <span className={`ml-2 font-medium ${trend <= 0 ? "text-green-600" : "text-red-500"}`}>
                ({trend > 0 ? "+" : ""}{trend.toFixed(1)}% trend)
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setActiveMetric(m.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeMetric === m.key
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-gray-400 w-8">
          <span>{Math.ceil(maxVal)}%</span>
          <span>{Math.round(maxVal / 2)}%</span>
          <span>0%</span>
        </div>

        {/* Bars */}
        <div className="ml-10 flex items-end gap-1 h-56">
          {chronological.map((record, i) => {
            const value = record[activeMetric];
            const height = maxVal > 0 ? (value / maxVal) * 100 : 0;
            const isLatest = i === chronological.length - 1;

            return (
              <div
                key={record.id}
                className="flex-1 flex flex-col items-center group relative min-w-0"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                    <p className="font-medium">{value.toFixed(1)}%</p>
                    <p className="text-gray-300">{formatShortDate(record.created_at)}</p>
                  </div>
                </div>

                {/* Bar */}
                <div
                  className={`w-full rounded-t-md transition-all duration-300 cursor-pointer hover:opacity-80 ${
                    isLatest ? metric.color : metric.bgColor
                  } ${isLatest ? "" : "opacity-70"}`}
                  style={{ height: `${height}%`, minHeight: value > 0 ? "4px" : "0" }}
                />

                {/* X-axis label (show every few to avoid crowding) */}
                {(chronological.length <= 10 || i % Math.ceil(chronological.length / 8) === 0 || isLatest) && (
                  <span className="text-[10px] text-gray-400 mt-2 truncate max-w-full">
                    {formatShortDate(record.created_at)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend / Stats */}
      {values.length > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <p className="text-gray-400">Lowest</p>
            <p className="font-semibold text-green-600">{minVal.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-400">Average</p>
            <p className="font-semibold text-gray-700">{avg.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-400">Latest</p>
            <p className={`font-semibold ${metric.color.replace("bg-", "text-")}`}>
              {values[values.length - 1].toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
