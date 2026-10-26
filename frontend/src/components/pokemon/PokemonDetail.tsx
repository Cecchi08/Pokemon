import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getErrorMessage } from '../../api/axiosClient';
import { pokemonApi } from '../../api/pokemon.api';
import { DeleteConfirmModal } from './DeleteConfirmModal';

const statLabels = [['hp', 'HP'], ['attack', 'ATAQUE'], ['defense', 'DEFENSA'], ['sp_attack', 'AT. ESP.'], ['sp_defense', 'DEF. ESP.'], ['speed', 'VELOCIDAD']] as const;

export function PokemonDetail() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const id = Number(useParams().id);
  const navigate = useNavigate();
  const client = useQueryClient();
  const query = useQuery({ queryKey: ['pokemon', id], queryFn: () => pokemonApi.getById(id), enabled: Number.isInteger(id) && id > 0 });
  const remove = useMutation({ mutationFn: () => pokemonApi.remove(id), onSuccess: async () => { await client.invalidateQueries({ queryKey: ['pokemon'] }); navigate('/'); } });
  if (query.isLoading) return <div className="standalone-state">Abriendo ficha...</div>;
  if (query.isError || !query.data) return <div className="standalone-state"><p>{query.isError ? getErrorMessage(query.error) : 'Pokemon no encontrado.'}</p><Link className="text-link" to="/">Volver a la coleccion</Link></div>;
  const pokemon = query.data;
  const total = Object.values(pokemon.stats).reduce((sum, value) => sum + value, 0);
  const accent = pokemon.types[0]?.color ?? '#d5cfbd';

  return <section className="detail-view" style={{ '--detail-accent': accent } as React.CSSProperties}>
    <div className="detail-toolbar"><Link to="/" className="back-link"><ArrowLeft size={16} /> COLECCION</Link><div className="detail-actions"><Link to={`/pokemon/${id}/edit`} className="icon-action" aria-label="Editar Pokemon" title="Editar"><Pencil size={16} /></Link><button className="icon-action danger-action" onClick={() => setConfirmDelete(true)} disabled={remove.isPending} aria-label="Eliminar Pokemon" title="Eliminar"><Trash2 size={16} /></button></div></div>
    {remove.isError && <p className="form-error">{getErrorMessage(remove.error)}</p>}
    <div className="detail-hero"><div className="detail-art"><span className="detail-watermark">{String(pokemon.pokedex_number).padStart(3, '0')}</span><div className="detail-art-ring" />{pokemon.sprite_url ? <img src={pokemon.sprite_url} alt={pokemon.name} /> : <span className="sprite-placeholder">?</span>}</div><div className="detail-heading"><span className="eyebrow">NO. {String(pokemon.pokedex_number).padStart(3, '0')} <span className="eyebrow-divider">/</span> {pokemon.generation_name}</span><h1>{pokemon.name}<span className="title-period">.</span></h1><p className="detail-description">{pokemon.description || 'Una criatura esperando que alguien escriba su historia.'}</p><div className="type-list detail-types">{pokemon.types.map((type) => <span className="type-pill" key={type.id} style={{ '--type-color': type.color } as React.CSSProperties}>{type.name}</span>)}</div><div className="detail-meta"><span><small>REGION</small>{pokemon.region}</span><span><small>ALTURA</small>{pokemon.height_m == null ? '—' : `${pokemon.height_m} m`}</span><span><small>PESO</small>{pokemon.weight_kg == null ? '—' : `${pokemon.weight_kg} kg`}</span><span><small>EXPERIENCIA</small>{pokemon.base_experience ?? '—'}</span></div></div></div>
    <div className="detail-columns"><section className="stat-section"><div className="section-kicker">01 <span /> ATRIBUTOS BASE <strong>{total} TOTAL</strong></div>{statLabels.map(([key, label]) => <div className="stat-row" key={key}><span>{label}</span><strong>{pokemon.stats[key]}</strong><div className="stat-track"><span style={{ width: `${Math.min(100, pokemon.stats[key] / 2.55)}%` }} /></div></div>)}</section><section className="ability-section"><div className="section-kicker">02 <span /> HABILIDADES</div>{pokemon.abilities.length ? pokemon.abilities.map((ability) => <article className="ability-row" key={ability.id}><div><h3>{ability.name.replace(/-/g, ' ')}</h3><p>{ability.description || 'Sin descripcion disponible.'}</p></div>{ability.is_hidden && <span className="hidden-tag">OCULTA</span>}</article>) : <p className="muted-copy">Sin habilidades registradas.</p>}<div className="section-kicker section-kicker-lower">03 <span /> ARCHIVO</div><div className="record-row"><span>REGISTRADO</span><strong>{new Date(pokemon.created_at).toLocaleDateString('es-ES')}</strong></div></section></div>
    {confirmDelete && <DeleteConfirmModal name={pokemon.name} pending={remove.isPending} onClose={() => setConfirmDelete(false)} onConfirm={() => remove.mutate()} />}
  </section>;
}