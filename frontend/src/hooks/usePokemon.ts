import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pokemonApi } from '../api/pokemon.api';
import type { PokemonInput } from '../types/pokemon';

export function usePokemon(params: { search: string; type: number | undefined; generation: number | undefined; page: number }) {
  return useQuery({
    queryKey: ['pokemon', params],
    queryFn: () => pokemonApi.list({ ...params, pageSize: 12 }),
    placeholderData: (previous) => previous,
  });
}

export function usePokemonById(id: number, enabled = true) {
  return useQuery({ queryKey: ['pokemon', id], queryFn: () => pokemonApi.getById(id), enabled });
}

export function useSavePokemon(id?: number) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: PokemonInput) => id ? pokemonApi.update(id, input) : pokemonApi.create(input),
    onSuccess: async () => { await client.invalidateQueries({ queryKey: ['pokemon'] }); },
  });
}

export function useDeletePokemon() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: pokemonApi.remove,
    onSuccess: async () => { await client.invalidateQueries({ queryKey: ['pokemon'] }); },
  });
}