# StockControl Inventario

Proyecto final con frontend desacoplado y backend API REST.

## 1. Estructura

```txt
stockcontrol-proyecto/
├── frontend/
│   ├── index.html
│   └── assets/
│       ├── app.js
│       ├── style.css
│       └── logo-stockcontrol.jpg
├── backend/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── utils/
└── docs/
    ├── stockcontrol_postman_collection.json
    ├── guia_pruebas_postman.md
    └── capturas-postman/
```

## 2. Que se debe instalar


1. Node.js LTS.
2. MongoDB Community Server.
3. MongoDB Compass, para ver la base de datos con interfaz.
4. Postman, para probar los endpoints.
5. Visual Studio Code, para abrir el proyecto.

### Verificar instalacion

Abre una terminal y ejecuta:

```bash
node -v
npm -v
mongod --version
```

## 3. Configurar MongoDB local

Si instalaste MongoDB local, inicia el servicio.

En Windows, normalmente queda activo como servicio despues de la instalacion.

En Linux, usa:

```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

La conexion local usada por el proyecto es:

```txt
mongodb://127.0.0.1:27017/stockcontrol_db
```

## 4. Levantar el backend

Entra a la carpeta del backend:

```bash
cd backend
```

Instala dependencias:

```bash
npm install
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Carga datos iniciales:

```bash
npm run seed
```

Inicia el servidor:

```bash
npm run dev
```

Si todo queda bien, veras:

```txt
Servidor activo en http://localhost:4000
MongoDB conectado: 127.0.0.1
```

## 5. Usuario demo

```json
{
  "email": "admin@inventario.com",
  "password": "123456"
}
```

## 6. Ver el frontend


1. Abre `frontend/index.html` en el navegador.
2. O usa la extension Live Server de VS Code y ejecuta `Open with Live Server`.

Acceso visual:

```txt
Correo: admin@inventario.com
Contrasena: 123456
```

## 7. Diccionario de endpoints

Base URL:

```txt
http://localhost:4000
```

Los endpoints CRUD requieren token Bearer, salvo el login.

### Autenticacion

| Metodo | Ruta | Descripcion |
|---|---|---|
| POST | `/api/auth/login` | Verifica correo y contrasena. Devuelve token. |
| GET | `/api/auth/me` | Devuelve el usuario autenticado. |

### Usuarios

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/users` | Lista usuarios. |
| GET | `/api/users/:id` | Consulta un usuario por ID. |
| POST | `/api/users` | Crea usuario. |
| PUT | `/api/users/:id` | Actualiza usuario. |
| DELETE | `/api/users/:id` | Elimina usuario. |

### Productos

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/products` | Lista productos. |
| GET | `/api/products/stats` | Devuelve conteos de productos y alertas. |
| GET | `/api/products/:id` | Consulta producto por ID. |
| POST | `/api/products` | Crea producto. |
| PUT | `/api/products/:id` | Actualiza producto. |
| DELETE | `/api/products/:id` | Elimina producto. |

### Servicios

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/api/services` | Lista servicios. |
| GET | `/api/services/:id` | Consulta servicio por ID. |
| POST | `/api/services` | Crea servicio. |
| PUT | `/api/services/:id` | Actualiza servicio. |
| DELETE | `/api/services/:id` | Elimina servicio. |

## 8. JSON de prueba

### Login

`POST /api/auth/login`

```json
{
  "email": "admin@inventario.com",
  "password": "123456"
}
```

Respuesta esperada:

```json
{
  "ok": true,
  "message": "Inicio de sesion correcto",
  "token": "TOKEN_JWT",
  "user": {
    "id": "ID_DEL_USUARIO",
    "name": "Administrador StockControl",
    "email": "admin@inventario.com",
    "role": "admin",
    "active": true
  }
}
```

### Crear usuario

`POST /api/users`

Headers:

```txt
Authorization: Bearer TOKEN_JWT
Content-Type: application/json
```

Body:

```json
{
  "name": "Analista Inventario",
  "email": "analista@inventario.com",
  "password": "123456",
  "role": "operator",
  "active": true
}
```

### Crear producto

`POST /api/products`

```json
{
  "name": "Lector codigo de barras",
  "sku": "SC-LECT-010",
  "category": "Tecnologia",
  "quantity": 12,
  "minStock": 5,
  "price": 190000,
  "location": "Bodega A"
}
```

### Crear servicio

`POST /api/services`

```json
{
  "name": "Revision de inventario mensual",
  "code": "SRV-REV-010",
  "description": "Revision mensual de diferencias y existencias.",
  "area": "Inventario",
  "cost": 110000,
  "priority": "Media",
  "active": true
}
```

## 9. Pruebas en Postman

Importa este archivo en Postman:

```txt
docs/stockcontrol_postman_collection.json
```

Flujo sugerido:

1. Ejecuta `Auth/Login`.
2. Copia el token recibido.
3. En Postman, ve a la variable `token` y pega el valor.
4. Ejecuta los CRUD de usuarios, productos y servicios.
5. Guarda capturas en `docs/capturas-postman/`.

Capturas minimas esperadas:

1. Login correcto.
2. GET usuarios.
3. POST usuario.
4. PUT usuario.
5. DELETE usuario.
6. GET productos.
7. POST producto.
8. PUT producto.
9. DELETE producto.
10. GET servicios.
11. POST servicio.
12. PUT servicio.
13. DELETE servicio.

## 10. Explicacion del DOM en frontend

El frontend usa un solo archivo HTML para las vistas internas.

La navegacion se hace con JavaScript:

1. Las secciones tienen IDs como `dashboardSection`, `usersSection`, `productsSection` y `servicesSection`.
2. La funcion `showView(viewId)` oculta todas las secciones con la clase `hidden`.
3. Luego muestra la seccion seleccionada.
4. Los botones del menu usan `data-view` para indicar que seccion abrir.
5. Los formularios validan campos vacios, formato de correo y valores numericos antes de modificar los arreglos locales.
6. Las tablas se renderizan con `innerHTML` a partir de arreglos en JavaScript.

