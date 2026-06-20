import { LandmarkMesh, FeatureVector } from '../types/landmarks';

export const extractFeatureVector = (mesh: LandmarkMesh): FeatureVector => {
  if (!mesh || mesh.length === 0) return [];

  // Simple normalization: calculate centroid, translate points, calculate max distance, scale points
  let centroidX = 0;
  let centroidY = 0;
  for (const pt of mesh) {
    centroidX += pt.x;
    centroidY += pt.y;
  }
  centroidX /= mesh.length;
  centroidY /= mesh.length;

  let maxDist = 0;
  const translated = mesh.map((pt) => {
    const tx = pt.x - centroidX;
    const ty = pt.y - centroidY;
    const dist = Math.sqrt(tx * tx + ty * ty);
    if (dist > maxDist) maxDist = dist;
    return { x: tx, y: ty };
  });

  const scaled = translated.map((pt) => ({
    x: pt.x / (maxDist || 1),
    y: pt.y / (maxDist || 1),
  }));

  // Flatten into a vector
  return scaled.flatMap((pt) => [pt.x, pt.y]);
};
