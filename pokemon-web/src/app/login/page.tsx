// src/app/login/page.tsx
'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Entrar no Centro Pokémon</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="treinador@pokemon.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Palavra-passe</label>
            <input 
              type="password" 
              className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="********"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700 font-semibold"
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Ainda não tem conta?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Registe-se aqui
          </Link>
        </p>
      </div>
    </main>
  );
}