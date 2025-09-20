import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;
const GIT_SHA = process.env.GIT_SHA || 'dev';
const DASH_PIN = process.env.DASH_PIN || '';

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/version', (req, res) => res.json({ sha: GIT_SHA }));