import { useApp } from '../context/AppContext';

const ZONES = [
  { label: 'Normal', systolic: [0, 120], diastolic: [0, 80], color: '#10b981', bg: 'bg-emerald-50' },
  { label: 'Elevated', systolic: [120, 130], diastolic: [0, 80], color: '#f59e0b', bg: 'bg-amber-50' },
  { label: 'Hypertension Stage 1', systolic: [130, 140], diastolic: [80, 90], color: '#f97316', bg: 'bg-orange-50' },
  { label: 'Hypertension Stage 2', systolic: [140, 250], diastolic: [90, 150], color: '#ef4444', bg: 'bg-red-50' },
];

function getZone(systolic, diastolic) {
  if (systolic >= 140 || diastolic >= 90) return 3;
  if (systolic >= 130 || diastolic >= 80) return 2;
  if (systolic >= 120 && diastolic < 80) return 1;
  return 0;
}

export default function BloodPressureChart({ systolic, diastolic }) {
  const { t } = useApp();

  if (!systolic || !diastolic) return null;

  const zone = getZone(systolic, diastolic);
  const currentZone = ZONES[zone];

  const sysPercent = Math.min(Math.max(((systolic - 70) / (200 - 70)) * 100, 0), 100);
  const diaPercent = Math.min(Math.max(((diastolic - 40) / (120 - 40)) * 100, 0), 100);

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <span className="w-6 h-6 bg-rose-50 rounded-lg flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </span>
        {t('charts.bp.title')}
      </h3>
      <p className="text-xs text-gray-400 mb-4">{t('charts.bp.subtitle')}</p>

      {/* Zone indicator */}
      <div className={`rounded-xl p-3 mb-4 border ${zone === 0 ? 'border-emerald-200 bg-emerald-50' : zone === 1 ? 'border-amber-200 bg-amber-50' : zone === 2 ? 'border-orange-200 bg-orange-50' : 'border-red-200 bg-red-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold" style={{ color: currentZone.color }}>{currentZone.label}</p>
            <p className="text-lg font-bold text-gray-900">{systolic}/{diastolic} <span className="text-xs font-normal text-gray-400">mmHg</span></p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: currentZone.color + '20' }}>
            <span className="text-lg">{zone === 0 ? '✓' : zone === 1 ? '!' : zone === 2 ? '!!' : '!!!'}</span>
          </div>
        </div>
      </div>

      {/* Systolic bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">{t('charts.bp.systolic')}</span>
          <span className="text-xs font-semibold text-gray-700">{systolic} mmHg</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-400" style={{ width: '38%' }} />
          <div className="h-full bg-amber-400" style={{ width: '8%' }} />
          <div className="h-full bg-orange-400" style={{ width: '8%' }} />
          <div className="h-full bg-red-400" style={{ width: '46%' }} />
        </div>
        <div className="relative h-3 -mt-3">
          <div className="absolute top-0 w-0.5 h-3 bg-gray-900 rounded" style={{ left: `${sysPercent}%` }} />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
          <span>70</span><span>120</span><span>130</span><span>140</span><span>200+</span>
        </div>
      </div>

      {/* Diastolic bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">{t('charts.bp.diastolic')}</span>
          <span className="text-xs font-semibold text-gray-700">{diastolic} mmHg</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-400" style={{ width: '50%' }} />
          <div className="h-full bg-orange-400" style={{ width: '12.5%' }} />
          <div className="h-full bg-red-400" style={{ width: '37.5%' }} />
        </div>
        <div className="relative h-3 -mt-3">
          <div className="absolute top-0 w-0.5 h-3 bg-gray-900 rounded" style={{ left: `${diaPercent}%` }} />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
          <span>40</span><span>80</span><span>90</span><span>120+</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        {ZONES.map((z, i) => (
          <span key={i} className="inline-flex items-center gap-1 text-[10px] text-gray-500">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: z.color }} />
            {z.label}
          </span>
        ))}
      </div>
    </div>
  );
}
