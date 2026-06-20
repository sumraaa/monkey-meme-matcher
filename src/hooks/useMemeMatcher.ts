import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { MemeEntry } from '../types/meme';
import { findBestMatch } from '../lib/matchingEngine';
import { getMemeLibrary } from '../lib/memeLibrary';

export const useMemeMatcher = (
  liveExpressions: faceapi.FaceExpressions | null, 
  mesh: any | null = null,
  poseLandmarks: any | null = null
) => {
  const [matchedMeme, setMatchedMeme] = useState<{ match: MemeEntry; score: number } | null>(null);

  useEffect(() => {
    if (!liveExpressions && !poseLandmarks) {
      setMatchedMeme(null);
      return;
    }

    const library = getMemeLibrary();
    const matchResult = findBestMatch(liveExpressions, mesh, poseLandmarks, library);

    setMatchedMeme(matchResult);
  }, [liveExpressions, mesh, poseLandmarks]);

  return { matchedMeme };
};
