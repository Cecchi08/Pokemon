import { Router } from 'express';
import { listAbilities } from './ability.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const abilityRoutes = Router();
abilityRoutes.get('/', asyncHandler(listAbilities));