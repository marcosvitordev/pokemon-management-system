// src/app/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function EditPokemonPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id; // O ID vem do URL dinâmico

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    level: 1,
    hp: 10,
    pokedexNumber: 1,
  });

  useEffect(() => {
    const token = localStorage.getItem('@pokemon:token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchPokemon = async () => {
      try {
        // A sua API NestJS procura um Pokémon pelo ID
        const response = await api.get(`/pokemons/${id}`);
        // O backend devolve o objeto dentro da propriedade "pokemon"
        const pkmn = response.data.pokemon; 
        
        // Preenche o formulário com os dados atuais
        setFormData({
          name: pkmn.name,
          type: pkmn.type,
          level: pkmn.level,
          hp: pkmn.hp,
          pokedexNumber: pkmn.pokedexNumber,
        });
      } catch (err: any) {
        setError('Erro ao carregar os dados do Pokémon. Pode não existir ou não ter permissão.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPokemon();
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'name' || name === 'type' ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      // O seu NestJS usa o método PATCH para atualizações
      await api.patch(`/pokemons/${id}`, formData);
      router.push('/'); // Volta para a Pokedex
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar o Pokémon.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-600">A carregar dados do Pokémon...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Editar Pokémon</h2>
          <Link href="/" className="text-sm font-semibold text-gray-500 hover:text-gray-800">
            Cancelar
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
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Tipo principal</label>
              <input 
                type="text" name="type" required
                value={formData.type} onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Número da Pokedex</label>
              <input 
                type="number" name="pokedexNumber" min="1" required
                value={formData.pokedexNumber} onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nível</label>
              <input 
                type="number" name="level" min="1" max="100" required
                value={formData.level} onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">HP (Pontos de Vida)</label>
              <input 
                type="number" name="hp" min="1" required
                value={formData.hp} onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={saving || !!error}
            className="mt-6 w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700 font-semibold disabled:bg-blue-400"
          >
            {saving ? 'A guardar...' : 'Guardar Alterações'}
          </button>
        </form>
      </div>
    </main>
  );
}