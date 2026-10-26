export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  sp_attack: number;
  sp_defense: number;
  speed: number;
}

export interface PokemonType {
  id: number;
  name: string;
  color: string;
  slot: number;
}

export interface PokemonAbility {
  id: number;
  name: string;
  description: string | null;
  is_hidden: boolean;
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
  created_at: Date | string;
  updated_at: Date | string;
  stats: PokemonStats;
  types: PokemonType[];
  abilities: PokemonAbility[];
}

export interface PokemonInput {
  pokedex_number: number;
  name: string;
  description: string | null;
  height_m: number | null;
  weight_kg: number | null;
  base_experience: number | null;
  sprite_url: string | null;
  generation_id: number;
  stats: PokemonStats;
  type_ids: number[];
  abilities: Array<{ ability_id: number; is_hidden: boolean }>;
}

export interface PokemonListQuery {
  search: string;
  type?: number;
  generation?: number;
  page: number;
  pageSize: number;
}

export interface CatalogGeneration {
  id: number;
  number: number;
  name: string;
  region: string;
}

export interface CatalogType {
  id: number;
  name: string;
  color: string;
}

export interface CatalogAbility {
  id: number;
  name: string;
  description: string | null;
}