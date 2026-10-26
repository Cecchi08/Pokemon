import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Pokemon } from '../../types/pokemon';

export function PokemonCard({ pokemon, index }: { pokemon: Pokemon & { total_stats: number }; index: number }) {
  const accent = pokemon.types[0]?.color ?? '#b5b6a4';
  return (
    <Link to={`/pokemon/${pokemon.id}`} className="pokemon-card" style={{ '--card-accent': accent, '--card-delay': `${index * 45}ms` } as React.CSSProperties}>
      <div className="card-topline"><span className="dex-number">NO. {String(pokemon.pokedex_number).padStart(3, '0')}</span><ArrowUpRight className="card-arrow" size={15} /></div>
      <div className="card-art"><div className="art-halo" /><span className="art-index">{String(pokemon.pokedex_number).padStart(3, '0')}</span>{pokemon.sprite_url ? <img src={pokemon.sprite_url} alt={pokemon.name} loading="lazy" /> : <div className="sprite-placeholder">?</div>}</div>
      <div className="card-info"><div className="card-title-row"><h2>{pokemon.name}</h2><span className="card-region">{pokemon.region}</span></div><div className="type-list">{pokemon.types.map((type) => <span className="type-pill" key={type.id} style={{ '--type-color': type.color } as React.CSSProperties}>{type.name}</span>)}</div><div className="card-baseline"><span>BASE STATS</span><strong>{pokemon.total_stats || '—'}</strong><span className="baseline-rule" /><span>GEN {pokemon.generation_id}</span></div></div>
    </Link>
  );
}