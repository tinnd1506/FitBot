# MLApp

MLApp is a Flask-based machine learning server-side application designed to process video data and detect body poses using MediaPipe and OpenCV. The application utilizes a pre-trained model to classify body movements and provides a RESTful API for interaction.

## Features

- **Pose Detection**: Utilizes MediaPipe for detecting poses in video frames.
- **Movement Classification**: Classifies body movements using a RandomForest model.
- **API Endpoints**: Offers RESTful API endpoints for processing video frames and managing detection states.

## Installation

1. Ensure you have Python installed on your machine.
2. Clone the entire app repository to your local machine.
3. Navigate to the MLApp directory:
   ```bash
   cd mlapp
   ```
4. Set up the environment variables by creating a `.env` file with the necessary settings.
5. Install the required packages:
   ```bash
   pip3 install -r requirements.txt
   ```

## Configuration

Create a `.env` file in the MLApp directory with the following required environment variables:

Example format:
- `FLASK_PORT=<port_number>`: The port number on which the Flask server will run, ensuring it matches `REACT_APP_ML_API_URL`in the client/src/.env file.

Actual variables for testing:
- FLASK_PORT=5001

## Data Collection and Model Training

### Collecting Data

Run the data collection script to capture keypoints from video frames and label them:

```bash
python3 data/data_collection.py
```

This script processes video frames to detect poses and saves the keypoints and labels to a CSV file.

### Training the Model

After collecting sufficient data, train the model using the following command:

```bash
python3 models/model_training.py
```

This will train a RandomForest model using the collected data and save it to `mlapp/models/model.pkl`.

## Running the Application

To start the server, run:
```bash
python3 app.py
```

## API Endpoints

### Detection Routes

- **POST /detect**: Receives a video frame as a multipart file upload and returns the current pose classification and count of repetitions.

### Reset Route

- **POST /reset**: Resets the detection state (current stage and counter), useful for starting a new session.

## Dependencies

- Flask: Framework for building the API.
- MediaPipe: Library for pose detection.
- OpenCV: Library for image processing.
- RandomForest: Machine learning model for classification.
- dotenv: Loads environment variables from `.env` file.

## Code Structure

- **Entry Point**: The main entry point of the application is `app.py`.
- **API Endpoints**: Defined in `app.py`.
- **Models**: Machine learning models are defined in `models`.
- **Data Collection**: Scripts for data collection are located in `data`.
- **Environment Configuration**: Configuration files and setup are located in the root directory.
