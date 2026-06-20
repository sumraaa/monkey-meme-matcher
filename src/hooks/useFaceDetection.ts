import { useState, useEffect, useRef, RefObject } from 'react';
import * as faceapi from 'face-api.js';
import { LandmarkMesh } from '../types/landmarks';
import { loadPoseModel } from '../lib/poseApiLoader';

export const useFaceDetection = (videoRef: RefObject<HTMLVideoElement>) => {
  const [mesh, setMesh] = useState<LandmarkMesh | null>(null);
  const [expressions, setExpressions] = useState<faceapi.FaceExpressions | null>(null);
  const [poseLandmarks, setPoseLandmarks] = useState<any | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    let active = true;

    const initPose = async () => {
      const pose = await loadPoseModel();
      pose.onResults((results) => {
        if (active && results.poseLandmarks) {
          setPoseLandmarks(results.poseLandmarks);
        } else {
          setPoseLandmarks(null);
        }
      });
      return pose;
    };

    let poseInstance: any = null;
    initPose().then(p => { poseInstance = p; });

    let isPoseProcessing = false;

    const detectFace = async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || !isDetecting || !active) {
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

        // Run pose detection non-blockingly so it doesn't freeze face-api
        if (poseInstance && !isPoseProcessing) {
          isPoseProcessing = true;
          poseInstance.send({ image: videoRef.current }).finally(() => {
            isPoseProcessing = false;
          });
        }
      } catch (err) {
        console.error("Detection error:", err);
      }

      if (isDetecting && active) {
        animationFrameRef.current = requestAnimationFrame(detectFace);
      }
    };

    if (isDetecting) {
      detectFace();
    }

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDetecting, videoRef]);

  const startDetection = () => setIsDetecting(true);
  const stopDetection = () => setIsDetecting(false);

  return { mesh, expressions, poseLandmarks, isDetecting, startDetection, stopDetection };
};
