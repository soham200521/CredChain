import os
from pathlib import Path
from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
from flask_cors import CORS
app = Flask(__name__)

CORS(app)

# Configuration
BASE_DIR = Path(__file__).parent
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "credit_model.pkl"
COLUMNS_PATH = MODEL_DIR / "columns.pkl"
CSV_PATH = BASE_DIR / "data/training_data.csv"

# Ensure model directory exists
MODEL_DIR.mkdir(exist_ok=True)

def train_model():
    try:
        df = pd.read_csv(CSV_PATH)
        X = df.drop("credit_score", axis=1)
        X = pd.get_dummies(X)
        y = df["credit_score"]
        
        model = RandomForestRegressor()
        model.fit(X, y)
        
        joblib.dump(model, MODEL_PATH)
        joblib.dump(X.columns.tolist(), COLUMNS_PATH)
        
        print(f"✅ Model saved to {MODEL_PATH}")
        return True
    except Exception as e:
        print(f"❌ Training error: {str(e)}")
        return False

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if not (MODEL_PATH.exists() and COLUMNS_PATH.exists()):
            return jsonify({"error": "Model not trained"}), 400
            
        model = joblib.load(MODEL_PATH)
        columns = joblib.load(COLUMNS_PATH)
        
        data = request.json
        df = pd.DataFrame([data])
        df = pd.get_dummies(df).reindex(columns=columns, fill_value=0)
        
        prediction = model.predict(df)
        return jsonify({"prediction": prediction[0]})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/train", methods=["POST"])
def train_endpoint():
    success = train_model()
    return jsonify({"success": success}), 200 if success else 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
