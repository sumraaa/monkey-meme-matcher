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
        ctx.fillStyle = '#FF2A85'; // meme-pink
        
        mesh.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
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
    <div className="relative w-full h-full flex items-center justify-center bg-meme-green border-r-4 border-black md:border-r-0 md:border-b-4">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onPlay={onPlay}
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 grayscale contrast-125"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 pointer-events-none drop-shadow-md"
      />
      {!mesh && (
        <div className="absolute inset-0 flex items-center justify-center bg-white border-4 border-black m-8 shadow-brutal z-10 transform rotate-1">
          <p className="text-black font-heading font-black uppercase text-2xl animate-pulse">Detecting Face...</p>
        </div>
      )}
    </div>
  );
}
