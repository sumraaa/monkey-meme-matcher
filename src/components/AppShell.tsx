"use client";

import { useState, useEffect } from 'react';
import { loadModels } from '../lib/faceApiLoader';
import { precomputeMemes } from '../lib/memeLibrary';
import MemeGridBackground from './MemeGridBackground';
import DetectButton from './DetectButton';
import SplitScreenView from './SplitScreenView';

export default function AppShell({ memes }: { memes: string[] }) {
  const [isReady, setIsReady] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    const init = async () => {
      await loadModels();
      await precomputeMemes(memes);
      setIsReady(true);
    };
    init();
  }, [memes]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-hidden font-sans">
      {!isDetecting && <MemeGridBackground memes={memes} />}
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {!isDetecting ? (
          <div className="text-center space-y-8 max-w-2xl backdrop-blur-sm bg-slate-900/40 p-12 rounded-3xl border border-slate-800/50 shadow-2xl">
            <h1 className="text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">
              Meme Face Mimic
            </h1>
            <p className="text-xl text-slate-300 font-medium">
              Match your facial expression to our curated monkey memes in real-time.
            </p>
            <DetectButton 
              isReady={isReady} 
              onClick={() => setIsDetecting(true)} 
            />
          </div>
        ) : (
          <div className="w-full h-[90vh] max-w-7xl backdrop-blur-md bg-slate-900/60 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/80">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Live Matching
              </h2>
              <button 
                onClick={() => setIsDetecting(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors font-medium text-sm border border-slate-600"
              >
                Back to Start
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-6">
              <SplitScreenView />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
