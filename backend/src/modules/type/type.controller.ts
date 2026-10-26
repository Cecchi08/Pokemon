import type { Request, Response } from 'express';
import { getTypes } from './type.service.js';

export async function listTypes(_request: Request, response: Response) {
  response.json(await getTypes());
}