import { Link } from 'react-router-dom';

export function Header() {
  return <header className="topbar"><Link to="/" className="brand" aria-label="Pokedex Studio, inicio"><span className="brand-mark"><span /></span><span className="brand-name">Pokedex<span>Studio</span></span></Link><div className="topbar-right"><span className="edition-label"><span className="live-dot" /> PERSONAL ARCHIVE</span><span className="topbar-divider" /><span className="edition-year">№ 001 — 999</span></div></header>;
}