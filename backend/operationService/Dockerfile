FROM eclipse-temurin:17-jdk

WORKDIR /app

# Копируем только файлы для сборки (для кеширования слоев)
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .

# Даем права на выполнение gradlew
RUN chmod +x gradlew

# Копируем исходный код
COPY . .

# Собираем проект с retry для работы с нестабильным соединением
RUN ./gradlew build -x test --no-daemon || \
    (sleep 10 && ./gradlew build -x test --no-daemon) || \
    (sleep 20 && ./gradlew build -x test --no-daemon --refresh-dependencies)

# Запускаем приложение
ENTRYPOINT ["java", "-jar", "build/libs/operationService-0.0.1-SNAPSHOT.jar"]

EXPOSE 8083