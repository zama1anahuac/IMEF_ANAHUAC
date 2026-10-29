# IMEF Research Explorer | Yucatán

**Plataforma académica conceptual de exploración de investigaciones IMEF–Universidad**. No es un producto oficial del IMEF ni supone colaboración formal, financiamiento, consentimiento, acceso a datos confidenciales o compromiso de ninguna institución.

## 1. Qué contiene

El archivo original, con corte documental del **28 de octubre de 2026**, contiene:

| Elemento | Total verificado |
| --- | ---: |
| Temas | 20 |
| Problemas | 20 |
| Sectores y poblaciones | 20 |
| Combinaciones evaluadas | 8,000 |
| Investigaciones aprobadas | 5,270 |
| Combinaciones descartadas | 2,730 |
| Propuestas destacadas en la hoja PRIORITARIAS | 60 |
| Prioridad A (índice ≥90) | 809 |
| Prioridad B (80–89) | 1,798 |
| Prioridad C (67–79) | 2,663 |

No se han reescrito ni generado títulos adicionales. Las fichas recuperan el texto exacto de `PROPUESTAS`.

## 2. Estructura del proyecto

```text
IMEF-Research-Explorer/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── app.js           # Navegación, vistas, eventos, rankings y exportación
│   ├── excel-loader.js  # Lee XLSX; valida hojas, encabezados y duplicados
│   ├── explorer.js      # Explorador guiado, fichas y búsqueda por sectores
│   ├── filters.js       # Búsqueda avanzada y filtros dependientes
│   ├── scoring.js       # Escalas originales y cálculos orientativos
│   ├── charts.js        # Barras, matriz y red interactiva
│   └── favorites.js     # Almacenamiento local de favoritos
├── data/
│   └── IMEF_Yucatan_Megabase.xlsx
├── assets/icons/
│   └── favicon.svg
└── vendor/
    ├── jszip.min.js
    └── JSZIP-LICENSE.md
```

Toda la aplicación usa rutas relativas, funciona sin base de datos, sin servidor propio, sin API key, sin cuentas y **sin bibliotecas externas cargadas por internet**. Incluye una copia local de JSZip, bajo su licencia correspondiente.

## 3. Publicar gratis en GitHub Pages

1. Ingresa a [github.com](https://github.com) y crea un repositorio público, por ejemplo, `IMEF-Research-Explorer`.
2. En el repositorio elige **Add file → Upload files**.
3. Abre el ZIP y **sube el contenido de la carpeta `IMEF-Research-Explorer`** a la raíz del repositorio, conservando las subcarpetas. Es importante que `index.html` quede en la raíz, no dentro de otra carpeta anidada.
4. Confirma los cambios con **Commit changes**.
5. Abre **Settings → Pages** y, en **Build and deployment**, selecciona `Deploy from a branch`.
6. Elige la rama `main` y la carpeta `/ (root)`. Guarda los cambios.
7. Abre la dirección indicada en GitHub Pages. Habitualmente tiene la forma `https://USUARIO.github.io/IMEF-Research-Explorer/` (sustituye usuario y repositorio por los reales).

Si aparece **404**, verifica la rama, `index.html` en la raíz y el enlace del repositorio. La publicación puede tardar algunos instantes después de hacer commit.

### Vista previa local

Debido a las restricciones del navegador para `fetch()` bajo `file://`, **no es recomendable abrir `index.html` con doble clic**. Usa GitHub Pages o un servidor local, por ejemplo:

```bash
cd IMEF-Research-Explorer
python3 -m http.server 8000
```

Después abre `http://localhost:8000/` en el navegador. Python se utiliza **solo para la vista previa** y no es necesario para GitHub Pages.

## 4. Cómo usar la plataforma

**Recorrido principal:** `Inicio → Exploremos → Tema → Problema compatible → Sector compatible → Ficha`.

- **Exploremos:** permite seleccionar cualquiera de los 20 temas, después problemas con al menos un cruce aprobado y, por último, los sectores compatibles. La ficha devuelve el título exacto y las valoraciones disponibles.
- **Los más viables:** muestra las propuestas con índice ≥90, con opciones Top 10, 25, 50 o todas las de prioridad muy alta.
- **Los menos viables:** diferencia las propuestas aprobadas de menor prioridad de las combinaciones rechazadas; muestra las razones de descarte y permite abrir alternativas aprobadas.
- **Relevancia institucional:** compara tres perspectivas (Yucatán, universidad e IMEF), diferenciando indicadores ponderados de descripciones sin puntuación independiente.
- **Buscador:** permite buscar por título, folio, indicador, tema, problema, sector, prioridad y aportación IMEF. Incluye resultados paginados.
- **Matriz:** compara los 20 temas con los 20 problemas (400 celdas). El número en cada celda es el total real de sectores aprobados para la pareja; al tocar una celda se pueden explorar sus investigaciones.
- **Mapa de relaciones:** visualiza vínculos del tema elegido con sus problemas y sectores más recurrentes; los nodos abren investigaciones relacionadas.
- **Explorar por sectores:** recorre `sector → problema → tema → ficha`.
- **Comparador:** añade entre 2 y 4 investigaciones y confronta índices, coherencia, metodología, indicadores y aportación IMEF.
- **Favoritos:** guarda folios en `localStorage` de ese navegador (no se sincronizan entre dispositivos).
- **Sorpréndeme:** abre al azar una investigación aprobada con índice ≥90.
- **Ficha:** puedes copiar el título, guardar favorito, comparar o descargar un archivo **HTML autocontenido** que se abre e imprime desde el navegador.

## 5. Actualizar el Excel

### Opción A1: reemplazar la versión publicada

1. Conserva las hojas `PROPUESTAS`, `DESCARTADAS`, `20 TEMAS`, `20 PROBLEMAS`, `20 SECTORES` y, preferentemente, `MATRICES`, `METODOLOGIA`, `PRIORITARIAS` y `FUENTES`.
2. Conserva sus encabezados originales. El sistema identifica columnas **por encabezado**, no únicamente por posición.
3. Reemplaza en GitHub **`data/IMEF_Yucatan_Megabase.xlsx`** con el archivo actualizado, manteniendo exactamente ese nombre. Realiza un commit.
4. Recarga la plataforma publicada. El navegador **vuelve a leer directamente el Excel publicado** (no existe un JSON estático que se quede desactualizado).

### Opción B: actualización temporal desde la interfaz

Haz clic en **Actualizar Excel**, selecciona un archivo `.xlsx` válido y la página lo interpretará directamente en el navegador. Esta actualización **no modifica el repositorio GitHub, no se sube a un servidor y se pierde al recargar la página**. Para hacerla permanente, sigue la opción A.

### Validaciones

- Verificación de hojas y encabezados requeridos.
- Exclusión de filas sin campos indispensables.
- Detección de folios o combinaciones duplicadas.
- Avisos si las cantidades no coinciden con las originales o el universo evaluado está incompleto.
- Los datos cargados se muestran con sus totales reales; nunca se fuerzan las 5,270 propuestas si se importa una versión distinta.
- La matriz de coherencia, cuando está disponible, se extrae de `MATRICES`.

El lector está optimizado para el formato del Excel adjunto. No se garantiza compatibilidad con cualquier plantilla de Excel arbitraria ni con archivos `.xls` antiguos. Si una importación no funciona, revisa nombres de hojas, encabezados y estructura antes de reintentar.

## 6. Cómo se evalúa la viabilidad

Según la hoja `METODOLOGIA`, se valoran tres relaciones:

- **T–P:** tema y problema.
- **T–S:** tema y sector.
- **P–S:** problema y sector.

Cada una se valora con `0` (insuficiente), `2` (defendible) o `3` (directa).

El índice original (sobre 100) es:

```text
REDONDEAR(
  0.88 * ((4*T-P + 3*T-S + 3*P-S) / 30 * 100)
  + 1.5 * relevancia_base_del_problema
  + 1.5 * peso_territorial_del_sector
)
```

**Solo se aprueba** un cruce si las tres relaciones son mayores que cero **y** el índice es de al menos 67. Las prioridades A, B y C se clasifican como `90–100`, `80–89` y `67–79`, respectivamente.

La plataforma presenta tres indicadores numéricos claramente identificados:

1. **Índice de prioridad editorial:** copiado del Excel, sin modificación.
2. **Coherencia temática ponderada:** derivada de las relaciones T–P, T–S y P–S mediante `(4*T-P + 3*T-S + 3*P-S)/30*100`.
3. **Pertinencia territorial orientativa:** `(relevancia del problema + peso sectorial)/6*100`, redondeado. **No equivale a impacto demostrado**.

No hay en el Excel calificaciones cuantitativas independientes de **facilidad académica, apoyo efectivo del IMEF ni beneficio institucional**. La aplicación muestra método, indicador y aportación potencial de forma descriptiva. En las ordenaciones de “universidad” e “IMEF”, se favorece la presencia de estos datos y se desempata por el índice editorial. **No se inventan probabilidades de éxito** ni acuerdos entre instituciones.

## 7. Precauciones y limitaciones

- Los títulos son **hipótesis o preguntas de investigación**, no pruebas de un problema ya detectado.
- El cumplimiento de la regla editorial no garantiza acceso a empresas, participantes, estados financieros privados ni recursos.
- Es necesario definir muestra, periodo, instrumento, consentimiento, privacidad y verificabilidad de datos antes de ejecutar un estudio.
- Las 20 categorías de sectores pueden superponerse entre sí; no son estratos estadísticos exhaustivos.
- Los datos son públicos en cualquier repositorio **público** de GitHub. **No subas información privada de empresas ni datos personales**.
- La red de relaciones muestra hasta ocho problemas y ocho sectores por tema para no saturar la vista; las búsquedas conservan el universo completo.
- El descargable de fichas se entrega en HTML e incorpora texto y métricas documentales; desde el navegador se puede imprimir como PDF.

## 8. Problemas comunes

| Problema | Solución |
| --- | --- |
| Pantalla con error de carga | Comprueba que `data/IMEF_Yucatan_Megabase.xlsx` esté publicado y respete mayúsculas, espacios y extensión. |
| GitHub Pages devuelve 404 | Comprueba `index.html` en la raíz, Settings → Pages y la rama configurada. |
| Abrir con doble clic no carga | Usa GitHub Pages o el servidor local explicado arriba. |
| La actualización no persiste | La carga del navegador es temporal; reemplaza el Excel en el repositorio para hacerla permanente. |
| La búsqueda no devuelve proyectos | Limpia filtros y revisa si la combinación existe en `PROPUESTAS`. |
| Mis favoritos desaparecieron | Los favoritos se guardan en el almacenamiento local del mismo navegador; incógnito o limpieza del almacenamiento puede eliminarlos. |
| Otra plantilla no se importa | Comprueba las hojas y encabezados especificados en el apartado 5. |

## 9. Pruebas realizadas

Comprobaciones automáticas con Chromium en modo headless, inyectando los archivos y el Excel en una página de prueba, sin conexión a servicios externos:

- 5,270 registros aprobados, 2,730 descartados, 20+20+20 catálogos, 400 relaciones T–P.
- 60 folios destacados detectados desde `PRIORITARIAS`.
- 8,000 cruces conformes a la regla de aceptación/rechazo; ausencia de errores de validación del Excel original.
- Recorrido de exploración, ficha, rankings, descarte con alternativas, filtros dependientes, matriz, mapa, sectores, favoritos, comparador y sección metodológica.
- Vista móvil con ancho de 390 píxeles sin desbordamiento horizontal.

Estas pruebas **no son equivalentes a una publicación real en una cuenta GitHub**. Después de publicarla, confirma que GitHub Pages sirve el Excel y los archivos JavaScript con las rutas relativas indicadas.

---

Desarrollo académico para explorar opciones de investigación en Yucatán; no herramienta institucional oficial.
