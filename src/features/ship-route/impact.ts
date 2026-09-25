// Vessel data and a rough, benchmark-driven model of what a collision would do to the sea.
// Figures are illustrative estimates scaled from documented incidents (Exxon Valdez 1989,
// Deepwater Horizon 2010, Sanchi 2018), not a forecasting tool.

export type CargoKind = "crude" | "product" | "lng"

export interface VesselSpec {
  id: string
  name: string
  type: string
  kind: CargoKind
  lengthM: number
  dwt: number
  cargo: string
  cargoBbl: number // crude/product barrels, or LNG m³ for gas carriers
  cargoTanks: number
  bunkerBbl: number
  crew: number
  flag: string
}

export const PLAYER_SHIP = {
  name: "MV Meridian Star",
  type: "Container ship · 8,500 TEU",
  lengthM: 262,
  bunkerBbl: 42000,
  crew: 23,
}

export const TANKERS: VesselSpec[] = [
  {
    id: "vlcc",
    name: "MT Nordic Titan",
    type: "VLCC crude oil tanker",
    kind: "crude",
    lengthM: 333,
    dwt: 318000,
    cargo: "Arab Light crude",
    cargoBbl: 2_000_000,
    cargoTanks: 15,
    bunkerBbl: 28000,
    crew: 28,
    flag: "Liberia",
  },
  {
    id: "suezmax",
    name: "MT Coral Horizon",
    type: "Suezmax crude oil tanker",
    kind: "crude",
    lengthM: 274,
    dwt: 158000,
    cargo: "Brent blend crude",
    cargoBbl: 1_000_000,
    cargoTanks: 12,
    bunkerBbl: 19000,
    crew: 26,
    flag: "Marshall Islands",
  },
  {
    id: "aframax",
    name: "MT Atlas Meridian",
    type: "Aframax crude oil tanker",
    kind: "crude",
    lengthM: 245,
    dwt: 115000,
    cargo: "Heavy fuel oil",
    cargoBbl: 750_000,
    cargoTanks: 12,
    bunkerBbl: 15000,
    crew: 24,
    flag: "Greece",
  },
  {
    id: "product",
    name: "MT Sea Harmony",
    type: "MR product tanker",
    kind: "product",
    lengthM: 183,
    dwt: 50000,
    cargo: "Diesel & gasoline",
    cargoBbl: 330_000,
    cargoTanks: 12,
    bunkerBbl: 9000,
    crew: 22,
    flag: "Singapore",
  },
  {
    id: "lng",
    name: "LNG Polar Spirit",
    type: "LNG carrier (Moss spheres)",
    kind: "lng",
    lengthM: 290,
    dwt: 84000,
    cargo: "Liquefied natural gas",
    cargoBbl: 145_000, // m³ of LNG
    cargoTanks: 4,
    bunkerBbl: 22000,
    crew: 30,
    flag: "Norway",
  },
]

export interface ImpactReport {
  tanker: VesselSpec
  impactSpeedKn: number
  impactAngleDeg: number
  breachedTanks: number
  cargoSpilledBbl: number
  bunkerSpilledBbl: number
  totalOilBbl: number
  lngReleasedM3: number
  oilTonnes: number
  litres: number
  burnedTonnes: number
  co2Tonnes: number
  slick24hKm2: number
  slickWeekKm2: number
  coastlineKm: number
  fisheryClosureKm2: number
  seabirds: number
  marineMammals: number
  seaTurtles: number
  fishLarvaeBillions: number
  coralHa: number
  cleanupUsd: number
  recoveryYears: [number, number]
  crewAtRisk: number
  olympicPools: number
  comparisons: { label: string; bbl: number; ratio: number }[]
  leakTau: number
}

const EXXON_VALDEZ_BBL = 257_000

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

/** Fay-style maximum slick area (m²) for a spill volume in m³. */
function fayArea(volumeM3: number) {
  return 1e5 * Math.pow(Math.max(volumeM3, 1), 0.75)
}

export function computeImpact(
  tanker: VesselSpec,
  impactSpeedKn: number,
  impactAngleDeg: number,
  nearestShoreKm: number,
): ImpactReport {
  const speedF = clamp(impactSpeedKn / 18, 0.15, 1.35)
  const angleF = 0.3 + 0.7 * Math.abs(Math.sin((impactAngleDeg * Math.PI) / 180))
  const severity = speedF * angleF
  const breachedTanks = clamp(Math.round(1 + severity * (tanker.kind === "lng" ? 1.6 : 4.2)), 1, tanker.kind === "lng" ? 2 : 6)

  const perTank = tanker.cargoBbl / tanker.cargoTanks
  const hydrostaticLoss = 0.42 + 0.35 * clamp(speedF, 0, 1)
  const isLng = tanker.kind === "lng"
  const cargoSpilledBbl = isLng ? 0 : Math.round(breachedTanks * perTank * hydrostaticLoss)
  const lngReleasedM3 = isLng ? Math.round(breachedTanks * perTank * 0.55) : 0
  const bunkerSpilledBbl = Math.round(tanker.bunkerBbl * (0.25 + 0.3 * speedF) + PLAYER_SHIP.bunkerBbl * 0.22 * speedF)
  const totalOilBbl = cargoSpilledBbl + bunkerSpilledBbl

  const bblPerTonne = tanker.kind === "product" ? 7.9 : 7.2
  const oilTonnes = totalOilBbl / bblPerTonne
  const litres = totalOilBbl * 158.987
  const burnFraction = isLng ? 0.35 : 0.08 + 0.14 * clamp(speedF, 0, 1)
  // LNG pool fire: ~0.45 t of gas per m³ LNG, most of it burns off.
  const burnedTonnes = oilTonnes * burnFraction + lngReleasedM3 * 0.45 * 0.9
  const co2Tonnes = burnedTonnes * 3.1

  const remaining = totalOilBbl * (1 - burnFraction) * (tanker.kind === "product" ? 0.55 : 1) // light products evaporate
  const volumeM3 = remaining * 0.159
  const slickWeekKm2 = fayArea(volumeM3) / 1e6
  const slick24hKm2 = slickWeekKm2 * 0.32

  const proximity = Math.exp(-Math.max(nearestShoreKm, 0.2) / 14)
  const evRatio = remaining / EXXON_VALDEZ_BBL
  const coastlineKm = 2100 * Math.pow(evRatio, 0.85) * (0.15 + 0.85 * proximity)
  const fisheryClosureKm2 = slickWeekKm2 * 6.5

  const exposure = 0.45 + 0.55 * proximity
  const seabirds = 250_000 * Math.pow(evRatio, 0.8) * exposure
  const marineMammals = 3_100 * Math.pow(evRatio, 0.8) * exposure
  const seaTurtles = 1_400 * Math.pow(evRatio, 0.8) * (0.6 + 0.4 * proximity)
  const fishLarvaeBillions = 55 * Math.pow(evRatio, 0.9)
  const coralHa = 45 * Math.pow(evRatio, 0.7) * proximity

  const cleanupUsd = 180e6 + remaining * (6500 + 6000 * proximity) + (isLng ? 400e6 : 0)
  const recoveryYears: [number, number] =
    remaining < 50_000 ? [3, 10] : remaining < 500_000 ? [10, 25] : [20, 40]

  const comparisons = [
    { label: "Exxon Valdez (Alaska, 1989)", bbl: 257_000 },
    { label: "Prestige (Spain, 2002)", bbl: 470_000 },
    { label: "Sanchi collision (East China Sea, 2018)", bbl: 1_000_000 },
    { label: "Atlantic Empress collision (Tobago, 1979)", bbl: 2_100_000 },
    { label: "Deepwater Horizon (Gulf of Mexico, 2010)", bbl: 4_900_000 },
  ].map((c) => ({ ...c, ratio: totalOilBbl / c.bbl }))

  return {
    tanker,
    impactSpeedKn,
    impactAngleDeg,
    breachedTanks,
    cargoSpilledBbl,
    bunkerSpilledBbl,
    totalOilBbl,
    lngReleasedM3,
    oilTonnes,
    litres,
    burnedTonnes,
    co2Tonnes,
    slick24hKm2,
    slickWeekKm2,
    coastlineKm,
    fisheryClosureKm2,
    seabirds,
    marineMammals,
    seaTurtles,
    fishLarvaeBillions,
    coralHa,
    cleanupUsd,
    recoveryYears,
    crewAtRisk: tanker.crew + PLAYER_SHIP.crew,
    olympicPools: (totalOilBbl * 0.159) / 2500,
    comparisons,
    leakTau: 38,
  }
}

/** Barrels released so far, t seconds after impact (fast initial gush, then a tail). */
export function spilledAt(report: ImpactReport, t: number) {
  return report.totalOilBbl * (1 - Math.exp(-t / report.leakTau))
}

export interface GroundingReport {
  bunkerSpilledBbl: number
  reefDamageHa: number
  speedKn: number
}

export function computeGrounding(speedKn: number): GroundingReport {
  const f = clamp(speedKn / 18, 0.1, 1.3)
  return {
    bunkerSpilledBbl: Math.round(PLAYER_SHIP.bunkerBbl * 0.12 * f),
    reefDamageHa: Math.round(2 + 14 * f),
    speedKn,
  }
}
