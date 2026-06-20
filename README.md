# Pollería Don Victor

Proyecto final integrador — aplicación web para la gestión básica de la Pollería Don Victor.

## Descripción

Aplicación web desarrollada con Spring Boot y Thymeleaf que provee registro y autenticación de usuarios, gestión de contactos y una interfaz estática para mostrar secciones de productos. Es un proyecto educativo y de demostración pensado para desplegar en entornos locales y de servidor.

## Tecnologías utilizadas

- Java 17+
- Spring Boot (Maven)
- Thymeleaf
- Maven (con `mvnw` / `mvnw.cmd`)
- MySQL (como ejemplo de base de datos relacional)
- HTML, CSS y JavaScript para frontend estático

## login correo y contraseña de usuarios
- correo: juan@gmail.com  pass: 123456
## Funcionalidades principales

- Registro y login de usuarios.
- Gestión de contactos (crear/listar/editar/eliminar).
- Páginas públicas con plantillas Thymeleaf: `index`, `login`, `registro`.
- Recursos estáticos organizados en `css/`, `js/`, `img/` y subcarpetas por secciones.

## Requisitos para ejecutarlo

- JDK 17 o superior instalado y configurado en `PATH`.
- MySQL (o ajusta `application.properties` para otra BD).
- Git (opcional).
- En Windows usar `mvnw.cmd`; en macOS/Linux usar `./mvnw`.

## Instalación paso a paso

1. Clona el repositorio:

```bash
git clone https://github.com/<tu-usuario>/Polleria-DonVictor.git
cd Polleria-DonVictor/ProyectoFianal_Integrador/ProyectoFianal_Integrador
```

2. (Opcional) Configura un entorno virtual de Java o asegúrate de tener la versión requerida.

3. Configura la base de datos MySQL (ver sección siguiente).

4. Ejecuta la aplicación localmente:

Windows:

```powershell
mvnw.cmd spring-boot:run
```

macOS / Linux:

```bash
./mvnw spring-boot:run
```

5. Generar JAR y ejecutar:

```bash
./mvnw clean package
java -jar target/*.jar
```

6. Ejecutar pruebas unitarias:

```bash
./mvnw test
```

## Configuración de la base de datos MySQL

1. Crear la base de datos y el usuario (ajusta `DB_USER` y `DB_PASS`):

```sql
CREATE DATABASE polleriadonvictor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pdv_user'@'localhost' IDENTIFIED BY 'tu_password_segura';
GRANT ALL PRIVILEGES ON polleriadonvictor.* TO 'pdv_user'@'localhost';
FLUSH PRIVILEGES;
```

2. Añade la configuración MySQL en `src/main/resources/application.properties` (reemplaza valores):

```properties
# Datasource
spring.datasource.url=jdbc:mysql://localhost:3306/polleriadonvictor?useSSL=false&serverTimezone=UTC
spring.datasource.username=pdv_user
spring.datasource.password=tu_password_segura
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Puerto (opcional)
server.port=8080
```

Notas:
- `spring.jpa.hibernate.ddl-auto=update` crea/actualiza tablas automáticamente en desarrollo; para producción considere `validate` y migraciones con Flyway/Liquibase.
- Añade el conector MySQL al `pom.xml` si no está presente:

```xml
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <scope>runtime</scope>
</dependency>
```

## Cómo ejecutar el proyecto

- Ejecutar con Maven Wrapper (desarrollo): `mvnw[.cmd] spring-boot:run` desde `ProyectoFianal_Integrador/ProyectoFianal_Integrador`.
- Construir y ejecutar JAR: `./mvnw clean package` → `java -jar target/*.jar`.
- Acceder en el navegador: `http://localhost:8080/` (o el puerto configurado).

## Estructura de carpetas

Resumen de la estructura relevante (ruta relativa al módulo):

```
ProyectoFianal_Integrador/
├─ mvnw, mvnw.cmd, pom.xml
├─ src/
│  ├─ main/
│  │  ├─ java/com/example/ProyectoFianal_Integrador/
│  │  │  ├─ ProyectoFianalIntegradorApplication.java
│  │  │  ├─ controller/DonVictorController.java
│  │  │  ├─ entity/Usuario.java
+│  │  │  └─ entity/Contacto.java
│  │  ├─ resources/
│  │  │  ├─ application.properties
│  │  │  ├─ static/
│  │  │  │  ├─ css/
│  │  │  │  ├─ js/
│  │  │  │  └─ img/
│  │  │  └─ templates/
│  │  │     ├─ index.html
│  │  │     ├─ login.html
│  │  │     └─ registro.html
│  └─ test/
```

Revisa los paquetes:
- `controller/` → rutas y manejo HTTP.
- `entity/` → modelos de dominio.
- `repository/` → interfaces Spring Data JPA.

## Autor

- Autor: [Tu Nombre] — reemplaza con tu nombre o el del equipo.



## Contribuciones

1. Fork del repositorio.
2. Crear una rama: `git checkout -b feature/mi-cambio`.
3. Commit y push.
4. Abrir pull request describiendo los cambios.

## Contacto

Para dudas o soporte, abre un issue en el repositorio o contacta al autor.

---

