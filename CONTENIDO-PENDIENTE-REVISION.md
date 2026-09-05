# Contenido pendiente de revisión y configuración

Este archivo es la lista de todo lo que **debe completarse o validarse antes de
publicar en producción**. Está aquí, y no en un correo, porque es parte del
producto: la plataforma está construida para no mostrar nunca un dato inventado,
y eso significa que hay huecos deliberados que alguien tiene que rellenar.

Nada de lo que sigue es un descuido. Es una decisión.

---

## 1. Revisión jurídica obligatoria

### 1.1 Contenido de los trámites

Los 25 trámites de `src/content/tramites.ts` llevan `pendingLegalReview: true`.
La interfaz muestra el aviso **«Pendiente de firma jurídica»** en cada ficha
mientras esa marca siga activa.

El profesional responsable debe, para cada trámite:

- [ ] Verificar requisitos, plazos y documentación contra la normativa vigente
      (LO 4/2000, RD 1155/2024, Ley 14/2013, Código Civil según corresponda).
- [ ] Confirmar que las fuentes oficiales citadas son las correctas.
- [ ] Poner `pendingLegalReview: false` y actualizar `updatedAt`.

Mientras `pendingLegalReview` sea `true`, la ficha se publica igualmente pero
identificada como pendiente. Es preferible a publicarla como definitiva.

### 1.2 Textos legales

Los cinco documentos de `src/content/legal.ts` son **plantillas**, no textos
legales. Cada página muestra un banner permanente y no se indexa
(`robots: noindex`) hasta que `reviewed: true`.

| Documento | Qué falta |
| --- | --- |
| Aviso legal | Razón social, NIF, domicilio, datos registrales, colegio y nº de colegiado |
| Política de privacidad | Responsable, encargados reales, plazos de conservación, base jurídica del art. 10 RGPD para antecedentes penales, valoración de EIPD |
| Política de cookies | Auditoría real de cookies antes de publicar |
| Condiciones de contratación | Desistimiento, reembolsos, resolución alternativa de litigios |
| Protección de datos | Registro de actividades (art. 30), procedimiento de brechas en 72 h |

Los huecos aparecen resaltados en amarillo en la propia página con el formato
`[[PLACEHOLDER]]`, de modo que ninguno pueda pasar inadvertido.

### 1.3 Revisor

`src/content/site.ts` → `review.reviewer` está en `null`. Mientras lo esté, la
autoría de la revisión se atribuye a la organización
(«Equipo jurídico de Extranjería Segura»), no a una persona inventada. Al
asignar un profesional colegiado, rellenar `name`, `role` y `barId`.

---

## 2. Datos de negocio sin configurar

Todos en `src/content/site.ts`. Están en `null` **a propósito** y la interfaz
muestra el estado vacío honesto en lugar de una cifra plausible.

- [ ] `legalName`, `nif`
- [ ] `contact.email`, `contact.phone`, `contact.address`
- [ ] `metrics.casesManaged`, `avgResponseHours`, `googleRating`,
      `googleReviewCount`, `nationalitiesServed`

> **Regla del proyecto:** una métrica solo se publica si puede evidenciarse
> cuando un cliente, un competidor o el colegio la pidan. No hay «tasa de éxito
> del 87 %» en ninguna parte del código, y no debe añadirse sin un modelo
> estadístico detrás.

---

## 3. Reseñas

`src/content/reviews.ts` está vacío a propósito. `<SocialProof/>` cambia sola de
la política de verificación a la parrilla de reseñas en cuanto haya entradas.

Para publicar una reseña son obligatorios todos los campos, incluido
`sourceUrl`, que debe resolver a un sitio donde cualquiera pueda leerla. **Si no
hay `sourceUrl`, la reseña no se publica.**

Alternativa: conectar `NEXT_PUBLIC_GOOGLE_PLACE_ID` y la Google Places API.

---

## 4. Datos que caducan

| Dato | Dónde | Cuándo revisar |
| --- | --- | --- |
| IPREM | `src/content/calculators.ts` → `IPREM.monthlyCents`, `IPREM.year` | Cada año, con la Ley de Presupuestos |
| Multiplicadores de medios económicos | `IPREM.routes` | Al cambiar la normativa de cada vía |
| Ventana de renovación (60 días antes / 90 después) | `renewalWindow()` | Al cambiar el reglamento |
| Plazos de nacionalidad | `NATIONALITY_TRACKS` | Al cambiar el Código Civil |
| Rutas de apostilla por país | `src/content/geo.ts` | Al incorporarse países al Convenio de La Haya |

La calculadora de medios económicos muestra el año del IPREM en pantalla, de
modo que un valor desactualizado sea visible en vez de silenciosamente erróneo.

---

## 5. Integraciones construidas pero no activadas

Cada una tiene su `feature flag` en `site.features` y la interfaz **dice en
pantalla** que no está activa. No hay ninguna simulada como si funcionase.

| Integración | Estado | Qué falta |
| --- | --- | --- |
| Supabase (auth, BD, storage) | Esquema y políticas completos | Variables de entorno y `supabase db push` |
| Stripe | Modelo de datos y claves de producto listos | Claves, productos y webhook |
| Resend | — | Clave y plantillas |
| Revisión documental automática | Interfaz y estados listos | Proveedor de OCR + contrato de encargo |
| Videollamada y calendario | Interfaz lista | Proveedor + contrato de encargo |
| Firma electrónica | Arquitectura prevista | Proveedor |

Al activar cualquiera que trate datos personales, **añadir el encargado de
tratamiento a la política de privacidad antes de ponerlo en producción**.

---

## 6. Tareas programadas por conectar

- [ ] `public.expire_documents()` — a diario, vía `pg_cron` o edge function.
- [ ] Borrado por retención — según `document_types.retention_days` desde el
      cierre del expediente. Requiere service role y debe registrarse en
      `audit_logs`.
- [ ] Automatizaciones de aviso (documento pendiente, caducidad próxima,
      requerimiento recibido). Las reglas están definidas en `/admin`; falta el
      proveedor de envío.

---

## 7. Contenido editorial

`/recursos` no publica artículos porque no hay ninguno revisado. La sección está
construida y conectada al modelo de datos (`public.articles`), y la restricción
`articles_publish_requires_review` impide a nivel de base de datos publicar un
artículo sin revisor y fecha de revisión.

Cualquier artículo futuro debe cumplir el criterio editorial publicado en esa
misma página: revisado por un profesional, con fuentes oficiales enlazadas, con
fecha de última revisión y sin promesas de resultado.

---

## 8. Idiomas

`src/content/site.ts` → `locales`. Solo español está marcado `ready: true`. Los
otros siete aparecen como «próximamente» y **no se sirven**.

`ready` significa «el contenido jurídico existe y está revisado en este
idioma», no «el selector lo lista». Hoy solo el español lo cumple.

Motivo: un requisito de extranjería mal traducido no es un fallo estético.
Cuando se traduzca cada idioma, el contenido jurídico debe revisarse en ese
idioma antes de poner `ready: true`.
