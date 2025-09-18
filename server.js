"use strict";
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'postgres-db',
  database: 'mon_projet_db',
  password: 'mypassword',
  port: 5432,
});

// Vérification initiale
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('DB error:', err);
  else console.log('DB connected:', res.rows[0]);
});

// Logger minimal: méthode, chemin, status, durée
app.use((req, res, next) => {
  const t0 = Date.now();
  res.on('finish', () => {
    const dt = Date.now() - t0;
    console.log(`${req.method} ${req.path} -> ${res.statusCode} ${dt}ms`);
  });
  next();
});

// Santé
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', service: 'dernier-metro-api' }));

// Utilitaire pour simuler un horaire HH:MM
function nextTimeFromNow(headwayMin = 3) {
  const now = new Date();
  const next = new Date(now.getTime() + headwayMin * 60 * 1000);
  const hh = String(next.getHours()).padStart(2, '0');
  const mm = String(next.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

// Endpoint métier minimal
app.get('/next-metro', (req, res) => {
  const station = (req.query.station || '').toString().trim();
  if (!station) return res.status(400).json({ error: "missing station" });
  return res.status(200).json({ station, line: 'M1', headwayMin: 3, nextArrival: nextTimeFromNow(3) });
});

app.get('/stations', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stations');
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('DB query error:', err);
    return res.status(500).json({ error: 'Erreur serveur DB' });
  }
});

// 404 JSON
app.use((_req, res) => res.status(404).json({ error: 'not found' }));

app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}`));
