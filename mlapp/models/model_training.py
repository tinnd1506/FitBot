import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score
import pickle

# Load the dataset containing keypoints and corresponding labels
data_path = 'mlapp/data/data.csv'  # Path to the CSV file
df = pd.read_csv(data_path)  # Read the dataset into a DataFrame

# Separate features (X) and labels (y)
X = df.drop(columns=['label'])  # Features: all columns except 'label'
y = df['label']  # Labels: the target variable ('bottom' or 'top')

# Split the dataset into training and testing sets
# 80% for training and 20% for testing, stratified by labels for balanced classes
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Define a machine learning pipeline to streamline preprocessing and model training
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='mean')),  # Step 1: Impute missing values with the mean
    ('scaler', StandardScaler()),                 # Step 2: Standardize features to have mean=0 and variance=1
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))  # Step 3: Random Forest classifier
])

# Train the model using the training set
pipeline.fit(X_train, y_train)

# Make predictions on the testing set
y_pred = pipeline.predict(X_test)

# Calculate and print the accuracy of the model
accuracy = accuracy_score(y_test, y_pred)  # Compare predictions to actual labels
print(f"Model accuracy: {accuracy * 100:.2f}%")  # Output the accuracy as a percentage

# Save the trained model to a file for future use
model_path = 'mlapp/models/model.pkl'  # Path to save the model
with open(model_path, 'wb') as f:
    pickle.dump(pipeline, f)  # Save the pipeline object as a binary file

print(f"Model saved to {model_path}")  # Confirm that the model was saved
