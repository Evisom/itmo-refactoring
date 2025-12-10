FROM node:23-alpine

WORKDIR /app

# Устанавливаем зависимости для работы с npm
RUN apk add --no-cache libc6-compat

# Копируем package файлы для кеширования слоев
COPY package*.json ./

# Устанавливаем зависимости с retry
RUN npm install --force --legacy-peer-deps || npm install --force --legacy-peer-deps

# Копируем остальные файлы
COPY . .

# Собираем проект
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
