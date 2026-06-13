from fastapi import APIRouter

from app.services.train_model import train_and_save
from app.services import risk_engine
from app.services.dataset_loader import FEATURES
from app.services.explainer import get_explainers

router = APIRouter()


@router.post("/model/retrain")
def retrain_model():
    model = train_and_save()
    risk_engine._model = model
    # Reset SHAP explainers so they rebuild with new model
    import app.services.explainer as exp
    exp._explainers = None
    return {"status": "retrained", "message": "Model retrained and reloaded successfully"}


@router.get("/model/info")
def model_info():
    model = risk_engine.get_model()
    estimator = model.estimators_[0]
    return {
        "algorithm": type(estimator).__name__,
        "n_estimators": estimator.n_estimators,
        "max_depth": estimator.max_depth,
        "learning_rate": estimator.learning_rate,
        "subsample": estimator.subsample,
        "n_features": len(FEATURES),
        "features": FEATURES,
        "targets": ["cardiovascular_risk", "diabetes_risk", "mental_health_risk"],
        "data_sources": [
            "Framingham Heart Study (CVD risk coefficients)",
            "NHANES 2017-2020 (population distributions)",
            "Finnish Diabetes Risk Score (FINDRISC)",
            "WHO Global Health Observatory (lifestyle factors)",
        ],
        "explainability": "SHAP TreeExplainer (per-feature contributions)",
    }
