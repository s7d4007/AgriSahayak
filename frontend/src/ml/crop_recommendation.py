import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import pickle

# Load dataset (replace with actual dataset path)
data = pd.read_csv('crop_data.csv')

# Features and target
X = data[['state', 'district', 'season', 'soil_type']]
y = data['recommended_crop']

# Preprocess categorical data
X = pd.get_dummies(X)

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate model
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f'Model Accuracy: {accuracy * 100:.2f}%')

# Save the trained model
with open('crop_recommendation_model.pkl', 'wb') as f:
    pickle.dump(model, f)