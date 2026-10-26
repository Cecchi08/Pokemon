import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return <section className="standalone-state"><strong>Esta pagina no existe.</strong><Link className="text-link" to="/">Volver a la coleccion</Link></section>;
}