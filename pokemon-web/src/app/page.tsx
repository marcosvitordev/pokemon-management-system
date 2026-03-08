// src/app/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { LayoutGrid, List } from "lucide-react";

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

function getTypeColor(type: string) {
  const normalized = type.toLowerCase();

  switch (normalized) {
    case "fogo":
    case "fire":
      return "from-orange-500 to-red-500";
    case "água":
    case "agua":
    case "water":
      return "from-blue-500 to-cyan-500";
    case "grama":
    case "grass":
      return "from-green-500 to-emerald-500";
    case "elétrico":
    case "eletrico":
    case "electric":
      return "from-yellow-400 to-amber-500";
    case "psíquico":
    case "psiquico":
    case "psychic":
      return "from-pink-500 to-fuchsia-500";
    case "gelo":
    case "ice":
      return "from-cyan-300 to-sky-400";
    case "lutador":
    case "fighting":
      return "from-red-700 to-orange-600";
    case "veneno":
    case "poison":
      return "from-violet-500 to-purple-600";
    case "terra":
    case "ground":
      return "from-amber-600 to-yellow-700";
    case "voador":
    case "flying":
      return "from-indigo-400 to-sky-500";
    case "inseto":
    case "bug":
      return "from-lime-500 to-green-600";
    case "pedra":
    case "rock":
      return "from-stone-500 to-stone-700";
    case "fantasma":
    case "ghost":
      return "from-indigo-600 to-purple-700";
    case "dragão":
    case "dragao":
    case "dragon":
      return "from-indigo-700 to-blue-700";
    case "sombrio":
    case "dark":
      return "from-gray-700 to-gray-900";
    case "aço":
    case "aco":
    case "steel":
      return "from-slate-400 to-slate-600";
    case "fada":
    case "fairy":
      return "from-pink-300 to-rose-400";
    case "normal":
      return "from-zinc-400 to-zinc-600";
    default:
      return "from-red-500 to-rose-600";
  }
}

export default function Home() {
  const router = useRouter();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name?: string;
    email?: string;
    avatarUrl?: string;
  } | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");

  // ADICIONADO: Estado para controlar o modo de visualização (grade ou lista)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchPokemons = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/pokemons", {
        params: {
          page,
          limit: 8,
          name: searchName || undefined,
          type: searchType || undefined,
        },
      });

      setPokemons(response.data.data || []);
      setTotalPages(response.data.meta?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar a lista de Pokémons.");
    } finally {
      setLoading(false);
    }
  }, [page, searchName, searchType]);

  useEffect(() => {
    const token = localStorage.getItem("@pokemon:token");

    if (!token) {
      router.push("/login");
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const payloadBase64 = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      const userId =
        decodedPayload.sub || decodedPayload.userId || decodedPayload.id;

      setCurrentUser({
        id: userId,
        name: decodedPayload.name,
        email: decodedPayload.email,
      });

      api
        .get("/users/me")
        .then((res) => {
          if (res.data?.user) {
            setCurrentUser({
              id: res.data.user.id,
              name: res.data.user.name,
              email: res.data.user.email,
              avatarUrl: res.data.user.avatarUrl,
            });
          }
        })
        .catch((err) => console.error("Erro ao buscar perfil atualizado", err));
    } catch (e) {
      console.error("Erro ao descodificar o token", e);
    }

    fetchPokemons();
  }, [fetchPokemons, router]);

  const handleLogout = () => {
    localStorage.removeItem("@pokemon:token");
    delete api.defaults.headers.common["Authorization"];
    router.push("/login");
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Tem a certeza que deseja apagar este Pokémon?",
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/pokemons/${id}`);
      fetchPokemons();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Erro ao apagar o Pokémon.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearchName("");
    setSearchType("");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-red-50 to-amber-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-6 bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 p-6 text-white md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-red-100">
                Pokédex Online
              </p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Centro Pokémon
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-red-50/90 sm:text-base">
                Gerencie, explore e acompanhe os seus Pokémons cadastrados de
                forma moderna e organizada.
              </p>
            </div>

            <div className="flex flex-col items-end gap-4">
              {currentUser && (
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 backdrop-blur-sm border border-white/20 shadow-inner hover:bg-white/20 transition cursor-pointer"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white">
                      {currentUser.name || "Treinador Pokémon"}
                    </p>
                    <p className="text-xs text-red-100">
                      {currentUser.email || "Mestre em treinamento"}
                    </p>
                  </div>
                  <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/50 bg-white/20 shadow-md">
                    <img
                      src={
                        currentUser.avatarUrl ||
                        `https://api.dicebear.com/9.x/adventurer/svg?seed=${currentUser.id}`
                      }
                      alt="Avatar do Treinador"
                      className="h-full w-full object-cover bg-white"
                    />
                  </div>
                </Link>
              )}

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-bold text-red-600 shadow-lg transition hover:scale-[1.02] hover:bg-red-50"
                >
                  + Adicionar Pokémon
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/20"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm text-red-700">Pokémons visíveis</p>
              <p className="mt-1 text-2xl font-extrabold text-red-600">
                {pokemons.length}
              </p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-sm text-blue-700">Página atual</p>
              <p className="mt-1 text-2xl font-extrabold text-blue-600">
                {page}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm text-amber-700">Total de páginas</p>
              <p className="mt-1 text-2xl font-extrabold text-amber-600">
                {totalPages}
              </p>
            </div>
          </div>
        </header>

        <section className="mb-8 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg backdrop-blur">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Filtros de pesquisa
            </h2>
            <p className="text-sm text-slate-500">
              Encontre Pokémons pelo nome ou tipo.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="grid gap-4 md:grid-cols-[1fr_1fr_auto_auto]"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar por nome
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Ex: Pikachu"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Buscar por tipo
              </label>
              <input
                type="text"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                placeholder="Ex: Fogo, Água"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100"
              />
            </div>

            <button
              type="submit"
              className="h-[50px] self-end rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 font-bold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg"
            >
              Filtrar
            </button>

            {(searchName || searchType) && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-[50px] self-end rounded-2xl border border-slate-200 bg-slate-100 px-6 font-bold text-slate-700 transition hover:bg-slate-200"
              >
                Limpar
              </button>
            )}
          </form>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {/* ADICIONADO: Controles de alternância de visualização */}
        {!loading && pokemons.length > 0 && (
          <div className="mb-6 flex justify-end gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition shadow-sm ${
                viewMode === "grid"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid size={18} /> Grade
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition shadow-sm ${
                viewMode === "list"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <List size={18} /> Lista
            </button>
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-white/70 bg-white/80 p-12 text-center shadow-lg backdrop-blur">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-600" />
            <p className="text-lg font-semibold text-slate-700">
              A carregar a Pokédex...
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Aguarde enquanto os Pokémons são carregados.
            </p>
          </div>
        ) : pokemons.length === 0 && !error ? (
          <div className="rounded-3xl border border-white/70 bg-white/80 p-12 text-center shadow-lg backdrop-blur">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-3xl">
              🔍
            </div>
            <h3 className="text-2xl font-bold text-slate-800">
              Nenhum Pokémon encontrado
            </h3>
            <p className="mt-2 text-slate-500">
              Tente ajustar os filtros ou adicione um novo Pokémon à sua
              coleção.
            </p>
          </div>
        ) : (
          <>
            <section
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
                  : "flex flex-col gap-4"
              }
            >
              {pokemons.map((pokemon) => {
                const isOwner =
                  currentUser?.id && pokemon.createdBy?.id === currentUser.id;
                const typeGradient = getTypeColor(pokemon.type);

                // --- RENDERIZAÇÃO MODO LISTA ---
                if (viewMode === "list") {
                  return (
                    <article
                      key={pokemon.id}
                      className="group flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div
                        className={`bg-gradient-to-r ${typeGradient} p-5 text-white sm:w-64 flex-shrink-0 flex items-center justify-between sm:flex-col sm:justify-center`}
                      >
                        <div className="sm:text-center">
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                            #{pokemon.pokedexNumber}
                          </p>
                          <h3 className="mt-1 text-2xl font-extrabold capitalize">
                            {pokemon.name}
                          </h3>
                        </div>
                        {pokemon.imageUrl ? (
                          <div className="rounded-2xl bg-white/20 p-2 backdrop-blur-sm sm:mt-4">
                            <img
                              src={pokemon.imageUrl}
                              alt={pokemon.name}
                              className="h-16 w-16 sm:h-24 sm:w-24 object-contain drop-shadow-lg"
                            />
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm sm:mt-4">
                            ⚪
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between sm:flex-row sm:items-center">
                        <div className="flex-1">
                          <div className="mb-4 flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700">
                              {pokemon.type}
                            </span>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                              Nível {pokemon.level}
                            </span>
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                              HP {pokemon.hp}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600">
                            <span className="font-medium text-slate-500">
                              Treinador:{" "}
                            </span>
                            <span className="font-bold text-slate-800">
                              {pokemon.createdBy?.name || "Não informado"}
                            </span>
                          </div>
                        </div>

                        {isOwner && (
                          <div className="mt-5 flex gap-3 sm:mt-0 sm:ml-4 sm:flex-col">
                            <Link
                              href={`/edit/${pokemon.id}`}
                              className="flex-1 rounded-2xl bg-blue-600 px-6 py-2 text-center text-sm font-bold text-white transition hover:bg-blue-700"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDelete(pokemon.id)}
                              className="flex-1 rounded-2xl bg-red-600 px-6 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                            >
                              Apagar
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                }

                // --- RENDERIZAÇÃO MODO GRADE (DEFAULT) ---
                return (
                  <article
                    key={pokemon.id}
                    className="group overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div
                      className={`bg-gradient-to-r ${typeGradient} p-5 text-white`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                            Pokédex #{pokemon.pokedexNumber}
                          </p>
                          <h3 className="mt-1 text-2xl font-extrabold capitalize">
                            {pokemon.name}
                          </h3>
                        </div>

                        {pokemon.imageUrl ? (
                          <div className="rounded-2xl bg-white/20 p-2 backdrop-blur-sm">
                            <img
                              src={pokemon.imageUrl}
                              alt={pokemon.name}
                              className="h-20 w-20 object-contain drop-shadow-lg"
                            />
                          </div>
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm">
                            ⚪
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-700">
                          {pokemon.type}
                        </span>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                          Nível {pokemon.level}
                        </span>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                          HP {pokemon.hp}
                        </span>
                      </div>

                      <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                          <span className="font-medium text-slate-500">
                            Número
                          </span>
                          <span className="font-bold text-slate-800">
                            #{pokemon.pokedexNumber}
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                          <span className="font-medium text-slate-500">
                            Tipo
                          </span>
                          <span className="font-bold text-slate-800">
                            {pokemon.type}
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                          <span className="font-medium text-slate-500">
                            Treinador
                          </span>
                          <span className="max-w-[140px] truncate font-bold text-slate-800">
                            {pokemon.createdBy?.name || "Não informado"}
                          </span>
                        </div>
                      </div>

                      {isOwner && (
                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <Link
                            href={`/edit/${pokemon.id}`}
                            className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(pokemon.id)}
                            className="rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                          >
                            Apagar
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/80 px-6 py-5 shadow-lg backdrop-blur sm:flex-row">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-full rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  ← Anterior
                </button>

                <div className="text-center">
                  <p className="text-sm text-slate-500">Navegação</p>
                  <p className="text-lg font-extrabold text-slate-800">
                    Página {page} de {totalPages}
                  </p>
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-full rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
