import type { Request, Response } from 'express';
import * as service from './pokemon.service.js';
import { idSchema, listPokemonSchema, pokemonInputSchema } from './pokemon.schema.js';

export async function listPokemon(request: Request, response: Response) {
  response.json(await service.getPokemonList(listPokemonSchema.parse(request.query)));
}

export async function getPokemon(request: Request, response: Response) {
  const { id } = idSchema.parse(request.params);
  response.json(await service.getPokemon(id));
}

export async function createPokemon(request: Request, response: Response) {
  const pokemon = await service.createPokemon(pokemonInputSchema.parse(request.body));
  response.status(201).json(pokemon);
}

export async function updatePokemon(request: Request, response: Response) {
  const { id } = idSchema.parse(request.params);
  response.json(await service.updatePokemon(id, pokemonInputSchema.parse(request.body)));
}

export async function deletePokemon(request: Request, response: Response) {
  const { id } = idSchema.parse(request.params);
  await service.removePokemon(id);
  response.status(204).send();
}