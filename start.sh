#!/bin/bash

set -e

echo "🚀 Запуск проекта booBook..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Проверка наличия docker-compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    error "Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

# Используем docker compose (v2) если доступен, иначе docker-compose (v1)
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

info "Используется: $DOCKER_COMPOSE"

# Проверка валидности docker-compose.yaml
step "Проверка docker-compose.yaml..."
if $DOCKER_COMPOSE config > /dev/null 2>&1; then
    info "✓ docker-compose.yaml валиден"
else
    error "Ошибка в docker-compose.yaml"
    $DOCKER_COMPOSE config
    exit 1
fi

# Остановка существующих контейнеров (если есть)
step "Остановка существующих контейнеров..."
$DOCKER_COMPOSE down 2>/dev/null || true

# Сборка и запуск всех сервисов
step "Сборка и запуск всех сервисов..."
$DOCKER_COMPOSE up -d --build

# Ждем пока сервисы запустятся
info "Ожидание запуска сервисов (60 секунд)..."
sleep 60

# Создание топика Kafka
step "Создание топика Kafka 'email_requests'..."
if docker exec boobook-kafka /usr/bin/kafka-topics --bootstrap-server localhost:9092 --list 2>/dev/null | grep -q "email_requests"; then
    warn "Топик 'email_requests' уже существует"
else
    if docker exec boobook-kafka /usr/bin/kafka-topics --create \
        --bootstrap-server localhost:9092 \
        --topic email_requests \
        --partitions 1 \
        --replication-factor 1 2>/dev/null; then
        info "✓ Топик 'email_requests' создан"
    else
        warn "Не удалось создать топик автоматически. Создайте вручную:"
        echo "  docker exec -it boobook-kafka /usr/bin/kafka-topics --create --bootstrap-server localhost:9092 --topic email_requests --partitions 1 --replication-factor 1"
    fi
fi

# Настройка Keycloak (если скрипт существует)
if [ -f "./setup-keycloak.sh" ]; then
    step "Настройка Keycloak..."
    sleep 10  # Даем Keycloak время полностью запуститься
    if ./setup-keycloak.sh; then
        info "✓ Keycloak настроен"
    else
        warn "Не удалось автоматически настроить Keycloak. Настройте вручную или запустите: ./setup-keycloak.sh"
    fi
fi

# Инициализация базы данных (если скрипт существует)
if [ -f "./init_database.sh" ]; then
    step "Инициализация базы данных..."
    sleep 5  # Даем PostgreSQL время полностью запуститься
    if ./init_database.sh; then
        info "✓ База данных инициализирована"
    else
        warn "Не удалось автоматически инициализировать базу данных. Запустите вручную: ./init_database.sh"
    fi
fi

# Проверка статуса сервисов
step "Проверка статуса сервисов..."
echo ""
$DOCKER_COMPOSE ps

# Проверка здоровья сервисов
step "Проверка здоровья сервисов..."
echo ""

# PostgreSQL
if docker exec boobook-postgres pg_isready -U admin &> /dev/null; then
    info "✓ PostgreSQL работает"
else
    warn "⚠ PostgreSQL не отвечает"
fi

# Kafka
if docker exec boobook-kafka kafka-broker-api-versions --bootstrap-server localhost:9092 &> /dev/null; then
    info "✓ Kafka работает"
else
    warn "⚠ Kafka не отвечает"
fi

# Keycloak
if curl -f http://localhost:8080/health/ready &> /dev/null; then
    info "✓ Keycloak работает"
else
    warn "⚠ Keycloak не отвечает (может еще запускаться)"
fi

# Backend сервисы
for service in book operation email; do
    if docker ps | grep -q "boobook-$service"; then
        info "✓ $service запущен"
    else
        warn "⚠ $service не запущен"
    fi
done

# Frontend
if docker ps | grep -q "boobook-frontend"; then
    info "✓ frontend запущен"
else
    warn "⚠ frontend не запущен"
fi

echo ""
info "Проект запущен!"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  📋 Доступные сервисы:"
echo "═══════════════════════════════════════════════════════════════"
echo "  • Frontend:        http://localhost:5115"
echo "  • Keycloak:        http://localhost:8080"
echo "  • bookService:     http://localhost:5112"
echo "  • operationService: http://localhost:5110"
echo "  • emailService:    http://localhost:5111"
echo "  • PostgreSQL:      localhost:5100"
echo "  • Kafka:           localhost:9092"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  👤 Тестовые пользователи Keycloak:"
echo "═══════════════════════════════════════════════════════════════"
echo "  • user / user123 (ROLE_USER)"
echo "  • librarian / librarian123 (ROLE_LIBRARIAN)"
echo "  • admin_user / admin123 (ROLE_ADMIN)"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  📝 Полезные команды:"
echo "═══════════════════════════════════════════════════════════════"
echo "  • Просмотр логов:     docker-compose logs -f [service]"
echo "  • Остановить все:     docker-compose down"
echo "  • Перезапуск:         docker-compose restart [service]"
echo "  • Статус:             docker-compose ps"
echo ""

