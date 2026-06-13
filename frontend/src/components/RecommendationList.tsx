"use client";

import { RecommendationResponse } from "@/types/health";

const priorityStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};

export default function RecommendationList({ data }: { data: RecommendationResponse }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Personalized Recommendations</h2>
        <span className="text-sm text-primary-600 font-medium">
          Est. risk reduction: {Math.round(data.estimated_risk_reduction * 100)}%
        </span>
      </div>

      <div className="space-y-4">
        {data.recommendations.map((rec, i) => (
          <div key={i} className="border border-gray-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[rec.priority] || priorityStyles.medium}`}>
                {rec.priority}
              </span>
              <span className="text-xs text-gray-400">{rec.category}</span>
            </div>
            <h3 className="font-medium text-gray-900">{rec.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
            <div className="mt-2 flex items-center gap-1">
              <span className="text-xs text-gray-400">Impact:</span>
              <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${rec.impact_score * 100}%` }} />
              </div>
              <span className="text-xs text-gray-500">{Math.round(rec.impact_score * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
