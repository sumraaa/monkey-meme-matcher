import fs from 'fs';
import path from 'path';
import AppShell from '../components/AppShell';

export default function Page() {
  // Try to read from public/publicmemes first, otherwise provide default placeholder paths
  let memes: string[] = [];
  try {
    const memesDir = path.join(process.cwd(), 'public', 'publicmemes');
    if (fs.existsSync(memesDir)) {
      const files = fs.readdirSync(memesDir);
      memes = files
        .filter(file => !file.endsWith('.gif')) // Excluding gifs as requested
        .map(file => `/publicmemes/${file}`);
    }
  } catch (error) {
    console.error("Error reading memes directory:", error);
  }

  // Fallback if empty
  if (memes.length === 0) {
    memes = [
      '/publicmemes/still monkey.jpeg',
      '/publicmemes/think monek.jpeg',
      '/publicmemes/think.jpg'
    ];
  }

  return <AppShell memes={memes} />;
}
