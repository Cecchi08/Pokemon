import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { pokemonApi } from '../api/pokemon.api';
import { PokemonFilters } from '../components/pokemon/PokemonFilters';
import { PokemonGrid } from '../components/pokemon/PokemonGrid';
import { EmptyState } from '../components/shared/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { useCatalogs } from '../hooks/useCatalogs';
import { useDebounce } from '../hooks/useDebounce';
import { usePokemon } from '../hooks/usePokemon';

export function PokemonListPage() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('');
  const [generation, setGeneration] = useState('');
  const [page, setPage] = useState(1);
  const search = useDebounce(input);
  const catalogs = useCatalogs();
  const collection = useQuery({ queryKey: ['pokemon', 'count'], queryFn: () => pokemonApi.list({ pageSize: 1 }) });
  const query = usePokemon({ search, type: type ? Number(type) : undefined, generation: generation ? Number(generation) : undefined, page });
  const pagination = query.data?.pagination;

  return <>
    <section className="intro-row"><div><div className="eyebrow"><Sparkles size={13} /> YOUR FIELD JOURNAL</div><h1>Un mundo por<br className="mobile-break" /> descubrir<span className="title-period">.</span></h1><p className="intro-copy">Cada criatura tiene una historia. Esta es la tuya para guardar.</p></div><div className="collection-total"><span className="total-label">COLECCION</span><strong>{collection.data?.pagination.total ?? '—'}</strong><span className="total-note">Y contando</span></div></section>
    <PokemonFilters catalogs={catalogs.data} search={input} onSearch={(value) => { setInput(value); setPage(1); }} type={type} onType={(value) => { setType(value); setPage(1); }} generation={generation} onGeneration={(value) => { setGeneration(value); setPage(1); }} total={pagination?.total} />
    {query.isLoading && <div className="loading-state"><Spinner label="Abriendo el cuaderno..." /></div>}
    {query.isError && <div className="message-state error-state">No se pudo cargar la coleccion. Comprueba que la API y MySQL esten activos.</div>}
    {query.isSuccess && query.data.data.length === 0 && <EmptyState title="Aun no hay coincidencias">Prueba otra busqueda o agrega una nueva criatura.</EmptyState>}
    {query.data && query.data.data.length > 0 && <PokemonGrid items={query.data.data} />}
    {pagination && pagination.totalPages > 1 && <nav className="pagination" aria-label="Paginacion"><span className="pagination-label">PAGINA <strong>{String(page).padStart(2, '0')}</strong> / {String(pagination.totalPages).padStart(2, '0')}</span><div className="pagination-actions"><button onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} aria-label="Pagina anterior"><ChevronLeft size={17} /></button><button onClick={() => setPage((value) => Math.min(pagination.totalPages, value + 1))} disabled={page === pagination.totalPages} aria-label="Pagina siguiente"><ChevronRight size={17} /></button></div></nav>}
  </>;
}