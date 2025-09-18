-- Crée la table stations
CREATE TABLE stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ligne VARCHAR(10) NOT NULL
);


