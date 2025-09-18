INSERT INTO stations (name, ligne) VALUES
('Chatelet', 'M1'),
('Gare de Lyon', 'M1'),
('Bastille', 'M1');

INSERT INTO config (key, station_id, heureLine, line, tz)
VALUES
('metro.defaults', 1, '00:00:00', 'M1', 'Europe/Paris');
INSERT INTO config (key, station_id, heureLine, line)
VALUES
('metro.last', 1, '00:45:00', 'M1'),
('metro.last', 2, '00:50:00', 'M1'),
('metro.last', 3, '00:55:00', 'M1');