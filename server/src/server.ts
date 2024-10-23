import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import routes from './routes/index.js';
import { sequelize, User } from './models/index.js';
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
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(routes);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// Database initialization and server start
async function startServer() {
  try {
    // Log database state before sync
    console.log('Starting server initialization...');
    console.log(`Force refresh is set to: ${forceDatabaseRefresh}`);

    // Sync database
    await sequelize.sync({ force: forceDatabaseRefresh });
    console.log('Database sync completed');

    // Log current users
    const userCount = await User.count();
    console.log(`Current users in database: ${userCount}`);

    if (userCount > 0) {
      // Log some user info without sensitive data
      const users = await User.findAll({
        attributes: ['id', 'username', 'createdAt'],
        order: [['id', 'ASC']]
      });
      console.log('Existing users:', users.map(u => ({
        id: u.id,
        username: u.username,
        created: u.createdAt
      })));
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Database: ${process.env.DB_NAME || 'default'}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});