import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { MemeEntry } from '../types/meme';
import { findBestMatch } from '../lib/matchingEngine';
import { getMemeLibrary } from '../lib/memeLibrary';

export const useMemeMatcher = (liveExpressions: faceapi.FaceExpressions | null, mesh: any | null = null) => {
  const [matchedMeme, setMatchedMeme] = useState<{ match: MemeEntry; score: number } | null>(null);

  useEffect(() => {
    if (!liveExpressions) {
      setMatchedMeme(null);
      return;
    }

    const library = getMemeLibrary();
    const matchResult = findBestMatch(liveExpressions, mesh, library);

    setMatchedMeme(matchResult);
  }, [liveExpressions, mesh]);

  return { matchedMeme };
};
