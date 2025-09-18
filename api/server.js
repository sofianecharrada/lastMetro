const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Importer routes
const stationsRoutes = require('./routes/stations.js');
app.use('/stations', stationsRoutes);

app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}`));
