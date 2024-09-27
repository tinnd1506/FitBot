from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np
import pandas as pd
import pickle
import logging
from utils.landmarks import landmarks  # Ensure this file is structured with the list of landmarks
import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Initialize the Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for all origins to allow cross-origin requests

# Configure logging for debugging purposes
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load the pre-trained model for predictions
try:
    with open('mlapp/models/model.pkl', 'rb') as f:
        model = pickle.load(f)  # Load the model from the specified file
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Error loading model: {e}")  # Log any error that occurs during model loading
    raise

# Initialize MediaPipe pose detection with specified confidence thresholds
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(min_tracking_confidence=0.5, min_detection_confidence=0.5)

# Global variables to keep track of the current stage and rep count
current_stage = ''
counter = 0
bodylang_class = ''

@app.route('/detect', methods=['POST'])
def detect():
    global current_stage, counter, bodylang_class

    logger.debug("Received /detect request.")

    try:
        # Check if the request contains a file
        if 'frame' not in request.files:
            logger.error("No file part in request")
            return jsonify({'error': 'No file part in request'}), 400  # Return error if no file part

        file = request.files['frame']  # Get the uploaded file
        
        # Check if the uploaded file has a filename
        if file.filename == '':
            logger.error("No selected file")
            return jsonify({'error': 'No selected file'}), 400  # Return error if no file selected

        # Read file content and decode the image
        file_content = file.read()
        npimg = np.frombuffer(file_content, np.uint8)  # Convert to numpy array
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)  # Decode image from the buffer

        if frame is None:
            logger.error("Failed to decode image")
            return jsonify({'error': 'Failed to decode image'}), 400  # Return error if image decoding fails

        # Convert the frame from BGR to RGB for processing
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)  # Process the image to detect pose landmarks

        # Handle case where no landmarks are detected
        if not results.pose_landmarks:
            logger.debug("No pose landmarks detected.")
            return jsonify({'stage': current_stage, 'reps': counter})  # Return current stage and count

        # Extract landmarks into a flattened array for prediction
        row = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten().tolist()
        X = pd.DataFrame([row], columns=landmarks)  # Create a DataFrame with the landmarks

        # Make predictions using the loaded model
        bodylang_class = model.predict(X)[0]  # Get the predicted class

        logger.debug(f"Predicted body language class: {bodylang_class}")

        # Update current stage and rep count based on the predicted class
        if bodylang_class == "down":
            current_stage = "down"
        elif current_stage == "down" and bodylang_class == "up":
            current_stage = "up"  # Change stage to 'up' if transitioning
            counter += 1  # Increment the rep count

        logger.info(f"Current stage: {current_stage}, Reps: {counter}")

        # Return the current stage and rep count as JSON
        return jsonify({
            'stage': current_stage,
            'reps': counter
        })
    except Exception as e:
        logger.error(f"Error in detect function: {e}")  # Log any errors encountered
        return jsonify({'error': str(e)}), 500  # Return an internal server error

@app.route('/reset', methods=['POST'])
def reset():
    global current_stage, counter, bodylang_class
    try:
        logger.debug("Received /reset request.")

        # Reset the global variables
        current_stage = ''
        counter = 0
        bodylang_class = ''
        
        logger.info(f"State reset: stage={current_stage}, reps={counter}")

        # Return the reset rep count as JSON
        return jsonify({'reps': counter})
    except Exception as e:
        logger.error(f"Error in reset function: {e}")  # Log any errors encountered
        return jsonify({'error': str(e)}), 500  # Return an internal server error

if __name__ == '__main__':
    # Run the Flask app on the specified port
    port = int(os.getenv('FLASK_PORT', 5001))  # Default to port 5001 if not set in environment
    app.run(port=port, debug=True)  # Enable debug mode for development
