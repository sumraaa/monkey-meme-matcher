"use client";

import { MemeEntry } from '../types/meme';

export default function MatchedMemeDisplay({ 
  matchData 
}: { 
  matchData: { match: MemeEntry; score: number } | null;
}) {
  return (
    <div className="relative w-full h-full flex flex-col bg-slate-900 items-center justify-center p-6">
      {matchData ? (
        <>
          <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={matchData.match.url} 
              alt="Matched meme" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform duration-300 transform scale-100"
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/80 backdrop-blur-md px-6 py-3 rounded-full border border-emerald-500/30 flex items-center gap-4 shadow-xl">
            <span className="text-slate-300 font-medium">Match Score</span>
            <div className="h-8 w-[2px] bg-slate-700"></div>
            <span className="text-2xl font-bold text-emerald-400">
              {matchData.score.toFixed(1)}%
            </span>
          </div>
        </>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🙈</div>
          <p className="text-slate-400 font-medium text-lg">Waiting for a face...</p>
        </div>
      )}
    </div>
  );
}
