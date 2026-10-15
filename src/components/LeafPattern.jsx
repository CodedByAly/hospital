/**
 * Leaves and forks fanning out from the bottom, after the back cover of the printed menu.
 * Purely decorative.
 */
const LEAF = 'M0-60C26-36 26 36 0 60-26 36-26-36 0-60Z';
const FORK =
  'M-9-58v30c0 6 4 10 7 11V58h4V-17c3-1 7-5 7-11v-30h-3v26h-3v-26h-3v26h-2v-26h-3v26h-3v-26z';

const shapes = [
  { d: LEAF, x: 60, y: 300, r: -48, s: 1.1 },
  { d: LEAF, x: 150, y: 250, r: -22, s: 1.35 },
  { d: FORK, x: 230, y: 175, r: -4, s: 1.05 },
  { d: LEAF, x: 300, y: 240, r: 8, s: 1.5 },
  { d: LEAF, x: 395, y: 210, r: 30, s: 1.2 },
  { d: FORK, x: 470, y: 260, r: 52, s: 1 },
  { d: LEAF, x: 520, y: 330, r: 64, s: 1.1 },
  { d: LEAF, x: 210, y: 345, r: -10, s: 1.25 },
  { d: LEAF, x: 385, y: 355, r: 24, s: 1.3 },
  { d: LEAF, x: 15, y: 205, r: -70, s: 0.9 },
];

export default function LeafPattern({ className = '' }) {
  return (
    <svg className={`leaf-pattern ${className}`} viewBox="0 0 560 400" fill="currentColor" aria-hidden="true" focusable="false">
      {shapes.map((shape, i) => (
        <path key={i} d={shape.d} transform={`translate(${shape.x} ${shape.y}) rotate(${shape.r}) scale(${shape.s})`} />
      ))}
    </svg>
  );
}
