// Closed traffic lanes (x, z control points) for the AI tankers, kept clear of land.

export interface Lane {
  points: [number, number][]
  speed: number
  reverse?: boolean
  phase: number
}

function ellipse(cx: number, cz: number, rx: number, rz: number, n: number): [number, number][] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2
    return [cx + Math.cos(a) * rx, cz + Math.sin(a) * rz] as [number, number]
  })
}

export const LANES: Record<string, Lane> = {
  vlcc: { points: ellipse(240, 525, 380, 72, 10), speed: 3.0, phase: 0.62 },
  suezmax: {
    points: [[-560, -60], [-400, -360], [-260, -700], [80, -740], [90, -380], [100, -60], [-130, 100], [-430, -10]],
    speed: 3.6,
    phase: 0.1,
  },
  aframax: {
    points: [[260, 30], [560, -50], [770, 170], [640, 400], [380, 370], [250, 220]],
    speed: 4.0,
    reverse: true,
    phase: 0.45,
  },
  product: {
    points: [[-450, 160], [-300, 230], [-240, 400], [-330, 560], [-470, 520], [-480, 330]],
    speed: 4.4,
    phase: 0.3,
  },
  lng: {
    points: [[470, -240], [700, -300], [810, -510], [580, -610], [510, -450]],
    speed: 3.4,
    reverse: true,
    phase: 0.8,
  },
}
