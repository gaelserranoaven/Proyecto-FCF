# Fundación Construyendo Futuro · Web nueva (propuesta B)

Sitio institucional de la **Fundación Construyendo Futuro ONG** (Bogotá, desde 2009), hecho desde cero con HTML, CSS y JavaScript sin dependencias y sin paso de build.

> **Estado: en revisión.** Es una propuesta de diseño para que la fundación la compare con la web actual corregida. Las páginas llevan `noindex` y `robots.txt` bloquea a los buscadores. Los textos marcados como pendientes (recuadros naranja punteados) son datos que la fundación todavía debe confirmar.

## Páginas
| Archivo | Contenido |
|---|---|
| `index.html` | Inicio: quiénes somos, programas, modelo de atención, cómo ayudar, sedes |
| `programas.html` | Índice de los dos programas |
| `programa-jovenes.html` | Jóvenes con discapacidad cognitiva |
| `programa-personas-mayores.html` | Personas mayores en situación de calle |
| `como-ayudar.html` | Alianzas, voluntariado, trabaja con nosotros y donaciones |
| `sedes.html` | Samper Mendoza y La Favorita |
| `transparencia.html` | Informes de gestión y política de datos |
| `contacto.html` | Formulario de contacto |
| `donaciones.html` | Donaciones en dinero y en especie |
| `certificados.html` | Solicitud de certificados laborales |

Estilos en `assets/css/styles.css`, comportamiento en `assets/js/main.js` y el logo en `assets/img/`.

## Ver el sitio
Abre `index.html` en el navegador, o activa **GitHub Pages** (Settings → Pages → rama `main`, carpeta `/ (root)`). Los enlaces son relativos, así que funciona en cualquier subcarpeta.

## Lo que falta
- **Formularios:** contacto y certificados validan los datos pero **no envían nada**. Se conectan pegando la URL del webhook de n8n en el atributo `data-webhook` de cada `<form>`.
- **Donaciones:** el botón "Donar" informa cómo aportar mientras no haya pasarela de pagos.
- **Fotos:** todas son marcadores. Solo se publican fotos de personas con autorización firmada (Ley 1581 de 2012).
- **Datos pendientes:** se encuentran buscando `class="pendiente"` en los `.html`.

## Antes de publicar de verdad
1. Quitar `<meta name="robots" content="noindex, nofollow">` de cada página y cambiar `robots.txt`.
2. Reemplazar los datos pendientes por los confirmados.
3. Conectar los formularios y definir la pasarela de pagos.

## Accesibilidad
Contraste mínimo de 4,5:1 en todo el texto, áreas táctiles de 44 px, foco visible, navegación completa con teclado, texto que escala hasta el 200 %, y respuesta a `prefers-reduced-motion`, `prefers-contrast` y `forced-colors`.
