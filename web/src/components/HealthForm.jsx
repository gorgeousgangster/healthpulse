import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

const INITIAL_FORM = {
  age: '',
  height_cm: '',
  weight_kg: '',
  blood_pressure_systolic: '',
  blood_pressure_diastolic: '',
  cholesterol: '',
  glucose: '',
  smoking: false,
  alcohol_weekly_units: '',
  exercise_hours_weekly: '',
  sleep_hours_daily: '',
  stress_level: '',
  family_history_heart_disease: false,
  family_history_diabetes: false,
};

export default function HealthForm({ onSubmit, isLoading }) {
  const { t } = useApp();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const bmi = useMemo(() => {
    const h = parseFloat(form.height_cm);
    const w = parseFloat(form.weight_kg);
    if (h > 0 && w > 0) return (w / ((h / 100) ** 2)).toFixed(1);
    return '';
  }, [form.height_cm, form.weight_kg]);

  const VALIDATIONS = {
    age: { min: 18, max: 100, label: t('form.age') },
    height_cm: { min: 100, max: 250, label: t('form.height') },
    weight_kg: { min: 25, max: 250, label: t('form.weight') },
    blood_pressure_systolic: { min: 70, max: 250, label: t('form.systolic') },
    blood_pressure_diastolic: { min: 40, max: 150, label: t('form.diastolic') },
    cholesterol: { min: 80, max: 400, label: t('form.cholesterol') },
    glucose: { min: 40, max: 400, label: t('form.glucose') },
    alcohol_weekly_units: { min: 0, max: 50, label: t('form.alcohol') },
    exercise_hours_weekly: { min: 0, max: 40, label: t('form.exercise') },
    sleep_hours_daily: { min: 2, max: 14, label: t('form.sleep') },
    stress_level: { min: 1, max: 10, label: t('form.stress') },
  };

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  }

  function validate() {
    const newErrors = {};
    for (const [field, rules] of Object.entries(VALIDATIONS)) {
      const val = parseFloat(form[field]);
      if (!form[field] && form[field] !== 0) {
        newErrors[field] = t('validation.required').replace('{field}', rules.label);
      } else if (isNaN(val) || val < rules.min || val > rules.max) {
        newErrors[field] = t('validation.range').replace('{field}', rules.label).replace('{min}', rules.min).replace('{max}', rules.max);
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      age: parseInt(form.age),
      bmi: parseFloat(bmi),
      blood_pressure_systolic: parseInt(form.blood_pressure_systolic),
      blood_pressure_diastolic: parseInt(form.blood_pressure_diastolic),
      cholesterol: parseInt(form.cholesterol),
      glucose: parseInt(form.glucose),
      smoking: form.smoking,
      alcohol_weekly_units: parseFloat(form.alcohol_weekly_units),
      exercise_hours_weekly: parseFloat(form.exercise_hours_weekly),
      sleep_hours_daily: parseFloat(form.sleep_hours_daily),
      stress_level: parseInt(form.stress_level),
      family_history_heart_disease: form.family_history_heart_disease,
      family_history_diabetes: form.family_history_diabetes,
    };
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{t('form.title')}</h2>
        <p className="text-sm text-gray-500 mt-1">{t('form.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <InputField label={t('form.age')} name="age" placeholder="30" value={form.age} onChange={handleChange} error={errors.age} suffix={t('form.years')} />
        <InputField label={t('form.height')} name="height_cm" placeholder="170" value={form.height_cm} onChange={handleChange} error={errors.height_cm} suffix={t('form.cm')} />
        <InputField label={t('form.weight')} name="weight_kg" placeholder="70" value={form.weight_kg} onChange={handleChange} error={errors.weight_kg} suffix={t('form.kg')} />

        {/* Auto-calculated BMI */}
        <div>
          <label className="label">{t('form.bmi')}</label>
          <div className="relative">
            <input type="text" readOnly value={bmi} placeholder="—" className="input-field pr-14 bg-gray-50 cursor-not-allowed" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">{t('form.kgm2')}</span>
          </div>
          {bmi && <p className="text-xs mt-1 text-blue-500">Auto-calculated from height & weight</p>}
        </div>

        <InputField label={t('form.systolic')} name="blood_pressure_systolic" placeholder="120" value={form.blood_pressure_systolic} onChange={handleChange} error={errors.blood_pressure_systolic} suffix={t('form.mmHg')} />
        <InputField label={t('form.diastolic')} name="blood_pressure_diastolic" placeholder="80" value={form.blood_pressure_diastolic} onChange={handleChange} error={errors.blood_pressure_diastolic} suffix={t('form.mmHg')} />
        <InputField label={t('form.cholesterol')} name="cholesterol" placeholder="200" value={form.cholesterol} onChange={handleChange} error={errors.cholesterol} suffix={t('form.mgdl')} />
        <InputField label={t('form.glucose')} name="glucose" placeholder="90" value={form.glucose} onChange={handleChange} error={errors.glucose} suffix={t('form.mgdl')} />
        <InputField label={t('form.alcohol')} name="alcohol_weekly_units" placeholder="4" value={form.alcohol_weekly_units} onChange={handleChange} error={errors.alcohol_weekly_units} suffix={t('form.units')} />
        <InputField label={t('form.exercise')} name="exercise_hours_weekly" placeholder="3.5" value={form.exercise_hours_weekly} onChange={handleChange} error={errors.exercise_hours_weekly} suffix={t('form.hours')} />
        <InputField label={t('form.sleep')} name="sleep_hours_daily" placeholder="7.5" value={form.sleep_hours_daily} onChange={handleChange} error={errors.sleep_hours_daily} suffix={t('form.hours')} />
        <InputField label={t('form.stress')} name="stress_level" placeholder="5" value={form.stress_level} onChange={handleChange} error={errors.stress_level} suffix={t('form.of10')} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <CheckboxField label={t('form.smoking')} name="smoking" checked={form.smoking} onChange={handleChange} />
        <CheckboxField label={t('form.familyHeart')} name="family_history_heart_disease" checked={form.family_history_heart_disease} onChange={handleChange} />
        <CheckboxField label={t('form.familyDiabetes')} name="family_history_diabetes" checked={form.family_history_diabetes} onChange={handleChange} />
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button type="submit" disabled={isLoading || !bmi} className="btn-primary flex items-center gap-2">
          {isLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('form.submitting')}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              {t('form.submit')}
            </>
          )}
        </button>
        <button type="button" onClick={() => { setForm(INITIAL_FORM); setErrors({}); }} className="btn-secondary">
          {t('form.reset')}
        </button>
      </div>
    </form>
  );
}

function InputField({ label, name, placeholder, value, onChange, error, suffix }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <input
          type="number" step="any" name={name} placeholder={placeholder}
          value={value} onChange={onChange}
          className={`input-field pr-14 ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : ''}`}
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">{suffix}</span>}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function CheckboxField({ label, name, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
      <input type="checkbox" name={name} checked={checked} onChange={onChange}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-200" />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
