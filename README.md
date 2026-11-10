# Sintonía

Aplicación frontend construida con React y Vite. Incluye la página de inicio y el catálogo musical.

## Requisitos

- Node.js 20.19 o posterior en la rama 20, o Node.js 22.12 o posterior.
- npm, incluido con Node.js.

## Instalación

Desde la raíz del proyecto, instala las dependencias:

```sh
npm ci
```

## Desarrollo

Inicia el servidor de desarrollo:

```sh
npm run dev
```

Abre la URL que muestre Vite en la terminal (por defecto, `http://localhost:5173`).

## Build de producción y vista previa

Genera la versión de producción:

```sh
npm exec vite -- build
```

Para servir localmente esa versión, después del build ejecuta:

```sh
npm exec vite -- preview
```

Abre la URL de vista previa que muestre Vite en la terminal (por defecto, `http://localhost:4173`).
