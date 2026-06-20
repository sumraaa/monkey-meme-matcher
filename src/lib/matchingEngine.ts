import * as faceapi from 'face-api.js';
import { MemeLibrary, MemeEntry } from '../types/meme';

export const findBestMatch = (
  liveExpressions: faceapi.FaceExpressions,
  mesh: any | null,
  library: MemeLibrary
): { match: MemeEntry; score: number } | null => {
  if (!liveExpressions || !library.length) return null;

  let targetUrl = 'still monkey.jpeg';
  let score = 50;

  let isMouthOpen = false;
  let isSideEye = false;

  if (mesh && mesh.length >= 68) {
    // --- MOUTH OPENNESS TRACKING ---
    const topInnerLip = mesh[62];
    const bottomInnerLip = mesh[66];
    const leftCorner = mesh[60];
    const rightCorner = mesh[64];

    const mouthHeight = bottomInnerLip.y - topInnerLip.y;
    const mouthWidth = rightCorner.x - leftCorner.x;
    const mouthRatio = mouthHeight / (mouthWidth || 1);

    if (mouthRatio > 0.25) {
      isMouthOpen = true;
    }

    // --- ASYMMETRICAL EYEBROW RAISE TRACKING ---
    const leftEyeY = mesh.slice(36, 42).reduce((sum: number, p: any) => sum + p.y, 0) / 6;
    const leftEyebrowY = mesh.slice(17, 22).reduce((sum: number, p: any) => sum + p.y, 0) / 5;
    
    const rightEyeY = mesh.slice(42, 48).reduce((sum: number, p: any) => sum + p.y, 0) / 6;
    const rightEyebrowY = mesh.slice(22, 27).reduce((sum: number, p: any) => sum + p.y, 0) / 5;

    const leftBrowDist = leftEyeY - leftEyebrowY;
    const rightBrowDist = rightEyeY - rightEyebrowY;
    
    const asymmetryRatio = Math.max(leftBrowDist, rightBrowDist) / (Math.min(leftBrowDist, rightBrowDist) || 1);

    // Trigger if one eyebrow is clearly raised more than the other
    if (asymmetryRatio >= 1.10) {
      isSideEye = true;
    }
  }

  if (isSideEye) {
    targetUrl = 'sideeyes'; // matches sideeyes.jpg or sideeyes.jpeg
    score = 95.0;
  } else if (isMouthOpen) {
    targetUrl = 'think.jpg';
    score = 95.0;
  } else if (liveExpressions.happy > 0.4) {
    targetUrl = 'think monek.jpeg';
    score = Math.min(99.9, 80 + (liveExpressions.happy * 20));
  } else if (liveExpressions.surprised > 0.3) {
    targetUrl = 'think.jpg';
    score = Math.min(99.9, 80 + (liveExpressions.surprised * 20));
  } else if (liveExpressions.sad > 0.3) {
    // Map sad/thinking to think.jpg since we don't have the gif
    targetUrl = 'think.jpg';
    score = Math.min(99.9, 80 + (liveExpressions.sad * 20));
  } else if (liveExpressions.neutral > 0.5) {
    targetUrl = 'still monkey.jpeg';
    score = Math.min(99.9, 80 + (liveExpressions.neutral * 20));
  } else {
    // No clear expression dominates
    targetUrl = 'still monkey.jpeg';
    score = 85.5;
  }

  // Find the meme in the library that matches the targetUrl
  const bestMatch = library.find(m => m.url.includes(targetUrl)) || library[0];

  return { match: bestMatch, score };
};
