import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import routes from './routes/index.js';
import { sequelize, User } from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const forceDatabaseRefresh = false;

// Check environment before forcefully refreshing the database
if (process.env.NODE_ENV === 'production' && forceDatabaseRefresh) {
  console.error('WARNING: Database refresh is set to true in production environment!');
  process.exit(1);
}

// 1. Serve static files from the client's dist folder
app.use(express.static(join(__dirname, '../../client/dist')));

// 2. Enable JSON parsing middleware
app.use(express.json());

// 3. Logging middleware for request details (optional)
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 4. API routes
app.use(routes);

// 5. Catch-all route for frontend routing
app.get('*', (req, res) => {
  console.log(`Serving index.html for route: ${req.originalUrl}`);
  res.sendFile(join(__dirname, '../../client/dist/index.html'), (err) => {
    if (err) {
      console.error(`Error serving index.html:`, err);
      res.status(500).send('Error loading the page');
    }
  });
});

// Database initialization and server start
async function startServer() {
  try {
    console.log('Starting server initialization...');
    console.log(`Force refresh is set to: ${forceDatabaseRefresh}`);

    // Sync database
    await sequelize.sync({ force: forceDatabaseRefresh });
    console.log('Database sync completed');

    const userCount = await User.count();
    console.log(`Current users in database: ${userCount}`);

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
