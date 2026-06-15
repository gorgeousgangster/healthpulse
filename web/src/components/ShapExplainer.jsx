import { useApp } from '../context/AppContext';

export function ShapChartExplainer() {
  const { t } = useApp();

  return (
    <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 p-4">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{t('shap.chartExplainer.title')}</h4>
          <p className="text-xs text-gray-600 leading-relaxed">{t('shap.chartExplainer.text')}</p>
        </div>
      </div>
    </div>
  );
}

export function ShapTableExplainer() {
  const { t } = useApp();

  return (
    <div className="rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50/80 to-pink-50/80 p-4">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-3.5 h-3.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{t('shap.tableExplainer.title')}</h4>
          <p className="text-xs text-gray-600 leading-relaxed">{t('shap.tableExplainer.text')}</p>
        </div>
      </div>
    </div>
  );
}

export default function ShapExplainer() {
  const { t } = useApp();

  return (
    <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">{t('shap.explainer.title')}</h4>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <span className="inline-block w-4 h-3 rounded-sm bg-emerald-500 mt-1 shrink-0" />
              <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-semibold text-emerald-700">{t('shap.explainer.greenLabel')}</span> {t('shap.explainer.greenText')}
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="inline-block w-4 h-3 rounded-sm bg-red-500 mt-1 shrink-0" />
              <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-semibold text-red-700">{t('shap.explainer.redLabel')}</span> {t('shap.explainer.redText')}
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="inline-block w-4 h-3 rounded-sm bg-gray-400 mt-1 shrink-0" />
              <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-700">{t('shap.explainer.numbersLabel')}</span> {t('shap.explainer.numbersText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
