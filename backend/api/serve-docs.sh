#!/bin/bash

# Скрипт для запуска локального сервера для просмотра API документации

PORT=${1:-8081}
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Запуск локального сервера для API документации"
echo "📁 Директория: $DIR"
echo "🌐 Порт: $PORT"
echo ""
echo "Откройте в браузере:"
echo "  • Swagger UI: http://localhost:$PORT/openapi-swagger.html"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

cd "$DIR"

# Проверяем наличие Python
if command -v python3 &> /dev/null; then
    python3 -m http.server "$PORT"
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer "$PORT"
else
    echo "❌ Ошибка: Python не найден!"
    echo "Установите Python 3 для запуска сервера"
    exit 1
fi

