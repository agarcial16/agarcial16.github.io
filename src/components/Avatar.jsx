// Avatar provisional: silueta pixel art de 16×16. Se sustituirá por el sprite definitivo.
const ROWS = [
  '......####......',
  '....########....',
  '...##########...',
  '...##########...',
  '...##.####.##...',
  '...##########...',
  '....########....',
  '.....######.....',
  '......####......',
  '...##########...',
  '..############..',
  '.##############.',
  '.##############.',
  '.##############.',
  '.##############.',
  '.##############.',
];

export default function Avatar({ size = 128 }) {
  return (
    <svg className="avatar" width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" role="img" aria-label="Avatar provisional">
      {ROWS.flatMap((row, y) =>
        [...row].map((c, x) => (c === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)),
      )}
      <text x="8" y="14.2" textAnchor="middle" fontSize="5" className="avatar-q">?</text>
    </svg>
  );
}
