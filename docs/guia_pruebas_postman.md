# Guia de pruebas en Postman

## 1. Preparacion

1. Inicia MongoDB.
2. Entra a `backend`.
3. Ejecuta `npm install`.
4. Copia `.env.example` como `.env`.
5. Ejecuta `npm run seed`.
6. Ejecuta `npm run dev`.
7. Confirma que el servidor responda en `http://localhost:4000`.

## 2. Importar coleccion

Importa el archivo:

```txt
docs/stockcontrol_postman_collection.json
```

La coleccion usa estas variables:

| Variable | Valor inicial |
|---|---|
| `base_url` | `http://localhost:4000` |
| `token` | Pegar token del login |
| `user_id` | Pegar ID de usuario creado |
| `product_id` | Pegar ID de producto creado |
| `service_id` | Pegar ID de servicio creado |
