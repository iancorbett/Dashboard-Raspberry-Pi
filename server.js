import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getWeather } from './lib/weather.js';
import { getVerse } from './lib/verse.js';
import { getSystem } from './lib/system.js';
import { listNotes, addNote, deleteNote } from './lib/notes.js';

const app = express();
const port = process.env.PORT || 3000;
const GIT_SHA = process.env.GIT_SHA || 'dev';
const DASH_PIN = process.env.DASH_PIN || '';

app.use(express.json());

app.use((req, _res, next) => { console.log(req.method, req.url); next(); });

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/version', (req, res) => res.json({ sha: GIT_SHA }));



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

  app.get('/api/system', (_req, res) => {
    res.json(getSystem());
  });

  function requirePin(req, res, next) {
    if (!DASH_PIN) return next();
    const pin = req.header('x-dash-pin');
    if (pin === DASH_PIN) return next();
    return res.status(401).json({ error: 'PIN required' });
  }

  app.get('/api/notes', requirePin, (_req, res) => {
    res.json({ notes: listNotes() });
  });

  app.post('/api/notes', requirePin, (req, res) => {
    const { text } = req.body || {};
    if (!text || !String(text).trim()) return res.status(400).json({ error: 'text_required' }); //if empty
    const note = addNote(String(text).trim()); //force type to be a string
    res.json({ ok: true, note });
  });

const __filename = fileURLToPath(import.meta.url); // full path to current file
const __dirname  = path.dirname(__filename); // folder path (no filename)
app.use(express.static(path.join(__dirname, 'public'))); //joins the current folder (__dirname) with public/


app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

app.listen(port, () => {
    console.log(`Dashboard on :${port}`);
  });

