-- Crée la table stations
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ligne VARCHAR(10) NOT NULL
);

-- Crée la table config avec lien vers stations
CREATE TABLE config (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) NOT NULL,
    station_id INT NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    heureLine TIME NOT NULL,
    line VARCHAR(255),
    tz VARCHAR(50) DEFAULT 'Europe/Paris'
);