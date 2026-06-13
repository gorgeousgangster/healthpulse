import { getSession } from "next-auth/react";
import { HealthProfile, RiskScore, RecommendationResponse, AssessmentRecord } from "@/types/health";

const ML_API_BASE = "/api/ml";

async function authHeaders(): Promise<Record<string, string>> {
  const session = await getSession();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (session && (session as any).accessToken) {
    headers["Authorization"] = `Bearer ${(session as any).accessToken}`;
  }
  return headers;
}

export async function assessRisk(profile: HealthProfile): Promise<RiskScore> {
  const headers = await authHeaders();
  const res = await fetch(`${ML_API_BASE}/assess-risk`, {
    method: "POST",
    headers,
    body: JSON.stringify(profile),
  });
  if (res.status === 401) throw new Error("Please sign in to use this feature");
  if (!res.ok) throw new Error(`Risk assessment failed: ${res.status}`);
  return res.json();
}

export async function getRecommendations(profile: HealthProfile): Promise<RecommendationResponse> {
  const headers = await authHeaders();
  const res = await fetch(`${ML_API_BASE}/recommendations`, {
    method: "POST",
    headers,
    body: JSON.stringify(profile),
  });
  if (res.status === 401) throw new Error("Please sign in to use this feature");
  if (!res.ok) throw new Error(`Recommendations failed: ${res.status}`);
  return res.json();
}

export async function getAssessmentHistory(): Promise<AssessmentRecord[]> {
  const headers = await authHeaders();
  const res = await fetch(`${ML_API_BASE}/assessments/history`, { headers });
  if (res.status === 401) throw new Error("Please sign in to view history");
  if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
  return res.json();
}
