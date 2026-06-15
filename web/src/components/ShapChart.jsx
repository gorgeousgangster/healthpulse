import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useApp } from '../context/AppContext';

export default function ShapChart({ explanation }) {
  const { t } = useApp();

  if (!explanation) return null;

  const targets = Object.entries(explanation).filter(([_, v]) => v && v.features);
  if (targets.length === 0) return null;

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        {t('shapChart.title')}
      </h3>
      <p className="text-xs text-gray-400 mb-4">{t('shapChart.subtitle')}</p>

      <div className="space-y-6">
        {targets.map(([key, target]) => (
          <ShapDimension key={key} title={key} target={target} riskLabel={t('shapChart.risk')} />
        ))}
      </div>
    </div>
  );
}

function ShapDimension({ title, target, riskLabel }) {
  const data = target.features
    .filter(f => f.shap_value !== 0)
    .map(f => ({
      name: f.display_name || f.name,
      value: f.direction === 'risk' ? Math.abs(f.shap_value) : -Math.abs(f.shap_value),
      direction: f.direction,
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  const maxVal = Math.max(...data.map(d => Math.abs(d.value)), 0.01);
  const chartHeight = Math.max(data.length * 32, 120);

  return (
    <div>
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${title === 'cardiovascular' ? 'bg-red-400' : title === 'diabetes' ? 'bg-amber-400' : 'bg-blue-400'}`}></span>
        {title.replace('_', ' ')} {riskLabel}
      </p>
      <div className="w-full" style={{ height: `${chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
            <XAxis type="number" domain={[-maxVal * 1.2, maxVal * 1.2]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => v.toFixed(2)} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#4b5563' }} width={95} interval={0} />
            <Tooltip formatter={(value) => [`${value > 0 ? '+' : ''}${value.toFixed(3)}`, 'SHAP']} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
            <ReferenceLine x={0} stroke="#d1d5db" strokeWidth={1} />
            <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={16}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.direction === 'risk' ? '#f87171' : '#34d399'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
