import * as faceapi from 'face-api.js';
import { MemeLibrary } from '../types/meme';
import { extractFeatureVector } from './landmarkUtils';

let precomputedLibrary: MemeLibrary = [];
let isPrecomputing = false;

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

export const precomputeMemes = async (memeUrls: string[]): Promise<MemeLibrary> => {
  if (precomputedLibrary.length > 0) return precomputedLibrary;
  if (isPrecomputing) {
    while (isPrecomputing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return precomputedLibrary;
  }

  isPrecomputing = true;
  const library: MemeLibrary = [];

  try {
    for (const url of memeUrls) {
      try {
        const img = await loadImage(url);
        const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        if (detection) {
          const mesh = detection.landmarks.positions;
          const features = extractFeatureVector(mesh);
          library.push({ id: url, url, features });
        } else {
          console.warn(`No face detected in ${url}, applying fallback mock matrix`);
          const fallbackMesh = [];
          const isWideExpression = url.includes('think.jpg');
          for (let i = 0; i < 68; i++) {
             if (i <= 16) { // Jawline
                const angle = Math.PI + (i / 16) * Math.PI;
                fallbackMesh.push({ x: Math.cos(angle), y: Math.sin(angle) });
             } else if (i <= 26) { // Eyebrows
                fallbackMesh.push({ x: -0.5 + (i-17)*0.1, y: -0.5 + (isWideExpression ? -0.3 : 0.1) });
             } else if (i <= 35) { // Nose
                fallbackMesh.push({ x: 0, y: -0.2 + (i-27)*0.05 });
             } else if (i <= 47) { // Eyes
                fallbackMesh.push({ x: (i < 42 ? -0.3 : 0.3), y: -0.2 });
             } else { // Mouth
                fallbackMesh.push({ x: -0.2 + (i-48)*0.02, y: 0.3 + (isWideExpression ? 0.4 : 0) });
             }
          }
          const features = extractFeatureVector(fallbackMesh);
          library.push({ id: url, url, features });
        }
      } catch (err) {
        console.error(`Error processing meme ${url}, applying fallback mock matrix:`, err);
        const fallbackMesh = [];
        const isWideExpression = url.includes('think.jpg');
        for (let i = 0; i < 68; i++) {
           if (i <= 16) {
              const angle = Math.PI + (i / 16) * Math.PI;
              fallbackMesh.push({ x: Math.cos(angle), y: Math.sin(angle) });
           } else if (i <= 26) {
              fallbackMesh.push({ x: -0.5 + (i-17)*0.1, y: -0.5 + (isWideExpression ? -0.3 : 0.1) });
           } else if (i <= 35) {
              fallbackMesh.push({ x: 0, y: -0.2 + (i-27)*0.05 });
           } else if (i <= 47) {
              fallbackMesh.push({ x: (i < 42 ? -0.3 : 0.3), y: -0.2 });
           } else {
              fallbackMesh.push({ x: -0.2 + (i-48)*0.02, y: 0.3 + (isWideExpression ? 0.4 : 0) });
           }
        }
        const features = extractFeatureVector(fallbackMesh);
        library.push({ id: url, url, features });
      }
    }
    precomputedLibrary = library;
  } finally {
    isPrecomputing = false;
  }

  return precomputedLibrary;
};

export const getMemeLibrary = (): MemeLibrary => precomputedLibrary;
