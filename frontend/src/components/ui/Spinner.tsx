export function Spinner({ label = 'Cargando...' }: { label?: string }) {
  return <span className="ui-spinner" role="status"><span />{label}</span>;
}