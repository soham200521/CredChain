from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

app = Flask(__name__)

# Paths
MODEL_DIR = "model"
MODEL_PATH = os.path.join(MODEL_DIR, "credit_model.pkl")
COLUMNS_PATH = os.path.join(MODEL_DIR, "columns.pkl")
CSV_PATH = "data/training_data.csv"

# Ensure model directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

# ------------------ TRAIN MODEL ------------------

def train_model():
    print("🔥 Training started...")

    try:
        df = pd.read_csv(CSV_PATH)
        print("✅ CSV loaded. First 3 rows:")
        print(df.head(3))
    except Exception as e:
        print("❌ Error loading CSV:", e)
        return

    try:
        X = df.drop("credit_score", axis=1)
        y = df["credit_score"]
        X = pd.get_dummies(X)

        model = RandomForestRegressor()
        model.fit(X, y)

        # Save model and columns
        joblib.dump(model, MODEL_PATH)
        joblib.dump(X.columns.tolist(), COLUMNS_PATH)

        print(f"✅ Model saved to {MODEL_PATH}")
        print(f"✅ Columns saved to {COLUMNS_PATH}")
    except Exception as e:
        print("❌ Error during training:", e)

# ------------------ PREDICT ------------------

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if not os.path.exists(MODEL_PATH) or not os.path.exists(COLUMNS_PATH):
            return jsonify({"error": "Model not trained yet."}), 500

        model = joblib.load(MODEL_PATH)
        columns = joblib.load(COLUMNS_PATH)

        user_data = request.get_json()
        df = pd.DataFrame([user_data])
        df = pd.get_dummies(df)

        # Align input with training columns
        df = df.reindex(columns=columns, fill_value=0)

        score = model.predict(df)[0]
        return jsonify({"predicted_credit_score": round(score, 2)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------ TRAIN ENDPOINT ------------------

@app.route("/train", methods=["GET"])
def train():
    try:
        train_model()
        return jsonify({"message": "Model trained successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ------------------ MAIN ------------------

if __name__ == "__main__":
    app.run(debug=True)
