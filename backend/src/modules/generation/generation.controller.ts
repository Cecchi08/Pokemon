import type { Request, Response } from 'express';
import { getGenerations } from './generation.service.js';

export async function listGenerations(_request: Request, response: Response) {
  response.json(await getGenerations());
}