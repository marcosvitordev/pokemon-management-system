// src/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatarUrl: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('@pokemon:token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me');
        const user = response.data.user;
        
        setFormData({
          name: user.name || '',
          email: user.email || '',
          avatarUrl: user.avatarUrl || '',
        });
      } catch (err: any) {
        setMessage({ text: 'Erro ao carregar o perfil.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Função para quando o usuário clicar em um avatar da lista
  const handleSelectAvatar = (url: string) => {
    setFormData({ ...formData, avatarUrl: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      await api.patch('/users/me', formData);
      setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || 'Erro ao atualizar.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-lg font-semibold text-slate-600">A carregar perfil...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-red-50 to-amber-50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800">Meu Perfil</h2>
          <Link href="/" className="text-sm font-bold text-slate-500 hover:text-red-600 transition">
            Voltar à Pokédex
          </Link>
        </div>

        {/* Pré-visualização do Avatar Ativo */}
        <div className="mb-6 flex justify-center">
          <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg bg-slate-200">
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl">👤</div>
            )}
          </div>
        </div>
        
        {message.text && (
          <div className={`mb-6 rounded-xl p-4 text-sm font-bold text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Nome</label>
            <input 
              type="text" name="name" required
              value={formData.name} onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <input 
              type="email" name="email" required
              value={formData.email} onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* LISTA DE AVATARES PARA ESCOLHER */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <label className="mb-3 block text-sm font-semibold text-slate-700 text-center">
              Escolha seu Avatar
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PRESET_AVATARS.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectAvatar(url)}
                  className={`relative flex justify-center overflow-hidden rounded-2xl border-4 transition-all duration-200 ${
                    formData.avatarUrl === url
                      ? 'border-blue-500 scale-105 shadow-md'
                      : 'border-transparent hover:scale-105 hover:bg-slate-200'
                  }`}
                >
                  <img src={url} alt={`Avatar ${index + 1}`} className="h-16 w-16 bg-white/50 object-cover" />
                </button>
              ))}
            </div>
            
            {/* Opção de inserir URL manualmente caso queira um diferente */}
            <div className="mt-4 border-t border-slate-200 pt-4">
              <label className="mb-1 block text-xs font-semibold text-slate-500">
                Ou cole a URL de uma imagem:
              </label>
              <input 
                type="url" name="avatarUrl"
                value={formData.avatarUrl} onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={saving}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg disabled:opacity-70"
          >
            {saving ? 'A guardar...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </main>
  );
}