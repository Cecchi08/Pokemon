import { Router } from 'express';
import { listTypes } from './type.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const typeRoutes = Router();
typeRoutes.get('/', asyncHandler(listTypes));