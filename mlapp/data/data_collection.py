import cv2
import pandas as pd
import mediapipe as mp
import math

# Initialize MediaPipe pose detection
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils  # Utilities for drawing landmarks on images
pose = mp_pose.Pose(min_tracking_confidence=0.5, min_detection_confidence=0.5)

# Initialize video capture from a specified path
video_path = 'mlapp/static/input_video.mp4'  # Path to the input video
cap = cv2.VideoCapture(video_path)

# Lists to store keypoints and corresponding labels
data = []
labels = []

def calculate_angle(a, b, c):
    """Calculate the angle formed by three points (shoulder, hip, knee).
    
    Args:
        a: Coordinates of the first point (shoulder).
        b: Coordinates of the second point (hip).
        c: Coordinates of the third point (knee).

    Returns:
        Angle in degrees between the segments (a-b) and (b-c).
    """
    angle = math.degrees(math.atan2(c[1] - b[1], c[0] - b[0]) - 
                         math.atan2(a[1] - b[1], a[0] - b[0]))
    return angle + 360 if angle < 0 else angle  # Ensure positive angle

def label_stage(landmarks):
    """Determine the stage of the deadlift based on hip angle.
    
    Args:
        landmarks: Detected pose landmarks.

    Returns:
        A tuple of the stage ('down' or 'up') and the calculated hip angle.
    """
    left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, 
                     landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
    left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, 
                landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
    left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, 
                 landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]

    # Calculate the hip angle using shoulder, hip, and knee positions
    hip_angle = calculate_angle(left_shoulder, left_hip, left_knee)
    
    # Determine the stage based on the calculated hip angle
    if hip_angle < 120:
        return 'down', hip_angle  # Down stage if angle is less than 120
    else:
        return 'up', hip_angle  # Up stage otherwise

# Process the video frames until the video ends
while cap.isOpened():
    ret, frame = cap.read()  # Read a frame from the video
    if not ret:
        break  # Exit loop if no frame is captured

    # Convert the frame to RGB format for processing
    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image)  # Process the frame to detect poses

    if results.pose_landmarks:  # If landmarks are detected
        landmarks = results.pose_landmarks.landmark
        
        # Collect keypoint values (33 landmarks with 4 attributes each)
        keypoints = []
        for landmark in landmarks:
            keypoints.append(landmark.x)
            keypoints.append(landmark.y)
            keypoints.append(landmark.z)
            keypoints.append(landmark.visibility)
        
        # Ensure the keypoints list has the correct number of elements
        if len(keypoints) == 132:
            label, hip_angle = label_stage(landmarks)  # Get the stage and angle
            data.append(keypoints)  # Append keypoints to data list
            labels.append(label)  # Append label to labels list
            
            # Display the current stage and hip angle on the video frame
            cv2.putText(frame, f'Stage: {label}', (10, 40), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)
            cv2.putText(frame, f'Hip Angle: {int(hip_angle)}', (10, 80), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)

        # Draw landmarks and connections on the frame
        mp_drawing.draw_landmarks(
            frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
            mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=3),  # Landmarks
            mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2, circle_radius=2)   # Connections
        )

    # Display the annotated video frame
    cv2.imshow('Deadlift Detection', frame)

    # Allow user to exit the video by pressing 'q'
    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

# Release video capture and close all OpenCV windows
cap.release()
cv2.destroyAllWindows()

# Create a DataFrame for the collected data
columns = [f'x{i+1}' for i in range(33)] + \
          [f'y{i+1}' for i in range(33)] + \
          [f'z{i+1}' for i in range(33)] + \
          [f'v{i+1}' for i in range(33)]

df = pd.DataFrame(data, columns=columns)  # Create DataFrame with keypoints
df['label'] = labels  # Add the label column to the DataFrame

# Save the DataFrame to a CSV file
csv_path = 'mlapp/data/data.csv'  # Path to save the CSV file
df.to_csv(csv_path, index=False)  # Save without row indices
