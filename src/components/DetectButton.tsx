"use client";

import { Loader2, Camera } from "lucide-react";

export default function DetectButton({ isReady, onClick }: { isReady: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={!isReady}
      className={`
        relative overflow-hidden px-8 py-4 font-bold text-lg transition-all duration-200 border-4 border-black
        ${isReady 
          ? 'bg-meme-yellow text-black hover:translate-y-[2px] hover:translate-x-[2px] shadow-brutal hover:shadow-brutal-hover' 
          : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
        }
      `}
    >
      <div className="flex items-center justify-center gap-3">
        {!isReady ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Warming up Models...</span>
          </>
        ) : (
          <>
            <Camera className="w-6 h-6" />
            <span>Start Matching</span>
          </>
        )}
      </div>
      {isReady && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
      )}
    </button>
  );
}
