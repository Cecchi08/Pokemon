# Backend

API REST con Express 4, TypeScript estricto, Zod y MySQL 8 (`mysql2/promise`). Copia `backend/.env.example` como `backend/.env`, configura MySQL y ejecuta el esquema existente `../schema.sql` antes de iniciar.

Desde `backend/`, ejecuta `npm install` y `npm run dev` para iniciar el API en `http://localhost:3001`. `npm run dev:all` inicia ambos servidores. Usa `npm run typecheck`, `npm run lint` y `npm run build` para validar el backend.

Rutas: `/api/pokemon`, `/api/generations`, `/api/types`, `/api/abilities` y `/api/health`. El CRUD de Pokemon guarda estadisticas y relaciones en una transaccion. Los catalogos exponen consultas de lectura.