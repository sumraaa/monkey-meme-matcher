import { Pose, Results, Options } from '@mediapipe/pose';

let poseInstance: Pose | null = null;

export const loadPoseModel = async (): Promise<Pose> => {
  if (poseInstance) return poseInstance;

  const pose = new Pose({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
  });

  pose.setOptions({
    modelComplexity: 0, // 0 for faster performance in browser alongside face-api
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  // Warm up the model (optional, usually MediaPipe loads on first send)
  await pose.initialize();
  
  poseInstance = pose;
  return poseInstance;
};

export const getPoseInstance = () => poseInstance;
