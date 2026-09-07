![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-EC5990?logo=reacthookform&logoColor=fff)

# Deliver Frontend

Frontend de um aplicativo de delivery de comida, desenvolvido em **React + TypeScript + Vite**, com autenticação JWT (access + refresh token) e consumo de uma API **FastAPI**.

## Funcionalidades

- **Autenticação completa**: login, cadastro e recuperação de senha
- **Sessão persistente**: access token + refresh token com renovação automática (interceptors do Axios)
- **Rotas protegidas**: acesso à área logada somente para usuários autenticados
- **Cardápio dinâmico**: listagem de itens (lanches, pizzas, bebidas, sobremesas) consumidos direto da API
- **UI moderna**: Tailwind CSS + animações com Framer Motion + ícones Lucide

## Stack

| Categoria                | Tecnologia            |
| ------------------------- | ---------------------- |
| Framework                 | React 19 + TypeScript  |
| Build tool                | Vite 7                 |
| Estilização                | Tailwind CSS 4         |
| Roteamento                 | React Router DOM 7     |
| Gerenciamento de estado    | Zustand                |
| Formulários                | React Hook Form + Zod  |
| Requisições HTTP           | Axios                  |
| Animações                  | Motion (Framer Motion) |
| Ícones                     | Lucide React           |
| Autenticação               | JWT (jwt-decode)       |

## Estrutura do projeto

```
src/
├── api/          # Cliente Axios + interceptors de auth/refresh
├── assets/       # Imagens e arquivos estáticos
├── pages/        # Páginas (Login, SignUp, RecoverPassword, Home)
├── routes/       # Componentes de rota (ProtectedRoute)
├── schemas/      # Schemas de validação (Zod)
├── store/        # Estado global (Zustand) — autenticação
├── types/        # Tipagens compartilhadas
├── App.tsx       # Definição das rotas da aplicação
└── main.tsx      # Ponto de entrada
```

## Começando

### Pré-requisitos

- Node.js 20+
- Uma instância do backend rodando (FastAPI)

### Instalação

```bash
git clone https://github.com/JohnLouisMaker/deliver-frontend.git
cd deliver-frontend
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8000
```

### Rodando em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Build de produção

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Integração com a API

A aplicação consome um backend FastAPI através das seguintes rotas principais:

- `POST /auth/login`
- `POST /auth/signup`
- `GET /auth/me`
- `POST /auth/refresh`
- `GET /cardapio/`
- `/pedidos/...`

A URL base da API é definida pela variável de ambiente `VITE_API_URL`.

## Roadmap

- [ ] Implementar carrinho de compras / fluxo de pedido
- [ ] Reforçar a proteção de autenticação da rota `/home`
- [ ] Página de detalhes do pedido
