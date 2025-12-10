# booBook - Система управления библиотекой

Система управления библиотекой с микросервисной архитектурой на Spring Boot и Next.js.

## Быстрый старт

### Требования

- Docker и Docker Compose
- Bash

### Запуск проекта

```bash
./start.sh
```

Скрипт автоматически:
- Запустит все сервисы (PostgreSQL, Kafka, Keycloak, backend, frontend)
- Настроит Keycloak (realm, client, roles, пользователи)
- Инициализирует базу данных (функции, тестовые данные)

### Доступные сервисы

- **Frontend**: http://localhost:5115
- **Keycloak**: http://localhost:8080 (admin/admin)
- **bookService**: http://localhost:5112
- **operationService**: http://localhost:5110
- **emailService**: http://localhost:5111
- **PostgreSQL**: localhost:5100
- **Kafka**: localhost:9092

### Тестовые пользователи

- `user` / `user123` (ROLE_USER)
- `librarian` / `librarian123` (ROLE_LIBRARIAN)
- `admin_user` / `admin123` (ROLE_ADMIN)

## Структура проекта

```
boobook/
├── backend/              # Backend сервисы (Spring Boot)
│   ├── bookService/      # Сервис управления книгами
│   ├── operationService/ # Сервис операций (транзакции, рейтинги)
│   └── emailService/     # Сервис отправки email
├── frontend/             # Frontend (Next.js)
├── setup-keycloak.sh     # Скрипты настройки Keycloak
├── docker-compose.yaml   # Конфигурация всех сервисов
├── start.sh              # Главный скрипт запуска
├── init_database.sh      # Скрипт инициализации БД
└── init_database.sql     # SQL скрипт с данными
```

## Полезные команды

```bash
# Просмотр логов
docker-compose logs -f [service]

# Остановить все сервисы
docker-compose down

# Перезапуск сервиса
docker-compose restart [service]

# Статус сервисов
docker-compose ps
```

## Ручная настройка

### Keycloak

Если автоматическая настройка не сработала:

```bash
./setup-keycloak.sh
```

### База данных

Если база данных не инициализирована:

```bash
./init_database.sh
```

## Остановка

```bash
docker-compose down
```

Для полной очистки (включая данные):

```bash
docker-compose down -v
```

