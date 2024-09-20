# Ricky Morty Backend

Este es el backend del juego de Rick y Morty desarrollado con NestJS, Prisma y Node.js 2.5.0.

## Requisitos previos

- Node.js 2.5.0 o superior instalado en tu sistema
- Docker-compose instalado localmente

## Instalación

### 1. Clona el repositorio:
  - `git clone https://github.com/freiman-uribe/backen_rick_and_morty.git`
  - `cd backen_rick_and_morty`

### 2. Instala las dependencias:
  - `npm i`

### 3. Configura tus variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto
   - Agrega las siguientes variables:
      - `DATABASE_URL="postgresql://postgres:password@localhost:5432/NombreDB?schema=public"`


### 4. Inicializa Prisma:
  - `npm run prisma:create-migrate` para la creación de tablas en la base de datos.
  - `npm run prisma:seed` para la creaciónn de los roles.

## Documentación de la API

La documentación de la API está disponible en:
http://localhost:3000/api

## Consideraciones importantes

- La API utiliza autenticación JWT para proteger sus endpoints.
- Todos los endpoints están documentados con Swagger.
- Se recomienda utilizar Postman o cURL para probar la API.
