import { Router } from 'express';
import * as controller from './pokemon.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const pokemonRoutes = Router();

pokemonRoutes.get('/', asyncHandler(controller.listPokemon));
pokemonRoutes.get('/:id', asyncHandler(controller.getPokemon));
pokemonRoutes.post('/', asyncHandler(controller.createPokemon));
pokemonRoutes.put('/:id', asyncHandler(controller.updatePokemon));
pokemonRoutes.delete('/:id', asyncHandler(controller.deletePokemon));