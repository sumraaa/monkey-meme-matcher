"use client";

import { Loader2, Camera } from "lucide-react";

export default function DetectButton({ isReady, onClick }: { isReady: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={!isReady}
      className={`
        px-5 py-2.5 rounded-xl font-medium transition-all duration-200 border flex items-center justify-center gap-3
        ${isReady 
          ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700 shadow-xl' 
          : 'bg-slate-900/50 text-slate-600 border-slate-800/50 cursor-not-allowed'
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
