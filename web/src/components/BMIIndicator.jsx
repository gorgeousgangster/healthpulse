import { useApp } from '../context/AppContext';

const CATEGORIES = [
  { label: 'Underweight', min: 0, max: 18.5, color: '#60a5fa', textColor: 'text-blue-600' },
  { label: 'Normal', min: 18.5, max: 25, color: '#10b981', textColor: 'text-emerald-600' },
  { label: 'Overweight', min: 25, max: 30, color: '#f59e0b', textColor: 'text-amber-600' },
  { label: 'Obese', min: 30, max: 50, color: '#ef4444', textColor: 'text-red-600' },
];

function getCategory(bmi) {
  if (bmi < 18.5) return 0;
  if (bmi < 25) return 1;
  if (bmi < 30) return 2;
  return 3;
}

export default function BMIIndicator({ bmi }) {
  const { t } = useApp();

  if (!bmi) return null;

  const bmiVal = parseFloat(bmi);
  const category = getCategory(bmiVal);
  const cat = CATEGORIES[category];

  const minDisplay = 14;
  const maxDisplay = 40;
  const pointerPercent = Math.min(Math.max(((bmiVal - minDisplay) / (maxDisplay - minDisplay)) * 100, 2), 98);

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <span className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </span>
        {t('charts.bmi.title')}
      </h3>
      <p className="text-xs text-gray-400 mb-4">{t('charts.bmi.subtitle')}</p>

      {/* BMI value display */}
      <div className="text-center mb-4">
        <span className="text-3xl font-bold text-gray-900">{bmiVal.toFixed(1)}</span>
        <span className="text-sm text-gray-400 ml-1">kg/m²</span>
        <p className={`text-sm font-semibold mt-1 ${cat.textColor}`}>{cat.label}</p>
      </div>

      {/* Multi-colored bar */}
      <div className="relative">
        <div className="h-4 rounded-full overflow-hidden flex shadow-inner">
          <div className="h-full" style={{ width: '17%', backgroundColor: CATEGORIES[0].color }} />
          <div className="h-full" style={{ width: '25%', backgroundColor: CATEGORIES[1].color }} />
          <div className="h-full" style={{ width: '19%', backgroundColor: CATEGORIES[2].color }} />
          <div className="h-full" style={{ width: '39%', backgroundColor: CATEGORIES[3].color }} />
        </div>

        {/* Pointer */}
        <div className="absolute -top-1" style={{ left: `${pointerPercent}%`, transform: 'translateX(-50%)' }}>
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-900" />
          <div className="w-1 h-5 bg-gray-900 mx-auto rounded-b" />
        </div>

        {/* Labels */}
        <div className="flex mt-3">
          <div className="text-center" style={{ width: '17%' }}>
            <p className="text-[10px] text-gray-400">&lt;18.5</p>
          </div>
          <div className="text-center" style={{ width: '25%' }}>
            <p className="text-[10px] text-gray-400">18.5-25</p>
          </div>
          <div className="text-center" style={{ width: '19%' }}>
            <p className="text-[10px] text-gray-400">25-30</p>
          </div>
          <div className="text-center" style={{ width: '39%' }}>
            <p className="text-[10px] text-gray-400">30+</p>
          </div>
        </div>
      </div>

      {/* Category legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map((c, i) => (
          <span key={i} className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${category === i ? 'ring-1 ring-gray-300 font-semibold' : ''}`} style={{ color: c.color }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}
