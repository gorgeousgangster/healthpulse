export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <section className="text-center mb-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Preventive Health,{" "}
          <span className="text-primary-600">Powered by AI</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          HealthPulse uses advanced data science models to predict disease risk
          from your lifestyle data and provides personalized, actionable
          recommendations — making preventive healthcare accessible to everyone.
        </p>
        <a
          href="/assess"
          className="inline-block bg-primary-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Get Your Health Assessment
        </a>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">&#x1F9EC;</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Risk Prediction</h3>
          <p className="text-gray-600">
            Multi-factor disease risk scoring for cardiovascular disease,
            diabetes, and mental health conditions.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">&#x1F4CA;</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Data-Driven Insights</h3>
          <p className="text-gray-600">
            Evidence-based analysis trained on population health data to identify
            your specific risk factors and their interactions.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl">&#x1F4A1;</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
          <p className="text-gray-600">
            Personalized, prioritized action plans with estimated impact scores
            so you focus on what matters most.
          </p>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">The Opportunity</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-primary-600">$4.2T</p>
            <p className="text-gray-600 mt-2">Global healthcare spending annually</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary-600">70%</p>
            <p className="text-gray-600 mt-2">Of diseases are preventable with lifestyle changes</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary-600">3.8B</p>
            <p className="text-gray-600 mt-2">People lack access to preventive health guidance</p>
          </div>
        </div>
      </section>
    </div>
  );
}
