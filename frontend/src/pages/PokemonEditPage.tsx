import { useCatalogs } from '../hooks/useCatalogs';
import { PokemonForm } from '../components/pokemon/PokemonForm';

export function PokemonEditPage() {
  const catalogs = useCatalogs();
  return <PokemonForm catalogs={catalogs.data} />;
}