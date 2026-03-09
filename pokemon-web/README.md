
# 🔴 Centro Pokémon - Pokédex Online (Frontend)

Este é o **frontend do sistema de gestão de Pokémons**, desenvolvido como parte de um desafio técnico para avaliar conhecimentos em **desenvolvimento web moderno**.

A aplicação permite que **treinadores e pesquisadores se registrem, façam login e gerenciem sua própria coleção de Pokémons**.

O backend correspondente (API) foi desenvolvido em **NestJS**.

---

# ✨ Funcionalidades

- **Autenticação JWT**
  - Registro e login de treinadores
  - Gestão segura de sessões
  - Proteção de rotas privadas

- **Perfil do Usuário**
  - Personalização de perfil
  - Escolha de avatares pré-definidos via **API DiceBear**
  - Upload de imagem personalizada (convertida para Base64)

- **CRUD de Pokémons**
  - Adicionar Pokémon
  - Listar Pokémons
  - Editar Pokémons
  - Apagar Pokémons

- **Regras de Negócio**
  - A Pokédex é global
  - Apenas o **criador do Pokémon pode editar ou excluir**

- **Filtros Avançados**
  - Busca por **nome**
  - Busca por **tipo**

- **Paginação**
  - Listagem eficiente com paginação fornecida pela API

- **Múltiplas Visualizações**
  - Alternância entre:
    - **Grade (Cards)**
    - **Lista**

- **Interface Moderna**
  - Design responsivo com **Tailwind CSS**
  - Efeito **Glassmorphism**
  - Gradientes baseados no tipo do Pokémon
  - Feedback visual para o usuário

---

# 🛠️ Tecnologias Utilizadas

- **Next.js (App Router)**  
  Framework React para estruturação da aplicação e rotas.

- **React**  
  Biblioteca principal para construção da interface.

- **TypeScript**  
  Tipagem estática para maior segurança e organização do código.

- **Tailwind CSS**  
  Framework utilitário para estilização rápida e responsiva.

- **Axios**  
  Cliente HTTP para comunicação com a API NestJS.

- **DiceBear**  
  API pública para geração de avatares dinâmicos.

---

# 🚀 Como Executar o Projeto Localmente

## Pré-requisitos

- Node.js instalado na máquina
- Backend (API NestJS) rodando localmente  
  (geralmente na porta **3000**)

---

## Passo 1 — Clonar o repositório

```bash
git clone https://github.com/marcosvitordev/pokemon-management-system.git
cd pokemon-web
```

---

## Passo 2 — Instalar dependências

```bash
npm install
```

ou

```bash
yarn install
```

---

## Passo 3 — Configurar a API (Opcional)

O cliente Axios (`src/lib/api.ts`) está configurado por padrão para:

```
http://localhost:3000
```

Caso a API esteja rodando em outra porta, ajuste o arquivo:

```
src/lib/api.ts
```

---

## Passo 4 — Rodar o projeto

```bash
npm run dev
```

ou

```bash
yarn dev
```

---

## Passo 5 — Abrir no navegador

Acesse:

```
http://localhost:3000
```

Caso a porta 3000 esteja ocupada pela API, o Next.js pode usar **3001**.

---

# 📂 Estrutura de Rotas (App Router)

| Rota | Descrição |
|-----|-----------|
| `/` | Dashboard principal (Pokédex, listagem, filtros e paginação) |
| `/login` | Tela de login |
| `/register` | Tela de registro de treinador |
| `/create` | Formulário para adicionar Pokémon |
| `/edit/[id]` | Formulário para editar Pokémon |
| `/profile` | Gerenciamento do perfil do usuário |

⚠️ Algumas rotas são **protegidas por autenticação JWT**.

---

# 👨‍💻 Autor

Desenvolvido por **Marcos Vitor**  
Analista e Desenvolvedor de Software apaixonado por tecnologia.
