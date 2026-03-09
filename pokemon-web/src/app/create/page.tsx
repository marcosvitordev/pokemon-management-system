// src/app/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

// Lista de tipos oficiais de Pokémon
const POKEMON_TYPES = [
  'Normal', 'Fogo', 'Água', 'Grama', 'Elétrico', 'Gelo',
  'Lutador', 'Veneno', 'Terra', 'Voador', 'Psíquico', 'Inseto',
  'Pedra', 'Fantasma', 'Dragão', 'Sombrio', 'Aço', 'Fada'
];

export default function CreatePokemonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estado unificado para o formulário
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    level: 1,
    hp: 10,
    pokedexNumber: 1,
  });

  // Verifica se o utilizador está logado antes de mostrar a página
  useEffect(() => {
    const token = localStorage.getItem('@pokemon:token');
    if (!token) {
      router.push('/login');
    } else {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Se for número, converte para Number, senão mantém string
      [name]: name === 'name' ? value : Number(value),
    }));
  };

  // Nova função para quando o utilizador clica num tipo
  const handleTypeSelect = (selectedType: string) => {
    setFormData((prev) => ({
      ...prev,
      type: selectedType,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validação extra para garantir que escolheu um tipo
    if (!formData.type) {
      setError('Por favor, selecione o tipo principal do Pokémon.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/pokemons', formData);
      router.push('/'); // Redireciona de volta para a Pokedex após criar
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar o Pokémon. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-red-50 to-amber-50 p-4">
      <div className="my-8 w-full max-w-2xl rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-red-500">
              Pokédex
            </p>
            <h2 className="text-3xl font-black text-slate-800">Registar Pokémon</h2>
          </div>
          <Link href="/" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm transition hover:text-red-600 hover:shadow">
            Voltar
          </Link>
        </div>
        
        {error && (
          <div className="mb-6 rounded-2xl bg-red-100 p-4 text-center text-sm font-bold text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Nome do Pokémon</label>
              <input 
                type="text" name="name" required
                value={formData.name} onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
                placeholder="Ex: Pikachu"
              />
            </div>

            {/* SELEÇÃO CLICÁVEL DE TIPOS */}
            <div className="md:col-span-2">
              <label className="mb-3 block text-sm font-semibold text-slate-700">Tipo principal</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {POKEMON_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeSelect(type)}
                    className={`rounded-xl border py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      formData.type === type
                        ? 'border-red-500 bg-red-50 text-red-600 shadow-md scale-105'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-red-300 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Número da Pokedex</label>
              <input 
                type="number" name="pokedexNumber" min="1" required
                value={formData.pokedexNumber} onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Nível</label>
              <input 
                type="number" name="level" min="1" max="100" required
                value={formData.level} onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">HP (Pontos de Vida)</label>
              <input 
                type="number" name="hp" min="1" required
                value={formData.hp} onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 py-4 font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'A registar...' : 'Registar Pokémon'}
          </button>
        </form>
      </div>
    </main>
  );
}