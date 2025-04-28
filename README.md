# Microservicio de Suma con Autenticación JWT

Este proyecto implementa un sistema de microservicios con autenticación JWT que consta de:

* Un servicio principal que maneja la autenticación y realiza operaciones de suma
* Un microservicio secundario que genera números aleatorios

## Características

* **Autenticación JWT** para proteger los endpoints del servicio principal
* **Arquitectura de microservicios** con comunicación mediante HTTP
* **Logging** para facilitar la depuración
* **Manejo de errores** centralizado
* **Variables de entorno** para configuración flexible

## Estructura del Proyecto

```
├── index.js           # Servicio principal (API de suma)
├── microservice.js    # Microservicio de números aleatorios
├── auth.js            # Módulo de autenticación
├── .env               # Variables de entorno (no incluido en el repositorio)
├── package.json       # Dependencias y scripts
└── README.md          # Documentación
```

## Requisitos

* Node.js (v14 o superior)
* npm o yarn

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/microservicio-suma-jwt.git
cd microservicio-suma-jwt
```

2. Instalar las dependencias:

```bash
npm install
```

3. Crear un archivo `.env` con el siguiente contenido:

```
PORT=6000
PORT2=6001
JWT_SECRET=clave_muyyyyy_secreta_aqui
AUTH_USERNAME=raul
AUTH_PASSWORD=1234
NUM_SERVICE_URL=http://localhost:6001/random
```

## Ejecución

### Iniciar ambos servicios simultáneamente:

```bash
npm start
#Instalar esto para que funcione:
npm install --save-dev concurrently
```

### Iniciar servicios en modo desarrollo (con recarga automática):

```bash
npm run dev:all
```

### Iniciar servicios por separado:

```bash
# Solo servicio principal
npm run dev

# Solo microservicio de números
npm run dev:microservice
```

## Uso de la API

### 1. Autenticación (Login)

```bash
curl -X POST http://localhost:6000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "raul", "password": "1234"}'
```

Respuesta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Autenticación exitosa",
  "expiresIn": "1h"
}
```

### 2. Obtener suma de números aleatorios

```bash
curl -X GET http://localhost:6000/sum \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Respuesta:

```json
{
  "result": 7,
  "operation": "3 + 4",
  "user": "raul",
  "timestamp": "2025-04-28T19:45:12.345Z"
}
```

### 3. Obtener información de la API

```bash
curl -X GET http://localhost:6000/info \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Respuesta:

```json
{
  "service": "API de suma con autenticación JWT",
  "user": "raul",
  "endpoints": [
    {
      "path": "/login",
      "method": "POST",
      "description": "Autenticación de usuario y generación de token"
    },
    {
      "path": "/sum",
      "method": "GET",
      "description": "Obtiene dos números aleatorios y devuelve su suma"
    },
    {
      "path": "/info",
      "method": "GET",
      "description": "Información sobre la API"
    }
  ]
}
```

### 4. Verificar estado del microservicio

```bash
curl -X GET http://localhost:6001/health
```

Respuesta:

```json
{
  "service": "Microservicio de números aleatorios",
  "status": "healthy",
  "timestamp": "2025-04-28T19:46:23.456Z"
}
```

## Arquitectura

### Servicio Principal (index.js)

* Maneja la autenticación de usuarios
* Genera tokens JWT
* Proporciona endpoints protegidos
* Se comunica con el microservicio de números aleatorios

### Microservicio de Números (microservice.js)

* Genera pares de números aleatorios entre 1 y 9
* No requiere autenticación (solo para uso interno)
* Proporciona un endpoint de estado de salud

### Módulo de Autenticación (auth.js)

* Gestiona la verificación de tokens JWT
* Genera nuevos tokens JWT
* Implementa la autenticación básica de usuarios

## Seguridad

* Los tokens JWT expiran después de 1 hora
* El microservicio de números aleatorios no requiere autenticación, por lo que debe desplegarse en una red segura
* En producción, se recomienda:
  * Configurar HTTPS
  * Almacenar credenciales en un sistema seguro
  * Implementar medidas adicionales de seguridad para el microservicio interno
