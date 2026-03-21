import express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { createApp } from './api.js';

const port = process.env.PORT || 8888;

const app = createApp();

const distPath = join(process.cwd(), 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(join(distPath, 'index.html')));
}

app.listen(port, () => {
  console.log(`lajfex-ng listening on port ${port}`);
});
