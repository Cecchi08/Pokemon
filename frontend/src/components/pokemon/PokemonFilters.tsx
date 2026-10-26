import { ArrowDown, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Catalogs } from '../../types/pokemon';

interface PokemonFiltersProps {
  catalogs?: Catalogs;
  search: string;
  onSearch: (value: string) => void;
  type: string;
  onType: (value: string) => void;
  generation: string;
  onGeneration: (value: string) => void;
  total?: number;
}

export function PokemonFilters(props: PokemonFiltersProps) {
  return <section className="collection-toolbar" aria-label="Controles de coleccion">
    <div className="collection-heading"><SlidersHorizontal size={15} /><span>Explorar</span></div>
    <label className="search-box"><Search size={16} /><input value={props.search} onChange={(event) => props.onSearch(event.target.value)} placeholder="Buscar por nombre o numero..." aria-label="Buscar Pokemon" /></label>
    <label className="select-wrap"><select value={props.type} onChange={(event) => props.onType(event.target.value)} aria-label="Filtrar por tipo"><option value="">Todos los tipos</option>{props.catalogs?.types.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}</select><ArrowDown size={13} /></label>
    <label className="select-wrap"><select value={props.generation} onChange={(event) => props.onGeneration(event.target.value)} aria-label="Filtrar por region"><option value="">Todas las regiones</option>{props.catalogs?.generations.map((generation) => <option key={generation.id} value={generation.id}>{generation.region}</option>)}</select><ArrowDown size={13} /></label>
    <span className="result-count">{props.total ?? '—'} criaturas</span>
    <Link className="primary-button" to="/pokemon/new"><Plus size={16} /> <span>Nuevo Pokemon</span></Link>
  </section>;
}