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
      
      // O backend devolve o token como access_token
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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-red-50 to-amber-50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur">
        <div className="mb-8 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-red-500">
            Centro Pokémon
          </p>
          <h2 className="text-3xl font-black text-slate-800">Acesso de Treinador</h2>
        </div>
        
        {error && (
          <div className="mb-6 rounded-2xl bg-red-100 p-4 text-center text-sm font-bold text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email de contacto</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
              placeholder="treinador@pokemon.com"
            />
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Palavra-passe</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 py-4 font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'A entrar...' : 'Entrar na Pokédex'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-600">
          Ainda não tem a sua licença?{' '}
          <Link href="/register" className="font-bold text-red-600 transition hover:text-red-700 hover:underline">
            Registe-se aqui
          </Link>
        </p>
      </div>
    </main>
  );
}