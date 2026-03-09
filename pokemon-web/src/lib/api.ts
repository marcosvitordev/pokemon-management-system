// pokemon-web/src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  // Tenta ler o URL da nuvem; se não existir, usa o localhost
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});