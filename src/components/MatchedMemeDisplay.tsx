"use client";

import { MemeEntry } from '../types/meme';

export default function MatchedMemeDisplay({ 
  matchData 
}: { 
  matchData: { match: MemeEntry; score: number } | null;
}) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-meme-yellow">
      {matchData ? (
        <>
          <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={matchData.match.url} 
              alt="Matched meme" 
              className="max-w-full max-h-full object-contain border-4 border-black shadow-brutal transition-transform duration-300"
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 border-4 border-black flex items-center gap-4 shadow-brutal transform rotate-2">
            <span className="text-black font-black uppercase tracking-widest">Match Score</span>
            <div className="h-8 w-[4px] bg-black"></div>
            <span className="text-2xl font-heading font-black text-meme-pink">
              {matchData.score.toFixed(1)}%
            </span>
          </div>
        </>
      ) : (
        <div className="text-center space-y-4 bg-white p-8 border-4 border-black shadow-brutal transform -rotate-2">
          <div className="text-6xl animate-bounce">🙈</div>
          <p className="text-black font-black uppercase text-xl">Waiting for a face...</p>
        </div>
      )}
    </div>
  );
}
