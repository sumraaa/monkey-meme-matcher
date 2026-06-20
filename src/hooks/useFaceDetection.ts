import { useState, useEffect, useRef, RefObject } from 'react';
import * as faceapi from 'face-api.js';
import { LandmarkMesh } from '../types/landmarks';

export const useFaceDetection = (videoRef: RefObject<HTMLVideoElement>) => {
  const [mesh, setMesh] = useState<LandmarkMesh | null>(null);
  const [expressions, setExpressions] = useState<faceapi.FaceExpressions | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const detectFace = async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || !isDetecting) {
        return;
      }

      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        if (detection) {
          setMesh(detection.landmarks.positions);
          setExpressions(detection.expressions);
        } else {
          setMesh(null);
          setExpressions(null);
        }
      } catch (err) {
        console.error("Detection error:", err);
      }

      if (isDetecting) {
        animationFrameRef.current = requestAnimationFrame(detectFace);
      }
    };

    if (isDetecting) {
      detectFace();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDetecting, videoRef]);

  const startDetection = () => setIsDetecting(true);
  const stopDetection = () => setIsDetecting(false);

  return { mesh, expressions, isDetecting, startDetection, stopDetection };
};
