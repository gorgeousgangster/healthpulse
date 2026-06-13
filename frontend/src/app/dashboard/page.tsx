"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AssessmentRecord } from "@/types/health";
import { getAssessmentHistory } from "@/lib/api";
import TrendChart from "@/components/TrendChart";

export default function DashboardPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (authStatus === "authenticated") {
      getAssessmentHistory()
        .then(setHistory)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [authStatus, router]);

  if (authStatus === "loading" || loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-sm text-red-500 underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return <EmptyState />;
  }

  const latest = history[0];
  const oldest = history[history.length - 1];
  const riskChange = latest.overall_risk - oldest.overall_risk;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Health Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Tracking {history.length} assessment{history.length > 1 ? "s" : ""} — powered by real-time AI analysis.
      </p>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <SummaryCard
          label="Overall Risk"
          value={`${latest.overall_risk.toFixed(1)}%`}
          subtitle={latest.risk_level}
          color="text-primary-600"
        />
        <SummaryCard
          label="Cardiovascular"
          value={`${latest.cardiovascular_risk.toFixed(1)}%`}
          subtitle="10-year Framingham"
          color="text-red-500"
        />
        <SummaryCard
          label="Diabetes"
          value={`${latest.diabetes_risk.toFixed(1)}%`}
          subtitle="FINDRISC-based"
          color="text-amber-500"
        />
        <SummaryCard
          label="Mental Health"
          value={`${latest.mental_health_risk.toFixed(1)}%`}
          subtitle="Composite score"
          color="text-purple-500"
        />
      </div>

      {/* Progress Change Banner */}
      {history.length > 1 && (
        <div className={`rounded-xl p-5 mb-10 ${riskChange <= 0 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${riskChange <= 0 ? "text-green-600" : "text-red-600"}`}>
              {riskChange <= 0 ? "↓" : "↑"}
            </span>
            <div>
              <p className={`font-semibold ${riskChange <= 0 ? "text-green-700" : "text-red-700"}`}>
                {riskChange <= 0 ? "Risk Decreasing" : "Risk Increasing"}
              </p>
              <p className="text-sm text-gray-600">
                Overall risk changed by{" "}
                <span className="font-mono font-medium">
                  {riskChange > 0 ? "+" : ""}{riskChange.toFixed(1)}%
                </span>{" "}
                since your first assessment ({formatDate(oldest.created_at)})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trend Chart */}
      <TrendChart history={history} />

      {/* Assessment Timeline */}
      <div className="mt-10 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-lg mb-4">Assessment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Overall</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Cardio</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Diabetes</th>
                <th className="text-right py-2 px-3 text-gray-500 font-medium">Mental</th>
                <th className="text-center py-2 px-3 text-gray-500 font-medium">Level</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 px-3 text-gray-700">{formatDate(record.created_at)}</td>
                  <td className="py-2.5 px-3 text-right font-mono">{record.overall_risk.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-red-500">{record.cardiovascular_risk.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-amber-500">{record.diabetes_risk.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-right font-mono text-purple-500">{record.mental_health_risk.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-center">
                    <RiskBadge level={record.risk_level} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 text-center">
        <a
          href="/assess"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          Take New Assessment
        </a>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, subtitle, color }: { label: string; value: string; subtitle: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-gray-400 mt-1 capitalize">{subtitle}</p>
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    low: "bg-green-100 text-green-700",
    moderate: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[level] || styles.moderate}`}>
      {level}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-80 mb-8" />
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-3 bg-gray-100 rounded w-20 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-16" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-64" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Health Dashboard</h1>
      <p className="text-gray-600 mb-10">Track your health risk over time with AI-powered assessments.</p>

      <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">&#x1F4CA;</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">No Assessments Yet</h2>
        <p className="text-gray-500 mb-6">
          Take your first health risk assessment to start tracking your progress.
          Each assessment is saved and displayed here so you can see how lifestyle
          changes impact your risk over time.
        </p>
        <a
          href="/assess"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          Take Your First Assessment
        </a>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <span className="text-2xl block mb-2">&#x1F3AF;</span>
          <h3 className="font-medium text-gray-800 mb-1">Track Progress</h3>
          <p className="text-sm text-gray-500">See your risk scores change over time as you improve habits.</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <span className="text-2xl block mb-2">&#x1F9E0;</span>
          <h3 className="font-medium text-gray-800 mb-1">AI Insights</h3>
          <p className="text-sm text-gray-500">SHAP explains exactly which factors drive your risk up or down.</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <span className="text-2xl block mb-2">&#x1F4C8;</span>
          <h3 className="font-medium text-gray-800 mb-1">Measure Impact</h3>
          <p className="text-sm text-gray-500">Quantify how each lifestyle change reduces your disease risk.</p>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
