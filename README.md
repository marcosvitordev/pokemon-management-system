# 🔴 Centro Pokémon - Sistema de Gestão Completo

![Status do Projeto](https://img.shields.io/badge/Status-Conclu%C3%ADdo-success?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Este repositório contém a solução Fullstack para o **Desafio Técnico** de criação de um Sistema para controle de Pokémons. O sistema permite que treinadores e pesquisadores autenticados operem um CRUD completo, gerindo a sua própria coleção de Pokémons de forma segura e com uma interface moderna.

---

## 🎯 Objetivo do Desafio

Desenvolver uma aplicação restrita a utilizadores autenticados para gerir Pokémons, incluindo operações de criação, leitura, atualização e exclusão (CRUD). 

**Regra de Negócio Principal:** A Pokédex é global e partilhada entre todos os utilizadores, mas **apenas o utilizador que criou um Pokémon tem permissão para o editar ou apagar**.

---

## ✨ Funcionalidades Implementadas

### Backend (API)
* **Autenticação Segura:** Login e Registo de Treinadores utilizando JWT e encriptação de palavras-passe com Bcrypt.
* **CRUD de Pokémons:** Endpoints RESTful completos exigindo campos obrigatórios: Nome, Tipo, Nível, HP e Número da Pokédex.
* **Paginação e Filtros:** Suporte nativo na API para busca de Pokémons por nome, tipo e separação por páginas.
* **Perfil de Utilizador Atualizável:** Rota para atualizar os dados do treinador, incluindo o upload de Avatares convertidos em Base64 para armazenamento direto na base de dados, contornando limitações de *ephemeral filesystems* em plataformas gratuitas de deploy.
* **Documentação Viva:** Integração completa com Swagger (`/api`) para testar os endpoints rapidamente.

### Frontend (Web)
* **UI/UX Moderna:** Interface desenhada com Tailwind CSS, focada em *Glassmorphism*, gradientes baseados no tipo do Pokémon e interações responsivas.
* **Gestão de Perfil Gamificada:** Os utilizadores podem escolher Avatares dinâmicos gerados via DiceBear no momento do registo/edição, ou fazer o upload da sua própria foto do computador.
* **Múltiplas Visualizações:** Alternância fluida (Toggle) entre o modo "Grade" (Cards clássicos) e o modo "Lista" horizontal para a Pokédex.
* **Formulários Interativos:** Substituição de inputs de texto tradicionais por grades clicáveis para seleção do Tipo do Pokémon, evitando erros de digitação.
* **Proteção de Rotas:** O Next.js valida a existência do Token JWT e redireciona utilizadores não autenticados para a página de Login.

---

## 🛠️ Tecnologias e Arquitetura

O projeto adota uma arquitetura em dois blocos distintos para total desacoplamento:

### ⚙️ Backend (`/pokemon-api`)
* **Framework:** Node.js com NestJS
* **Linguagem:** TypeScript
* **Base de Dados:** PostgreSQL utilizando TypeORM
* **Validações:** `class-validator` e `class-transformer`
* **Documentação:** `@nestjs/swagger`

### 🎨 Frontend (`/pokemon-web`)
* **Framework:** React com Next.js (App Router)
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS
* **Comunicação HTTP:** Axios (com gestão centralizada do Bearer Token)

---

## 🚀 Como Executar Localmente

Certifique-se de que tem o **Node.js** e o **PostgreSQL** instalados na sua máquina.

### 1. Configurar e rodar o Backend (API)
1. Navegue para a pasta da API: `cd pokemon-api`
2. Instale as dependências: `npm install`
3. Configure a sua base de dados PostgreSQL no ficheiro correspondente (ex: `.env` ou `app.module.ts`).
4. Inicie o servidor: `npm run start:dev`
5. A API estará disponível em: `http://localhost:3001` (Pode aceder a `http://localhost:3001/api` para ver a documentação Swagger).

### 2. Configurar e rodar o Frontend (Web)
1. Abra um novo terminal e navegue para a pasta web: `cd pokemon-web`
2. Instale as dependências: `npm install`
3. Inicie o servidor frontend: `npm run dev`
4. Aceda à aplicação através de: `http://localhost:3000` (ou a porta indicada no terminal).

---

## ☁️ Extras Cumpridos do Desafio

O desafio sugeriu como extras:
- [x] **Paginação e Filtros de Busca:** Implementados no backend e consumidos no frontend.
- [ ] **Deploy:** (A indicar - Vercel / Render).
- [x] **Testes Automatizados:** Configurados via Jest no ambiente NestJS.

---

## 👤 Autor

Desenvolvido por **Marcos Vitor** como parte do Desafio Técnico de Fullstack.