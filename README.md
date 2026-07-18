# Pollería Don Victor

Aplicación web de ventas para la Pollería Don Victor, desarrollada con Spring Boot, Thymeleaf y JavaScript.

## Descripción

Esta aplicación permite mostrar un catálogo de productos, gestionar usuarios, manejar un carrito de compras y procesar pedidos en una pollería.

## Tecnologías utilizadas

- Java 17
- Spring Boot 3.2
- Thymeleaf
- Spring Data JPA
- MySQL
- Bootstrap 5
- HTML, CSS, JavaScript
- Font Awesome

## Funcionalidades implementadas

### Público
- Página principal con catálogo de productos filtrados por sección.
- Formulario de contacto para guardar solicitudes en la base de datos.
- Carrito de compras en el frontend con:
  - agregar productos,
  - editar cantidades,
  - eliminar productos,
  - vaciar carrito,
  - cálculo de subtotal, delivery y total.
- Envío de pedidos al servidor para guardarlos en MySQL.

### Usuarios registrados
- Registro de usuario con nombre, email, teléfono y contraseña.
- Login con email y contraseña.
- Perfil de usuario (`/perfil`) con:
  - actualización de nombre y teléfono,
  - cambio de contraseña,
  - gestión de direcciones (agregar, eliminar, marcar como principal).
- Session management para mantener el usuario activo en views y carrito.

### Panel administrativo
- Dashboard con estadísticas de productos, usuarios, órdenes e ingresos.
- Gestión de productos:
  - listar productos,
  - obtener producto por ID,
  - crear producto,
  - editar producto,
  - eliminar producto.
- Gestión de usuarios:
  - listar usuarios,
  - eliminar usuarios (excepto al admin activo).
- Gestión de pedidos:
  - listar pedidos,
  - cambiar estado de pedido,
  - eliminar pedido.

## Estructura del proyecto

Ruta del módulo principal: `ProyectoFianal_Integrador/ProyectoFianal_Integrador`

- `src/main/java/com/example/ProyectoFianal_Integrador/controller/`
  - `DonVictorController.java` — rutas públicas, login, contacto, administración y pedidos.
  - `PedidoApiController.java` — API REST para guardar pedidos.
  - `PerfilController.java` — perfil de usuario y direcciones.
- `src/main/java/com/example/ProyectoFianal_Integrador/entity/` — entidades JPA: `Usuario`, `Producto`, `Pedido`, `DetallePedido`, `Contacto`, `Direccion`, `ItemCarrito`.
- `src/main/java/com/example/ProyectoFianal_Integrador/repository/` — repositorios Spring Data JPA.
- `src/main/resources/templates/` — vistas Thymeleaf.
- `src/main/resources/static/` — CSS, JS, imágenes y recursos estáticos.
- `src/main/resources/script_catalogo_donvictor.sql` — script para carga inicial de productos.

## Configuración de la base de datos

El archivo `src/main/resources/application.properties` contiene la configuración actual de MySQL:

```properties
spring.application.name=ProyectoFianal_Integrador
spring.datasource.url=jdbc:mysql://localhost:3306/bd_integrador
spring.datasource.username=root
spring.datasource.password=74418228
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

Ajusta `spring.datasource.username` y `spring.datasource.password` a los datos de tu entorno.

## Ejecución

Desde el directorio del módulo:

Windows:

```powershell
cd ProyectoFianal_Integrador\ProyectoFianal_Integrador
mvnw.cmd spring-boot:run
```

macOS/Linux:

```bash
cd ProyectoFianal_Integrador/ProyectoFianal_Integrador
./mvnw spring-boot:run
```

Construir y ejecutar JAR:

```bash
./mvnw clean package
java -jar target/ProyectoFianal_Integrador-0.0.1-SNAPSHOT.jar
```

Abre `http://localhost:8080/` en tu navegador.

## Notas importantes

- Las contraseñas se guardan en texto plano. Es recomendable usar hashing para mayor seguridad.
- El panel administrativo sólo funciona con usuarios que tengan `rol = ADMIN`.
- No existe un administrador preconfigurado en el código, por lo que debes crear un usuario admin directamente en la base de datos si deseas usar el panel.

## Cómo contribuir

1. Haz fork del repositorio.
2. Crea una rama: `git checkout -b feature/mi-cambio`.
3. Haz commit y push.
4. Abre un pull request.

---
