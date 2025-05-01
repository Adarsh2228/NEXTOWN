import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib
import os
from sklearn.preprocessing import OneHotEncoder

# Load data
script_dir = os.path.dirname(__file__)
csv_file_path = os.path.join(script_dir, 'indian_business_performance_data.csv')
df = pd.read_csv(csv_file_path)

# Convert 'Date' to datetime and extract features
df['Date'] = pd.to_datetime(df['Date'])
df['Year'] = df['Date'].dt.year
df['Month'] = df['Date'].dt.month
df['Day'] = df['Date'].dt.day

# Define columns to one-hot encode
columns_to_encode = ['Business Type', 'Location', 'Season', 'Weather', 'Tech Adoption']

# Define features and target, removing unnecessary fields
X = df[['Business Type', 'Location', 'Season', 'Weather', 'Tech Adoption']]
y = df['Profit']

# Print the shape of the dataset
print(f'Dataset shape: {X.shape}')

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# One-hot encode categorical variables
encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
X_train_encoded = encoder.fit_transform(X_train[columns_to_encode])

# Create DataFrames for encoded data
X_train_encoded_df = pd.DataFrame(X_train_encoded, columns=encoder.get_feature_names_out(columns_to_encode))
X_train_final = pd.concat([X_train.reset_index(drop=True), X_train_encoded_df.reset_index(drop=True)], axis=1).drop(columns=columns_to_encode)

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train_final, y_train)

# Save the model and encoder
joblib.dump(model, 'business_performance_model.pkl')
joblib.dump(encoder, 'business_performance_encoder.pkl')

print('Model and encoder saved successfully.')