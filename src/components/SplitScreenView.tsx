"use client";

import { useRef, useEffect, useState } from 'react';
import WebcamFeed from './WebcamFeed';
import MatchedMemeDisplay from './MatchedMemeDisplay';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useMemeMatcher } from '../hooks/useMemeMatcher';

export default function SplitScreenView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { mesh, expressions, isDetecting, startDetection, stopDetection } = useFaceDetection(videoRef);
  const { matchedMeme } = useMemeMatcher(expressions, mesh);

  useEffect(() => {
    // Request camera access
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    startVideo();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-full gap-6">
      <div className="flex-1 flex flex-col h-full bg-slate-950/50 rounded-2xl overflow-hidden border border-slate-800/80">
        <WebcamFeed videoRef={videoRef} mesh={mesh} onPlay={startDetection} />
      </div>
      <div className="flex-1 flex flex-col h-full bg-slate-950/50 rounded-2xl overflow-hidden border border-slate-800/80">
        <MatchedMemeDisplay matchData={matchedMeme} />
      </div>

      {/* DEBUG OVERLAY */}
      {expressions && (
        <div className="absolute top-4 left-4 bg-black/80 p-4 rounded-lg text-xs font-mono text-green-400 z-50 pointer-events-none">
          <p className="font-bold text-white mb-2">LIVE EXPRESSIONS:</p>
          {Object.entries(expressions).map(([key, val]) => (
            <div key={key} className="flex justify-between w-32">
              <span>{key}:</span>
              <span>{val.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
