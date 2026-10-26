import axios from 'axios';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api',
  timeout: 10000,
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ error?: string }>(error)) {
    return error.response?.data?.error ?? 'No se pudo conectar con la API.';
  }
  return 'Ocurrio un error inesperado.';
}