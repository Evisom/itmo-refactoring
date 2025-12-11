FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY operationService/gradlew ./operationService/
COPY operationService/gradle ./operationService/gradle
COPY operationService/build.gradle ./operationService/
COPY operationService/settings.gradle ./operationService/

COPY shared-library/build.gradle ./shared-library/
COPY shared-library/settings.gradle ./shared-library/
COPY shared-library/src ./shared-library/src

COPY operationService/src ./operationService/src
COPY operationService/config ./operationService/config

RUN chmod +x operationService/gradlew

WORKDIR /app/operationService

RUN ./gradlew build -x test --no-daemon || \
    (sleep 10 && ./gradlew build -x test --no-daemon) || \
    (sleep 20 && ./gradlew build -x test --no-daemon --refresh-dependencies)

ENTRYPOINT ["java", "-jar", "build/libs/operationService-0.0.1-SNAPSHOT.jar"]

EXPOSE 8083
