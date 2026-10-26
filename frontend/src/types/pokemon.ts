export interface Generation {
  id: number;
  number: number;
  name: string;
  region: string;
}

export interface PokemonType {
  id: number;
  name: string;
  color: string;
  slot: number;
}

export interface Ability {
  id: number;
  name: string;
  description: string | null;
  is_hidden: boolean;
}

export interface Stats {
  hp: number;
  attack: number;
  defense: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
}

export interface Pokemon {
  id: number;
  pokedex_number: number;
  name: string;
  description: string | null;
  height_m: number | null;
  weight_kg: number | null;
  base_experience: number | null;
  sprite_url: string | null;
  generation_id: number;
  generation_name: string;
  region: string;
  created_at: string;
  updated_at: string;
  types: PokemonType[];
  abilities: Ability[];
  stats: Stats;
}

export interface Catalogs {
  generations: Generation[];
  types: Omit<PokemonType, 'slot'>[];
  abilities: Omit<Ability, 'is_hidden'>[];
}

export type PokemonInput = Omit<Pokemon, 'id' | 'generation_name' | 'region' | 'created_at' | 'updated_at' | 'types' | 'abilities'> & {
  type_ids: number[];
  abilities: Array<{ ability_id: number; is_hidden: boolean }>;
};

export interface PokemonPage {
  data: Array<Pokemon & { total_stats: number }>;
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
}