import { z } from 'zod';

const nullableNumber = (max: number) => z.number().min(0).max(max).nullable();

export const pokemonInputSchema = z.object({
  pokedex_number: z.number().int().positive().max(100_000),
  name: z.string().trim().min(1).max(60),
  description: z.string().trim().max(5000).nullable(),
  height_m: nullableNumber(1000),
  weight_kg: nullableNumber(100_000),
  base_experience: z.number().int().min(0).max(100_000).nullable(),
  sprite_url: z.string().url().max(500).nullable().or(z.literal('').transform(() => null)),
  generation_id: z.number().int().positive(),
  stats: z.object({
    hp: z.number().int().min(0).max(1000),
    attack: z.number().int().min(0).max(1000),
    defense: z.number().int().min(0).max(1000),
    sp_attack: z.number().int().min(0).max(1000),
    sp_defense: z.number().int().min(0).max(1000),
    speed: z.number().int().min(0).max(1000),
  }),
  type_ids: z.array(z.number().int().positive()).min(1).max(2),
  abilities: z.array(z.object({ ability_id: z.number().int().positive(), is_hidden: z.boolean() })).max(3),
}).strict();

export const listPokemonSchema = z.object({
  search: z.string().trim().max(100).default(''),
  type: z.coerce.number().int().positive().optional(),
  generation: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
});

export const idSchema = z.object({ id: z.coerce.number().int().positive() });
export type PokemonInputData = z.infer<typeof pokemonInputSchema>;