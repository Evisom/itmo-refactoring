#!/bin/bash

# Скрипт для инициализации базы данных booBook

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Параметры подключения к БД
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5100}"
DB_NAME="${DB_NAME:-boobook}"
DB_USER="${DB_USER:-admin}"
DB_PASSWORD="${DB_PASSWORD:-admin}"

# Путь к SQL файлу
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_FILE="${SCRIPT_DIR}/init_database.sql"

info "Инициализация базы данных booBook..."
info "База данных: ${DB_NAME}@${DB_HOST}:${DB_PORT}"
info "Пользователь: ${DB_USER}"

# Проверка наличия SQL файла
if [ ! -f "$SQL_FILE" ]; then
    error "SQL файл не найден: $SQL_FILE"
    exit 1
fi

# Проверка, запущен ли Docker контейнер
if docker ps | grep -q "boobook-postgres"; then
    info "Используется Docker контейнер boobook-postgres"
    USE_DOCKER=true
elif command -v psql &> /dev/null; then
    info "Используется локальный psql"
    USE_DOCKER=false
    # Проверка подключения к БД
    info "Проверка подключения к базе данных..."
    if ! PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT 1;" > /dev/null 2>&1; then
        error "Не удалось подключиться к базе данных"
        error "Проверьте, что PostgreSQL запущен и доступен на ${DB_HOST}:${DB_PORT}"
        exit 1
    fi
    info "Подключение успешно!"
else
    error "psql не установлен и Docker контейнер не найден."
    error "Установите PostgreSQL client или запустите Docker контейнер boobook-postgres"
    exit 1
fi

# Выполнение SQL скрипта
info "Выполнение SQL скрипта..."
if [ "$USE_DOCKER" = true ]; then
    if docker exec -i boobook-postgres psql -U "${DB_USER}" -d "${DB_NAME}" < "${SQL_FILE}" 2>&1 | grep -v "NOTICE:" | grep -v "DO"; then
        info "✓ База данных успешно инициализирована!"
        echo ""
        info "Статистика данных:"
        docker exec boobook-postgres psql -U "${DB_USER}" -d "${DB_NAME}" -c "
        SELECT 
            'Жанры' as таблица, COUNT(*) as количество FROM genre
        UNION ALL
        SELECT 'Темы', COUNT(*) FROM theme
        UNION ALL
        SELECT 'Издательства', COUNT(*) FROM publisher
        UNION ALL
        SELECT 'Библиотеки', COUNT(*) FROM library
        UNION ALL
        SELECT 'Авторы', COUNT(*) FROM author
        UNION ALL
        SELECT 'Книги', COUNT(*) FROM book
        UNION ALL
        SELECT 'Связи авторов и книг', COUNT(*) FROM author_books
        UNION ALL
        SELECT 'Копии книг', COUNT(*) FROM book_copy
        UNION ALL
        SELECT 'Транзакции', COUNT(*) FROM book_transaction
        UNION ALL
        SELECT 'Рейтинги', COUNT(*) FROM rating;
        "
    else
        error "Ошибка при выполнении SQL скрипта"
        exit 1
    fi
else
    if PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -f "${SQL_FILE}" 2>&1 | grep -v "NOTICE:" | grep -v "DO"; then
        info "✓ База данных успешно инициализирована!"
        echo ""
        info "Статистика данных:"
        PGPASSWORD="${DB_PASSWORD}" psql -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" -d "${DB_NAME}" -c "
        SELECT 
            'Жанры' as таблица, COUNT(*) as количество FROM genre
        UNION ALL
        SELECT 'Темы', COUNT(*) FROM theme
        UNION ALL
        SELECT 'Издательства', COUNT(*) FROM publisher
        UNION ALL
        SELECT 'Библиотеки', COUNT(*) FROM library
        UNION ALL
        SELECT 'Авторы', COUNT(*) FROM author
        UNION ALL
        SELECT 'Книги', COUNT(*) FROM book
        UNION ALL
        SELECT 'Связи авторов и книг', COUNT(*) FROM author_books
        UNION ALL
        SELECT 'Копии книг', COUNT(*) FROM book_copy
        UNION ALL
        SELECT 'Транзакции', COUNT(*) FROM book_transaction
        UNION ALL
        SELECT 'Рейтинги', COUNT(*) FROM rating;
        "
    else
        error "Ошибка при выполнении SQL скрипта"
        exit 1
    fi
fi

info "Готово!"

