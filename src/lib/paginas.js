// Paginación de los cuadros de diálogo: en pantallas estrechas el recuadro debe
// tener un tamaño fijo, así que las líneas largas se trocean en varias páginas
// aunque haya que pulsar más veces; en escritorio cabe entero y no se trocea.
const PRESUPUESTOS = [
  [420, 90],   // movil estrecho: ~3 filas de dialogo
  [700, 110],  // movil ancho o tablet pequena
];

export function presupuestoDialogo(ancho = typeof window !== 'undefined' ? window.innerWidth : 1200) {
  for (const [limite, caracteres] of PRESUPUESTOS) if (ancho < limite) return caracteres;
  return Infinity;
}

// Corta un texto por palabras en paginas de como mucho `presupuesto` caracteres.
// El recorte nunca parte una palabra, y URLs o correos largos quedan solos en su pagina.
export function paginasDeTexto(texto, presupuesto) {
  if (!Number.isFinite(presupuesto) || texto.length <= presupuesto) return [texto];
  const paginas = [];
  let actual = '';
  for (const palabra of texto.split(' ')) {
    if (palabra.length > presupuesto) {
      if (actual) { paginas.push(actual); actual = ''; }
      for (let i = 0; i < palabra.length; i += presupuesto) paginas.push(palabra.slice(i, i + presupuesto));
      continue;
    }
    if (actual && (actual.length + 1 + palabra.length) > presupuesto) { paginas.push(actual); actual = palabra; }
    else actual = actual ? `${actual} ${palabra}` : palabra;
  }
  if (actual) paginas.push(actual);
  return paginas.length ? paginas : [''];
}
