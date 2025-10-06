-- Crée la table stations
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ligne VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL,         -- "metro.defaults" ou "metro.last"
    station_id INT REFERENCES stations(id) ON DELETE CASCADE,  -- null si clé globale
    value JSONB NOT NULL DEFAULT '{}'  -- Stocke les données : { "line":"M1", "tz":"Europe/Paris" } ou { "Chatelet":"00:45", ... }
);
