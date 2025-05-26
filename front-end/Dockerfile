# Paso 1: Construir la app
FROM node:18-alpine AS builder

WORKDIR /project-front-end

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

# Paso 2: Servir con Nginx
FROM nginx:stable-alpine

# Copiar archivos compilados al directorio público de nginx
COPY --from=builder /project-front-end/dist /usr/share/nginx/html

# Eliminar configuración por defecto de Nginx y usar la nuestra
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
