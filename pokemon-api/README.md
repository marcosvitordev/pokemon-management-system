# Pokemon API

API RESTful desenvolvida com **NestJS**, **TypeScript** e **PostgreSQL**
para autenticação de usuários e gerenciamento de Pokémons.

## Funcionalidades

-   Cadastro de usuário
-   Login com JWT
-   Rota protegida para dados do usuário autenticado
-   Criar Pokémon
-   Listar Pokémons
-   Buscar Pokémon por ID
-   Atualizar Pokémon
-   Excluir Pokémon
-   Regra de autorização: apenas o criador do Pokémon pode editar ou
    excluir

------------------------------------------------------------------------

## Tecnologias utilizadas

-   Node.js
-   NestJS
-   TypeScript
-   PostgreSQL
-   TypeORM
-   JWT
-   Passport
-   Bcrypt
-   Class Validator
-   Class Transformer

------------------------------------------------------------------------

## Requisitos

Antes de começar, você precisa ter instalado:

-   Node.js
-   npm
-   PostgreSQL

------------------------------------------------------------------------

## Instalação

Clone o repositório:

``` bash
git clone https://github.com/marcosvitordev/pokemon-management-system.git
```

Entre na pasta do projeto:

``` bash
cd pokemon-api
```

Instale as dependências:

``` bash
npm install
```

------------------------------------------------------------------------

## Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

``` env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=pokemon_api

JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1d
```

------------------------------------------------------------------------

## Banco de dados

Crie o banco no PostgreSQL:

``` sql
CREATE DATABASE pokemon_api;
```

------------------------------------------------------------------------

## Executando o projeto

Modo desenvolvimento:

``` bash
npm run start:dev
```

A aplicação estará disponível em:

    http://localhost:3000

------------------------------------------------------------------------

## Autenticação

A API utiliza autenticação via **JWT**.

Após realizar login, envie o token no header das rotas protegidas:

``` http
Authorization: Bearer SEU_TOKEN
```

------------------------------------------------------------------------

## Endpoints

### Auth

#### Registrar usuário

``` http
POST /auth/register
```

Body:

``` json
{
  "name": "Marcos Vitor",
  "email": "marcos@email.com",
  "password": "123456"
}
```

#### Login

``` http
POST /auth/login
```

Body:

``` json
{
  "email": "marcos@email.com",
  "password": "123456"
}
```

------------------------------------------------------------------------

### Users

#### Usuário autenticado

``` http
GET /users/me
```

Header:

``` http
Authorization: Bearer SEU_TOKEN
```

------------------------------------------------------------------------

### Pokemons

#### Criar Pokémon

``` http
POST /pokemons
```

Header:

``` http
Authorization: Bearer SEU_TOKEN
```

Body:

``` json
{
  "name": "Pikachu",
  "type": "Electric",
  "level": 10,
  "hp": 35,
  "pokedexNumber": 25
}
```

#### Listar Pokémons

``` http
GET /pokemons
```

#### Buscar Pokémon por ID

``` http
GET /pokemons/:id
```

#### Atualizar Pokémon

``` http
PATCH /pokemons/:id
```

Body:

``` json
{
  "name": "Raichu",
  "level": 22,
  "hp": 60
}
```

#### Excluir Pokémon

``` http
DELETE /pokemons/:id
```

------------------------------------------------------------------------

## Regra de autorização

Todos os usuários autenticados podem visualizar os Pokémons cadastrados.

Porém:

-   apenas o usuário que criou o Pokémon pode atualizá-lo
-   apenas o usuário que criou o Pokémon pode excluí-lo

Caso outro usuário tente editar ou excluir um Pokémon que não criou, a
API retornará:

    403 Forbidden

------------------------------------------------------------------------

## Validações

A aplicação possui validação global com `ValidationPipe`, incluindo:

-   remoção de campos não permitidos
-   bloqueio de campos extras
-   validação de tipos
-   validação de valores mínimos e máximos

------------------------------------------------------------------------

## Estrutura do projeto

    src/
    ├── auth/
    ├── users/
    ├── pokemons/
    ├── app.module.ts
    └── main.ts

------------------------------------------------------------------------

## Scripts úteis

``` bash
npm run start
npm run start:dev
npm run build
npm run lint
```

------------------------------------------------------------------------

## Observações

Este projeto foi desenvolvido como parte de um desafio técnico, com foco
em:

-   organização de código
-   autenticação e autorização
-   boas práticas com NestJS
-   clareza no histórico de commits
-   estrutura escalável para evolução futura
