# Comida al Paso - Frontend

Interfaz de usuario desarrollada con React y Tailwind CSS para el sistema de carrito de compras de comida rápida.

## Tecnologías

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Context API

## Estructura del Proyecto
```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Footer.jsx
│   │   ├── InventarioAdmin.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CarritoContext.jsx
│   ├── data/
│   │   └── productos.js
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Carrito.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Products.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   └── inventarioAPI.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Instalación

1. Entrar a la carpeta frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Ajustar la URL del backend en `.env`:
```
VITE_API_URL=http://localhost:8000/api
```

5. Iniciar servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Genera build de producción |
| `npm run preview` | Previsualiza build de producción |
| `npm run lint` | Ejecuta ESLint |

## Funcionalidades

### Públicas (sin autenticación)
- Ver catálogo de productos
- Filtrar productos por categoría
- Ver detalle de producto
- Agregar productos al carrito
- Ver página About

### Usuario Autenticado
- Todo lo anterior
- Finalizar compra (descuenta stock real)
- Ver información de cuenta

### Administrador
- Todo lo anterior
- Acceder al Dashboard
- Crear, editar y eliminar productos
- Gestionar inventario

## Páginas

| Ruta | Componente | Descripción | Acceso |
|------|------------|-------------|--------|
| `/` | Home.jsx | Página principal | Público |
| `/products` | Products.jsx | Catálogo de productos | Público |
| `/products/:id` | ProductDetail.jsx | Detalle de producto | Público |
| `/carrito` | Carrito.jsx | Carrito de compras | Público |
| `/about` | About.jsx | Información del negocio | Público |
| `/login` | Login.jsx | Inicio de sesión | Público |
| `/register` | Register.jsx | Registro de usuario | Público |
| `/dashboard` | Dashboard.jsx | Panel de administración | Admin |
| `*` | NotFound.jsx | Página 404 | Público |

## Componentes

### Componentes de UI
| Componente | Descripción |
|------------|-------------|
| Button.jsx | Botón reutilizable con variantes |
| Card.jsx | Tarjeta contenedora genérica |
| ProductCard.jsx | Tarjeta de producto con imagen, precio y acciones |
| Navbar.jsx | Barra de navegación con indicador de carrito |
| Footer.jsx | Pie de página |

### Componentes Funcionales
| Componente | Descripción |
|------------|-------------|
| ProtectedRoute.jsx | HOC para proteger rutas por rol |
| InventarioAdmin.jsx | Gestión de productos (CRUD) |

## Manejo de Estado

### AuthContext
Gestiona el estado de autenticación:
- Usuario actual
- Token JWT
- Funciones: login, logout, register
- Persistencia en localStorage

### CarritoContext
Gestiona el carrito de compras:
- Items del carrito
- Funciones: agregar, eliminar, actualizar cantidad, vaciar
- Cálculo de totales
- Persistencia en localStorage

## Comunicación con el Backend

El archivo `src/services/inventarioAPI.js` centraliza todas las llamadas a la API:
```javascript
// Configuración base con Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Interceptor para agregar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Demo Guiada

### 1. Navegación Pública
1. Abrir http://localhost:5173
2. Navegar al catálogo en "Productos"
3. Filtrar por categoría (ej: Hamburguesas)
4. Click en un producto para ver detalle
5. Agregar productos al carrito

### 2. Login y Autenticación
1. Click en "Iniciar Sesión" en la navbar
2. Ingresar credenciales:
   - Usuario: `test`
   - Contraseña: `test1234`
3. Observar que la navbar muestra el usuario
4. Aparece opción "Dashboard" (usuario admin)

### 3. CRUD de Productos (Admin)
1. Acceder al Dashboard
2. Ver listado de productos con stock
3. Click en "Nuevo Producto":
   - Completar nombre, categoría, precio, stock
   - Guardar
4. Editar un producto existente:
   - Modificar precio o stock
   - Guardar cambios
5. Eliminar un producto:
   - Click en eliminar
   - Confirmar acción

### 4. Proceso de Compra
1. Agregar varios productos al carrito
2. Ir al carrito
3. Ajustar cantidades si es necesario
4. Click en "Finalizar Compra"
5. Verificar mensaje de éxito
6. Observar que el stock se actualizó

### 5. Manejo de Errores
- **Sin stock**: Intentar comprar más unidades de las disponibles
- **Sin autenticación**: Intentar comprar sin estar logueado
- **Producto no existe**: Navegar a `/products/99999`
- **Ruta inexistente**: Navegar a `/ruta-falsa`

## Arquitectura y Decisiones Técnicas

### ¿Por qué React + Vite?
- Vite ofrece HMR ultrarrápido
- Build optimizado para producción
- Configuración simple con ESM nativo

### ¿Por qué Tailwind CSS?
- Utility-first para desarrollo rápido
- Sin CSS personalizado que mantener
- Bundle optimizado (purge de clases no usadas)

### ¿Por qué Context API?
- Suficiente para el tamaño del proyecto
- Sin dependencias adicionales (vs Redux)
- Fácil de entender y mantener

### Separación de Responsabilidades
```
src/
├── components/  → UI reutilizable (presentacional)
├── pages/       → Vistas completas (contenedor)
├── context/     → Estado global
├── services/    → Comunicación con API
└── data/        → Datos estáticos/mocks
```

## Manejo de Loading y Errores

### Estados de Loading
- Spinner o skeleton mientras cargan datos
- Botones deshabilitados durante peticiones
- Feedback visual en acciones

### Estados de Error
- Mensajes claros al usuario
- Página 404 para rutas inexistentes
- Manejo de errores de red
- Validación de formularios

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| VITE_API_URL | URL base de la API | http://localhost:8000/api |

## Mejoras Futuras

- Implementar tests con Vitest y React Testing Library
- Agregar PWA para uso offline
- Implementar búsqueda de productos
- Agregar filtros avanzados (precio, disponibilidad)
- Implementar paginación infinita
- Agregar animaciones y transiciones
- Modo oscuro
- Internacionalización (i18n)

## Requisitos del Sistema

- Node.js 18+
- npm 9+
- Navegador moderno (Chrome, Firefox, Edge, Safari)

## Licencia

Este proyecto es de uso educativo.

---

Desarrollado por Erica R. Ansaloni - 2025