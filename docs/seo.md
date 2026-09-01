# Arquitectura SEO territorial

## Rutas

La jerarquía pública se mantiene completa:

- `/municipios/{comunidad}/{provincia}/{municipio-codigo-ine}`
- `/abrir-negocio/{actividad}`
- `/abrir-negocio/{actividad}/{comunidad}/{provincia}/{municipio-codigo-ine}`

Las rutas existen independientemente de que sean indexables. Los slugs
municipales incluyen el código INE para resolver homónimos y los slugs antiguos
redirigen permanentemente al canonical.

## Política de indexabilidad

`seoIndexabilityForRoute` es la única fuente de decisión programática. Home,
páginas editoriales, recursos y hubs útiles son indexables. Las combinaciones
actividad + municipio permanecen accesibles con 200, canonical autocanónico y
`noindex,follow` mientras no tengan contenido local revisado.

No se usan mínimos de palabras ni una variable de entorno. Para indexar una
combinación debe añadirse una entrada editorial a `reviewedLocalSeoContent` con:

- aprobación explícita;
- fecha real de revisión;
- al menos un hecho local diferencial;
- al menos una fuente oficial territorial.

Una ruta `noindex` no debe bloquearse en `robots.txt`, porque el crawler necesita
leer la directiva.

## Canonical y datos estructurados

Todas las páginas tienen canonical autocanónico. Los municipios homónimos se
desambiguan con la provincia. Se usan `Organization`, `WebSite`, `WebPage`,
`Article` y `BreadcrumbList` solo cuando corresponden al contenido visible. El
schema no declara cobertura operativa.

## Sitemaps

`/sitemap.xml` es el único punto de entrada y contiene un índice de:

- `/sitemaps/static.xml`
- `/sitemaps/resources.xml`
- `/sitemaps/activities.xml`
- `/sitemaps/territorial-hubs.xml`

Los sitemaps de guías municipales se añaden y paginan al existir URLs locales
indexables. Solo incluyen URLs HTTPS, canónicas, 200 e indexables. `lastmod`
procede de contenido, catálogo o revisión real; no del despliegue. No se emiten
`changefreq` ni `priority`.

Los endpoints históricos `/sitemaps/{actividad}` siguen disponibles y aplican la
misma política.

## Ampliación del catálogo

Para una actividad nueva, añade la definición tipada, requisitos generales,
fuentes oficiales y fecha de revisión; después valida rutas, metadata y sitemap.
Para una ubicación, actualiza el catálogo mediante el script existente y revisa
la jerarquía/código INE. La presencia en el catálogo no autoriza por sí sola la
indexación de una guía actividad + municipio.
