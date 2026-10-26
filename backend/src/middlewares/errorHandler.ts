import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof ZodError) {
    response.status(400).json({ error: 'Datos no validos.', details: error.flatten() });
    return;
  }
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = String(error.code);
    if (code === 'ER_DUP_ENTRY') {
      response.status(409).json({ error: 'Ya existe un Pokemon con ese numero de Pokedex.' });
      return;
    }
    if (code === 'ER_NO_REFERENCED_ROW_2') {
      response.status(400).json({ error: 'La generacion, tipo o habilidad seleccionada no existe.' });
      return;
    }
  }
  console.error(error);
  response.status(500).json({ error: 'Ocurrio un error interno.' });
};