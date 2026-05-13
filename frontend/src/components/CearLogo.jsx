/**
 * Logo CEAR
 * ViewBox 260×280. Elipse: cx=130, cy=116, rx=112, ry=100.
 * Puntos del arco inferior calculados exactamente sobre la elipse:
 *   y = 116 + 75%*100 = 191  →  x_offset = 112*sqrt(1-(75/100)²) = 74.1
 *   Left=(55.9, 191)  Right=(204.1, 191)
 */
export default function CearLogo({ size = 80, dark = false }) {
  const cx = 130, cy = 116;

  return (
    <svg
      width={size}
      height={size * (280 / 260)}
      viewBox="0 0 260 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Elipse exterior ── */}
      <ellipse cx={cx} cy={cy} rx="112" ry="100"
        fill="white" stroke="#1B3568" strokeWidth="5.5" />

      {/* ── CEAR ── */}
      <text
        x={cx} y="72"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="900"
        fontSize="38"
        letterSpacing="5"
        fill="#1B3568"
      >CEAR</text>

      {/* ── Línea divisora ── */}
      <line x1="38" y1="83" x2="222" y2="83"
        stroke="#1B3568" strokeWidth="1.5" />

      {/* ── Silueta Argentina — simple, pequeña, solo outline ── */}
      <g transform="translate(113, 90) scale(0.34)">
        <path
          d="M50,0 C66,4 82,16 84,32 C86,48 74,58 78,74
             C82,90 96,98 90,114 C84,130 70,134 66,150
             C62,166 70,176 62,190 C54,204 38,206 32,196
             C26,186 30,172 26,160 C22,148 10,142 12,128
             C14,114 28,108 26,94 C24,80 10,72 14,58
             C18,44 32,28 50,0Z"
          fill="none"
          stroke="#1B3568"
          strokeWidth="3"
          strokeOpacity="0.25"
        />
      </g>

      {/* ── "Cobertura Educativa" — arco inferior ──
           Puntos calculados sobre la elipse en y=191:
           x_offset = 112*sqrt(1-(75/100)²) = 74.1
           → L=(55.9,191) R=(204.1,191)
           sweep=1 (CW, left→right) → arco baja → texto queda por encima, dentro de la elipse
      ── */}
      <path id="arcBottom"
        d="M 56,191 A 112,100 0 0,1 204,191"
        fill="none" />
      <text
        fontFamily="Arial, sans-serif"
        fontWeight="600"
        fontSize="12"
        fill="#1B3568"
        letterSpacing="1"
      >
        <textPath href="#arcBottom" startOffset="50%" textAnchor="middle">
          Cobertura Educativa
        </textPath>
      </text>

      {/* ── "Asesores de Seguros" — debajo de la elipse ── */}
      <text
        x={cx} y="262"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="12.5"
        letterSpacing="2"
        fill={dark ? '#ffffff' : '#1B3568'}
      >Asesores de Seguros</text>
    </svg>
  );
}
