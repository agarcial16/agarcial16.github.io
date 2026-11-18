// Miniatura de proyecto con marco de cartucho. Usa una captura real si existe;
// si no, una portada pixel art propia dibujada en SVG.

const stepTriangle = (x, y, h, color) =>
  Array.from({ length: h }, (_, i) => {
    const w = Math.min(i + 1, h - i);
    return <rect key={i} x={x} y={y + i} width={w} height="1" fill={color} />;
  });

function StreamingArt() {
  return (
    <svg viewBox="0 0 48 27" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="48" height="27" fill="#101848" />
      <rect x="10" y="3" width="28" height="18" fill="#eef1ff" />
      <rect x="12" y="5" width="24" height="14" fill="#2c3fb8" />
      <rect x="12" y="5" width="24" height="3" fill="#3a50d6" />
      <rect x="12" y="16" width="24" height="3" fill="#22318f" />
      {stepTriangle(21, 7, 10, '#ffd866')}
      <rect x="20" y="21" width="8" height="2" fill="#b3bce9" />
      <rect x="16" y="23" width="16" height="1" fill="#b3bce9" />
      {[4, 41].map((x) => [0, 1, 2].map((i) => <rect key={`${x}-${i}`} x={x} y={8 + i * 4} width="3" height="2" fill="#86f5a6" opacity={1 - i * 0.3} />))}
    </svg>
  );
}

function QuantumArt() {
  const wires = [7, 13, 19];
  return (
    <svg viewBox="0 0 48 27" shapeRendering="crispEdges" aria-hidden="true">
      <rect width="48" height="27" fill="#101848" />
      {wires.map((y) => <rect key={y} x="4" y={y} width="40" height="1" fill="#b3bce9" />)}
      {[['H', 10, 7], ['X', 30, 19], ['H', 36, 13]].map(([t, x, y]) => (
        <g key={`${t}${x}`}>
          <rect x={x - 3} y={y - 3} width="7" height="7" fill="#eef1ff" />
          <rect x={x - 2} y={y - 2} width="5" height="5" fill="#3446c2" />
          <text x={x + 0.5} y={y + 2} fontSize="5" textAnchor="middle" fill="#ffd866" fontFamily="'Press Start 2P', monospace">{t}</text>
        </g>
      ))}
      <rect x="20" y="7" width="1" height="13" fill="#ffd866" />
      <rect x="19" y="6" width="3" height="3" fill="#ffd866" />
      <rect x="18" y="17" width="5" height="5" fill="#ffd866" />
      <rect x="20" y="18" width="1" height="3" fill="#101848" />
      <rect x="19" y="19" width="3" height="1" fill="#101848" />
      {wires.map((y, i) => <rect key={`m${y}`} x="42" y={y - 1} width="3" height="3" fill="#86f5a6" opacity={1 - i * 0.25} />)}
    </svg>
  );
}

const ART = { streaming: StreamingArt, quantum: QuantumArt };

export default function ProjectCover({ thumb, art, name }) {
  const Art = ART[art];
  return (
    <figure className="cover">
      {thumb ? <img src={thumb} alt={`Captura de ${name}`} loading="lazy" /> : Art ? <Art /> : null}
    </figure>
  );
}
