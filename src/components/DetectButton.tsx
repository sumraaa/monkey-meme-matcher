"use client";

import { Loader2, Camera } from "lucide-react";

export default function DetectButton({ isReady, onClick }: { isReady: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={!isReady}
      className={`
        relative group overflow-hidden rounded-full px-8 py-4 font-bold text-lg transition-all duration-300
        ${isReady 
          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:scale-105 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]' 
          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
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
