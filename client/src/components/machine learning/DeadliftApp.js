import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import '@tensorflow/tfjs';
import { detectDeadlift, resetDeadlift } from '../../api';

const DeadliftApp = () => {
    // State variables
    const [stage, setStage] = useState('0');
    const [reps, setReps] = useState(0);
    const [error, setError] = useState(null);
    const [poseNetModel, setPoseNetModel] = useState(null);
    const [isVideoReady, setIsVideoReady] = useState(false);

    // Refs for video and canvas elements
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Load PoseNet model
    useEffect(() => {
        const loadPoseNet = async () => {
            try {
                const model = await posenet.load();
                setPoseNetModel(model);
            } catch (err) {
                console.error('Error loading PoseNet model: ', err);
                setError('Error loading PoseNet model');
            }
        };
        loadPoseNet();
    }, []);

    // Set up video stream from webcam
    useEffect(() => {
        const getVideoStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        setIsVideoReady(true);
                    };
                }
            } catch (err) {
                console.error('Error accessing webcam: ', err);
                setError('Error accessing webcam');
            }
        };
        getVideoStream();
    }, []);

    // Send frame to backend for deadlift detection
    const sendFrame = useCallback(async (frame) => {
        try {
            const { stage, reps } = await detectDeadlift(frame);
            setStage(stage);
            setReps(reps);
        } catch (err) {
            console.error('Error detecting deadlift: ', err.message);
            setError('Error detecting deadlift');
        }
    }, []);

    // Draw a line on the canvas
    const drawLine = useCallback((ctx, start, end) => {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'green';
        ctx.stroke();
    }, []);

    // Draw the detected pose on the canvas
    const drawPose = useCallback((pose) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!canvas || !ctx || !videoRef.current) return;

        // Set canvas dimensions to match video
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (pose) {
            // Filter keypoints with high confidence
            const keypoints = pose.keypoints.filter((kp) => kp.score > 0.5);

            // Draw keypoints
            keypoints.forEach(({ position }) => {
                ctx.beginPath();
                ctx.arc(position.x, position.y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = 'red';
                ctx.fill();
            });

            // Draw skeleton
            const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.5);
            adjacentKeyPoints.forEach((keypoint) => {
                drawLine(ctx, keypoint[0].position, keypoint[1].position);
            });
        }
    }, [drawLine]);

    // Capture a frame from the video and send it to the backend
    const captureFrame = useCallback(() => {
        if (videoRef.current && isVideoReady) {
            const video = videoRef.current;

            // Ensure video has valid dimensions
            if (video.videoWidth === 0 || video.videoHeight === 0) {
                console.error('Invalid video dimensions');
                setError('Invalid video dimensions');
                return;
            }

            // Create a canvas to capture the frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => sendFrame(blob), 'image/jpeg');
        }
    }, [isVideoReady, sendFrame]);

    // Detect pose using PoseNet and draw it
    const detectPose = useCallback(async () => {
        if (poseNetModel && videoRef.current && isVideoReady) {
            try {
                const video = videoRef.current;
                const pose = await poseNetModel.estimateSinglePose(video, {
                    flipHorizontal: false,
                });
                drawPose(pose);
            } catch (err) {
                console.error('Error detecting pose: ', err);
                setError('Error detecting pose');
            }
        }
    }, [poseNetModel, isVideoReady, drawPose]);

    // Set up interval to capture frames and detect poses
    useEffect(() => {
        const interval = setInterval(() => {
            if (isVideoReady) {
                captureFrame();
                detectPose();
            }
        }, 500); // Adjust interval as needed
        return () => clearInterval(interval);
    }, [captureFrame, detectPose, isVideoReady]);

    // Handle reset button click
    const handleReset = async () => {
        console.log('Reset button clicked');
        try {
            const data = await resetDeadlift();
            console.log('Reset response:', data);
            setReps(data.reps);
            setStage('0');
        } catch (error) {
            console.error('Error resetting:', error);
        }
    };

    // Render component
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Video and canvas container */}
            <div style={{ position: 'relative', width: '480px', height: '360px' }}>
                <video ref={videoRef} autoPlay playsInline width="480" height="360" />
                <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} />
            </div>
            {/* Stage and rep counters */}
            <div style={{ display: 'flex', justifyContent: 'space-around', width: '80%' }}>
                <div>
                    <h2>STAGE</h2>
                    <p>{stage}</p>
                </div>
                <div>
                    <h2>REPS</h2>
                    <p>{reps}</p>
                </div>
            </div>
            {/* Reset button */}
            <button onClick={handleReset} style={{ position: 'relative', zIndex: 10 }}>Reset</button>
            {/* Error display */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default DeadliftApp;
