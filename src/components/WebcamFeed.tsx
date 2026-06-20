"use client";

import { RefObject, useEffect, useRef } from 'react';
import { LandmarkMesh } from '../types/landmarks';

export default function WebcamFeed({ 
  videoRef, 
  mesh,
  poseLandmarks,
  onPlay
}: { 
  videoRef: RefObject<HTMLVideoElement>;
  mesh: LandmarkMesh | null;
  poseLandmarks?: any | null;
  onPlay: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && videoRef.current && (mesh || poseLandmarks)) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const displaySize = { width: video.videoWidth, height: video.videoHeight };
      
      canvas.width = displaySize.width;
      canvas.height = displaySize.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw face mesh
        if (mesh) {
          ctx.fillStyle = '#10b981'; // emerald-500
          mesh.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
            ctx.fill();
          });
        }

        // Draw pose landmarks (specifically wrists and nose for context)
        if (poseLandmarks && poseLandmarks.length > 16) {
          ctx.fillStyle = '#06b6d4'; // cyan-500 for pose

          const drawPoint = (index: number) => {
            const point = poseLandmarks[index];
            if (point && point.visibility > 0.5) {
              const x = point.x * displaySize.width;
              const y = point.y * displaySize.height;
              ctx.beginPath();
              ctx.arc(x, y, 6, 0, 2 * Math.PI);
              ctx.fill();
            }
          };

          drawPoint(0); // nose
          drawPoint(15); // left wrist
          drawPoint(16); // right wrist
        }
      }
    } else if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [mesh, poseLandmarks, videoRef]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black rounded-xl overflow-hidden">
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
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm z-10">
          <p className="text-emerald-400 font-mono text-lg animate-pulse">Detecting Face...</p>
        </div>
      )}
    </div>
  );
}
