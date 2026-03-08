// src/app/login/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // O backend costuma devolver o token como access_token ou token.
      const token = response.data.access_token || response.data.token;
      
      if (token) {
        // Guarda o token no Local Storage
        localStorage.setItem('@pokemon:token', token);
        
        // Configura o axios para enviar o token nos próximos pedidos automaticamente
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Redireciona para a Pokedex (página principal)
        router.push('/');
      } else {
        setError('Token não recebido. Verifique a API.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou palavra-passe incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Entrar no Centro Pokémon</h2>
        
        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="treinador@pokemon.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Palavra-passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="********"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700 font-semibold disabled:bg-blue-400"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Ainda não tem conta?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Registe-se aqui
          </Link>
        </p>
      </div>
    </main>
  );
}