#!/bin/bash

# Скрипт для автоматической настройки Keycloak
# Создает realm, client, roles и тестовых пользователей

set -e

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
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

step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Параметры
KC_URL="${KC_URL:-http://localhost:8080}"
KC_ADMIN="${KC_ADMIN:-admin}"
KC_PASSWORD="${KC_PASSWORD:-admin}"
REALM_NAME="${REALM_NAME:-boobook}"
CLIENT_ID="${CLIENT_ID:-nextjs}"

# Функция для ожидания готовности Keycloak
wait_for_keycloak() {
    info "Ожидание запуска Keycloak..."
    local max_attempts=120
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        # Проверяем статус контейнера
        if ! docker ps | grep -q "boobook-keycloak"; then
            error "Контейнер Keycloak не запущен!"
            return 1
        fi
        
        # Проверяем доступность главной страницы
        if curl -s -f "${KC_URL}" > /dev/null 2>&1; then
            # Проверяем доступность realms endpoint
            if curl -s -f "${KC_URL}/realms/master" > /dev/null 2>&1; then
                # Пытаемся отключить SSL requirement для master realm через kcadm
                if [ $attempt -eq 5 ]; then
                    docker exec boobook-keycloak /opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user admin --password admin > /dev/null 2>&1 && \
                    docker exec boobook-keycloak /opt/keycloak/bin/kcadm.sh update realms/master -s sslRequired=none > /dev/null 2>&1 && \
                    sleep 2
                fi
                # Дополнительная проверка - пытаемся получить токен
                sleep 1
                local token=$(get_admin_token 2>/dev/null)
                if [ -n "$token" ] && [ ${#token} -gt 10 ]; then
                    info "✓ Keycloak готов и доступен"
                    return 0
                fi
            fi
        fi
        attempt=$((attempt + 1))
        if [ $((attempt % 15)) -eq 0 ]; then
            info "Ожидание... (попытка ${attempt}/${max_attempts})"
        fi
        sleep 2
    done
    
    warn "Keycloak может быть еще не полностью готов, но продолжаем..."
    # Пытаемся получить токен еще раз
    local token=$(get_admin_token 2>/dev/null)
    if [ -z "$token" ] || [ ${#token} -le 10 ]; then
        error "Не удалось подключиться к Keycloak после ${max_attempts} попыток"
        error "Проверьте логи: docker logs boobook-keycloak"
        return 1
    fi
    return 0
}

# Функция для получения токена администратора
get_admin_token() {
    local response=$(curl -s -X POST "${KC_URL}/realms/master/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=${KC_ADMIN}" \
        -d "password=${KC_PASSWORD}" \
        -d "grant_type=password" \
        -d "client_id=admin-cli" 2>/dev/null)
    
    if [ -z "$response" ] || echo "$response" | grep -q "error"; then
        return 1
    fi
    
    local token=$(echo "$response" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    if [ -n "$token" ] && [ ${#token} -gt 10 ]; then
        echo "$token"
    else
        return 1
    fi
}

# Функция для проверки существования realm
realm_exists() {
    local token=$1
    local response=$(curl -s -X GET "${KC_URL}/admin/realms/${REALM_NAME}" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" \
        -w "%{http_code}")
    
    local http_code="${response: -3}"
    [ "$http_code" = "200" ]
}

# Функция для отключения SSL requirement для master realm через kcadm
disable_ssl_master_via_kcadm() {
    step "Отключение SSL requirement для master realm через kcadm"
    
    if docker exec boobook-keycloak /opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user admin --password admin > /dev/null 2>&1; then
        docker exec boobook-keycloak /opt/keycloak/bin/kcadm.sh update realms/master -s sslRequired=none > /dev/null 2>&1
        info "✓ SSL requirement отключен для master realm"
        sleep 2
        return 0
    else
        warn "Не удалось отключить SSL requirement через kcadm, попробуем через API"
        return 1
    fi
}

# Функция для отключения SSL requirement для master realm через API
disable_ssl_master() {
    local token=$1
    step "Отключение SSL requirement для master realm"
    
    local master_update=$(cat <<EOF
{
  "sslRequired": "none"
}
EOF
)
    
    curl -s -X PUT "${KC_URL}/admin/realms/master" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" \
        -d "$master_update" > /dev/null 2>&1
    
    info "✓ SSL requirement отключен для master realm"
}

# Функция для создания realm
create_realm() {
    local token=$1
    step "Создание realm: ${REALM_NAME}"
    
    local realm_config=$(cat <<EOF
{
  "realm": "${REALM_NAME}",
  "enabled": true,
  "displayName": "booBook Library System",
  "sslRequired": "none"
}
EOF
)
    
    curl -s -X POST "${KC_URL}/admin/realms" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" \
        -d "$realm_config" > /dev/null
    
    # Обновляем realm для отключения SSL requirement
    local realm_update=$(cat <<EOF
{
  "sslRequired": "none"
}
EOF
)
    
    curl -s -X PUT "${KC_URL}/admin/realms/${REALM_NAME}" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" \
        -d "$realm_update" > /dev/null 2>&1
    
    info "✓ Realm создан с отключенным SSL requirement"
}

# Функция для создания ролей
create_roles() {
    local token=$1
    step "Создание ролей"
    
    local roles=("ROLE_USER" "ROLE_LIBRARIAN" "ROLE_ADMIN")
    
    for role in "${roles[@]}"; do
        local role_config=$(cat <<EOF
{
  "name": "${role}",
  "description": "${role} role for booBook"
}
EOF
)
        curl -s -X POST "${KC_URL}/admin/realms/${REALM_NAME}/roles" \
            -H "Authorization: Bearer ${token}" \
            -H "Content-Type: application/json" \
            -d "$role_config" > /dev/null 2>&1 || warn "Роль ${role} уже существует"
    done
    
    info "✓ Роли созданы"
}

# Функция для создания client
create_client() {
    local token=$1
    step "Создание client: ${CLIENT_ID}"
    
    local client_config=$(cat <<EOF
{
  "clientId": "${CLIENT_ID}",
  "enabled": true,
  "publicClient": true,
  "standardFlowEnabled": true,
  "directAccessGrantsEnabled": true,
  "redirectUris": [
    "http://localhost:5115/*",
    "http://localhost:3000/*"
  ],
  "webOrigins": [
    "http://localhost:5115",
    "http://localhost:3000",
    "+"
  ],
  "protocol": "openid-connect",
  "attributes": {
    "pkce.code.challenge.method": "S256"
  }
}
EOF
)
    
    curl -s -X POST "${KC_URL}/admin/realms/${REALM_NAME}/clients" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" \
        -d "$client_config" > /dev/null 2>&1 || warn "Client ${CLIENT_ID} уже существует"
    
    info "✓ Client создан"
}

# Функция для настройки mapper для ролей
setup_role_mapper() {
    local token=$1
    step "Настройка mapper для ролей"
    
    # Получаем ID client scope "roles"
    local roles_scope_id=$(curl -s -X GET "${KC_URL}/admin/realms/${REALM_NAME}/client-scopes" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" | grep -o '"id":"[^"]*"[^}]*"name":"roles"' | grep -o '"id":"[^"]*' | cut -d'"' -f4 | head -1)
    
    if [ -z "$roles_scope_id" ]; then
        # Пробуем другой способ поиска
        roles_scope_id=$(curl -s -X GET "${KC_URL}/admin/realms/${REALM_NAME}/client-scopes" \
            -H "Authorization: Bearer ${token}" \
            -H "Content-Type: application/json" | python3 -c "import sys, json; data=json.load(sys.stdin); print([s['id'] for s in data if s.get('name')=='roles'][0] if any(s.get('name')=='roles' for s in data) else '')" 2>/dev/null || echo "")
    fi
    
    if [ -z "$roles_scope_id" ]; then
        warn "Client scope 'roles' не найден, пропускаем настройку mapper"
        return
    fi
    
    # Получаем существующие mappers
    local existing_mappers=$(curl -s -X GET "${KC_URL}/admin/realms/${REALM_NAME}/client-scopes/${roles_scope_id}/protocol-mappers/models" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json")
    
    # Проверяем, есть ли уже mapper для realm roles
    local has_realm_roles_mapper=$(echo "$existing_mappers" | grep -i "realm roles" || echo "")
    
    if [ -z "$has_realm_roles_mapper" ]; then
        # Создаем mapper для realm roles
        local mapper_config=$(cat <<EOF
{
  "name": "realm roles",
  "protocol": "openid-connect",
  "protocolMapper": "oidc-usermodel-realm-role-mapper",
  "config": {
    "user.attribute": "foo",
    "claim.name": "realm_access.roles",
    "jsonType.label": "String",
    "multivalued": "true",
    "id.token.claim": "true",
    "access.token.claim": "true",
    "userinfo.token.claim": "true"
  }
}
EOF
)
        
        curl -s -X POST "${KC_URL}/admin/realms/${REALM_NAME}/client-scopes/${roles_scope_id}/protocol-mappers/models" \
            -H "Authorization: Bearer ${token}" \
            -H "Content-Type: application/json" \
            -d "$mapper_config" > /dev/null 2>&1 || warn "Не удалось создать mapper"
    fi
    
    # Обновляем существующий mapper "realm roles" если он есть
    local realm_roles_mapper_id=$(echo "$existing_mappers" | python3 -c "import sys, json; data=json.load(sys.stdin); print([m['id'] for m in data if 'realm' in m.get('name', '').lower() and 'role' in m.get('name', '').lower()][0] if any('realm' in m.get('name', '').lower() and 'role' in m.get('name', '').lower() for m in data) else '')" 2>/dev/null || echo "")
    
    if [ -n "$realm_roles_mapper_id" ]; then
        # Обновляем mapper для включения в токены
        local mapper_update=$(cat <<EOF
{
  "id": "${realm_roles_mapper_id}",
  "name": "realm roles",
  "protocol": "openid-connect",
  "protocolMapper": "oidc-usermodel-realm-role-mapper",
  "config": {
    "user.attribute": "foo",
    "claim.name": "realm_access.roles",
    "jsonType.label": "String",
    "multivalued": "true",
    "id.token.claim": "true",
    "access.token.claim": "true",
    "userinfo.token.claim": "true"
  }
}
EOF
)
        
        curl -s -X PUT "${KC_URL}/admin/realms/${REALM_NAME}/client-scopes/${roles_scope_id}/protocol-mappers/models/${realm_roles_mapper_id}" \
            -H "Authorization: Bearer ${token}" \
            -H "Content-Type: application/json" \
            -d "$mapper_update" > /dev/null 2>&1
    fi
    
    info "✓ Mapper для ролей настроен"
}

# Функция для создания пользователя
create_user() {
    local token=$1
    local username=$2
    local password=$3
    local email=$4
    local first_name=$5
    local last_name=$6
    local role=$7
    
    step "Создание пользователя: ${username}"
    
    local user_config=$(cat <<EOF
{
  "username": "${username}",
  "email": "${email}",
  "firstName": "${first_name}",
  "lastName": "${last_name}",
  "enabled": true,
  "emailVerified": true,
  "credentials": [{
    "type": "password",
    "value": "${password}",
    "temporary": false
  }]
}
EOF
)
    
    # Создаем пользователя
    local user_response=$(curl -s -w "%{http_code}" -X POST "${KC_URL}/admin/realms/${REALM_NAME}/users" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" \
        -d "$user_config")
    
    local http_code="${user_response: -3}"
    
    if [ "$http_code" = "201" ] || [ "$http_code" = "409" ]; then
        # Получаем ID пользователя
        local user_id=$(curl -s -X GET "${KC_URL}/admin/realms/${REALM_NAME}/users?username=${username}" \
            -H "Authorization: Bearer ${token}" \
            -H "Content-Type: application/json" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
        
        if [ -n "$user_id" ] && [ -n "$role" ]; then
            # Получаем role ID
            local role_id=$(curl -s -X GET "${KC_URL}/admin/realms/${REALM_NAME}/roles/${role}" \
                -H "Authorization: Bearer ${token}" \
                -H "Content-Type: application/json" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
            
            if [ -n "$role_id" ]; then
                # Назначаем роль
                curl -s -X POST "${KC_URL}/admin/realms/${REALM_NAME}/users/${user_id}/role-mappings/realm" \
                    -H "Authorization: Bearer ${token}" \
                    -H "Content-Type: application/json" \
                    -d "[{\"id\":\"${role_id}\",\"name\":\"${role}\"}]" > /dev/null 2>&1
            fi
        fi
        
        info "✓ Пользователь ${username} создан"
    else
        warn "Пользователь ${username} уже существует или ошибка создания"
    fi
}

# Основная функция
main() {
    info "Настройка Keycloak для booBook"
    info "URL: ${KC_URL}"
    info "Realm: ${REALM_NAME}"
    
    # Ждем запуска Keycloak
    wait_for_keycloak
    
    # Получаем токен администратора
    step "Получение токена администратора"
    local token=$(get_admin_token)
    
    if [ -z "$token" ]; then
        error "Не удалось получить токен администратора"
        exit 1
    fi
    
    info "✓ Токен получен"
    
    # Отключаем SSL requirement для master realm (сначала через kcadm, потом через API)
    if ! disable_ssl_master_via_kcadm; then
        disable_ssl_master "$token"
        sleep 1
    fi
    
    # Создаем realm (если не существует)
    if ! realm_exists "$token"; then
        create_realm "$token"
        sleep 2
    else
        info "Realm ${REALM_NAME} уже существует"
        # Обновляем realm для отключения SSL requirement
        local realm_update=$(cat <<EOF
{
  "sslRequired": "none"
}
EOF
)
        curl -s -X PUT "${KC_URL}/admin/realms/${REALM_NAME}" \
            -H "Authorization: Bearer ${token}" \
            -H "Content-Type: application/json" \
            -d "$realm_update" > /dev/null 2>&1
        info "✓ SSL requirement отключен для realm ${REALM_NAME}"
    fi
    
    # Создаем роли
    create_roles "$token"
    
    # Создаем client
    create_client "$token"
    
    # Настраиваем mapper
    setup_role_mapper "$token"
    
    # Создаем тестовых пользователей
    step "Создание тестовых пользователей"
    create_user "$token" "user" "user123" "user@example.com" "Иван" "Петров" "ROLE_USER"
    create_user "$token" "librarian" "librarian123" "librarian@example.com" "Мария" "Сидорова" "ROLE_LIBRARIAN"
    create_user "$token" "admin_user" "admin123" "admin@example.com" "Алексей" "Иванов" "ROLE_ADMIN"
    
    info ""
    info "✓ Настройка Keycloak завершена!"
    info ""
    info "Тестовые пользователи:"
    info "  - user / user123 (ROLE_USER)"
    info "  - librarian / librarian123 (ROLE_LIBRARIAN)"
    info "  - admin_user / admin123 (ROLE_ADMIN)"
    info ""
    info "Keycloak доступен по адресу: ${KC_URL}"
}

# Запуск
main

