import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { getErrorMessage } from '../../api/axiosClient';
import { pokemonApi } from '../../api/pokemon.api';
import type { Catalogs, PokemonInput } from '../../types/pokemon';

const nullableNumber = z.number().min(0).nullable();
const formSchema = z.object({
  pokedex_number: z.number().int().positive('Ingresa un numero valido.'),
  name: z.string().trim().min(1, 'El nombre es obligatorio.').max(60),
  description: z.string().max(5000),
  height_m: nullableNumber,
  weight_kg: nullableNumber,
  base_experience: z.number().int().min(0).nullable(),
  sprite_url: z.union([z.literal(''), z.string().url('Ingresa una URL valida.')]),
  generation_id: z.number().int().positive('Selecciona una generacion.'),
  stats: z.object({ hp: z.number().int().min(0), attack: z.number().int().min(0), defense: z.number().int().min(0), sp_attack: z.number().int().min(0), sp_defense: z.number().int().min(0), speed: z.number().int().min(0) }),
  type_ids: z.array(z.number().int()).min(1, 'Selecciona al menos un tipo.').max(2, 'El maximo son dos tipos.'),
  abilities: z.array(z.object({ ability_id: z.number().int(), is_hidden: z.boolean() })),
});
type FormValues = z.infer<typeof formSchema>;

const numberInput = (value: number | null) => value ?? null;

export function PokemonForm({ catalogs }: { catalogs?: Catalogs }) {
  const id = Number(useParams().id);
  const editing = Number.isInteger(id) && id > 0;
  const navigate = useNavigate();
  const client = useQueryClient();
  const detail = useQuery({ queryKey: ['pokemon', id], queryFn: () => pokemonApi.getById(id), enabled: editing });
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { pokedex_number: 1, name: '', description: '', height_m: null, weight_kg: null, base_experience: null, sprite_url: '', generation_id: catalogs?.generations[0]?.id ?? 1, stats: { hp: 0, attack: 0, defense: 0, sp_attack: 0, sp_defense: 0, speed: 0 }, type_ids: [], abilities: [] },
  });

  useEffect(() => {
    if (!detail.data) return;
    const pokemon = detail.data;
    form.reset({ pokedex_number: pokemon.pokedex_number, name: pokemon.name, description: pokemon.description ?? '', height_m: numberInput(pokemon.height_m), weight_kg: numberInput(pokemon.weight_kg), base_experience: numberInput(pokemon.base_experience), sprite_url: pokemon.sprite_url ?? '', generation_id: pokemon.generation_id, stats: pokemon.stats, type_ids: pokemon.types.map((type) => type.id), abilities: pokemon.abilities.map((ability) => ({ ability_id: ability.id, is_hidden: ability.is_hidden })) });
  }, [detail.data, form]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const input = { ...values, description: values.description || null, sprite_url: values.sprite_url || null, height_m: values.height_m, weight_kg: values.weight_kg, base_experience: values.base_experience } as PokemonInput;
      return editing ? pokemonApi.update(id, input) : pokemonApi.create(input);
    },
    onSuccess: async (pokemon) => { await client.invalidateQueries({ queryKey: ['pokemon'] }); navigate(`/pokemon/${pokemon.id}`); },
  });

  const submit = form.handleSubmit((values) => mutation.mutate(values));
  const registerNumber = (name: `stats.${keyof FormValues['stats']}`) => form.register(name, { valueAsNumber: true });
  const selectedTypes = useWatch({ control: form.control, name: 'type_ids' }) ?? [];
  const selectedAbilities = useWatch({ control: form.control, name: 'abilities' }) ?? [];
  const toggleType = (typeId: number) => form.setValue('type_ids', selectedTypes.includes(typeId) ? selectedTypes.filter((item) => item !== typeId) : selectedTypes.length < 2 ? [...selectedTypes, typeId] : selectedTypes, { shouldValidate: true });
  const toggleAbility = (abilityId: number) => form.setValue('abilities', selectedAbilities.some((item) => item.ability_id === abilityId) ? selectedAbilities.filter((item) => item.ability_id !== abilityId) : [...selectedAbilities, { ability_id: abilityId, is_hidden: false }], { shouldValidate: true });

  if (editing && detail.isLoading) return <div className="standalone-state">Abriendo ficha...</div>;
  if (editing && detail.isError) return <div className="standalone-state"><p>{getErrorMessage(detail.error)}</p><Link to="/" className="text-link">Volver a la coleccion</Link></div>;

  return <section className="form-view"><Link to={editing ? `/pokemon/${id}` : '/'} className="back-link"><ArrowLeft size={16} /> {editing ? 'FICHA DEL POKEMON' : 'COLECCION'}</Link><div className="form-heading"><div><span className="eyebrow">{editing ? 'ACTUALIZAR REGISTRO' : 'NUEVA ENTRADA'}</span><h1>{editing ? 'Editar ficha' : 'Una nueva historia'}<span className="title-period">.</span></h1></div><span className="form-index">POKEDEX<br />ENTRY / {editing ? String(id).padStart(3, '0') : 'NEW'}</span></div>
    <form onSubmit={submit} className="pokemon-form" noValidate>
      <div className="form-section-title"><span>01</span><h2>Identidad</h2><i /></div><div className="form-grid identity-grid">
        <label className="field"><span>Numero Pokedex</span><input type="number" min="1" {...form.register('pokedex_number', { valueAsNumber: true })} />{form.formState.errors.pokedex_number && <small>{form.formState.errors.pokedex_number.message}</small>}</label>
        <label className="field"><span>Nombre</span><input placeholder="ej. pikachu" {...form.register('name')} />{form.formState.errors.name && <small>{form.formState.errors.name.message}</small>}</label>
        <label className="field"><span>Generacion</span><select {...form.register('generation_id', { valueAsNumber: true })}><option value="">Seleccionar...</option>{catalogs?.generations.map((generation) => <option key={generation.id} value={generation.id}>{generation.name} · {generation.region}</option>)}</select>{form.formState.errors.generation_id && <small>{form.formState.errors.generation_id.message}</small>}</label>
        <label className="field span-two"><span>Descripcion</span><textarea rows={3} placeholder="Una breve historia sobre esta criatura..." {...form.register('description')} /></label>
        <label className="field span-two"><span>URL de la imagen</span><input type="url" placeholder="https://..." {...form.register('sprite_url')} />{form.formState.errors.sprite_url && <small>{form.formState.errors.sprite_url.message}</small>}</label>
      </div>

      <div className="form-section-title"><span>02</span><h2>Detalles fisicos</h2><i /></div><div className="form-grid three-grid">
        <label className="field"><span>Altura <em>METROS</em></span><input type="number" min="0" step="0.1" placeholder="—" {...form.register('height_m', { setValueAs: (value) => value === '' ? null : Number(value) })} /></label>
        <label className="field"><span>Peso <em>KILOGRAMOS</em></span><input type="number" min="0" step="0.1" placeholder="—" {...form.register('weight_kg', { setValueAs: (value) => value === '' ? null : Number(value) })} /></label>
        <label className="field"><span>Experiencia base</span><input type="number" min="0" placeholder="—" {...form.register('base_experience', { setValueAs: (value) => value === '' ? null : Number(value) })} /></label>
      </div>

      <div className="form-section-title"><span>03</span><h2>Tipos</h2><i /></div><div className="choice-grid">{catalogs?.types.map((type) => <button className={`choice-chip ${selectedTypes.includes(type.id) ? 'selected' : ''}`} type="button" key={type.id} onClick={() => toggleType(type.id)} style={{ '--choice-color': type.color } as React.CSSProperties}><span />{type.name}</button>)}</div>{form.formState.errors.type_ids && <small className="inline-error">{form.formState.errors.type_ids.message}</small>}

      <div className="form-section-title"><span>04</span><h2>Habilidades</h2><i /></div><div className="ability-choice-grid">{catalogs?.abilities.map((ability) => { const chosen = selectedAbilities.find((item) => item.ability_id === ability.id); return <label className={`ability-choice ${chosen ? 'chosen' : ''}`} key={ability.id}><input type="checkbox" checked={Boolean(chosen)} onChange={() => toggleAbility(ability.id)} /><span className="custom-check" /><span className="ability-choice-name">{ability.name}</span>{chosen && <button className="hidden-toggle" type="button" onClick={(event) => { event.preventDefault(); form.setValue('abilities', selectedAbilities.map((item) => item.ability_id === ability.id ? { ...item, is_hidden: !item.is_hidden } : item)); }}>{chosen.is_hidden ? 'OCULTA' : 'NORMAL'}</button>}</label>; })}</div>

      <div className="form-section-title"><span>05</span><h2>Estadisticas base</h2><i /></div><div className="form-grid three-grid stats-inputs">{([['hp', 'HP'], ['attack', 'Ataque'], ['defense', 'Defensa'], ['sp_attack', 'Ataque especial'], ['sp_defense', 'Defensa especial'], ['speed', 'Velocidad']] as const).map(([key, label]) => <label className="field" key={key}><span>{label}</span><input type="number" min="0" max="1000" {...registerNumber(`stats.${key}`)} /></label>)}</div>

      {mutation.isError && <div className="form-error">{getErrorMessage(mutation.error)}</div>}
      <div className="form-actions"><Link to={editing ? `/pokemon/${id}` : '/'} className="cancel-button">Cancelar</Link><button className="primary-button" type="submit" disabled={mutation.isPending}><Save size={16} /> {mutation.isPending ? 'Guardando...' : 'Guardar Pokemon'}</button></div>
    </form>
  </section>;
}