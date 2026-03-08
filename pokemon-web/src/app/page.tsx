// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Pokemon {
  id: string;
  name: string;
  type: string;
  level: number;
  hp: number;
  pokedexNumber: number;
  imageUrl: string; 
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function Home() {
  const router = useRouter();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('@pokemon:token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Descodifica o payload do JWT para obter o ID do utilizador logado
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      // No NestJS, o ID normalmente fica no 'sub' ou 'userId' no JWT
      setCurrentUserId(decodedPayload.sub || decodedPayload.userId || decodedPayload.id);
    } catch (e) {
      console.error('Erro ao descodificar o token', e);
    }

    fetchPokemons();
  }, [router]);

  const fetchPokemons = async () => {
    try {
      const response = await api.get('/pokemons');
      setPokemons(response.data.data); 
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar a lista de Pokémons.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('@pokemon:token');
    delete api.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Tem a certeza que deseja apagar este Pokémon?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/pokemons/${id}`);
      // Remove o pokemon apagado da lista no frontend sem recarregar a página
      setPokemons((prev) => prev.filter((pokemon) => pokemon.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Erro ao apagar o Pokémon.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-gray-600">Loading Pokedex...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-red-600">Centro Pokémon</h1>
          
          <div className="flex items-center gap-4">
            <Link href="/create" className="rounded-md bg-green-600 px-4 py-2 font-semibold text-white transition hover:bg-green-700">
              + Adicionar Pokémon
            </Link>
            <button 
              onClick={handleLogout}
              className="rounded-md border border-gray-300 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Sair
            </button>
          </div>
        </header>

        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{error}</div>}

        {pokemons.length === 0 && !error ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">Nenhum Pokémon registado ainda. Seja o primeiro a adicionar!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pokemons.map((pokemon) => {
              // Verifica se o utilizador logado é o criador deste Pokémon
              const isOwner = currentUserId && pokemon.createdBy?.id === currentUserId;

              return (
                <div key={pokemon.id} className="rounded-lg bg-white p-6 shadow-sm transition hover:shadow-md border-t-4 border-red-500 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 capitalize">{pokemon.name}</h3>
                        <span className="text-sm font-bold text-gray-400">#{pokemon.pokedexNumber}</span>
                      </div>
                      {pokemon.imageUrl && (
                        <img src={pokemon.imageUrl} alt={pokemon.name} className="w-16 h-16 object-contain" />
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-semibold">Tipo:</span> {pokemon.type}</p>
                      <p><span className="font-semibold">Nível:</span> {pokemon.level}</p>
                      <p><span className="font-semibold">HP:</span> {pokemon.hp}</p>
                      {pokemon.createdBy && (
                        <p className="text-xs text-gray-400 mt-2">Treinador: {pokemon.createdBy.name}</p>
                      )}
                    </div>
                  </div>

                  {/* Renderiza os botões apenas se o utilizador for o dono (isOwner) */}
                  {isOwner && (
                    <div className="mt-4 flex gap-2 border-t pt-4">
                      <Link 
                        href={`/edit/${pokemon.id}`} 
                        className="flex-1 rounded bg-blue-100 py-1 text-center text-blue-700 hover:bg-blue-200 transition text-sm font-semibold"
                      >
                        Editar
                      </Link>
                      <button 
                        onClick={() => handleDelete(pokemon.id)}
                        className="flex-1 rounded bg-red-100 py-1 text-red-700 hover:bg-red-200 transition text-sm font-semibold"
                      >
                        Apagar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}