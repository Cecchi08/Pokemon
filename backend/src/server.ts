import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

const server = app.listen(env.API_PORT, () => {
  console.log(`API lista en http://localhost:${env.API_PORT}`);
});

const shutdown = () => {
  server.close(() => {
    void pool.end().finally(() => process.exit(0));
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);