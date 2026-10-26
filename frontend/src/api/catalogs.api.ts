import { axiosClient } from './axiosClient';
import type { Ability, Catalogs, Generation, PokemonType } from '../types/pokemon';

export const catalogsApi = {
  all: async (): Promise<Catalogs> => {
    const [generations, types, abilities] = await Promise.all([
      axiosClient.get<Generation[]>('/generations'),
      axiosClient.get<Array<Omit<PokemonType, 'slot'>>>('/types'),
      axiosClient.get<Array<Omit<Ability, 'is_hidden'>>>('/abilities'),
    ]);
    return { generations: generations.data, types: types.data, abilities: abilities.data };
  },
};