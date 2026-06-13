const THRESHOLDS = {
  bmi: { good: 25, warn: 30 },
  blood_pressure_systolic: { good: 120, warn: 140 },
  blood_pressure_diastolic: { good: 80, warn: 90 },
  cholesterol: { good: 200, warn: 240 },
  glucose: { good: 100, warn: 126 },
  stress_level: { good: 4, warn: 7 },
  exercise_hours_weekly: { good: 3, warn: 1.5, inverted: true },
  sleep_hours_daily: { good: 7, warn: 5.5, inverted: true },
  alcohol_weekly_units: { good: 7, warn: 14 },
};

const ADVICE = {
  bmi: { critical: 'Consult a physician about weight management strategies', improvement: 'Aim for a BMI under 25 through balanced nutrition', positive: 'Your BMI is in a healthy range — great job maintaining it' },
  blood_pressure_systolic: { critical: 'High blood pressure requires immediate medical attention', improvement: 'Reduce sodium intake and increase potassium-rich foods', positive: 'Blood pressure is within the normal healthy range' },
  blood_pressure_diastolic: { critical: 'Diastolic hypertension detected — consult your doctor', improvement: 'Regular cardio exercise can help lower diastolic pressure', positive: 'Diastolic blood pressure is well controlled' },
  cholesterol: { critical: 'Very high cholesterol — discuss statins with your doctor', improvement: 'Increase fiber and omega-3 fatty acids in your diet', positive: 'Cholesterol levels are within healthy bounds' },
  glucose: { critical: 'Blood glucose in diabetic range — seek medical evaluation', improvement: 'Reduce refined carbs and increase whole grains', positive: 'Blood glucose is well-regulated' },
  stress_level: { critical: 'Extreme stress is impacting your health significantly', improvement: 'Try mindfulness, meditation, or regular breaks', positive: 'Stress levels are well-managed' },
  exercise_hours_weekly: { critical: 'Sedentary lifestyle is a major health risk factor', improvement: 'Aim for at least 150 minutes of activity per week', positive: 'Excellent activity level — keep it up!' },
  sleep_hours_daily: { critical: 'Severe sleep deprivation — prioritize sleep hygiene', improvement: 'Target 7-9 hours of quality sleep nightly', positive: 'Getting adequate sleep — supports recovery and focus' },
  alcohol_weekly_units: { critical: 'Alcohol intake is dangerously high — consider support', improvement: 'Try to stay under 14 units per week', positive: 'Alcohol consumption is within safe limits' },
};

const LABELS = {
  bmi: 'Body Mass Index',
  blood_pressure_systolic: 'Blood Pressure',
  blood_pressure_diastolic: 'Diastolic BP',
  cholesterol: 'Cholesterol',
  glucose: 'Blood Glucose',
  stress_level: 'Stress Management',
  exercise_hours_weekly: 'Physical Activity',
  sleep_hours_daily: 'Sleep Quality',
  alcohol_weekly_units: 'Alcohol Intake',
};

function categorize(profile) {
  const critical = [];
  const improvement = [];
  const positive = [];

  for (const [key, threshold] of Object.entries(THRESHOLDS)) {
    const value = profile[key];
    if (value === undefined || value === null) continue;

    const label = LABELS[key];
    const advice = ADVICE[key];

    if (threshold.inverted) {
      if (value < threshold.warn) critical.push({ label, advice: advice.critical, value });
      else if (value < threshold.good) improvement.push({ label, advice: advice.improvement, value });
      else positive.push({ label, advice: advice.positive, value });
    } else {
      if (value > threshold.warn) critical.push({ label, advice: advice.critical, value });
      else if (value > threshold.good) improvement.push({ label, advice: advice.improvement, value });
      else positive.push({ label, advice: advice.positive, value });
    }
  }

  return { critical, improvement, positive };
}

export default function Recommendations({ profile, riskData }) {
  if (!profile || !riskData) return null;

  const { critical, improvement, positive } = categorize(profile);

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        Personalized Health Recommendations
      </h3>
      <p className="text-xs text-gray-400 mb-5">Based on your health profile and risk assessment</p>

      <div className="space-y-4">
        {critical.length > 0 && (
          <Section title="Needs Attention" color="red" items={critical} icon="!" />
        )}
        {improvement.length > 0 && (
          <Section title="Room for Improvement" color="amber" items={improvement} icon="↑" />
        )}
        {positive.length > 0 && (
          <Section title="Keep It Up" color="emerald" items={positive} icon="✓" />
        )}
      </div>
    </div>
  );
}

function Section({ title, color, items, icon }) {
  const colors = {
    red: { bg: 'bg-red-50', border: 'border-red-100', badge: 'bg-red-100 text-red-700', title: 'text-red-800' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-100', badge: 'bg-amber-100 text-amber-700', title: 'text-amber-800' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700', title: 'text-emerald-800' },
  };
  const c = colors[color];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${c.badge}`}>{icon}</span>
        <h4 className={`text-xs font-semibold uppercase tracking-wide ${c.title}`}>{title}</h4>
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${c.badge}`}>{items.length}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {items.map((item, i) => (
          <div key={i} className={`rounded-xl p-3 ${c.bg} border ${c.border}`}>
            <p className="text-xs font-semibold text-gray-800 mb-0.5">{item.label}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{item.advice}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
