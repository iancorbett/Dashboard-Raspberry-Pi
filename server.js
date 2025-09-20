import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;
const GIT_SHA = process.env.GIT_SHA || 'dev';
const DASH_PIN = process.env.DASH_PIN || '';

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/version', (req, res) => res.json({ sha: GIT_SHA }));

const __filename = fileURLToPath(import.meta.url); // full path to current file
const __dirname  = path.dirname(__filename); // folder path (no filename)
app.use(express.static(path.join(__dirname, 'public'))); //joins the current folder (__dirname) with public/





app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.listen(port, () => {
    console.log(`Dashboard on :${port}`);
  });

