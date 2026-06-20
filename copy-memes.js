const fs = require('fs');
const path = require('path');

const srcDir = 'e:/publicmemes';
const destDir = path.join(__dirname, 'public', 'publicmemes');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    if (!file.endsWith('.gif')) {
      const srcFile = path.join(srcDir, file);
      const destFile = path.join(destDir, file);
      fs.copyFileSync(srcFile, destFile);
      console.log(`Copied ${file}`);
    }
  }
} else {
  console.log(`Source dir ${srcDir} does not exist`);
}
