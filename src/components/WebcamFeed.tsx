"use client";

import { RefObject, useEffect, useRef } from 'react';
import { LandmarkMesh } from '../types/landmarks';

export default function WebcamFeed({ 
  videoRef, 
  mesh,
  onPlay
}: { 
  videoRef: RefObject<HTMLVideoElement>;
  mesh: LandmarkMesh | null;
  onPlay: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && videoRef.current && mesh) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      
      canvas.width = displaySize.width;
      canvas.height = displaySize.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#10b981'; // emerald-500
        
        mesh.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    } else if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [mesh, videoRef]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onPlay={onPlay}
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 pointer-events-none"
      />
      {!mesh && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
          <p className="text-emerald-400 font-mono animate-pulse">Detecting face...</p>
        </div>
      )}
    </div>
  );
}
