INSERT INTO stations (id, name, ligne) VALUES
(1, 'Chatelet', 'M1'),
(2, 'Gare de Lyon', 'M1'),
(3, 'Bastille', 'M1'),
(4, 'Aragon', 'M1');

-- Config globale
INSERT INTO config (key, station_id, value)
VALUES 
  ('metro.defaults', NULL, '{"line":"M1","tz":"Europe/Paris"}');

-- Derniers métros par station
INSERT INTO config (key, station_id, value)
VALUES
  ('metro.last', 1, '{"lastMetro":"00:45"}'),
  ('metro.last', 2, '{"lastMetro":"00:50"}'),
  ('metro.last', 3, '{"lastMetro":"00:55"}'),
  ('metro.last', 4, '{"lastMetro":"01:00"}');
