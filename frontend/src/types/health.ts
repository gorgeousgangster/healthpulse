export interface HealthProfile {
  age: number;
  bmi: number;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  cholesterol: number;
  glucose: number;
  smoking: boolean;
  alcohol_weekly_units: number;
  exercise_hours_weekly: number;
  sleep_hours_daily: number;
  stress_level: number;
  family_history_heart_disease: boolean;
  family_history_diabetes: boolean;
}

export interface FeatureExplanation {
  name: string;
  display_name: string;
  value: number;
  shap_value: number;
  direction: "risk" | "protective";
}

export interface TargetExplanation {
  base_value: number;
  prediction: number;
  features: FeatureExplanation[];
}

export interface RiskExplanation {
  cardiovascular: TargetExplanation | null;
  diabetes: TargetExplanation | null;
  mental_health: TargetExplanation | null;
}

export interface RiskScore {
  overall_risk: number;
  cardiovascular_risk: number;
  diabetes_risk: number;
  mental_health_risk: number;
  risk_level: "low" | "moderate" | "high" | "critical";
  contributing_factors: string[];
  explanation: RiskExplanation | null;
}

export interface Recommendation {
  category: string;
  priority: string;
  title: string;
  description: string;
  impact_score: number;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  estimated_risk_reduction: number;
}

export interface AssessmentRecord {
  id: string;
  overall_risk: number;
  cardiovascular_risk: number;
  diabetes_risk: number;
  mental_health_risk: number;
  risk_level: "low" | "moderate" | "high" | "critical";
  created_at: string;
}
