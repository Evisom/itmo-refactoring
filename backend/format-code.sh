#!/bin/bash

# Скрипт для форматирования Java кода с помощью Google Java Format

echo "Formatting Java code with Google Java Format..."

# Путь к jar файлу
FORMATTER_JAR="/tmp/google-java-format.jar"

# Установка google-java-format если не установлен
if [ ! -f "$FORMATTER_JAR" ]; then
    echo "Installing google-java-format..."
    curl -L -o "$FORMATTER_JAR" https://github.com/google/google-java-format/releases/download/v1.23.0/google-java-format-1.23.0-all-deps.jar
fi

# Проверка наличия Java
if ! command -v java &> /dev/null; then
    echo "Error: Java is not installed or not in PATH"
    exit 1
fi

# Форматирование всех Java файлов
echo "Formatting bookService..."
find bookService/src -name "*.java" -exec java -jar "$FORMATTER_JAR" -i {} \;

echo "Formatting operationService..."
find operationService/src -name "*.java" -exec java -jar "$FORMATTER_JAR" -i {} \;

echo "Formatting shared-library..."
find shared-library/src -name "*.java" -exec java -jar "$FORMATTER_JAR" -i {} \;

echo "Formatting complete!"
