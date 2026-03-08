// src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  // Assumindo que o seu backend NestJS corre na porta 3000 por defeito
  baseURL: 'http://localhost:3001', 
});