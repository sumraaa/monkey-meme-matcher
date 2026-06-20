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
    <div className="relative min-h-screen text-black overflow-hidden font-sans">
      {!isDetecting && <MemeGridBackground memes={memes} />}
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {!isDetecting ? (
          <div className="text-center space-y-8 max-w-2xl bg-white p-12 border-8 border-black shadow-brutal-lg transform -rotate-1">
            <h1 className="text-6xl font-extrabold tracking-tight text-black uppercase">
              Meme Face Mimic
            </h1>
            <p className="text-xl text-black font-medium border-t-4 border-black pt-4">
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
          <div className="w-full h-[90vh] max-w-7xl bg-meme-pink border-8 border-black shadow-brutal-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b-8 border-black flex justify-between items-center bg-white">
              <h2 className="text-3xl font-black uppercase tracking-wider text-black">
                Live Matching
              </h2>
              <button 
                onClick={() => setIsDetecting(false)}
                className="px-6 py-2 bg-meme-blue text-white font-bold border-4 border-black shadow-brutal hover:shadow-brutal-hover hover:translate-y-[2px] hover:translate-x-[2px] transition-all uppercase"
              >
                Exit
              </button>
            </div>
            <div className="flex-1 overflow-hidden p-6 bg-meme-pink">
              <SplitScreenView />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
