import { createClient } from "./server";

/**
 * Document access helpers.
 *
 * The only way a document ever reaches a browser is through a short-lived
 * signed URL minted here. There is no public bucket, no permanent link and no
 * path that a client could guess. If this module is bypassed, RLS on
 * storage.objects still refuses the read — this is convenience, not the
 * security boundary.
 */

/** Signed URLs live for one minute. Long enough to open, short enough to leak harmlessly. */
const SIGNED_URL_TTL_SECONDS = 60;

const BUCKET = "case-documents";

export function documentObjectKey(caseId: string, documentId: string, version: number, filename: string) {
  // cases/<case_id>/<document_id>/<version>-<filename>
  // The case id is the second segment so the storage policy can extract it
  // with a single split_part, matching supabase/migrations.
  const safe = filename
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9._-]/g, "-")
    .slice(0, 120);
  return `cases/${caseId}/${documentId}/${version}-${safe}`;
}

/** Mints a short-lived signed URL and records the download in the audit trail. */
export async function getSignedDocumentUrl(storagePath: string, caseId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);

  if (error || !data) {
    throw new Error("No se ha podido generar el enlace de descarga.");
  }

  // Reads of case documents are auditable events, not silent operations.
  await supabase.from("case_events").insert({
    case_id: caseId,
    kind: "document_download",
    title: "Se ha descargado un documento del expediente",
    client_visible: false,
    metadata: { storage_path: storagePath },
  });

  return data.signedUrl;
}

/** Uploads a new document version. Objects are immutable: a new version is a new object. */
export async function uploadDocumentVersion(params: {
  caseId: string;
  documentId: string;
  version: number;
  file: File;
}) {
  const supabase = await createClient();
  const key = documentObjectKey(params.caseId, params.documentId, params.version, params.file.name);

  const { error } = await supabase.storage.from(BUCKET).upload(key, params.file, {
    upsert: false,
    contentType: params.file.type,
  });

  if (error) throw new Error("No se ha podido subir el documento.");

  // The client can move a document to `subido` and no further — the database
  // policy enforces that a client can never mark their own document validated.
  const { error: updateError } = await supabase
    .from("documents")
    .update({
      storage_path: key,
      state: "subido",
      mime_type: params.file.type,
      size_bytes: params.file.size,
      version: params.version,
      uploaded_at: new Date().toISOString(),
      issue_title: null,
      issue_detail: null,
    })
    .eq("id", params.documentId);

  if (updateError) throw new Error("No se ha podido registrar el documento.");

  return key;
}
