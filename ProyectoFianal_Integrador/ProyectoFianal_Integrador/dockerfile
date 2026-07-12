# Primera etapa: compilación con Java 17
FROM maven:3.8-openjdk-17 AS build

WORKDIR /app

# Copia archivos de configuración
COPY pom.xml .
COPY .mvn .mvn/
COPY mvnw .
COPY mvnw.cmd .

# Descarga dependencias (mejora el caché)
RUN mvn dependency:go-offline -B

# Copia el código fuente
COPY src src/

# Compila el proyecto
RUN mvn clean package -DskipTests

# Segunda etapa: imagen liviana para ejecutar
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copia el JAR generado
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
