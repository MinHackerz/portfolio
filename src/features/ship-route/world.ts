import * as THREE from "three"
import { clamp, fbm2, lerp, mulberry32, smoothstep } from "./noise"

// World units: 1 unit ≈ 5 metres. The playable sea spans roughly ±900 units.

export const MAP_RECT = { minX: -1000, minZ: -1000, size: 2000 }

export interface IslandDef {
  x: number
  z: number
  r: number
  h: number
  seed: number
  lighthouse?: boolean
}

export const ISLANDS: IslandDef[] = [
  { x: -170, z: -210, r: 150, h: 58, seed: 1.7 },
  { x: 330, z: -470, r: 115, h: 42, seed: 4.2 },
  { x: 470, z: 170, r: 82, h: 26, seed: 7.9, lighthouse: true },
  { x: -120, z: 360, r: 52, h: 16, seed: 2.6 },
  { x: -480, z: -560, r: 96, h: 36, seed: 9.1 },
  { x: 720, z: -760, r: 70, h: 22, seed: 5.5 },
  { x: 120, z: 690, r: 44, h: 12, seed: 3.3 },
  { x: -380, z: 90, r: 20, h: 7, seed: 8.8 },
  { x: 240, z: -80, r: 16, h: 6, seed: 6.1 },
  { x: 720, z: 520, r: 22, h: 8, seed: 1.1 },
]

// Shipyard on the western mainland: concrete quay jutting into a dredged basin.
export const QUAY = { minX: -705, maxX: -600, minZ: 170, maxZ: 450, top: 3 }
const BASIN = { minX: -600, maxX: -420, minZ: 120, maxZ: 500 }
export const BERTH = { x: -600 + 0.6 + 3.95, z: 318, heading: Math.PI / 2 }

function coastX(z: number) {
  return -690 + 38 * fbm2(z * 0.0032, 3.1, 3)
}

function mainlandHeight(x: number, z: number) {
  const e = coastX(z) - x // distance inland
  if (e <= 0) return Math.max(e * 0.32, -40)
  const beach = Math.min(e * 0.14, 3.2)
  const hills = smoothstep(25, 320, e) * (70 + 60 * fbm2(x * 0.004, z * 0.004, 5))
  return beach + hills * (0.6 + 0.4 * (fbm2(x * 0.012 + 3, z * 0.012, 3) * 0.5 + 0.5))
}

function islandHeight(isl: IslandDef, x: number, z: number) {
  const dx = x - isl.x
  const dz = z - isl.z
  const lim = isl.r * 1.7
  if (dx > lim || dx < -lim || dz > lim || dz < -lim) return -40
  let r = Math.sqrt(dx * dx + dz * dz) / isl.r
  r += 0.3 * fbm2((x / isl.r) * 1.1 + isl.seed * 7, (z / isl.r) * 1.1 - isl.seed * 3, 4)
  const t = 1 - r
  if (t <= 0) return Math.max(t * isl.r * 0.38, -40)
  const peak = Math.pow(smoothstep(0, 0.9, t), 1.55)
  const rough = 0.72 + 0.56 * (fbm2(x * 0.021 + isl.seed, z * 0.021, 5) * 0.5 + 0.5)
  return isl.h * peak * rough + 0.1
}

/** Terrain / seabed height at a world position (y=0 is mean sea level). */
export function groundHeight(x: number, z: number): number {
  let h = -40
  h = Math.max(h, mainlandHeight(x, z))
  for (let i = 0; i < ISLANDS.length; i++) h = Math.max(h, islandHeight(ISLANDS[i], x, z))

  // Dredged harbour basin.
  const bx = Math.min(x - BASIN.minX, BASIN.maxX - x)
  const bz = Math.min(z - BASIN.minZ, BASIN.maxZ - z)
  const basinMask = smoothstep(-40, 20, Math.min(bx + 40, bz))
  if (basinMask > 0) h = lerp(h, Math.min(h, -16), basinMask)

  if (x >= QUAY.minX && x <= QUAY.maxX && z >= QUAY.minZ && z <= QUAY.maxZ) h = QUAY.top - 0.6
  return h
}

// ---------------------------------------------------------------------------
// Meshes

const C_WET_SAND = new THREE.Color(0.55, 0.47, 0.33)
const C_SAND = new THREE.Color(0.84, 0.76, 0.58)
const C_GRASS = new THREE.Color(0.24, 0.36, 0.13)
const C_FOREST = new THREE.Color(0.1, 0.2, 0.07)
const C_ROCK = new THREE.Color(0.33, 0.3, 0.26)
const C_ROCK_LIGHT = new THREE.Color(0.45, 0.41, 0.35)
const C_SEABED = new THREE.Color(0.42, 0.4, 0.3)

function terrainColor(out: THREE.Color, h: number, slope: number, x: number, z: number, peak: number) {
  const n = fbm2(x * 0.03, z * 0.03, 3) * 0.5 + 0.5
  if (h < 0.4) {
    out.copy(C_SEABED).lerp(C_WET_SAND, smoothstep(-6, 0.4, h))
    return
  }
  if (h < 2.8) {
    out.copy(C_WET_SAND).lerp(C_SAND, smoothstep(0.4, 1.6, h))
    return
  }
  out.copy(C_SAND).lerp(C_GRASS, smoothstep(2.8, 5.5, h))
  out.lerp(C_FOREST, smoothstep(0.35, 0.75, n) * 0.85)
  const rockiness = clamp(smoothstep(0.7, 1.3, slope) + smoothstep(peak * 0.75, peak * 1.05, h), 0, 1) * 0.85
  const rock = C_ROCK.clone().lerp(C_ROCK_LIGHT, n)
  out.lerp(rock, rockiness)
}

function buildTerrain(minX: number, maxX: number, minZ: number, maxZ: number, segX: number, segZ: number, peak: number) {
  const geo = new THREE.PlaneGeometry(maxX - minX, maxZ - minZ, segX, segZ)
  geo.rotateX(-Math.PI / 2)
  geo.translate((minX + maxX) / 2, 0, (minZ + maxZ) / 2)
  const pos = geo.attributes.position as THREE.BufferAttribute
  const colors = new Float32Array(pos.count * 3)
  const col = new THREE.Color()
  const e = 2
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const h = groundHeight(x, z)
    pos.setY(i, h)
    const sx = (groundHeight(x + e, z) - groundHeight(x - e, z)) / (2 * e)
    const sz = (groundHeight(x, z + e) - groundHeight(x, z - e)) / (2 * e)
    terrainColor(col, h, Math.sqrt(sx * sx + sz * sz), x, z, peak)
    colors[i * 3] = col.r
    colors[i * 3 + 1] = col.g
    colors[i * 3 + 2] = col.b
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  return geo
}

function buildTrees(isl: { x: number; z: number; r: number; h: number }, count: number, seed: number) {
  const rand = mulberry32(seed)
  const pts: { x: number; y: number; z: number; s: number }[] = []
  let attempts = 0
  while (pts.length < count && attempts < count * 12) {
    attempts++
    const x = isl.x + (rand() * 2 - 1) * isl.r * 1.2
    const z = isl.z + (rand() * 2 - 1) * isl.r * 1.2
    const h = groundHeight(x, z)
    if (h < 4.2 || h > isl.h * 0.8) continue
    const sx = groundHeight(x + 2, z) - groundHeight(x - 2, z)
    const sz = groundHeight(x, z + 2) - groundHeight(x, z - 2)
    if (Math.sqrt(sx * sx + sz * sz) / 4 > 0.7) continue
    if (fbm2(x * 0.02, z * 0.02, 2) < -0.15) continue
    pts.push({ x, y: h, z, s: 0.7 + rand() * 0.7 })
  }
  return pts
}

function treeGeometry() {
  const trunk = new THREE.CylinderGeometry(0.12, 0.2, 1.6, 5)
  trunk.translate(0, 0.8, 0)
  const crown = new THREE.IcosahedronGeometry(1.25, 1)
  crown.scale(1, 1.25, 1)
  crown.translate(0, 2.4, 0)
  const crown2 = new THREE.IcosahedronGeometry(0.9, 1)
  crown2.translate(0.5, 3.2, 0.2)
  const parts = [trunk, crown, crown2]
  const colors: number[] = []
  const merged = new THREE.BufferGeometry()
  const positions: number[] = []
  const normals: number[] = []
  parts.forEach((g, gi) => {
    const ng = g.index ? g.toNonIndexed() : g
    const p = ng.attributes.position.array as Float32Array
    ng.computeVertexNormals()
    const n = ng.attributes.normal.array as Float32Array
    for (let i = 0; i < p.length; i++) {
      positions.push(p[i])
      normals.push(n[i])
    }
    const c = gi === 0 ? [0.3, 0.22, 0.14] : [1, 1, 1]
    for (let i = 0; i < p.length / 3; i++) colors.push(c[0], c[1], c[2])
  })
  merged.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  merged.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3))
  merged.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
  return merged
}

function lighthouse() {
  const g = new THREE.Group()
  const white = new THREE.MeshStandardMaterial({ color: 0xf2f0ea, roughness: 0.6 })
  const red = new THREE.MeshStandardMaterial({ color: 0xb3261e, roughness: 0.6 })
  const segs = 5
  for (let i = 0; i < segs; i++) {
    const r0 = 1.5 - i * 0.16
    const r1 = 1.5 - (i + 1) * 0.16
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, 2.2, 20), i % 2 ? red : white)
    m.position.y = 1.1 + i * 2.2
    m.castShadow = true
    g.add(m)
  }
  const lamp = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 1.2, 16),
    new THREE.MeshStandardMaterial({ color: 0xfff2c0, emissive: 0xffd27a, emissiveIntensity: 2, roughness: 0.2 }),
  )
  lamp.position.y = segs * 2.2 + 0.6
  g.add(lamp)
  const cap = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.2, 16), red)
  cap.position.y = segs * 2.2 + 1.8
  g.add(cap)
  return g
}

export function createLand(): THREE.Group {
  const group = new THREE.Group()
  group.name = "land"
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 })

  // Mainland (west).
  const main = new THREE.Mesh(buildTerrain(-1700, -520, -1700, 1700, 220, 340, 130), mat)
  main.receiveShadow = true
  main.castShadow = true
  group.add(main)

  const treeGeo = treeGeometry()
  const treeMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 })
  const allTrees: { x: number; y: number; z: number; s: number }[] = []

  ISLANDS.forEach((isl, i) => {
    const size = isl.r * 1.7
    const seg = Math.round(clamp(isl.r * 1.3, 40, 200))
    const mesh = new THREE.Mesh(
      buildTerrain(isl.x - size, isl.x + size, isl.z - size, isl.z + size, seg, seg, isl.h),
      mat,
    )
    mesh.receiveShadow = true
    mesh.castShadow = true
    group.add(mesh)
    if (isl.r > 30) allTrees.push(...buildTrees(isl, Math.round(isl.r * isl.r * 0.018), 100 + i))
    if (isl.lighthouse) {
      // Place on the highest sampled point near the eastern shore.
      let best = { x: isl.x, z: isl.z, h: -99 }
      for (let a = 0; a < 40; a++) {
        const ang = (a / 40) * Math.PI * 2
        const x = isl.x + Math.cos(ang) * isl.r * 0.55
        const z = isl.z + Math.sin(ang) * isl.r * 0.55
        const h = groundHeight(x, z)
        if (h > best.h && Math.cos(ang) > 0.3) best = { x, z, h }
      }
      const lh = lighthouse()
      lh.position.set(best.x, best.h - 0.3, best.z)
      group.add(lh)
    }
  })

  // Hills of the mainland also get forests.
  allTrees.push(...buildTrees({ x: -900, z: 0, r: 700, h: 110 }, 1400, 77))

  const trees = new THREE.InstancedMesh(treeGeo, treeMat, allTrees.length)
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const s = new THREE.Vector3()
  const p = new THREE.Vector3()
  const c = new THREE.Color()
  const rand = mulberry32(99)
  allTrees.forEach((t, i) => {
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand() * Math.PI * 2)
    s.setScalar(t.s * 1.3)
    p.set(t.x, t.y - 0.2, t.z)
    m.compose(p, q, s)
    trees.setMatrixAt(i, m)
    c.setRGB(0.12 + rand() * 0.08, 0.26 + rand() * 0.12, 0.08 + rand() * 0.05)
    trees.setColorAt(i, c)
  })
  trees.castShadow = true
  trees.receiveShadow = true
  group.add(trees)
  return group
}

/** Encodes seabed height over MAP_RECT into a texture for the water shader. */
export function createBathymetryTexture(res = 512): THREE.DataTexture {
  const data = new Uint8Array(res * res * 4)
  for (let j = 0; j < res; j++) {
    const z = MAP_RECT.minZ + ((j + 0.5) / res) * MAP_RECT.size
    for (let i = 0; i < res; i++) {
      const x = MAP_RECT.minX + ((i + 0.5) / res) * MAP_RECT.size
      const h = groundHeight(x, z)
      const v = clamp((h + 40) / 80, 0, 1)
      const k = (j * res + i) * 4
      data[k] = Math.round(v * 255)
      data[k + 1] = 0
      data[k + 2] = 0
      data[k + 3] = 255
    }
  }
  const tex = new THREE.DataTexture(data, res, res, THREE.RGBAFormat)
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearFilter
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
  tex.needsUpdate = true
  return tex
}
