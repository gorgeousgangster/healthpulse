import { useState } from 'react';
import { useApp } from '../context/AppContext';

function generateExpertNotes(results, t) {
  const notes = [];
  const { cardiovascular_risk, diabetes_risk, mental_health_risk, risk_level } = results;

  if (cardiovascular_risk < 30) {
    notes.push(t('insights.expert.cardioLow'));
  } else if (cardiovascular_risk < 60) {
    notes.push(t('insights.expert.cardioModerate'));
  } else {
    notes.push(t('insights.expert.cardioHigh'));
  }

  if (diabetes_risk < 30) {
    notes.push(t('insights.expert.diabetesLow'));
  } else if (diabetes_risk < 60) {
    notes.push(t('insights.expert.diabetesModerate'));
  } else {
    notes.push(t('insights.expert.diabetesHigh'));
  }

  if (mental_health_risk > 50) {
    notes.push(t('insights.expert.mentalHigh'));
  } else {
    notes.push(t('insights.expert.mentalLow'));
  }

  return notes;
}

function generateHabits(results, t) {
  const habits = [];

  if (results.cardiovascular_risk > 40) {
    habits.push(t('insights.habits.reducesSalt'));
    habits.push(t('insights.habits.cardioExercise'));
  } else {
    habits.push(t('insights.habits.maintainExercise'));
  }

  if (results.mental_health_risk > 40) {
    habits.push(t('insights.habits.breathing'));
    habits.push(t('insights.habits.sleepHygiene'));
  } else {
    habits.push(t('insights.habits.meditation'));
  }

  if (results.diabetes_risk > 40) {
    habits.push(t('insights.habits.reduceSugar'));
  } else {
    habits.push(t('insights.habits.balancedDiet'));
  }

  return habits.slice(0, 4);
}

export default function InsightCards({ results }) {
  const { t } = useApp();
  const [checked, setChecked] = useState({});

  if (!results) return null;

  const expertNotes = generateExpertNotes(results, t);
  const habits = generateHabits(results, t);

  function toggleHabit(index) {
    setChecked(prev => ({ ...prev, [index]: !prev[index] }));
  }

  return (
    <div className="space-y-4 mt-6">
      {/* Card A: Expert Consensus */}
      <div className="card">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-7 h-7 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          <h4 className="text-sm font-semibold text-gray-900">{t('insights.expertTitle')}</h4>
        </div>
        <ul className="space-y-2.5">
          {expertNotes.map((note, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600 leading-relaxed">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
              {note}
            </li>
          ))}
        </ul>
      </div>

      {/* Card B: 7-Day Habits */}
      <div className="card">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="w-7 h-7 bg-gradient-to-br from-violet-100 to-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </span>
          <h4 className="text-sm font-semibold text-gray-900">{t('insights.habitsTitle')}</h4>
        </div>
        <ul className="space-y-2">
          {habits.map((habit, i) => (
            <li key={i} className="flex items-center gap-3">
              <button
                onClick={() => toggleHabit(i)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                  checked[i]
                    ? 'bg-violet-500 border-violet-500'
                    : 'border-gray-300 hover:border-violet-300'
                }`}
              >
                {checked[i] && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span className={`text-xs leading-relaxed ${checked[i] ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                {habit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
