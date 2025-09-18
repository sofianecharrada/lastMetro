const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'postgres-db',
  database: 'mon-projet-db',
  password: 'mypassword',
  port: 5432,
  max: 5,
	idleTimeoutMillis: 10000

});

app.use(express.json());

function nextTimeFromNow(headwayMin = 3) {
	const now = new Date();
	const next = new Date(now.getTime() + headwayMin * 60 * 1000);
	const hh = String(next.getHours()).padStart(2, '0');
	const mm = String(next.getMinutes()).padStart(2, '0');
	return `${hh}:${mm}`;
}

// GET /next-metro?station=...
app.get('/next-metro', (req, res) => {
	const station = (req.query.station || '').toString().trim();
	if (!station) return res.status(400).json({ error: "station manquante" });
	return res.status(200).json({ station, line: 'M1', headwayMin: 3, nextArrival: nextTimeFromNow(3) });
});


// GET /last-metro?station=...
app.get('/last-metro', async (req, res) => {
  try {
    const stationQuery = (req.query.station || '').toString().trim();
    if (!stationQuery) return res.status(400).json({ error: "station manquante" });

    const stationLower = stationQuery.toLowerCase();

    // Récupérer les valeurs par défaut
    const defaultsResult = await pool.query(
      `SELECT line, tz 
       FROM config 
       WHERE key='metro.defaults' 
       LIMIT 1`
    );
    const defaults = defaultsResult.rows[0] || { line: 'M1', tz: 'Europe/Paris' };

    // Récupérer l'heure du dernier métro pour la station (insensible à la casse)
    const lastResult = await pool.query(
      `SELECT c.heureLine, COALESCE(c.line, $2) AS line, COALESCE(c.tz, $3) AS tz, s.name AS station
       FROM config c
       JOIN stations s ON c.station_id = s.id
       WHERE c.key='metro.last' AND LOWER(s.name)=$1
       LIMIT 1`,
      [stationLower, defaults.line, defaults.tz]
    );

    if (!lastResult.rows.length) {
      return res.status(404).json({ error: 'station inconnue' });
    }

    const lastMetroData = lastResult.rows[0];

    res.status(200).json({
      station: lastMetroData.station,
      lastMetro: lastMetroData.heureline,
      line: lastMetroData.line,
      tz: lastMetroData.tz,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erreur interne' });
  }
});



app.use((_req, res) => res.status(404).json({ error: 'not found' }));
// Importer routes

app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}`));
module.exports = app;