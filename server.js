import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getWeather } from './lib/weather.js';

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

app.get('/api/weather', async (req, res) => {
    try {
      const lat = Number(req.query.lat ?? process.env.LAT ?? 37.3382);   // default San Jose-ish
      const lon = Number(req.query.lon ?? process.env.LON ?? -121.8863);
      const data = await getWeather(lat, lon);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: 'weather_failed', message: String(e) });
    }
  });

  app.get('/api/verse', async (_req, res) => {
    try {
      const data = await getVerse();
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: 'verse_failed', message: String(e) });
    }
  });


app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.listen(port, () => {
    console.log(`Dashboard on :${port}`);
  });

