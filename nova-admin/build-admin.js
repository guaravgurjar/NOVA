import { bundle } from '@adminjs/bundler';

console.log('Starting Admin.js local build...');

await bundle({
  destinationDir: './public',
});

console.log('Build complete! The files are ready in the ./public directory.');