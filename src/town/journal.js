// Diario de misiones: visitar los cinco edificios y conseguir el CV del cofre.
// Se guarda en el navegador para que el progreso no se pierda al recargar.
import { BUILDINGS } from './map.js';

const KEY = 'pueblo-diario';

export const OBJECTIVES = [...BUILDINGS.map((b) => b.id), 'cv'];
// El gato de Mi casa es un extra: se recuerda junto al diario pero no cuenta
// para completar la partida (igual que la cueva, que va aparte).
const KNOWN = [...OBJECTIVES, 'gato'];

export function loadJournal() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '{}');
    return { done: KNOWN.filter((id) => raw.done?.includes(id)), ended: Boolean(raw.ended) };
  } catch {
    return { done: [], ended: false };
  }
}

export function saveJournal(journal) {
  try { localStorage.setItem(KEY, JSON.stringify(journal)); } catch { /* sin almacenamiento */ }
}

export const isComplete = (journal) => OBJECTIVES.every((id) => journal.done.includes(id));

// Estado del pueblo que también se recuerda entre visitas: si ya se tiró de la palanca.
const WORLD_KEY = 'pueblo-mundo';

export function loadWorld() {
  try { return { bridge: Boolean(JSON.parse(localStorage.getItem(WORLD_KEY) ?? '{}').bridge) }; } catch { return { bridge: false }; }
}

export function saveWorld(state) {
  try { localStorage.setItem(WORLD_KEY, JSON.stringify(state)); } catch { /* sin almacenamiento */ }
}
