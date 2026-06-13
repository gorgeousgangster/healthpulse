"use client";

import { RiskExplanation, TargetExplanation, FeatureExplanation } from "@/types/health";
import { useState } from "react";

const TARGET_LABELS: Record<string, string> = {
  cardiovascular: "Cardiovascular",
  diabetes: "Diabetes",
  mental_health: "Mental Health",
};

const TARGET_COLORS: Record<string, string> = {
  cardiovascular: "text-red-600",
  diabetes: "text-amber-600",
  mental_health: "text-purple-600",
};

function ShapBar({ feature, maxAbsValue }: { feature: FeatureExplanation; maxAbsValue: number }) {
  const isRisk = feature.direction === "risk";
  const width = maxAbsValue > 0 ? (Math.abs(feature.shap_value) / maxAbsValue) * 100 : 0;

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-36 text-right">
        <span className="text-xs text-gray-600 truncate block">{feature.display_name}</span>
      </div>
      <div className="flex-1 flex items-center">
        <div className="w-full relative h-5 flex items-center">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300" />
          {/* Bar */}
          {isRisk ? (
            <div className="absolute left-1/2 h-4 rounded-r-sm bg-red-400 transition-all duration-300"
              style={{ width: `${width / 2}%` }} />
          ) : (
            <div className="absolute right-1/2 h-4 rounded-l-sm bg-green-400 transition-all duration-300"
              style={{ width: `${width / 2}%` }} />
          )}
        </div>
      </div>
      <div className="w-16 text-right">
        <span className={`text-xs font-mono font-medium ${isRisk ? "text-red-600" : "text-green-600"}`}>
          {isRisk ? "+" : ""}{feature.shap_value.toFixed(1)}
        </span>
      </div>
      <div className="w-14 text-right">
        <span className="text-xs text-gray-400">{feature.value}</span>
      </div>
    </div>
  );
}

function TargetPanel({ target, label }: { target: TargetExplanation; label: string }) {
  const topFeatures = target.features.slice(0, 8);
  const maxAbsValue = Math.max(...topFeatures.map((f) => Math.abs(f.shap_value)), 0.1);
  const riskFeatures = topFeatures.filter((f) => f.direction === "risk");
  const protectiveFeatures = topFeatures.filter((f) => f.direction === "protective");

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm text-gray-700">{label} Risk</h4>
        <div className="text-xs text-gray-500">
          Base: {target.base_value.toFixed(1)}% → Predicted: <span className="font-semibold">{target.prediction.toFixed(1)}%</span>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-1 px-1">
          <span className="text-green-500">← Protective</span>
          <span className="flex-1" />
          <span className="text-red-500">Risk →</span>
        </div>
      </div>

      {topFeatures.length > 0 ? (
        <div className="space-y-0">
          {topFeatures.map((feature) => (
            <ShapBar key={feature.name} feature={feature} maxAbsValue={maxAbsValue} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">No significant factors</p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-red-500 font-medium">Top risk drivers:</span>
          <ul className="mt-1 space-y-0.5">
            {riskFeatures.slice(0, 3).map((f) => (
              <li key={f.name} className="text-gray-600">
                {f.display_name} ({f.value})
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="text-green-500 font-medium">Protective factors:</span>
          <ul className="mt-1 space-y-0.5">
            {protectiveFeatures.slice(0, 3).map((f) => (
              <li key={f.name} className="text-gray-600">
                {f.display_name} ({f.value})
              </li>
            ))}
            {protectiveFeatures.length === 0 && (
              <li className="text-gray-400 italic">None detected</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ShapExplanation({ explanation }: { explanation: RiskExplanation }) {
  const [activeTab, setActiveTab] = useState<"cardiovascular" | "diabetes" | "mental_health">("cardiovascular");

  const targets = (["cardiovascular", "diabetes", "mental_health"] as const).filter(
    (key) => explanation[key] !== null
  );

  if (targets.length === 0) return null;

  const activeTarget = explanation[activeTab];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">AI Explainability — What Drives Your Risk</h2>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
          SHAP Analysis
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Each bar shows how much a specific factor pushes your risk score up (red) or down (green)
        compared to the population average. Longer bars = stronger influence on your result.
      </p>

      <div className="flex gap-2 mb-5">
        {targets.map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === key
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {TARGET_LABELS[key]}
          </button>
        ))}
      </div>

      {activeTarget && (
        <TargetPanel target={activeTarget} label={TARGET_LABELS[activeTab]} />
      )}
    </div>
  );
}
