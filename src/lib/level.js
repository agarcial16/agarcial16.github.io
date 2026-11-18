import { BIRTHDATE } from '../data/cv.js';

// Nivel = edad. La barra de EXP avanza hacia el próximo cumpleaños.
export function getLevel(now = new Date()) {
  const birth = new Date(BIRTHDATE + 'T00:00:00');
  let level = now.getFullYear() - birth.getFullYear();
  const thisYearBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  if (now < thisYearBirthday) level -= 1;
  const last = new Date(birth.getFullYear() + level, birth.getMonth(), birth.getDate());
  const next = new Date(birth.getFullYear() + level + 1, birth.getMonth(), birth.getDate());
  const progress = (now - last) / (next - last);
  const daysLeft = Math.ceil((next - now) / 86_400_000);
  return { level, progress, daysLeft };
}
