![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)
![CI](https://github.com/JohnLouisMaker/deliver-frontend/actions/workflows/ci.yml/badge.svg)

# Deliver — Frontend

Interface de um aplicativo de delivery de comida: cardápio, carrinho e
checkout, com autenticação JWT e consumo de uma API REST própria em FastAPI.

**Status:** em desenvolvimento. Catálogo, carrinho, checkout, autenticação e
edição de perfil estão funcionando; histórico de pedidos e detalhes do pedido
estão no roadmap.

**Backend:** [deliver-backend](https://github.com/JohnLouisMaker/deliver-backend)

<!-- Adicione aqui uma imagem do cardápio e do carrinho:
     ![Cardápio](docs/cardapio.png)
     ![Carrinho](docs/carrinho.png) -->

## Funcionalidades

- **Catálogo** — itens carregados da API, com modal de detalhes por produto
- **Carrinho** — estado global com Zustand, quantidade por item e tamanho
  obrigatório para pizzas
- **Checkout** — pedido enviado para a API (`POST /pedidos`); o preço exibido
  no carrinho é de referência e o backend recalcula com os valores oficiais
- **Autenticação** — login, cadastro e recuperação de senha por código
  enviado por e-mail
- **Sessão persistente** — access token + refresh token, com renovação
  automática via interceptor do Axios
- **Rotas protegidas** — área logada acessível apenas com sessão válida
- **Perfil** — edição dos dados do usuário (`PATCH /auth/me`)

## Stack

| Categoria        | Tecnologia            |
| ---------------- | --------------------- |
| Framework        | React 19 + TypeScript |
| Build tool       | Vite 7                |
| Estilização      | Tailwind CSS 4        |
| Roteamento       | React Router DOM 7    |
| Estado global    | Zustand               |
| Formulários      | React Hook Form + Zod |
| Requisições HTTP | Axios                 |
| Animações        | Motion                |
| Ícones           | Lucide React          |
| Autenticação     | JWT (jwt-decode)      |

## Como rodar

Pré-requisitos: Node.js 20+ e o
[backend](https://github.com/JohnLouisMaker/deliver-backend) rodando.

```bash
git clone https://github.com/JohnLouisMaker/deliver-frontend.git
cd deliver-frontend
npm install
```

Crie um `.env` na raiz apontando para a API:

```env
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev     # http://localhost:5173
npm run build   # build de produção
npm run lint    # ESLint
```

## Docker

A imagem é construída em dois estágios: o primeiro compila a aplicação com
Node 20, o segundo serve apenas o `dist/` com Nginx — a imagem final não
carrega Node nem as dependências de build. O `nginx.conf` faz fallback para
`index.html`, o que é necessário para as rotas do React Router continuarem
funcionando quando a página é recarregada.

```bash
docker build -t deliver-frontend .
docker run -p 8080:80 deliver-frontend
```

`VITE_API_URL` é resolvida **em tempo de build** (o Vite injeta a variável no
bundle), então o `.env` precisa existir antes de rodar `docker build`.

## Integração com a API

| Método | Rota                      |
| ------ | ------------------------- |
| POST   | `/auth/login`             |
| POST   | `/auth/signup`            |
| POST   | `/auth/forgot-password`   |
| POST   | `/auth/verify-reset-code` |
| POST   | `/auth/reset-password`    |
| POST   | `/auth/refresh`           |
| GET    | `/auth/me`                |
| PATCH  | `/auth/me`                |
| GET    | `/cardapio/`              |
| GET    | `/cardapio/{id}`          |
| POST   | `/pedidos`                |

## Estrutura

```
src/
├── api/          # Cliente Axios + interceptors de auth/refresh
├── components/   # auth, cart, product, profile, footer
├── pages/        # Home, Login, SignUp, RecoverPassword, Checkout,
│                 # PedidoSucesso, EditProfile
├── routes/       # ProtectedRoute e definição dos paths
├── schemas/      # Schemas de validação (Zod)
├── store/        # authStore e cartStore (Zustand)
├── types/        # Tipagens compartilhadas
├── App.tsx       # Definição das rotas
└── main.tsx      # Ponto de entrada
```

## CI

GitHub Actions roda **lint + build** em todo push para `main`, `feat/**`,
`fix/**` e `refactor/**`, e em pull requests para `main`.

## Roadmap

- [ ] Histórico de pedidos
- [ ] Página de detalhes do pedido
- [ ] Testes automatizados no frontend
