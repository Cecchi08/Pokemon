import type { RowDataPacket } from 'mysql2/promise';
import { pool } from '../../config/db.js';

export async function findAllTypes() {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id, name, color FROM types ORDER BY name');
  return rows;
}