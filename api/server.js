const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "postgres-db",
  database: "projet_renforcement",
  password: "password",
  port: 5432,
  max: 5,
  idleTimeoutMillis: 10000,
});

app.use(express.json());

// Fonction utilitaire pour calculer le prochain métro
function nextTimeFromNow(headwayMin = 3) {
  const now = new Date();
  const next = new Date(now.getTime() + headwayMin * 60 * 1000);
  const hh = String(next.getHours()).padStart(2, "0");
  const mm = String(next.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

// GET /next-metro?station=...
app.get("/next-metro", (req, res) => {
  const station = (req.query.station || "").toString().trim();
  if (!station)
    return res.status(400).json({ error: "station manquante" });

  return res.status(200).json({
    station,
    line: "M1",
    headwayMin: 3,
    nextArrival: nextTimeFromNow(3),
  });
});

// GET /ping
app.get("/ping", (req, res) => res.send("pong"));

// GET /last-metro?station=...
// GET /last-metro?station=...
app.get("/last-metro", async (req, res) => {
  try {
    const stationQuery = (req.query.station || "").toString().trim();
    if (!stationQuery) {
      return res.status(400).json({ error: "station manquante" });
    }

    // Requête SQL pour récupérer le dernier métro de la station + valeurs par défaut
    const result = await pool.query(
      `SELECT 
         s.name AS station,
         c.value->>'lastMetro' AS lastMetro,
         defaults.value->>'line' AS line,
         defaults.value->>'tz' AS tz
       FROM config c
       JOIN stations s ON c.station_id = s.id
       JOIN config defaults ON defaults.key = 'metro.defaults'
       WHERE c.key = 'metro.last'
         AND LOWER(s.name) = LOWER($1)
       LIMIT 1`,
      [stationQuery]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "station inconnue" });
    }

    const row = result.rows[0];

    res.status(200).json({
      station: row.station,
      lastMetro: row.lastmetro,
      line: row.line,
      tz: row.tz
    });
  } catch (err) {
    console.error("[❌ ERREUR SQL OU SERVEUR]", err.message);
    res.status(500).json({ error: "erreur interne", details: err.message });
  }
});



// 404 handler
app.use((_req, res) => res.status(404).json({ error: "not found" }));

// Lancer le serveur
app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}`));

module.exports = app;

