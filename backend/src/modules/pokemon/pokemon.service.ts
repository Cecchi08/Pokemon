import * as repository from './pokemon.repository.js';
import type { PokemonInput, PokemonListQuery } from '../../types/index.js';

export const getPokemonList = (query: PokemonListQuery) => repository.listPokemon(query);
export const getPokemon = (id: number) => repository.findPokemonById(id);
export async function createPokemon(input: PokemonInput) {
  return repository.findPokemonById(await repository.createPokemon(input));
}
export async function updatePokemon(id: number, input: PokemonInput) {
  await repository.updatePokemon(id, input);
  return repository.findPokemonById(id);
}
export const removePokemon = (id: number) => repository.deletePokemon(id);