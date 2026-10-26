import { Route, Routes } from 'react-router-dom';
import { Container } from './components/layout/Container';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { PokemonCreatePage } from './pages/PokemonCreatePage';
import { PokemonDetailPage } from './pages/PokemonDetailPage';
import { PokemonEditPage } from './pages/PokemonEditPage';
import { PokemonListPage } from './pages/PokemonListPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <ErrorBoundary><Container><Routes>
          <Route path="/" element={<PokemonListPage />} />
          <Route path="/pokemon/new" element={<PokemonCreatePage />} />
          <Route path="/pokemon/:id/edit" element={<PokemonEditPage />} />
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes></Container></ErrorBoundary>
      <Footer />
    </div>
  );
}