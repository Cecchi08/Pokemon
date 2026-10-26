import type { RowDataPacket } from 'mysql2/promise';
import { pool } from '../../config/db.js';

export async function findAllGenerations() {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT id, number, name, region FROM generations ORDER BY number');
  return rows;
}