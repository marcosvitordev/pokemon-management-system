// src/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

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

  // Estado separado para as senhas
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSelectAvatar = (url: string) => {
    setFormData({ ...formData, avatarUrl: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    // Validação da nova senha
    if (passwordData.password) {
      if (passwordData.password.length < 6) {
        setMessage({ text: 'A nova senha deve ter pelo menos 6 caracteres.', type: 'error' });
        setSaving(false);
        return;
      }
      if (passwordData.password !== passwordData.confirmPassword) {
        setMessage({ text: 'As senhas não coincidem. Tente novamente.', type: 'error' });
        setSaving(false);
        return;
      }
    }

    try {
      // Prepara os dados para enviar
      const payload: any = { ...formData };
      if (passwordData.password) {
        payload.password = passwordData.password;
      }

      await api.patch('/users/me', payload);
      setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
      
      // Limpa os campos de senha após o sucesso
      setPasswordData({ password: '', confirmPassword: '' });
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || 'Erro ao atualizar o perfil.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-lg font-semibold text-slate-600">A carregar perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-red-50 to-amber-50 p-4 sm:p-6">
      <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur sm:p-10 my-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800 sm:text-3xl">Meu Perfil</h2>
          <Link href="/" className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm transition hover:text-red-600 hover:shadow">
            Voltar à Pokédex
          </Link>
        </div>

        {/* Pré-visualização do Avatar Ativo */}
        <div className="mb-8 flex flex-col items-center justify-center">
          <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg bg-slate-200 mb-3">
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl">👤</div>
            )}
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Treinador</p>
        </div>
        
        {message.text && (
          <div className={`mb-6 rounded-2xl p-4 text-center text-sm font-bold shadow-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECÇÃO: DADOS PESSOAIS */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-400 border-b pb-2">Dados Pessoais</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            </div>
          </div>

          {/* SECÇÃO: AVATAR */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-400 border-b pb-2">Aparência</h3>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-3 block text-sm font-semibold text-slate-700 text-center">
                Escolha seu Avatar Rápido
              </label>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
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
                    <img src={url} alt={`Avatar ${index + 1}`} className="h-12 w-12 bg-white/50 object-cover sm:h-14 sm:w-14" />
                  </button>
                ))}
              </div>
              
              <div className="mt-4 border-t border-slate-200 pt-4">
                <label className="mb-1 block text-xs font-semibold text-slate-500">
                  Ou cole a URL de uma imagem personalizada:
                </label>
                <input 
                  type="url" name="avatarUrl"
                  value={formData.avatarUrl} onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* SECÇÃO: SEGURANÇA (NOVA) */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase text-slate-400 border-b pb-2">Segurança</h3>
            <p className="text-xs text-slate-500 mb-2">Deixe em branco se não quiser alterar a senha atual.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Nova Senha</label>
                <input 
                  type="password" name="password"
                  value={passwordData.password} onChange={handlePasswordChange}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Confirmar Nova Senha</label>
                <input 
                  type="password" name="confirmPassword"
                  value={passwordData.confirmPassword} onChange={handlePasswordChange}
                  placeholder="Repita a senha"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={saving}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? 'A guardar alterações...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </main>
  );
}