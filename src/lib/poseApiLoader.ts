let poseInstance: any = null;

export const loadPoseModel = async (): Promise<any> => {
  if (poseInstance) return poseInstance;

  // Dynamically import to avoid Next.js SSR window/self errors
  const mediapipePose = await import('@mediapipe/pose');
  const Pose = mediapipePose.Pose;

  const pose = new Pose({
    locateFile: (file: string) => {
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

  // Warm up the model
  await pose.initialize();
  
  poseInstance = pose;
  return poseInstance;
};

export const getPoseInstance = () => poseInstance;
