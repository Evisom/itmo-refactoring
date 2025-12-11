#!/bin/bash

# Скрипт для тестирования всех v2 API endpoints
# Использование: ./test-v2-endpoints.sh [JWT_TOKEN]
# Если токен не передан, будет получен автоматически из Keycloak

BOOK_SERVICE_URL="http://localhost:5112"
OPERATION_SERVICE_URL="http://localhost:5110"
KEYCLOAK_URL="http://localhost:8080"

# Учетные данные админа из start.sh
KEYCLOAK_ADMIN_USER="admin_user"
KEYCLOAK_ADMIN_PASSWORD="admin123"
KEYCLOAK_CLIENT_ID="nextjs"
KEYCLOAK_REALM="boobook"

# Функция для получения JWT токена из Keycloak
get_token_from_keycloak() {
    echo "Получение токена из Keycloak..." >&2
    local response=$(curl -s -X POST "$KEYCLOAK_URL/realms/$KEYCLOAK_REALM/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=$KEYCLOAK_ADMIN_USER" \
        -d "password=$KEYCLOAK_ADMIN_PASSWORD" \
        -d "grant_type=password" \
        -d "client_id=$KEYCLOAK_CLIENT_ID" 2>/dev/null)
    
    if [ -n "$response" ]; then
        if command -v jq &> /dev/null; then
            local token=$(echo "$response" | jq -r '.access_token // empty' 2>/dev/null)
        else
            local token=$(echo "$response" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
        fi
        
        if [ -n "$token" ] && [ "$token" != "null" ] && [ "$token" != "" ]; then
            echo "$token"
            return 0
        fi
    fi
    
    echo "Ошибка: не удалось получить токен из Keycloak" >&2
    return 1
}

# Получаем токен, если не передан как аргумент
if [ -z "$1" ]; then
    JWT_TOKEN=$(get_token_from_keycloak)
    if [ $? -ne 0 ] || [ -z "$JWT_TOKEN" ]; then
        echo "Ошибка: не удалось получить токен. Убедитесь, что Keycloak запущен и доступен на $KEYCLOAK_URL" >&2
        exit 1
    fi
    echo "Токен успешно получен из Keycloak" >&2
else
    JWT_TOKEN="$1"
    echo "Используется переданный токен" >&2
fi

FAILED_TESTS=0
TOTAL_TESTS=0

# Переменные для хранения созданных ID
CREATED_BOOK_ID=""
CREATED_AUTHOR_ID=""
CREATED_GENRE_ID=""
CREATED_THEME_ID=""
CREATED_PUBLISHER_ID=""
CREATED_LIBRARY_ID=""
CREATED_COPY_ID=""
CREATED_TRANSACTION_ID=""
CREATED_RATING_ID=""

# Уникальный суффикс для избежания конфликтов
TIMESTAMP=$(date +%s)
UNIQUE_SUFFIX="${TIMESTAMP}"

echo "=========================================="
echo "Тестирование v2 API Endpoints"
echo "=========================================="
echo "Уникальный суффикс: $UNIQUE_SUFFIX"
echo ""

# Функция для выполнения curl запроса с проверкой
test_endpoint() {
    local method=$1
    local url=$2
    local description=$3
    local expected_status=$4
    local data=$5
    local auth_header=$6
    local save_id_var=$7
    
    echo "--- $description ---"
    echo "Request: $method $url"
    
    if [ -n "$data" ]; then
        echo "Body: $data"
    fi
    
    if [ -n "$auth_header" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $auth_header" \
            ${data:+-d "$data"})
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" \
            -H "Content-Type: application/json" \
            ${data:+-d "$data"})
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$http_code" -eq "$expected_status" ]; then
        echo "✅ Status: $http_code (expected $expected_status)"
        
        # Сохраняем ID из ответа если нужно (используем jq если доступен)
        if [ -n "$save_id_var" ] && [ -n "$body" ] && [ "$body" != "null" ]; then
            if command -v jq &> /dev/null; then
                local id=$(echo "$body" | jq -r '.id // empty' 2>/dev/null)
            else
                local id=$(echo "$body" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
            fi
            if [ -n "$id" ] && [ "$id" != "null" ] && [ "$id" != "" ]; then
                eval "$save_id_var=\"$id\""
                echo "Created ID saved: $save_id_var=$id"
            fi
        fi
    else
        echo "❌ Status: $http_code (expected $expected_status)"
        echo "Response: $body"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    if [ -n "$body" ] && [ "$body" != "null" ]; then
        echo "Response: $(echo "$body" | head -c 200)..."
    fi
    echo ""
}

echo "=========================================="
echo "1. Публичные Endpoints - Чтение данных"
echo "=========================================="
echo ""

# Books - GET (public)
test_endpoint "GET" "$BOOK_SERVICE_URL/api/v2/books" \
    "GET /api/v2/books - Получить список книг" 200

test_endpoint "GET" "$BOOK_SERVICE_URL/api/v2/books?page=0&size=10" \
    "GET /api/v2/books?page=0&size=10 - Получить список книг с пагинацией" 200

test_endpoint "GET" "$BOOK_SERVICE_URL/api/v2/books/1" \
    "GET /api/v2/books/1 - Получить книгу по ID" 200

# Authors - GET (public)
test_endpoint "GET" "$BOOK_SERVICE_URL/api/v2/authors" \
    "GET /api/v2/authors - Получить список авторов" 200

# Genres - GET (public)
test_endpoint "GET" "$BOOK_SERVICE_URL/api/v2/genres" \
    "GET /api/v2/genres - Получить список жанров" 200

# Themes - GET (public)
test_endpoint "GET" "$BOOK_SERVICE_URL/api/v2/themes" \
    "GET /api/v2/themes - Получить список тем" 200

# Publishers - GET (public)
test_endpoint "GET" "$BOOK_SERVICE_URL/api/v2/publishers" \
    "GET /api/v2/publishers - Получить список издательств" 200

# Libraries - GET (public)
test_endpoint "GET" "$BOOK_SERVICE_URL/api/v2/libraries" \
    "GET /api/v2/libraries - Получить список библиотек" 200

test_endpoint "GET" "$BOOK_SERVICE_URL/api/v2/libraries/1/copies?page=0&size=10" \
    "GET /api/v2/libraries/1/copies - Получить копии книги в библиотеках" 200

# Copies - GET (LIBRARIAN)
test_endpoint "GET" "$BOOK_SERVICE_URL/api/v2/copies?bookId=1&page=0&size=10" \
    "GET /api/v2/copies - Получить копии LIBRARIAN" 200 \
    "" "$JWT_TOKEN"

echo "=========================================="
echo "2. OPERATION SERVICE - Публичные Endpoints"
echo "=========================================="
echo ""

# Transactions - GET reading-status (public)
test_endpoint "GET" "$OPERATION_SERVICE_URL/api/v2/transactions/reading-status?bookId=1" \
    "GET /api/v2/transactions/reading-status - Получить статус чтения книги" 200

# Ratings - GET (public)
test_endpoint "GET" "$OPERATION_SERVICE_URL/api/v2/ratings?bookId=1" \
    "GET /api/v2/ratings - Получить рейтинги книги" 200

# Transactions - GET (LIBRARIAN)
test_endpoint "GET" "$OPERATION_SERVICE_URL/api/v2/transactions?libraryId=1" \
    "GET /api/v2/transactions - Получить транзакции LIBRARIAN" 200 \
    "" "$JWT_TOKEN"

echo ""
echo "=========================================="
echo "3. Создание ресурсов (CRUD - Create)"
echo "=========================================="
echo "Используется JWT токен: ${JWT_TOKEN:0:20}..."
echo ""

# Сначала создаем зависимости (жанры, темы, издательства, авторы)
test_endpoint "POST" "$BOOK_SERVICE_URL/api/v2/genres" \
    "POST /api/v2/genres - Создать жанр" 201 \
    "{\"name\":\"Test Genre $UNIQUE_SUFFIX\"}" \
    "$JWT_TOKEN" "CREATED_GENRE_ID"

test_endpoint "POST" "$BOOK_SERVICE_URL/api/v2/themes" \
    "POST /api/v2/themes - Создать тему" 201 \
    "{\"name\":\"Test Theme $UNIQUE_SUFFIX\"}" \
    "$JWT_TOKEN" "CREATED_THEME_ID"

test_endpoint "POST" "$BOOK_SERVICE_URL/api/v2/publishers" \
    "POST /api/v2/publishers - Создать издательство" 201 \
    "{\"name\":\"Test Publisher $UNIQUE_SUFFIX\"}" \
    "$JWT_TOKEN" "CREATED_PUBLISHER_ID"

test_endpoint "POST" "$BOOK_SERVICE_URL/api/v2/authors" \
    "POST /api/v2/authors - Создать автора" 201 \
    "{\"name\":\"Test\",\"surname\":\"Author$UNIQUE_SUFFIX\"}" \
    "$JWT_TOKEN" "CREATED_AUTHOR_ID"

# Используем существующий genreId=3 (Роман) и существующего автора ID=1
GENRE_ID_FOR_BOOK=3
AUTHOR_IDS_FOR_BOOK="[1]"

# test_endpoint "POST" "$BOOK_SERVICE_URL/api/v2/books" \
#     "POST /api/v2/books - Создать книгу" 201 \
#     "{\"title\":\"Test Book $UNIQUE_SUFFIX\",\"isbn\":\"978-0-123456-$UNIQUE_SUFFIX\",\"yearPublished\":2024,\"genreId\":$GENRE_ID_FOR_BOOK,\"authorIds\":$AUTHOR_IDS_FOR_BOOK}" \
#     "$JWT_TOKEN" "CREATED_BOOK_ID"

# Libraries - POST (ADMIN)
test_endpoint "POST" "$BOOK_SERVICE_URL/api/v2/libraries" \
    "POST /api/v2/libraries - Создать библиотеку (ADMIN)" 201 \
    "{\"name\":\"Test Library $UNIQUE_SUFFIX\",\"address\":\"Test Address $UNIQUE_SUFFIX\"}" \
    "$JWT_TOKEN" "CREATED_LIBRARY_ID"

# Используем существующую книгу (ID=1) и существующую библиотеку (ID=1)
BOOK_ID_FOR_COPY=1
LIBRARY_ID_FOR_COPY=1

# Создаем копию с уникальным inventoryNumber (добавляем случайное число для гарантии уникальности)
RANDOM_SUFFIX=$((RANDOM % 100000))
UNIQUE_INV_NUMBER="INV-TEST-$UNIQUE_SUFFIX-$RANDOM_SUFFIX"
test_endpoint "POST" "$BOOK_SERVICE_URL/api/v2/copies" \
    "POST /api/v2/copies - Создать копию" 201 \
    "{\"bookId\":$BOOK_ID_FOR_COPY,\"libraryId\":$LIBRARY_ID_FOR_COPY,\"inventoryNumber\":\"$UNIQUE_INV_NUMBER\",\"available\":true}" \
    "$JWT_TOKEN" "CREATED_COPY_ID"

# Ratings - POST (public)
test_endpoint "POST" "$OPERATION_SERVICE_URL/api/v2/ratings" \
    "POST /api/v2/ratings - Создать рейтинг" 201 \
    "{\"bookId\":1,\"ratingValue\":5,\"review\":\"Отличная книга! Test $UNIQUE_SUFFIX\"}" \
    "" "CREATED_RATING_ID"

# Transactions - POST (reserve) - используем созданную копию (которая available=true)
if [ -n "$CREATED_COPY_ID" ]; then
    COPY_DATA=$(curl -s "$BOOK_SERVICE_URL/api/v2/copies/$CREATED_COPY_ID" -H "Authorization: Bearer $JWT_TOKEN" 2>/dev/null || echo "")
    if [ -n "$COPY_DATA" ] && [ "$COPY_DATA" != "null" ]; then
        COPY_LIBRARY_ID=$(echo "$COPY_DATA" | jq -r '.libraryId // empty' 2>/dev/null)
        COPY_AVAILABLE=$(echo "$COPY_DATA" | jq -r '.available // false' 2>/dev/null)
        if [ -z "$COPY_LIBRARY_ID" ] || [ "$COPY_LIBRARY_ID" = "null" ]; then
            COPY_LIBRARY_ID=$LIBRARY_ID_FOR_COPY
        fi
        # Создаем транзакцию только если копия доступна
        if [ "$COPY_AVAILABLE" = "true" ]; then
            test_endpoint "POST" "$OPERATION_SERVICE_URL/api/v2/transactions?bookId=$BOOK_ID_FOR_COPY" \
                "POST /api/v2/transactions - Создать транзакцию (reserve)" 201 \
                "{\"libraryId\":$COPY_LIBRARY_ID}" \
                "$JWT_TOKEN" "CREATED_TRANSACTION_ID"
        fi
    fi
fi

echo "=========================================="
echo "4. Обновление ресурсов (CRUD - Update)"
echo "=========================================="
echo ""

# Books - PUT (используем существующую книгу ID=1)
# isbn может быть null, поэтому используем новый уникальный isbn
test_endpoint "PUT" "$BOOK_SERVICE_URL/api/v2/books/1" \
    "PUT /api/v2/books/1 - Обновить книгу" 200 \
    "{\"title\":\"Updated Book $UNIQUE_SUFFIX\",\"isbn\":\"978-UPD-$UNIQUE_SUFFIX\",\"yearPublished\":2024,\"genreId\":3,\"authorIds\":[1]}" \
    "$JWT_TOKEN"

# Copies - PUT (используем созданную копию)
if [ -n "$CREATED_COPY_ID" ]; then
    test_endpoint "PUT" "$BOOK_SERVICE_URL/api/v2/copies/$CREATED_COPY_ID" \
        "PUT /api/v2/copies/$CREATED_COPY_ID - Обновить копию" 200 \
        "{\"bookId\":$BOOK_ID_FOR_COPY,\"libraryId\":$LIBRARY_ID_FOR_COPY,\"inventoryNumber\":\"$UNIQUE_INV_NUMBER-UPD\",\"available\":false}" \
        "$JWT_TOKEN"
fi

echo "=========================================="
echo "5. Операции с транзакциями"
echo "=========================================="
echo ""

# Создаем новую транзакцию для approve (используем созданную копию, которая available=true)
if [ -n "$CREATED_COPY_ID" ]; then
    COPY_DATA=$(curl -s "$BOOK_SERVICE_URL/api/v2/copies/$CREATED_COPY_ID" -H "Authorization: Bearer $JWT_TOKEN" 2>/dev/null || echo "")
    if [ -n "$COPY_DATA" ] && [ "$COPY_DATA" != "null" ]; then
        COPY_LIBRARY_ID=$(echo "$COPY_DATA" | jq -r '.libraryId // empty' 2>/dev/null)
        COPY_AVAILABLE=$(echo "$COPY_DATA" | jq -r '.available // false' 2>/dev/null)
        if [ -z "$COPY_LIBRARY_ID" ] || [ "$COPY_LIBRARY_ID" = "null" ]; then
            COPY_LIBRARY_ID=$LIBRARY_ID_FOR_COPY
        fi
        # Создаем транзакцию только если копия доступна
        if [ "$COPY_AVAILABLE" = "true" ]; then
            test_endpoint "POST" "$OPERATION_SERVICE_URL/api/v2/transactions?bookId=$BOOK_ID_FOR_COPY" \
                "POST /api/v2/transactions - Создать транзакцию для approve" 201 \
                "{\"libraryId\":$COPY_LIBRARY_ID}" \
                "$JWT_TOKEN" "APPROVE_TRANSACTION_ID"
        fi
    fi
fi

# Transactions - POST approve (LIBRARIAN) - требует available copy
if [ -n "$APPROVE_TRANSACTION_ID" ]; then
    test_endpoint "POST" "$OPERATION_SERVICE_URL/api/v2/transactions/$APPROVE_TRANSACTION_ID/approve" \
        "POST /api/v2/transactions/$APPROVE_TRANSACTION_ID/approve - Одобрить транзакцию" 200 \
        "" "$JWT_TOKEN"
fi

# Создаем новую транзакцию для decline (используем созданную копию, которая available=true)
# Но сначала нужно создать еще одну копию, так как первая может быть использована
if [ -n "$CREATED_COPY_ID" ]; then
    # Создаем еще одну копию для decline теста
    RANDOM_SUFFIX_DECLINE=$((RANDOM % 100000))
    UNIQUE_INV_NUMBER_DECLINE="INV-DECLINE-$UNIQUE_SUFFIX-$RANDOM_SUFFIX_DECLINE"
    DECLINE_COPY_RESPONSE=$(curl -s -X POST "$BOOK_SERVICE_URL/api/v2/copies" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -d "{\"bookId\":$BOOK_ID_FOR_COPY,\"libraryId\":$LIBRARY_ID_FOR_COPY,\"inventoryNumber\":\"$UNIQUE_INV_NUMBER_DECLINE\",\"available\":true}" 2>/dev/null || echo "")
    
    if [ -n "$DECLINE_COPY_RESPONSE" ] && [ "$DECLINE_COPY_RESPONSE" != "null" ]; then
        DECLINE_COPY_ID=$(echo "$DECLINE_COPY_RESPONSE" | jq -r '.id // empty' 2>/dev/null)
        if [ -n "$DECLINE_COPY_ID" ] && [ "$DECLINE_COPY_ID" != "null" ]; then
            test_endpoint "POST" "$OPERATION_SERVICE_URL/api/v2/transactions?bookId=$BOOK_ID_FOR_COPY" \
                "POST /api/v2/transactions - Создать транзакцию для decline" 201 \
                "{\"libraryId\":$LIBRARY_ID_FOR_COPY}" \
                "$JWT_TOKEN" "DECLINE_TRANSACTION_ID"
        fi
    fi
fi

# Transactions - POST decline (LIBRARIAN)
if [ -n "$DECLINE_TRANSACTION_ID" ]; then
    test_endpoint "POST" "$OPERATION_SERVICE_URL/api/v2/transactions/$DECLINE_TRANSACTION_ID/decline" \
        "POST /api/v2/transactions/$DECLINE_TRANSACTION_ID/decline - Отклонить транзакцию" 200 \
        "{\"comment\":\"Not available\"}" \
        "$JWT_TOKEN"
fi

# Transactions - POST return (LIBRARIAN) - требует APPROVED транзакцию
# Создаем транзакцию, одобряем её, затем возвращаем (используем созданную копию, которая available=true)
# Создаем еще одну копию для return теста
if [ -n "$CREATED_COPY_ID" ]; then
    RANDOM_SUFFIX_RETURN=$((RANDOM % 100000))
    UNIQUE_INV_NUMBER_RETURN="INV-RETURN-$UNIQUE_SUFFIX-$RANDOM_SUFFIX_RETURN"
    RETURN_COPY_RESPONSE=$(curl -s -X POST "$BOOK_SERVICE_URL/api/v2/copies" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -d "{\"bookId\":$BOOK_ID_FOR_COPY,\"libraryId\":$LIBRARY_ID_FOR_COPY,\"inventoryNumber\":\"$UNIQUE_INV_NUMBER_RETURN\",\"available\":true}" 2>/dev/null || echo "")
    
    if [ -n "$RETURN_COPY_RESPONSE" ] && [ "$RETURN_COPY_RESPONSE" != "null" ]; then
        RETURN_COPY_ID=$(echo "$RETURN_COPY_RESPONSE" | jq -r '.id // empty' 2>/dev/null)
        if [ -n "$RETURN_COPY_ID" ] && [ "$RETURN_COPY_ID" != "null" ]; then
            test_endpoint "POST" "$OPERATION_SERVICE_URL/api/v2/transactions?bookId=$BOOK_ID_FOR_COPY" \
                "POST /api/v2/transactions - Создать транзакцию для return" 201 \
                "{\"libraryId\":$LIBRARY_ID_FOR_COPY}" \
                "$JWT_TOKEN" "RETURN_TRANSACTION_ID"
        fi
    fi
fi

if [ -n "$RETURN_TRANSACTION_ID" ]; then
    # Одобряем транзакцию
    test_endpoint "POST" "$OPERATION_SERVICE_URL/api/v2/transactions/$RETURN_TRANSACTION_ID/approve" \
        "POST /api/v2/transactions/$RETURN_TRANSACTION_ID/approve - Одобрить для return" 200 \
        "" "$JWT_TOKEN"
    
    # Получаем inventoryNumber из одобренной транзакции
    TRANSACTION_DATA=$(curl -s "$OPERATION_SERVICE_URL/api/v2/transactions?libraryId=1" -H "Authorization: Bearer $JWT_TOKEN" | jq ".[] | select(.id == $RETURN_TRANSACTION_ID)" 2>/dev/null || echo "")
    if [ -n "$TRANSACTION_DATA" ]; then
        INV_NUMBER=$(echo "$TRANSACTION_DATA" | jq -r '.inventoryNumber // empty' 2>/dev/null || echo "")
        if [ -n "$INV_NUMBER" ] && [ "$INV_NUMBER" != "null" ]; then
            test_endpoint "POST" "$OPERATION_SERVICE_URL/api/v2/transactions/return" \
                "POST /api/v2/transactions/return - Вернуть книгу" 200 \
                "{\"inventoryNumber\":\"$INV_NUMBER\"}" \
                "$JWT_TOKEN"
        fi
    fi
fi

echo "=========================================="
echo "6. Удаление ресурсов (CRUD - Delete)"
echo "=========================================="
echo ""

# Transactions - DELETE (отменить транзакцию) - только для PENDING
# Создаем новую транзакцию для отмены (используем созданную копию, которая available=true)
# Создаем еще одну копию для cancel теста
if [ -n "$CREATED_COPY_ID" ]; then
    RANDOM_SUFFIX_CANCEL=$((RANDOM % 100000))
    UNIQUE_INV_NUMBER_CANCEL="INV-CANCEL-$UNIQUE_SUFFIX-$RANDOM_SUFFIX_CANCEL"
    CANCEL_COPY_RESPONSE=$(curl -s -X POST "$BOOK_SERVICE_URL/api/v2/copies" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -d "{\"bookId\":$BOOK_ID_FOR_COPY,\"libraryId\":$LIBRARY_ID_FOR_COPY,\"inventoryNumber\":\"$UNIQUE_INV_NUMBER_CANCEL\",\"available\":true}" 2>/dev/null || echo "")
    
    if [ -n "$CANCEL_COPY_RESPONSE" ] && [ "$CANCEL_COPY_RESPONSE" != "null" ]; then
        CANCEL_COPY_ID=$(echo "$CANCEL_COPY_RESPONSE" | jq -r '.id // empty' 2>/dev/null)
        if [ -n "$CANCEL_COPY_ID" ] && [ "$CANCEL_COPY_ID" != "null" ]; then
            test_endpoint "POST" "$OPERATION_SERVICE_URL/api/v2/transactions?bookId=$BOOK_ID_FOR_COPY" \
                "POST /api/v2/transactions - Создать транзакцию для cancel" 201 \
                "{\"libraryId\":$LIBRARY_ID_FOR_COPY}" \
                "$JWT_TOKEN" "CANCEL_TRANSACTION_ID"
        fi
    fi
fi

if [ -n "$CANCEL_TRANSACTION_ID" ]; then
    test_endpoint "DELETE" "$OPERATION_SERVICE_URL/api/v2/transactions/$CANCEL_TRANSACTION_ID" \
        "DELETE /api/v2/transactions/$CANCEL_TRANSACTION_ID - Отменить транзакцию" 204 \
        "" "$JWT_TOKEN"
fi

# Copies - DELETE (используем созданную копию)
if [ -n "$CREATED_COPY_ID" ]; then
    test_endpoint "DELETE" "$BOOK_SERVICE_URL/api/v2/copies/$CREATED_COPY_ID" \
        "DELETE /api/v2/copies/$CREATED_COPY_ID - Удалить копию" 204 \
        "" "$JWT_TOKEN"
fi

# Books - DELETE (используем созданную книгу)
if [ -n "$CREATED_BOOK_ID" ]; then
    test_endpoint "DELETE" "$BOOK_SERVICE_URL/api/v2/books/$CREATED_BOOK_ID" \
        "DELETE /api/v2/books/$CREATED_BOOK_ID - Удалить книгу" 204 \
        "" "$JWT_TOKEN"
fi

# Authors - DELETE (используем созданного автора)
if [ -n "$CREATED_AUTHOR_ID" ]; then
    test_endpoint "DELETE" "$BOOK_SERVICE_URL/api/v2/authors/$CREATED_AUTHOR_ID" \
        "DELETE /api/v2/authors/$CREATED_AUTHOR_ID - Удалить автора" 204 \
        "" "$JWT_TOKEN"
fi

# Genres - DELETE (используем созданный жанр)
if [ -n "$CREATED_GENRE_ID" ]; then
    test_endpoint "DELETE" "$BOOK_SERVICE_URL/api/v2/genres/$CREATED_GENRE_ID" \
        "DELETE /api/v2/genres/$CREATED_GENRE_ID - Удалить жанр" 204 \
        "" "$JWT_TOKEN"
fi

# Themes - DELETE (используем созданную тему)
if [ -n "$CREATED_THEME_ID" ]; then
    test_endpoint "DELETE" "$BOOK_SERVICE_URL/api/v2/themes/$CREATED_THEME_ID" \
        "DELETE /api/v2/themes/$CREATED_THEME_ID - Удалить тему" 204 \
        "" "$JWT_TOKEN"
fi

# Publishers - DELETE (используем созданное издательство)
if [ -n "$CREATED_PUBLISHER_ID" ]; then
    test_endpoint "DELETE" "$BOOK_SERVICE_URL/api/v2/publishers/$CREATED_PUBLISHER_ID" \
        "DELETE /api/v2/publishers/$CREATED_PUBLISHER_ID - Удалить издательство" 204 \
        "" "$JWT_TOKEN"
fi

# Libraries - DELETE не поддерживается, пропускаем

# Тесты на несуществующие ресурсы
test_endpoint "DELETE" "$BOOK_SERVICE_URL/api/v2/books/999999" \
    "DELETE /api/v2/books/999999 - Удалить несуществующую книгу" 404 \
    "" "$JWT_TOKEN"

test_endpoint "GET" "$BOOK_SERVICE_URL/api/v2/books/999999" \
    "GET /api/v2/books/999999 - Получить несуществующую книгу" 404

echo "=========================================="
echo "7. Тестирование валидации"
echo "=========================================="
echo ""

# Тест валидации - пустое тело запроса
test_endpoint "POST" "$BOOK_SERVICE_URL/api/v2/books" \
    "POST /api/v2/books - Валидация: пустое тело" 400 \
    '{}' "$JWT_TOKEN"

# Тест валидации - отсутствующие обязательные поля
test_endpoint "POST" "$BOOK_SERVICE_URL/api/v2/books" \
    "POST /api/v2/books - Валидация: отсутствует title" 400 \
    '{"isbn":"978-0-123456-78-9","genreId":3}' "$JWT_TOKEN"

# Тест валидации - отсутствует isbn
test_endpoint "POST" "$BOOK_SERVICE_URL/api/v2/books" \
    "POST /api/v2/books - Валидация: отсутствует isbn" 400 \
    '{"title":"Test Book","genreId":3}' "$JWT_TOKEN"

# Тест валидации - отсутствует genreId
test_endpoint "POST" "$BOOK_SERVICE_URL/api/v2/books" \
    "POST /api/v2/books - Валидация: отсутствует genreId" 400 \
    '{"title":"Test Book","isbn":"978-0-123456-78-9"}' "$JWT_TOKEN"

# Тест валидации - неверный формат данных (ratingValue > 5)
test_endpoint "POST" "$OPERATION_SERVICE_URL/api/v2/ratings" \
    "POST /api/v2/ratings - Валидация: ratingValue > 5" 400 \
    '{"bookId":1,"ratingValue":10,"review":"Test"}' ""

# Тест валидации - ratingValue < 1
test_endpoint "POST" "$OPERATION_SERVICE_URL/api/v2/ratings" \
    "POST /api/v2/ratings - Валидация: ratingValue < 1" 400 \
    '{"bookId":1,"ratingValue":0,"review":"Test"}' ""

# Тест валидации - отсутствует comment в decline (требует аутентификацию)
test_endpoint "POST" "$OPERATION_SERVICE_URL/api/v2/transactions/999/decline" \
    "POST /api/v2/transactions/999/decline - Валидация: отсутствует comment" 400 \
    '{}' "$JWT_TOKEN"

echo ""
echo "=========================================="
echo "Тестирование завершено"
echo "=========================================="
echo "Всего тестов: $TOTAL_TESTS"
echo "Успешных: $((TOTAL_TESTS - FAILED_TESTS))"
echo "Провалившихся: $FAILED_TESTS"
if [ $FAILED_TESTS -eq 0 ]; then
    echo "✅ Все тесты прошли успешно!"
    exit 0
else
    echo "❌ Некоторые тесты провалились"
    exit 1
fi
