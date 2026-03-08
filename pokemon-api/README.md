# Pokemon API

API RESTful desenvolvida com **NestJS**, **TypeScript** e **PostgreSQL**
para autenticação de usuários e gerenciamento de Pokémons.

A API permite que usuários criem, visualizem, atualizem e removam
Pokémons, respeitando regras de autorização baseadas no usuário
autenticado.

------------------------------------------------------------------------

# Funcionalidades

-   Cadastro de usuário
-   Login com autenticação JWT
-   Rota protegida para usuário autenticado
-   Criar Pokémon
-   Listar Pokémons
-   Buscar Pokémon por ID
-   Atualizar Pokémon
-   Excluir Pokémon
-   Regra de autorização por proprietário
-   Campo de **imagem do Pokémon**
-   **Geração automática da imagem via PokéAPI**
-   Documentação automática com **Swagger**

------------------------------------------------------------------------

# Tecnologias utilizadas

-   Node.js
-   NestJS
-   TypeScript
-   PostgreSQL
-   TypeORM
-   JWT
-   Passport
-   Bcrypt
-   Class Validator
-   Swagger

------------------------------------------------------------------------

# Requisitos

Antes de rodar o projeto, instale:

-   Node.js
-   npm
-   PostgreSQL

------------------------------------------------------------------------

# Instalação

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

# Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto:

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

# Banco de dados

Crie o banco no PostgreSQL:

``` sql
CREATE DATABASE pokemon_api;
```

------------------------------------------------------------------------

# Executando o projeto

Modo desenvolvimento:

``` bash
npm run start:dev
```

A aplicação estará disponível em:

    http://localhost:3000

------------------------------------------------------------------------

# Documentação da API (Swagger)

Após iniciar o projeto, acesse:

    http://localhost:3000/api

No Swagger é possível:

-   visualizar todos os endpoints
-   testar requisições
-   autenticar usando JWT
-   enviar dados diretamente pela interface

------------------------------------------------------------------------

# Autenticação

A API utiliza **JWT (JSON Web Token)**.

Após realizar login, envie o token no header:

    Authorization: Bearer SEU_TOKEN

No Swagger basta clicar em **Authorize** e inserir o token.

------------------------------------------------------------------------

# Endpoints

## Auth

### Registrar usuário

    POST /auth/register

Body:

``` json
{
  "name": "Marcos Vitor",
  "email": "marcos@email.com",
  "password": "123456"
}
```

------------------------------------------------------------------------

### Login

    POST /auth/login

Body:

``` json
{
  "email": "marcos@email.com",
  "password": "123456"
}
```

Resposta:

``` json
{
  "access_token": "JWT_TOKEN"
}
```

------------------------------------------------------------------------

# Users

### Usuário autenticado

    GET /users/me

Header:

    Authorization: Bearer TOKEN

------------------------------------------------------------------------

# Pokemons

## Criar Pokémon

    POST /pokemons

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

Resposta:

``` json
{
  "message": "Pokemon created successfully",
  "pokemon": {
    "name": "Pikachu",
    "type": "Electric",
    "level": 10,
    "hp": 35,
    "pokedexNumber": 25,
    "imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  }
}
```

------------------------------------------------------------------------

# Imagem automática do Pokémon

Se **imageUrl não for enviada**, a API gera automaticamente a imagem
usando a PokéAPI.

Exemplo:

``` json
{
  "pokedexNumber": 25
}
```

Imagem gerada:

    https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png

------------------------------------------------------------------------

# Listar Pokémons

    GET /pokemons

------------------------------------------------------------------------

# Buscar Pokémon por ID

    GET /pokemons/:id

------------------------------------------------------------------------

# Atualizar Pokémon

    PATCH /pokemons/:id

Exemplo:

``` json
{
  "name": "Raichu",
  "level": 22
}
```

------------------------------------------------------------------------

# Excluir Pokémon

    DELETE /pokemons/:id

------------------------------------------------------------------------

# Regra de autorização

Todos os usuários autenticados podem **visualizar Pokémons**.

Porém:

-   apenas o **usuário que criou** pode atualizar
-   apenas o **usuário que criou** pode excluir

Caso outro usuário tente modificar:

    403 Forbidden

------------------------------------------------------------------------

# Estrutura do projeto

    src
     ├── auth
     ├── users
     ├── pokemons
     ├── app.module.ts
     └── main.ts

------------------------------------------------------------------------

# Scripts úteis

Rodar projeto:

``` bash
npm run start
```

Modo desenvolvimento:

``` bash
npm run start:dev
```

Build:

``` bash
npm run build
```

------------------------------------------------------------------------

# Observações

Este projeto foi desenvolvido como parte de um desafio técnico com foco
em:

-   boas práticas com NestJS
-   organização de código
-   autenticação segura
-   controle de autorização
-   documentação clara da API
