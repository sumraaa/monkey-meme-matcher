"use client";

import { MemeEntry } from '../types/meme';

export default function MatchedMemeDisplay({ 
  matchData 
}: { 
  matchData: { match: MemeEntry; score: number } | null;
}) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {matchData ? (
        <>
          <div className="relative w-full h-full max-h-[70vh] flex items-center justify-center p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={matchData.match.url} 
              alt="Matched meme" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform duration-300 transform scale-100"
            />
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-lg shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="text-slate-300 uppercase tracking-widest text-sm mr-2">Match Score</span>
            <span>{matchData.score.toFixed(1)}%</span>
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
