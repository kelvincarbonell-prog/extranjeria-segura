"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";

/**
 * EXPORTAR LA LISTA A CSV.
 *
 * El botón existía y no hacía nada: un `<Button>` sin `onClick` en la
 * cabecera de la pantalla más usada del panel. Un botón falso es peor que
 * ninguno, porque enseña a desconfiar de los que sí funcionan.
 *
 * Ahora descarga exactamente lo que se ve —las filas ya recortadas al rol en
 * el servidor, en el mismo orden— y nada más. No hay petición nueva: si el
 * CSV pudiera traer expedientes que la pantalla no enseña, el botón sería una
 * puerta de atrás del modelo de permisos.
 *
 * Dos decisiones de formato, las dos por Excel en español:
 *
 *  · Separador `;`. Con la configuración regional española, Excel usa la coma
 *    como separador decimal y espera punto y coma entre columnas. Con comas,
 *    el archivo se abre con todo metido en la columna A.
 *  · BOM UTF-8 al principio. Sin él, Excel lo lee como Windows-1252 y
 *    «Nómada», «Ibrahim K.» en árabe o cualquier tilde salen rotas.
 */
export function ExportarCSV({
  cabecera,
  filas,
  nombre,
}: {
  cabecera: string[];
  filas: (string | number)[][];
  /** Nombre del archivo sin extensión. */
  nombre: string;
}) {
  const [hecho, setHecho] = React.useState(false);

  const descargar = () => {
    const celda = (v: string | number) => {
      // Los números van tal cual. La primera versión pasaba todo por la
      // protección de fórmulas y un plazo vencido —«-1» días— salía como
      // «'-1»: texto, imposible de ordenar o sumar en la hoja.
      if (typeof v === "number") return String(v);
      const t = v;
      // Comillas si hace falta, y las comillas internas dobladas (RFC 4180).
      // El `=`, `+`, `-` y `@` iniciales se neutralizan: una celda que empieza
      // así Excel la ejecuta como fórmula, y el nombre de un cliente no debe
      // poder ejecutar nada en el ordenador de quien abre el archivo.
      const segura = /^[=+\-@]/.test(t) ? `'${t}` : t;
      return /[";\n\r]/.test(segura) ? `"${segura.replace(/"/g, '""')}"` : segura;
    };
    const texto = [cabecera, ...filas].map((f) => f.map(celda).join(";")).join("\r\n");
    const blob = new Blob(["﻿" + texto], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nombre}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setHecho(true);
    window.setTimeout(() => setHecho(false), 2200);
  };

  return (
    <Button size="sm" variant="secondary" onClick={descargar} disabled={filas.length === 0}>
      <span aria-live="polite">{hecho ? "Descargado" : "Exportar CSV"}</span>
    </Button>
  );
}
