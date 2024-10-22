import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const forceDatabaseRefresh = false;

// If the environment is production and the forceDatabaseRefresh is set to true, then log a warning and exit the process
if (process.env.NODE_ENV === 'production' && forceDatabaseRefresh) {
  console.error('WARNING: Database refresh is set to true in production environment!');
  process.exit(1);
}

// Serves static files in the entire client's dist folder
app.use(express.static('../client/dist'));
app.use(express.static(path.join(__dirname, '../../client/dist')));

app.use(express.json());

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(routes);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

sequelize.sync({force: forceDatabaseRefresh}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Database sync completed. Force refresh: ${forceDatabaseRefresh}`);
  });
});