# Estágio de build
FROM node:14 as build-stage

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar os arquivos de configuração do projeto
COPY package*.json ./
COPY babel.config.js ./
COPY vue.config.js ./

# Instalar dependências
RUN npm ci

# Copiar os arquivos do projeto
COPY src ./src
COPY public ./public

# Construir o aplicativo para produção
RUN npm run build

# Estágio de produção
FROM nginx:stable-alpine as production-stage

# Copiar a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Remover a configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar os arquivos de build do estágio anterior
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Iniciar o Nginx quando o container for executado
CMD ["nginx", "-g", "daemon off;"]