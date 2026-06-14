import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { useApp } from '../context/AppContext';

export default function LifestyleRadar({ profile }) {
  const { t } = useApp();

  if (!profile) return null;

  const sleepScore = Math.min((profile.sleep_hours_daily / 8) * 100, 100);
  const exerciseScore = Math.min((profile.exercise_hours_weekly / 5) * 100, 100);
  const stressScore = Math.max(100 - (profile.stress_level / 10) * 100, 0);
  const alcoholScore = Math.max(100 - (profile.alcohol_weekly_units / 14) * 100, 0);

  const data = [
    { metric: t('charts.lifestyle.sleep'), score: Math.round(sleepScore), ideal: 100 },
    { metric: t('charts.lifestyle.exercise'), score: Math.round(exerciseScore), ideal: 100 },
    { metric: t('charts.lifestyle.stress'), score: Math.round(stressScore), ideal: 100 },
    { metric: t('charts.lifestyle.alcohol'), score: Math.round(alcoholScore), ideal: 100 },
  ];

  const avgScore = Math.round((sleepScore + exerciseScore + stressScore + alcoholScore) / 4);

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <span className="w-6 h-6 bg-violet-50 rounded-lg flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </span>
        {t('charts.lifestyle.title')}
      </h3>
      <p className="text-xs text-gray-400 mb-2">{t('charts.lifestyle.subtitle')}</p>

      <div className="text-center mb-1">
        <span className={`text-2xl font-bold ${avgScore >= 75 ? 'text-emerald-600' : avgScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
          {avgScore}%
        </span>
        <span className="text-xs text-gray-400 ml-1">{t('charts.lifestyle.overall')}</span>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name={t('charts.lifestyle.ideal')} dataKey="ideal" stroke="#d1d5db" fill="#f3f4f6" fillOpacity={0.3} strokeDasharray="4 4" />
            <Radar name={t('charts.lifestyle.you')} dataKey="score" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} strokeWidth={2} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between px-2.5 py-1.5 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-600">{d.metric}</span>
            <span className={`text-xs font-bold ${d.score >= 75 ? 'text-emerald-600' : d.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{d.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
