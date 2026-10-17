const FL: [number, number] = [150, 330];
const FR: [number, number] = [390, 400];
const BR: [number, number] = [530, 292];
const BL: [number, number] = [290, 222];

function mix(a: [number, number], b: [number, number], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export function HeroDrawing() {
  const alongX = Array.from({ length: 8 }, (_, i) => {
    const t = (i + 1) / 9;
    return [mix(FL, BL, t), mix(FR, BR, t)] as const;
  });
  const alongZ = Array.from({ length: 11 }, (_, i) => {
    const t = (i + 1) / 12;
    return [mix(FL, FR, t), mix(BL, BR, t)] as const;
  });
  const rise = 118;
  const tops = [FL, FR, BR, BL].map((point) => [point[0], point[1] - rise] as [number, number]);
  const peak: [number, number] = [(tops[0][0] + tops[2][0]) / 2, (tops[0][1] + tops[2][1]) / 2 - 78];

  return (
    <svg className="hero-drawing" viewBox="0 0 640 520" aria-hidden="true">
      <g className="iso">
        <ellipse className="shadow" cx="340" cy="430" rx="190" ry="28" />
        <polygon className="side" points={`${FL.join(',')} ${FR.join(',')} ${FR[0]},${FR[1] + 22} ${FL[0]},${FL[1] + 22}`} />
        <polygon className="side" points={`${FR.join(',')} ${BR.join(',')} ${BR[0]},${BR[1] + 22} ${FR[0]},${FR[1] + 22}`} />
        <polygon className="slab" points={`${FL.join(',')} ${FR.join(',')} ${BR.join(',')} ${BL.join(',')}`} />
        <g className="rebar">
          {alongX.map(([a, b], i) => (
            <line key={`x${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
          ))}
          {alongZ.map(([a, b], i) => (
            <line key={`z${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
          ))}
        </g>
        <g className="frame">
          {tops.map((top, i) => (
            <line key={`p${i}`} x1={[FL, FR, BR, BL][i][0]} y1={[FL, FR, BR, BL][i][1]} x2={top[0]} y2={top[1]} />
          ))}
          <polyline points={`${tops[0].join(',')} ${tops[1].join(',')} ${tops[2].join(',')} ${tops[3].join(',')} ${tops[0].join(',')}`} />
        </g>
        <g className="roofpoly">
          <polygon points={`${tops[0].join(',')} ${tops[1].join(',')} ${peak.join(',')}`} />
          <polygon points={`${tops[3].join(',')} ${tops[2].join(',')} ${peak.join(',')}`} />
        </g>
      </g>
    </svg>
  );
}
