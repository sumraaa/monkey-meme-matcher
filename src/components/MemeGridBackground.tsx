"use client";

import { useEffect, useState } from 'react';

export default function MemeGridBackground({ memes }: { memes: string[] }) {
  const [gridImages, setGridImages] = useState<string[]>([]);

  useEffect(() => {
    // Fill the grid with repeated memes for a wallpaper effect
    if (memes.length > 0) {
      const repeated = Array(20).fill(memes).flat();
      setGridImages(repeated.sort(() => Math.random() - 0.5));
    }
  }, [memes]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-[0.15] pointer-events-none">
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4 animate-pulse-slow">
        {gridImages.map((src, i) => (
          <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="meme" className="w-full h-full object-cover filter grayscale" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950"></div>
    </div>
  );
}
