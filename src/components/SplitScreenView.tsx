"use client";

import { useRef, useEffect, useState } from 'react';
import WebcamFeed from './WebcamFeed';
import MatchedMemeDisplay from './MatchedMemeDisplay';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useMemeMatcher } from '../hooks/useMemeMatcher';

export default function SplitScreenView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { mesh, expressions, poseLandmarks, isDetecting, startDetection, stopDetection } = useFaceDetection(videoRef);
  const { matchedMeme } = useMemeMatcher(expressions, mesh, poseLandmarks);

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

    const currentVideo = videoRef.current;

    return () => {
      if (currentVideo && currentVideo.srcObject) {
        const tracks = (currentVideo.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-8 h-full flex-1 w-full">
      <div className="flex flex-col h-full min-h-[400px] bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl overflow-hidden shadow-inner">
        <WebcamFeed videoRef={videoRef} mesh={mesh} poseLandmarks={poseLandmarks} onPlay={startDetection} />
      </div>
      <div className="flex flex-col h-full min-h-[400px] bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl overflow-hidden">
        <MatchedMemeDisplay matchData={matchedMeme} />
      </div>

      {/* DEBUG OVERLAY */}
      {expressions && (
        <div className="absolute top-4 left-4 bg-slate-900/80 p-4 rounded-lg text-xs font-mono text-emerald-400 z-50 pointer-events-none border border-slate-800 backdrop-blur-sm">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1 mb-2">LIVE EXPRESSIONS</p>
          {Object.entries(expressions).map(([key, val]) => (
            <div key={key} className="flex justify-between w-32">
              <span className="text-slate-400">{key}:</span>
              <span>{val.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
