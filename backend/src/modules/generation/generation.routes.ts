import { Router } from 'express';
import { listGenerations } from './generation.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const generationRoutes = Router();
generationRoutes.get('/', asyncHandler(listGenerations));