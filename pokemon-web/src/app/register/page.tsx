// src/app/register/page.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';

// Lista de avatares pré-definidos gerados pela API do DiceBear
const PRESET_AVATARS = [
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Ash',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Misty',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Brock',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Dawn',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Serena',
  'https://api.dicebear.com/9.x/adventurer/svg?seed=Gary',
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(''); // Estado para o avatar
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Enviamos o avatarUrl junto com os restantes dados
      await api.post('/auth/register', { name, email, password, avatarUrl });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-red-50 to-amber-50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur my-8">
        <div className="mb-8 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-red-500">
            Centro Pokémon
          </p>
          <h2 className="text-3xl font-black text-slate-800">Novo Treinador</h2>
        </div>
        
        {error && (
          <div className="mb-6 rounded-2xl bg-red-100 p-4 text-center text-sm font-bold text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {/* Pré-visualização do Avatar Ativo */}
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg bg-slate-200">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl">👤</div>
            )}
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Nome completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
              placeholder="Ex: Ash Ketchum"
            />
          </div>

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

          {/* LISTA DE AVATARES PARA ESCOLHER NO REGISTO */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <label className="mb-3 block text-sm font-semibold text-slate-700 text-center">
              Escolha um Avatar Inicial
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PRESET_AVATARS.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`relative flex justify-center overflow-hidden rounded-2xl border-4 transition-all duration-200 ${
                    avatarUrl === url
                      ? 'border-red-500 scale-105 shadow-md'
                      : 'border-transparent hover:scale-105 hover:bg-slate-200'
                  }`}
                >
                  <img src={url} alt={`Avatar ${index + 1}`} className="h-16 w-16 bg-white/50 object-cover" />
                </button>
              ))}
            </div>
            
            <div className="mt-4 border-t border-slate-200 pt-4">
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Ou cole a URL de uma imagem:
              </label>
              <input 
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 py-4 font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'A registar...' : 'Criar Conta de Treinador'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-slate-600">
          Já possui uma licença Pokémon?{' '}
          <Link href="/login" className="font-bold text-red-600 transition hover:text-red-700 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  );
}