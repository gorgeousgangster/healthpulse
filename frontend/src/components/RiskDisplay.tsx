"use client";

import { RiskScore } from "@/types/health";

const riskColors = {
  low: "text-primary-600 bg-primary-50",
  moderate: "text-warning-600 bg-warning-50",
  high: "text-danger-600 bg-danger-50",
  critical: "text-red-800 bg-red-100",
};

function RiskMeter({ label, value }: { label: string; value: number }) {
  const color = value < 25 ? "bg-green-500" : value < 50 ? "bg-yellow-500" : value < 75 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function RiskDisplay({ risk }: { risk: RiskScore }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="font-semibold text-lg mb-4">Risk Assessment Results</h2>

      <div className="text-center mb-6">
        <div className={`inline-block px-4 py-2 rounded-full font-semibold text-lg ${riskColors[risk.risk_level]}`}>
          Overall Risk: {risk.overall_risk}% — {risk.risk_level.toUpperCase()}
        </div>
      </div>

      <div className="space-y-1">
        <RiskMeter label="Cardiovascular" value={risk.cardiovascular_risk} />
        <RiskMeter label="Diabetes" value={risk.diabetes_risk} />
        <RiskMeter label="Mental Health" value={risk.mental_health_risk} />
      </div>

      {risk.contributing_factors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Contributing Factors</h3>
          <ul className="space-y-1">
            {risk.contributing_factors.map((factor, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-warning-500 mt-0.5">&#x26A0;</span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
