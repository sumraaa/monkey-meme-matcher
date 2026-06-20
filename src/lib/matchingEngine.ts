import * as faceapi from 'face-api.js';
import { MemeLibrary, MemeEntry } from '../types/meme';

export const findBestMatch = (
  liveExpressions: faceapi.FaceExpressions,
  library: MemeLibrary
): { match: MemeEntry; score: number } | null => {
  if (!liveExpressions || !library.length) return null;

  let targetUrl = 'still monkey.jpeg';
  let score = 50;

  if (liveExpressions.happy > 0.4) {
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
