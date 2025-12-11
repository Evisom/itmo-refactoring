FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY bookService/gradlew ./bookService/
COPY bookService/gradle ./bookService/gradle
COPY bookService/build.gradle ./bookService/
COPY bookService/settings.gradle ./bookService/

COPY shared-library/build.gradle ./shared-library/
COPY shared-library/settings.gradle ./shared-library/
COPY shared-library/src ./shared-library/src

COPY bookService/src ./bookService/src
COPY bookService/config ./bookService/config

RUN chmod +x bookService/gradlew

WORKDIR /app/bookService

RUN ./gradlew build -x test --no-daemon || \
    (sleep 10 && ./gradlew build -x test --no-daemon) || \
    (sleep 20 && ./gradlew build -x test --no-daemon --refresh-dependencies)

ENTRYPOINT ["java", "-jar", "build/libs/bookService-0.0.1-SNAPSHOT.jar"]

EXPOSE 8082
