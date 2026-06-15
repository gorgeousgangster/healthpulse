import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useApp } from '../context/AppContext';

const TAB_KEYS = ['cardiovascular', 'diabetes', 'mental_health'];

const TAB_STYLES = {
  cardiovascular: {
    dot: 'bg-red-500',
    activeBtn: 'bg-red-50 text-red-700 border-red-200 shadow-sm',
    hoverBtn: 'hover:bg-red-50/60',
  },
  diabetes: {
    dot: 'bg-amber-500',
    activeBtn: 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm',
    hoverBtn: 'hover:bg-amber-50/60',
  },
  mental_health: {
    dot: 'bg-blue-500',
    activeBtn: 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm',
    hoverBtn: 'hover:bg-blue-50/60',
  },
};

function translateFeatureName(displayName, t) {
  const translated = t(`featureNames.${displayName}`);
  if (translated && translated !== `featureNames.${displayName}`) {
    return translated;
  }
  return displayName;
}

export default function ShapChart({ explanation }) {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState(null);

  if (!explanation) return null;

  const availableTabs = TAB_KEYS.filter(k => explanation[k] && explanation[k].features);
  if (availableTabs.length === 0) return null;

  const currentTab = activeTab && availableTabs.includes(activeTab) ? activeTab : availableTabs[0];
  const currentTarget = explanation[currentTab];

  const tabLabels = {
    cardiovascular: t('shapTabs.cardiovascular'),
    diabetes: t('shapTabs.diabetes'),
    mental_health: t('shapTabs.mentalHealth'),
  };

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        {t('shapChart.title')}
      </h3>
      <p className="text-xs text-gray-400 mb-4">{t('shapChart.subtitle')}</p>

      {/* Tab Buttons */}
      <div className="flex gap-2 mb-5">
        {availableTabs.map(key => {
          const styles = TAB_STYLES[key];
          const isActive = key === currentTab;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isActive
                  ? styles.activeBtn
                  : `border-gray-200 text-gray-500 ${styles.hoverBtn}`
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
              {tabLabels[key]}
            </button>
          );
        })}
      </div>

      {/* Active Tab Chart */}
      {currentTarget && <TabChart target={currentTarget} t={t} />}
    </div>
  );
}

function TabChart({ target, t }) {
  const data = target.features
    .filter(f => f.shap_value !== 0)
    .map(f => ({
      name: translateFeatureName(f.display_name || f.name, t),
      value: f.direction === 'risk' ? Math.abs(f.shap_value) : -Math.abs(f.shap_value),
      direction: f.direction,
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  const maxVal = Math.max(...data.map(d => Math.abs(d.value)), 0.01);
  const chartHeight = Math.max(data.length * 36, 140);

  return (
    <div className="w-full" style={{ height: `${chartHeight}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 120 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" opacity={0.6} />
          <XAxis
            type="number"
            domain={[-maxVal * 1.2, maxVal * 1.2]}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickFormatter={v => v.toFixed(2)}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: '#374151' }}
            width={115}
            interval={0}
          />
          <Tooltip
            formatter={(value) => [`${value > 0 ? '+' : ''}${value.toFixed(3)}`, 'SHAP']}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          />
          <ReferenceLine x={0} stroke="#d1d5db" strokeWidth={1} />
          <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={14}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.direction === 'risk' ? '#f87171' : '#34d399'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
