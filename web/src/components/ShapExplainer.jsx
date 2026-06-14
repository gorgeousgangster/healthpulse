import { useApp } from '../context/AppContext';

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
