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
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased">
      {/* Header Navigation */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50 px-4 py-4 flex justify-between items-center">
        <h1 className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-bold tracking-tight text-xl">
          Meme Face Mimic
        </h1>
        {isDetecting && (
          <button 
            onClick={() => setIsDetecting(false)}
            className="px-5 py-2.5 rounded-xl font-medium transition-all duration-200 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 text-sm"
          >
            End Session
          </button>
        )}
      </header>

      <main className="relative flex flex-col items-center min-h-[calc(100vh-70px)]">
        {!isDetecting && <MemeGridBackground memes={memes} />}
        
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full p-4">
          {!isDetecting ? (
            <div className="text-center space-y-8 max-w-2xl bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-12 shadow-xl">
              <h2 className="text-5xl font-bold tracking-tight text-slate-100">
                Ready to match?
              </h2>
              <p className="text-xl text-slate-400 font-medium">
                Match your facial expression to our curated monkey memes in real-time.
              </p>
              <div className="pt-4">
                <DetectButton 
                  isReady={isReady} 
                  onClick={() => setIsDetecting(true)} 
                />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col h-full">
              <SplitScreenView />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
