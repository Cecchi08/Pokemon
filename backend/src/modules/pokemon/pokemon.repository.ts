import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../../config/db.js';
import { AppError } from '../../utils/AppError.js';
import type { PokemonInput, PokemonListQuery } from '../../types/index.js';

export async function listPokemon(query: PokemonListQuery) {
  const conditions: string[] = [];
  const params: Record<string, string | number> = {};
  if (query.search) {
    conditions.push('(p.name LIKE :search OR CAST(p.pokedex_number AS CHAR) LIKE :search)');
    params.search = `%${query.search}%`;
  }
  if (query.type) {
    conditions.push('EXISTS (SELECT 1 FROM pokemon_types pt WHERE pt.pokemon_id = p.id AND pt.type_id = :typeId)');
    params.typeId = query.type;
  }
  if (query.generation) {
    conditions.push('p.generation_id = :generationId');
    params.generationId = query.generation;
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [countRows] = await pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM pokemon p ${where}`, params);
  const total = Number(countRows[0]?.total ?? 0);
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT p.id, p.pokedex_number, p.name, p.description, p.height_m, p.weight_kg,
      p.base_experience, p.sprite_url, p.generation_id, g.name AS generation_name, g.region,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', t.id, 'name', t.name, 'color', t.color, 'slot', pt.slot))
       FROM pokemon_types pt JOIN types t ON t.id = pt.type_id WHERE pt.pokemon_id = p.id) AS types,
      (SELECT SUM(s.hp + s.attack + s.defense + s.sp_attack + s.sp_defense + s.speed)
       FROM pokemon_stats s WHERE s.pokemon_id = p.id) AS total_stats
     FROM pokemon p JOIN generations g ON g.id = p.generation_id ${where}
     ORDER BY p.pokedex_number LIMIT :limit OFFSET :offset`,
    { ...params, limit: query.pageSize, offset: (query.page - 1) * query.pageSize },
  );
  return {
    data: rows.map((row) => ({ ...row, types: row.types ?? [] })),
    pagination: { page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) },
  };
}

export async function findPokemonById(id: number) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT p.*, g.name AS generation_name, g.region,
      (SELECT JSON_OBJECT('hp', s.hp, 'attack', s.attack, 'defense', s.defense,
        'sp_attack', s.sp_attack, 'sp_defense', s.sp_defense, 'speed', s.speed)
       FROM pokemon_stats s WHERE s.pokemon_id = p.id LIMIT 1) AS stats,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', t.id, 'name', t.name, 'color', t.color, 'slot', pt.slot))
       FROM pokemon_types pt JOIN types t ON t.id = pt.type_id WHERE pt.pokemon_id = p.id) AS types,
      (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', a.id, 'name', a.name, 'description', a.description, 'is_hidden', pa.is_hidden))
       FROM pokemon_abilities pa JOIN abilities a ON a.id = pa.ability_id WHERE pa.pokemon_id = p.id) AS abilities
     FROM pokemon p JOIN generations g ON g.id = p.generation_id WHERE p.id = ?`, [id],
  );
  const pokemon = rows[0];
  if (!pokemon) throw new AppError(404, 'Pokemon no encontrado.');
  return {
    ...pokemon,
    stats: pokemon.stats ?? { hp: 0, attack: 0, defense: 0, sp_attack: 0, sp_defense: 0, speed: 0 },
    types: pokemon.types ?? [],
    abilities: pokemon.abilities ?? [],
  };
}

async function writePokemon(connection: Awaited<ReturnType<typeof pool.getConnection>>, input: PokemonInput, existingId?: number) {
  const fields = [input.pokedex_number, input.name, input.description, input.height_m, input.weight_kg,
    input.base_experience, input.sprite_url || null, input.generation_id];
  const duplicateQuery = existingId
    ? 'SELECT id FROM pokemon WHERE pokedex_number = ? AND id <> ? LIMIT 1'
    : 'SELECT id FROM pokemon WHERE pokedex_number = ? LIMIT 1';
  const duplicateParams = existingId ? [input.pokedex_number, existingId] : [input.pokedex_number];
  const [duplicates] = await connection.execute<RowDataPacket[]>(duplicateQuery, duplicateParams);
  if (duplicates.length) throw new AppError(409, 'Ya existe un Pokemon con ese numero de Pokedex.');

  let id = existingId;
  if (id) {
    await connection.execute(
      `UPDATE pokemon SET pokedex_number = ?, name = ?, description = ?, height_m = ?, weight_kg = ?,
       base_experience = ?, sprite_url = ?, generation_id = ? WHERE id = ?`, [...fields, id],
    );
  } else {
    const [result] = await connection.execute<ResultSetHeader>(
      `INSERT INTO pokemon (pokedex_number, name, description, height_m, weight_kg, base_experience, sprite_url, generation_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, fields,
    );
    id = result.insertId;
  }

  const [statsRows] = await connection.execute<RowDataPacket[]>(
    'SELECT id FROM pokemon_stats WHERE pokemon_id = ? LIMIT 1', [id],
  );
  const values = [input.stats.hp, input.stats.attack, input.stats.defense, input.stats.sp_attack, input.stats.sp_defense, input.stats.speed];
  if (statsRows.length) {
    await connection.execute(
      'UPDATE pokemon_stats SET hp = ?, attack = ?, defense = ?, sp_attack = ?, sp_defense = ?, speed = ? WHERE id = ?',
      [...values, statsRows[0]?.id],
    );
  } else {
    await connection.execute(
      'INSERT INTO pokemon_stats (pokemon_id, hp, attack, defense, sp_attack, sp_defense, speed) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, ...values],
    );
  }

  await connection.execute('DELETE FROM pokemon_types WHERE pokemon_id = ?', [id]);
  for (const [index, typeId] of input.type_ids.entries()) {
    await connection.execute('INSERT INTO pokemon_types (pokemon_id, type_id, slot) VALUES (?, ?, ?)', [id, typeId, index + 1]);
  }
  await connection.execute('DELETE FROM pokemon_abilities WHERE pokemon_id = ?', [id]);
  for (const ability of input.abilities) {
    await connection.execute('INSERT INTO pokemon_abilities (pokemon_id, ability_id, is_hidden) VALUES (?, ?, ?)',
      [id, ability.ability_id, ability.is_hidden]);
  }
  return id;
}

export async function createPokemon(input: PokemonInput) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const id = await writePokemon(connection, input);
    await connection.commit();
    return id;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updatePokemon(id: number, input: PokemonInput) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT id FROM pokemon WHERE id = ?', [id]);
    if (!rows.length) throw new AppError(404, 'Pokemon no encontrado.');
    await writePokemon(connection, input, id);
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deletePokemon(id: number) {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM pokemon WHERE id = ?', [id]);
  if (!result.affectedRows) throw new AppError(404, 'Pokemon no encontrado.');
}