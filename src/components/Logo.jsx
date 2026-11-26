// Logo de Complex en versión pixel JRPG (16×16, el mismo del kit de marca):
// la "C" en niebla y el rombo/enchufe en azul de las ventanas del juego.
// El rombo arranca en gris acero y se enciende con un parpadeo en oleada
// (cada pixel con su pequeño retardo) hasta quedar en azul.
const GRID = [
  '.......cc.......',
  '......cccc......',
  '.....cccc.......',
  '....cccc..p.....',
  '...cccc..ppp....',
  '..cccc..ppppp...',
  '.cccc..ppppppp..',
  'cccc..ppppppppp.',
  'cccc..ppppppppp.',
  '.cccc..ppppppp..',
  '..cccc..ppppp...',
  '...cccc..ppp....',
  '....cccc..p.....',
  '.....cccc.......',
  '......cccc......',
  '.......cc.......',
];
const FILL = { c: '#eef1ff', p: '#7d7d7d' };

export default function Logo({ size = 64, className = '' }) {
  const pixels = [];
  GRID.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch === '.') return;
    const esRombo = ch === 'p';
    pixels.push(
      <rect
        key={`${x}-${y}`}
        x={x}
        y={y}
        width={1}
        height={1}
        fill={FILL[ch]}
        className={esRombo ? 'brand-p' : undefined}
        style={esRombo ? { animationDelay: `${(x * 16 + y * 5)}ms` } : undefined}
      />,
    );
  }));
  return (
    <svg
      className={`brand-pixel ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Complex"
    >
      {pixels}
    </svg>
  );
}
