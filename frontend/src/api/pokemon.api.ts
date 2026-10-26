import { axiosClient } from './axiosClient';
import type { Pokemon, PokemonInput, PokemonPage } from '../types/pokemon';

export const pokemonApi = {
  list: async (params: { search?: string; type?: number; generation?: number; page?: number; pageSize?: number }) =>
    (await axiosClient.get<PokemonPage>('/pokemon', { params })).data,
  getById: async (id: number) => (await axiosClient.get<Pokemon>(`/pokemon/${id}`)).data,
  create: async (input: PokemonInput) => (await axiosClient.post<Pokemon>('/pokemon', input)).data,
  update: async (id: number, input: PokemonInput) => (await axiosClient.put<Pokemon>(`/pokemon/${id}`, input)).data,
  remove: async (id: number) => { await axiosClient.delete(`/pokemon/${id}`); },
};