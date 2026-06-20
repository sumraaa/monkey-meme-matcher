import fs from 'fs';
import path from 'path';
import AppShell from '../components/AppShell';

export default function Page() {
  // Try to read from public/publicmemes first, otherwise provide default placeholder paths
  let memes: string[] = [];
  try {
    const memesDirs = [
      { dir: path.join(process.cwd(), 'public', 'publicmemes'), prefix: '/publicmemes/' },
      { dir: path.join(process.cwd(), 'public', 'memes'), prefix: '/memes/' }
    ];

    for (const { dir, prefix } of memesDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        memes = memes.concat(files
          .filter(file => !file.endsWith('.gif')) // Excluding gifs as requested
          .map(file => `${prefix}${file}`));
      }
    }
  } catch (error) {
    console.error("Error reading memes directory:", error);
  }

  // Fallback if empty
  if (memes.length === 0) {
    memes = [
      '/publicmemes/still monkey.jpeg',
      '/publicmemes/think monek.jpeg',
      '/publicmemes/think.jpg',
      '/memes/head.jpeg',
      '/memes/sideeyes.jpg',
      '/memes/sideeyes.jpeg'
    ];
  }

  return <AppShell memes={memes} />;
}
