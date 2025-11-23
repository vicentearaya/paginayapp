# Sistema de Gestión de Vales - CasinoSoft

Sistema web para la gestión de vales de alimentación de Libros Impresos.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu computador:

- **Node.js** (versión 18 o superior)
  - Descarga desde: https://nodejs.org/
  - Verifica la instalación abriendo una terminal y escribiendo: `node --version`

## 🚀 Cómo Ejecutar la Aplicación

### Paso 1: Abrir dos terminales

Necesitarás tener **dos ventanas de terminal abiertas** al mismo tiempo:
- Una para el **Backend** (servidor)
- Una para el **Frontend** (interfaz web)

### Paso 2: Ejecutar el Backend

En la **primera terminal**:

```bash
# Navega a la carpeta del backend
cd backend

# Inicia el servidor
node src/app.js
```

Deberías ver el mensaje: `Server is running on port 3000`

**¡Importante!** Mantén esta terminal abierta mientras uses la aplicación.

### Paso 3: Ejecutar el Frontend

En la **segunda terminal**:

```bash
# Navega a la carpeta del frontend
cd frontend

# Inicia la aplicación web
npx ng serve
```

Espera a que termine de compilar. Verás un mensaje que dice: `Local: http://localhost:4200/`

**¡Importante!** Mantén esta terminal abierta mientras uses la aplicación.

### Paso 4: Abrir la Aplicación

1. Abre tu navegador web (Chrome, Firefox, Edge, etc.)
2. Visita: **http://localhost:4200**
3. ¡Listo! Ya puedes usar la aplicación

## 👤 Credenciales de Acceso

### Administrador
- **Email:** admin@librosimpresos.cl
- **Contraseña:** admin

### Funcionarios
Los usuarios funcionarios deben ser creados por el administrador desde el panel de administración.

## 🛑 Cómo Detener la Aplicación

Para detener los servidores:

1. Ve a cada terminal
2. Presiona `Ctrl + C`
3. Confirma si te pregunta

## 📁 Estructura del Proyecto

```
paginavales/
├── backend/          # Servidor y base de datos
│   └── src/
│       ├── app.js           # Punto de entrada del servidor
│       ├── database.js      # Configuración de la base de datos
│       ├── controllers/     # Lógica de negocio
│       ├── routes/          # Rutas de la API
│       └── middleware/      # Autenticación y seguridad
│
└── frontend/         # Interfaz web
    └── src/
        └── app/
            ├── login/       # Página de inicio de sesión
            ├── home/        # Página principal (funcionarios)
            ├── dashboard/   # Generación de vales
            └── admin/       # Panel de administración
```
