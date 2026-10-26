import type { RowDataPacket } from 'mysql2/promise';
import { pool } from '../../config/db.js';

export async function findAllAbilities() {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id, name, description FROM abilities ORDER BY name');
  return rows;
}