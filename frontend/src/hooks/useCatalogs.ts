import { useQuery } from '@tanstack/react-query';
import { catalogsApi } from '../api/catalogs.api';

export function useCatalogs() {
  return useQuery({ queryKey: ['catalogs'], queryFn: catalogsApi.all });
}