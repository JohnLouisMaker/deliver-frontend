# AGENTS.md — deliver-frontend

## Stack
- React + Tailwind
- API: backend FastAPI em `VITE_API_URL`
- Auth: JWT no localStorage (access + refresh)

## Regras
- NUNCA invente endpoints que não existem no backend
- SEMPRE use as rotas corretas (sem prefixo duplicado):
  - `/auth/login`, `/auth/signup`, `/auth/me`, `/auth/refresh`
  - `/cardapio/`
  - `/pedidos/...`
- NUNCA coloque lógica de negócio pesada no frontend
- Código mínimo (Ponytail)
- Componentes pequenos e reutilizáveis

## Atenção
- Rotas do backend foram corrigidas (sem `/auth/auth` nem `/cardapio/cardapio`)
- `/home` ainda precisa de proteção real de autenticação
- Carrinho/pedido ainda não está implementado no front

## Comandos
- `npm run dev`
- `npm run build`