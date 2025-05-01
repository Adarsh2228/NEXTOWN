import pandas as pd
import joblib
from flask import Flask, request, jsonify
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the saved machine learning model and encoder
model_path = os.path.join(os.path.dirname(__file__), 'business_performance_model.pkl')
encoder_path = os.path.join(os.path.dirname(__file__), 'business_performance_encoder.pkl')

# Load the model and encoder with error handling
try:
    model = joblib.load(model_path)
    encoder = joblib.load(encoder_path)
except FileNotFoundError as e:
    raise RuntimeError(f"Model or encoder file not found: {e}")

@app.route('/api/ml/bestmonths', methods=['POST'])
def predict_best_months():
    # Parse the incoming JSON data
    data = request.get_json()
    category = data.get('category')

    # Validate input
    if not category:
        return jsonify({"error": "Business category is required"}), 400

    try:
        # Load the dataset for filtering (this can be optimized based on your needs)
        csv_file_path = os.path.join(os.path.dirname(__file__), 'indian_business_performance_data.csv')
        df = pd.read_csv(csv_file_path)

        # Filter the DataFrame based on the provided category
        df_filtered = df[df['Business Type'] == category]

        if df_filtered.empty:
            return jsonify({"error": "No data found for this business category"}), 404

        # Ensure that Day, Month, Year are created before using them.
        df_filtered['Date'] = pd.to_datetime(df_filtered['Date'])
        df_filtered['Year'] = df_filtered['Date'].dt.year
        df_filtered['Month'] = df_filtered['Date'].dt.month
        
        # Prepare features for prediction (exclude unnecessary features)
        X_input = df_filtered[['Business Type', 'Location', 'Season', 'Weather', 'Tech Adoption']]
        
        # One-hot encode categorical variables using the pre-trained encoder
        X_encoded = encoder.transform(X_input)
        
        # Create a DataFrame from the encoded features
        X_final = pd.DataFrame(X_encoded, columns=encoder.get_feature_names_out())

        # Perform predictions using the pre-trained model
        predictions = model.predict(X_final)

        # Add predictions to the DataFrame and find the top months (ensure Month is present)
        df_filtered['Predicted Profit'] = predictions
        
        # Group by month and calculate average predicted profit (ensure Month is present)
        top_months = df_filtered.groupby('Month')['Predicted Profit'].mean().sort_values(ascending=False).head(3)

        # Return the result as JSON
        return jsonify(top_months.to_dict())

    except Exception as e:
        print(f"An error occurred: {str(e)}")  # Log error for debugging
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False)