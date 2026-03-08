// src/app/register/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api'; // Ajuste o caminho de importação se necessário ('../../lib/api')

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Ajuste a rota '/auth/register' ou '/users' consoante o seu backend NestJS
      await api.post('/auth/register', { name, email, password });
      
      // Se tiver sucesso, redireciona para o login
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Registo de Treinador</h2>
        
        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Ash Ketchum"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="ash@pokemon.com"
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
            className="w-full rounded-md bg-green-600 py-2 text-white transition hover:bg-green-700 font-semibold disabled:bg-green-400"
          >
            {loading ? 'A criar...' : 'Criar Conta'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Faça login aqui
          </Link>
        </p>
      </div>
    </main>
  );
}