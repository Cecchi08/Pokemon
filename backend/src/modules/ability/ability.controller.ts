import type { Request, Response } from 'express';
import { getAbilities } from './ability.service.js';

export async function listAbilities(_request: Request, response: Response) {
  response.json(await getAbilities());
}