# Fundación Construyendo Futuro · Web nueva (propuesta B)

Sitio institucional de la **Fundación Construyendo Futuro ONG** (Bogotá, desde 2009), hecho desde cero con HTML, CSS y JavaScript, sin dependencias y sin paso de build.

> **Estado: en revisión · versión 1.5 (25 de noviembre de 2026).** Es una propuesta de diseño para que la fundación la compare con su web actual corregida. Las páginas llevan `noindex` y `robots.txt` bloquea a los buscadores. Los recuadros naranja punteados son datos y fotos que la fundación todavía debe entregar.

Se puede ver en https://gaelserranoaven.github.io/Proyecto-FCF/

## A quién le habla
A la comunidad, a otras fundaciones, a entidades públicas y privadas, y a familiares. Las personas mayores que acompaña la fundación no llegan por la web: llegan directamente a las sedes. Por eso el sitio busca dos cosas: sensibilizar y dar confianza.

## Páginas
| Archivo | Contenido |
|---|---|
| `index.html` | Inicio: accesos según quién visita, quiénes somos, los dos programas, espacio para una historia, modelo de atención, cómo ayudar y sedes |
| `quienes-somos.html` | Historia de la fundación, equipo y datos legales |
| `programas.html` | Índice de los dos programas |
| `programa-jovenes.html` | Jóvenes con discapacidad cognitiva |
| `programa-personas-mayores.html` | Personas mayores en situación de calle: cómo llegan, día a día, centros de cuidado, equipo y registro del cuidado |
| `como-ayudar.html` | Alianzas, voluntariado, trabaja con nosotros y donaciones |
| `sedes.html` | Samper Mendoza y La Favorita, con enlace a Google Maps |
| `transparencia.html` | Informes de gestión y política de datos personales |
| `contacto.html` | Formulario de contacto |
| `donaciones.html` | Donaciones en dinero, en especie y en tiempo |
| `certificados.html` | Solicitud de certificados laborales |
| `404.html` | Página que se muestra cuando una dirección no existe |

## Archivos
| Carpeta | Contenido |
|---|---|
| `assets/css/styles.css` | Todos los estilos. Los colores y medidas están como variables al inicio |
| `assets/js/main.js` | Menú, animación de entrada, formularios y donaciones |
| `assets/fonts/` | La fuente Sofia Sans, alojada en el propio sitio |
| `assets/img/` | Logo, íconos del navegador e imagen para compartir (`compartir.png`) |

El sitio no carga nada de otros servidores: ni fuentes, ni mapas, ni programas de seguimiento.

Los `.html` se generan con un script que no está en este repositorio. Si editas una página a mano, avisa para llevar el cambio al generador; de lo contrario se pierde en la siguiente versión.

## Ver el sitio en tu computador
Abre `index.html` en el navegador. Los enlaces son relativos, así que funciona en cualquier carpeta o subcarpeta.

Para publicarlo en GitHub Pages: Settings → Pages → rama `main`, carpeta `/ (root)`.

## Cómo funciona hoy cada parte
- **Formularios de contacto y certificados:** validan los datos y muestran el mensaje de "gracias", pero **no envían nada**. Se conectan pegando la dirección del webhook de n8n en el atributo `data-webhook` de cada `<form>`.
- **Contacto:** hay que elegir un motivo y dejar un correo o un teléfono; con uno de los dos basta. El enlace `contacto.html?motivo=familiar` (o `ayudar`, `entidad`, `empleo`, `otro`) abre el formulario con ese motivo ya marcado.
- **Donaciones:** todavía no hay pasarela de pagos. El botón "Quiero aportar" explica cómo hacerlo por transferencia y lleva a los datos de la cuenta.
- **Fotos:** todas son marcadores. Solo se publican fotos de personas con autorización firmada (Ley 1581 de 2012).
- **Datos pendientes:** hay 67 (25 fotos y 42 datos). Se encuentran buscando `class="pendiente"` en los `.html`.

## Antes de publicar de verdad
1. Quitar `<meta name="robots" content="noindex, nofollow">` de cada página y cambiar `robots.txt`.
2. Cambiar la dirección `https://gaelserranoaven.github.io/Proyecto-FCF/` por el dominio definitivo. Aparece en las etiquetas `og:url` y `og:image` de cada página y en los datos estructurados de `index.html`. Sin ese cambio, la imagen al compartir por WhatsApp seguirá apuntando a GitHub.
3. Reemplazar los datos y las fotos pendientes por los confirmados.
4. Conectar los formularios y definir la pasarela de pagos.

## Accesibilidad
Contraste mínimo de 4,5:1 en todo el texto, áreas táctiles de 44 px, foco visible, navegación completa con teclado, un solo título principal por página y texto que escala hasta el 200 %. Responde a `prefers-reduced-motion`, `prefers-contrast` y `forced-colors`. Al imprimir o guardar como PDF se ven todas las secciones.

## Versiones
| Versión | Fecha | Qué cambió |
|---|---|---|
| 1.5 | 25 nov 2026 | Revisión completa: la página de personas mayores le habla a la comunidad y a las familias; accesos según quién visita; página Quiénes somos; botón Donar en el menú; donaciones y contacto rehechos; fuente alojada en el sitio; página 404 |
| 1.4 | 24 nov 2026 | Se quitó "Administración y finanzas"; pestañas con flecha animada; galería de jóvenes centrada en celular |
| 1.3 | 22 nov 2026 | Datos de las sedes confirmados |
| 1.2 | 22 nov 2026 | Auditoría de accesibilidad |
