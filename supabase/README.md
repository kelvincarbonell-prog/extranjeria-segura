# Base de datos — Extranjería Segura

## Aplicar el esquema

```bash
supabase link --project-ref <project-ref>
supabase db push
```

O, si trabajas en local:

```bash
supabase start
supabase db reset
```

## Orden de las migraciones

| Archivo | Qué hace |
| --- | --- |
| `20260905000100_schema.sql` | Tipos, tablas, índices y restricciones. |
| `20260905000200_rls.sql` | Funciones de acceso y todas las políticas RLS. |
| `20260905000300_triggers_storage.sql` | `updated_at`, auditoría, caducidades, buckets privados. |

## Principios que no se negocian

1. **Ninguna tabla sin RLS.** Las tablas más sensibles (`cases`, `documents`,
   `messages`, `audit_logs`) además llevan `FORCE ROW LEVEL SECURITY`, de modo
   que ni siquiera el propietario de la tabla las lee sin política.

2. **Un único predicado de acceso.** Todo pasa por `has_case_access()`. Si hay
   que cambiar quién ve qué, se cambia en un sitio.

3. **El perfil comercial no ve documentación migratoria.**
   `has_document_access()` lo excluye explícitamente, aunque haya originado el
   lead.

4. **Nada de buckets públicos.** No existe ninguno en el proyecto, así que un
   documento no puede hacerse público por error. El acceso es siempre por URL
   firmada de 60 segundos.

5. **Los objetos son inmutables.** Una versión nueva es un objeto nuevo. Así el
   historial documental es auditable y nadie puede sustituir un documento en
   silencio.

6. **El registro de consentimiento y el de auditoría no se actualizan ni se
   borran.** Retirar un consentimiento escribe una fila nueva. Son prueba, no
   estado.

7. **Un cliente nunca puede marcar su propio documento como validado.** La
   política lo limita a `pendiente` y `subido`; el veredicto lo firma un
   abogado colegiado y queda en `document_reviews`, que es append-only.

## Tareas programadas pendientes de conectar

- `public.expire_documents()` — marca como caducados los documentos cuya fecha
  de validez ha pasado. Ejecutar a diario vía `pg_cron` o una edge function.
- Borrado por retención — eliminar objetos y filas cuyo periodo de retención
  (`document_types.retention_days` desde el cierre del expediente) haya
  vencido. Requiere service role y debe quedar registrado en `audit_logs`.
