"use client";

import { useState } from "react";
import { HealthProfile, RiskScore, RecommendationResponse } from "@/types/health";
import { assessRisk, getRecommendations } from "@/lib/api";
import RiskDisplay from "@/components/RiskDisplay";
import RecommendationList from "@/components/RecommendationList";
import ShapExplanation from "@/components/ShapExplanation";

const defaultProfile: HealthProfile = {
  age: 35,
  bmi: 24.5,
  blood_pressure_systolic: 120,
  blood_pressure_diastolic: 80,
  cholesterol: 190,
  glucose: 95,
  smoking: false,
  alcohol_weekly_units: 5,
  exercise_hours_weekly: 3,
  sleep_hours_daily: 7,
  stress_level: 4,
  family_history_heart_disease: false,
  family_history_diabetes: false,
};

export default function AssessPage() {
  const [profile, setProfile] = useState<HealthProfile>(defaultProfile);
  const [risk, setRisk] = useState<RiskScore | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const [riskResult, recsResult] = await Promise.all([
        assessRisk(profile),
        getRecommendations(profile),
      ]);
      setRisk(riskResult);
      setRecommendations(recsResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assessment failed");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof HealthProfile, value: number | boolean) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Health Risk Assessment</h1>
      <p className="text-gray-600 mb-8">
        Enter your health metrics to receive a personalized risk analysis and recommendations.
      </p>

      <div className="grid lg:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-lg mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-600">Age</span>
                <input type="number" value={profile.age} onChange={(e) => updateField("age", +e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">BMI</span>
                <input type="number" step="0.1" value={profile.bmi} onChange={(e) => updateField("bmi", +e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-lg mb-4">Vitals</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-600">Systolic BP (mmHg)</span>
                <input type="number" value={profile.blood_pressure_systolic} onChange={(e) => updateField("blood_pressure_systolic", +e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Diastolic BP (mmHg)</span>
                <input type="number" value={profile.blood_pressure_diastolic} onChange={(e) => updateField("blood_pressure_diastolic", +e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Cholesterol (mg/dL)</span>
                <input type="number" value={profile.cholesterol} onChange={(e) => updateField("cholesterol", +e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Glucose (mg/dL)</span>
                <input type="number" value={profile.glucose} onChange={(e) => updateField("glucose", +e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" />
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-lg mb-4">Lifestyle</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-600">Exercise (hours/week)</span>
                <input type="number" step="0.5" value={profile.exercise_hours_weekly} onChange={(e) => updateField("exercise_hours_weekly", +e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Sleep (hours/day)</span>
                <input type="number" step="0.5" value={profile.sleep_hours_daily} onChange={(e) => updateField("sleep_hours_daily", +e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Alcohol (units/week)</span>
                <input type="number" value={profile.alcohol_weekly_units} onChange={(e) => updateField("alcohol_weekly_units", +e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2" />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600">Stress Level (1-10)</span>
                <input type="range" min="1" max="10" value={profile.stress_level} onChange={(e) => updateField("stress_level", +e.target.value)} className="mt-3 block w-full" />
                <span className="text-xs text-gray-500">{profile.stress_level}/10</span>
              </label>
            </div>
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={profile.smoking} onChange={(e) => updateField("smoking", e.target.checked)} className="rounded" />
                <span className="text-sm text-gray-600">Current smoker</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={profile.family_history_heart_disease} onChange={(e) => updateField("family_history_heart_disease", e.target.checked)} className="rounded" />
                <span className="text-sm text-gray-600">Family history of heart disease</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={profile.family_history_diabetes} onChange={(e) => updateField("family_history_diabetes", e.target.checked)} className="rounded" />
                <span className="text-sm text-gray-600">Family history of diabetes</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Analyzing..." : "Run Health Assessment"}
          </button>

          {error && (
            <div className="bg-danger-50 text-danger-600 p-4 rounded-xl">
              {error}
            </div>
          )}
        </form>

        <div className="space-y-6">
          {risk && <RiskDisplay risk={risk} />}
          {risk?.explanation && <ShapExplanation explanation={risk.explanation} />}
          {recommendations && <RecommendationList data={recommendations} />}
          {!risk && !recommendations && (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center text-gray-400">
              <p className="text-lg">Fill in your health profile and click &quot;Run Health Assessment&quot; to see your results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
