# --- Estágio 1: Build da aplicação ---
FROM node:20-alpine AS build

WORKDIR /app

# Copia os arquivos de configuração de pacotes e typescript
COPY package*.json ./
COPY tsconfig*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do frontend
COPY . .

# Executa o build (gera a pasta /dist)
RUN npm run build

# --- Estágio 2: Servindo com Nginx ---
FROM nginx:alpine

# Copia o build gerado no estágio anterior para a pasta pública do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia uma configuração customizada do Nginx para suportar rotas do React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]