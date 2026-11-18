// Diario de misiones: visitar los cinco edificios y conseguir el CV del cofre.
// Se guarda en el navegador para que el progreso no se pierda al recargar.
import { BUILDINGS } from './map.js';

const KEY = 'pueblo-diario';

export const OBJECTIVES = [...BUILDINGS.map((b) => b.id), 'cv'];

export function loadJournal() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return { done: OBJECTIVES.filter((id) => raw.done?.includes(id)), ended: Boolean(raw.ended) };
  } catch {
    return { done: [], ended: false };
  }
}

export function saveJournal(journal) {
  try { localStorage.setItem(KEY, JSON.stringify(journal)); } catch { /* sin almacenamiento */ }
}

export const isComplete = (journal) => OBJECTIVES.every((id) => journal.done.includes(id));
