import type { PokemonPage } from '../../types/pokemon';
import { PokemonCard } from './PokemonCard';

export function PokemonGrid({ items }: { items: PokemonPage['data'] }) {
  return <div className="pokemon-grid">{items.map((pokemon, index) => <PokemonCard key={pokemon.id} pokemon={pokemon} index={index} />)}</div>;
}