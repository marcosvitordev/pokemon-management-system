// src/app/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

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
      [name]: name === 'name' || name === 'type' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Registar Pokémon</h2>
          <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-800">
            Voltar
          </Link>
        </div>
        
        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nome do Pokémon</label>
              <input 
                type="text" name="name" required
                value={formData.name} onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Ex: Pikachu"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Tipo principal</label>
              <input 
                type="text" name="type" required
                value={formData.type} onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Ex: Elétrico, Fogo, Água"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Número da Pokedex</label>
              <input 
                type="number" name="pokedexNumber" min="1" required
                value={formData.pokedexNumber} onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nível</label>
              <input 
                type="number" name="level" min="1" max="100" required
                value={formData.level} onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">HP (Pontos de Vida)</label>
              <input 
                type="number" name="hp" min="1" required
                value={formData.hp} onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="mt-6 w-full rounded-md bg-red-600 py-2 text-white transition hover:bg-red-700 font-semibold disabled:bg-red-400"
          >
            {loading ? 'A registar...' : 'Registar Pokémon'}
          </button>
        </form>
      </div>
    </main>
  );
}