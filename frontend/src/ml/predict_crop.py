import argparse
import pickle
import pandas as pd

# Load the trained model
with open('src/ml/crop_recommendation_model.pkl', 'rb') as f:
    model = pickle.load(f)

# Parse input arguments
parser = argparse.ArgumentParser()
parser.add_argument('--district', type=str, required=True)
parser.add_argument('--season', type=str, required=True)
parser.add_argument('--soil_type', type=str, required=True)
args = parser.parse_args()

# Prepare input data
data = pd.DataFrame([{
    'district': args.district,
    'season': args.season,
    'soil_type': args.soil_type
}])
data = pd.get_dummies(data)

# Ensure all columns match the training data
# (Replace missing columns with 0)
for col in model.feature_names_in_:
    if col not in data.columns:
        data[col] = 0

data = data[model.feature_names_in_]

# Make prediction
predictions = model.predict(data)

# Output recommendations
print(predictions.tolist())