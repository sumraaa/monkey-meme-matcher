import * as faceapi from 'face-api.js';

let isLoaded = false;
let isLoading = false;

export const loadModels = async () => {
  if (isLoaded) return;
  if (isLoading) {
    while (isLoading) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return;
  }

  isLoading = true;
  try {
    const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models/';
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    isLoaded = true;
  } catch (error) {
    console.error('Failed to load face-api models:', error);
  } finally {
    isLoading = false;
  }
};
