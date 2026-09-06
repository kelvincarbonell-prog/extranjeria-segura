import * as React from "react";

/**
 * Énfasis dentro de una cadena traducida.
 *
 * Los avisos de límite del diagnóstico —«no es asesoramiento jurídico», «esto
 * es orientación preliminar, no validación profesional»— llevan dos o tres
 * palabras en negrita, y son justo las palabras que no se pueden perder.
 *
 * La alternativa era partir cada frase en tres cadenas —antes, negrita,
 * después— y eso rompe la traducción: en árabe y en chino el orden de esas
 * partes no es el mismo que en español, y un traductor que recibe fragmentos
 * sueltos no puede recomponer la frase. La cadena viaja entera con su marca, y
 * el orden lo decide quien traduce.
 *
 * Solo `**negrita**`. No es un renderizador de Markdown ni pretende serlo:
 * cuanto menos entienda, menos formas hay de que una cadena traducida acabe
 * inyectando algo que no era texto.
 */
export function Enfasis({ texto, className }: { texto: string; className?: string }) {
  const partes = texto.split(/\*\*(.+?)\*\*/g);

  return (
    <span className={className}>
      {partes.map((parte, i) =>
        // Los índices impares son lo que iba entre asteriscos.
        i % 2 === 1 ? (
          <strong key={i} className="text-ink-700 font-semibold">
            {parte}
          </strong>
        ) : (
          <React.Fragment key={i}>{parte}</React.Fragment>
        ),
      )}
    </span>
  );
}
