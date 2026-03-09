// src/app/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

// Lista de tipos oficiais de Pokémon (A mesma usada na página de Create)
const POKEMON_TYPES = [
  'Normal', 'Fogo', 'Água', 'Grama', 'Elétrico', 'Gelo',
  'Lutador', 'Veneno', 'Terra', 'Voador', 'Psíquico', 'Inseto',
  'Pedra', 'Fantasma', 'Dragão', 'Sombrio', 'Aço', 'Fada'
];

export default function EditPokemonPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [pokemonImageUrl, setPokemonImageUrl] = useState('');

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
        const response = await api.get(`/pokemons/${id}`);
        const pkmn = response.data.pokemon; 
        
        setFormData({
          name: pkmn.name,
          type: pkmn.type,
          level: pkmn.level,
          hp: pkmn.hp,
          pokedexNumber: pkmn.pokedexNumber,
        });
        
        // Guarda a imagem para podermos exibi-la na edição
        if (pkmn.imageUrl) {
          setPokemonImageUrl(pkmn.imageUrl);
        }
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
      [name]: name === 'name' ? value : Number(value),
    }));
  };

  const handleTypeSelect = (selectedType: string) => {
    setFormData((prev) => ({
      ...prev,
      type: selectedType,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.type) {
      setError('Por favor, selecione o tipo principal do Pokémon.');
      return;
    }

    setSaving(true);

    try {
      await api.patch(`/pokemons/${id}`, formData);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar o Pokémon.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-red-50 to-amber-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
          <p className="text-lg font-semibold text-slate-700">A carregar dados do Pokémon...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-red-50 to-amber-50 p-4">
      <div className="my-8 w-full max-w-2xl rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur">
        
        <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-6">
            {/* Exibe a imagem do Pokémon se ela já existir na API */}
            {pokemonImageUrl ? (
              <div className="h-24 w-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center">
                <img src={pokemonImageUrl} alt={formData.name} className="h-16 w-16 object-contain drop-shadow-md" />
              </div>
            ) : (
              <div className="h-24 w-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-4xl">
                ⚪
              </div>
            )}
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
                Pokédex #{formData.pokedexNumber || '?'}
              </p>
              <h2 className="text-3xl font-black text-slate-800">Editar Pokémon</h2>
            </div>
          </div>
          
          <Link href="/" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm transition hover:text-red-600 hover:shadow">
            Cancelar
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
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                        ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-md scale-105'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:bg-slate-50'
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
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Nível</label>
              <input 
                type="number" name="level" min="1" max="100" required
                value={formData.level} onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">HP (Pontos de Vida)</label>
              <input 
                type="number" name="hp" min="1" required
                value={formData.hp} onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={saving || !!error}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? 'A guardar...' : 'Guardar Alterações'}
          </button>
        </form>
      </div>
    </main>
  );
}