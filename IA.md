# Registro de uso de IA

## 1. Carrusel de álbumes del Home

- **Solicitud:** Permitir desplazarse horizontalmente por los álbumes del Home solo en mobile, sin cambiar la cuadrícula ni mostrar una barra de scroll en desktop.
- **Trabajo realizado:** Se añadió una variante mobile de la sección de álbumes, activada desde Home y limitada por CSS a pantallas de hasta 640 px.
- **Resultado:** El build de producción pasó.

## 2. Géneros visibles en mobile

- **Solicitud:** Mostrar únicamente los primeros cuatro géneros en la sección de géneros del Home en mobile, sin alterar el Catálogo.
- **Trabajo realizado:** Se aplicó una regla CSS dirigida a la sección que no tiene la clase de Catálogo.
- **Resultado:** El Catálogo conserva su límite y comportamiento existentes; el build pasó.

## 3. Corrección del hover del botón de accesibilidad

- **Solicitud:** En mobile, aplicar el hover al círculo del icono y dejar sin hover el resto de la fila; en desktop, mantener el estilo original.
- **Respuesta inicial equivocada:** Se cambió el centrado del botón de escritorio al intentar corregir el icono, lo que lo dejó más descentrado.
- **Corrección:** Tras la observación del usuario, se restauraron las reglas previas de escritorio y se limitaron las reglas de hover y del círculo al breakpoint mobile.
- **Resultado:** Se verificó el build de producción.

## 4. Renderizado del collage de portadas

- **Solicitud:** Recuperar el collage en desktop y conservarlo oculto en mobile.
- **Diagnóstico:** `PortadaAlbum` pasó a requerir un objeto `portada`, mientras que `CollagePortadas` seguía enviando `variante` o no enviaba portada. En consecuencia, el componente devolvía `null`.
- **Corrección:** Se actualizaron las tres llamadas para pasar objetos compatibles con la interfaz actual. No se modificó el CSS que oculta el collage en mobile ni su composición desktop.
- **Resultado:** El build de producción pasó.