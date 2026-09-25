import * as THREE from "three"
import { GLSL_NOISE, clamp, mulberry32, smoothstep } from "./noise"

// Ships are modelled with +X forward (bow), +Y up and the design waterline at y = 0.

export interface HullColors {
  hull: THREE.ColorRepresentation
  boot: THREE.ColorRepresentation
  bottom: THREE.ColorRepresentation
  deck: THREE.ColorRepresentation
  stripe?: THREE.ColorRepresentation
}

export interface HullSpec {
  length: number
  beam: number
  depth: number
  draft: number
  forecastleSheer: number
  colors: HullColors
}

export interface ShipModel {
  group: THREE.Group
  length: number
  beam: number
  draft: number
  depth: number
  deckY: number
  funnelTop: THREE.Vector3
  radar?: THREE.Object3D
}

// ---------------------------------------------------------------------------
// Procedural textures

let windowTex: THREE.CanvasTexture | null = null
export function windowTexture() {
  if (windowTex) return windowTex
  const c = document.createElement("canvas")
  c.width = 64
  c.height = 64
  const g = c.getContext("2d")!
  g.fillStyle = "#e9e7e1"
  g.fillRect(0, 0, 64, 64)
  g.fillStyle = "#d4d1ca"
  g.fillRect(0, 60, 64, 4)
  const grad = g.createLinearGradient(0, 18, 0, 42)
  grad.addColorStop(0, "#3b4a58")
  grad.addColorStop(1, "#16202a")
  g.fillStyle = grad
  g.fillRect(14, 20, 36, 22)
  g.fillStyle = "rgba(255,255,255,0.18)"
  g.fillRect(14, 20, 36, 4)
  windowTex = new THREE.CanvasTexture(c)
  windowTex.colorSpace = THREE.SRGBColorSpace
  windowTex.wrapS = windowTex.wrapT = THREE.RepeatWrapping
  windowTex.anisotropy = 4
  return windowTex
}

let bridgeTex: THREE.CanvasTexture | null = null
function bridgeTexture() {
  if (bridgeTex) return bridgeTex
  const c = document.createElement("canvas")
  c.width = 64
  c.height = 64
  const g = c.getContext("2d")!
  g.fillStyle = "#e9e7e1"
  g.fillRect(0, 0, 64, 64)
  const grad = g.createLinearGradient(0, 10, 0, 50)
  grad.addColorStop(0, "#4b5d6e")
  grad.addColorStop(1, "#0d151c")
  g.fillStyle = grad
  g.fillRect(2, 12, 60, 36)
  g.fillStyle = "#cfccc4"
  g.fillRect(31, 12, 2, 36)
  bridgeTex = new THREE.CanvasTexture(c)
  bridgeTex.colorSpace = THREE.SRGBColorSpace
  bridgeTex.wrapS = bridgeTex.wrapT = THREE.RepeatWrapping
  return bridgeTex
}

let containerTex: THREE.CanvasTexture | null = null
export function containerTexture() {
  if (containerTex) return containerTex
  const c = document.createElement("canvas")
  c.width = 128
  c.height = 32
  const g = c.getContext("2d")!
  g.fillStyle = "#ffffff"
  g.fillRect(0, 0, 128, 32)
  for (let i = 0; i < 128; i += 4) {
    g.fillStyle = "rgba(0,0,0,0.16)"
    g.fillRect(i, 0, 1, 32)
    g.fillStyle = "rgba(255,255,255,0.5)"
    g.fillRect(i + 2, 0, 1, 32)
  }
  g.fillStyle = "rgba(0,0,0,0.35)"
  g.fillRect(0, 0, 128, 2)
  g.fillRect(0, 30, 128, 2)
  g.fillRect(0, 0, 2, 32)
  g.fillRect(126, 0, 2, 32)
  containerTex = new THREE.CanvasTexture(c)
  containerTex.colorSpace = THREE.SRGBColorSpace
  containerTex.anisotropy = 4
  return containerTex
}

function textTexture(text: string, color: string, width = 1024, height = 128) {
  const c = document.createElement("canvas")
  c.width = width
  c.height = height
  const g = c.getContext("2d")!
  g.clearRect(0, 0, width, height)
  g.fillStyle = color
  g.font = `bold ${Math.round(height * 0.72)}px "Space Grotesk", Arial, sans-serif`
  g.textAlign = "center"
  g.textBaseline = "middle"
  g.fillText(text, width / 2, height / 2 + 4)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

// ---------------------------------------------------------------------------
// Materials

const matCache = new Map<string, THREE.Material>()
function std(color: THREE.ColorRepresentation, roughness = 0.6, metalness = 0.2, key?: string) {
  const k = key ?? `${new THREE.Color(color).getHexString()}-${roughness}-${metalness}`
  let m = matCache.get(k)
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness, metalness })
    matCache.set(k, m)
  }
  return m
}

function hullMaterial(spec: HullSpec) {
  const m = new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.3, side: THREE.DoubleSide })
  const u = {
    uHull: { value: new THREE.Color(spec.colors.hull) },
    uBoot: { value: new THREE.Color(spec.colors.boot) },
    uBottom: { value: new THREE.Color(spec.colors.bottom) },
    uStripe: { value: new THREE.Color(spec.colors.stripe ?? spec.colors.hull) },
    uDeckY: { value: spec.depth - spec.draft },
  }
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u)
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vHullPos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvHullPos = position;")
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        varying vec3 vHullPos;
        uniform vec3 uHull; uniform vec3 uBoot; uniform vec3 uBottom; uniform vec3 uStripe; uniform float uDeckY;
        ${GLSL_NOISE}`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        vec3 hc = uHull;
        if (vHullPos.y > uDeckY - 0.28) hc = uStripe;
        if (vHullPos.y < 0.42) hc = uBoot;
        if (vHullPos.y < -0.22) hc = uBottom;
        float plate = step(0.965, fract(vHullPos.x / 2.3)) * 0.07 + step(0.97, fract((vHullPos.y + 0.3) / 1.05)) * 0.05;
        float grime = srFbm(vHullPos.xy * vec2(0.35, 1.6) + vHullPos.z) ;
        float streak = smoothstep(0.55, 0.9, srNoise(vec2(vHullPos.x * 1.7, vHullPos.y * 0.15))) * 0.12;
        diffuseColor.rgb = hc * (1.0 - plate) * (0.86 + 0.2 * grime) * (1.0 - streak);`,
      )
  }
  return m
}

// ---------------------------------------------------------------------------
// Hull loft

function fullness(u: number) {
  return 1 - smoothstep(0.62, 1, u) * 0.85 - (1 - smoothstep(0, 0.24, u)) * 0.55
}

function planform(u: number, h: number) {
  if (u > 0.7) {
    const t = (u - 0.7) / 0.3
    const a = 1.5 + 1.9 * clamp(h, 0, 1)
    return Math.pow(Math.max(1 - Math.pow(t, a), 0), 0.55)
  }
  if (u < 0.2) {
    const t = (0.2 - u) / 0.2
    const pend = 0.1 + 0.72 * Math.pow(clamp(h, 0, 1), 0.6)
    return 1 - (1 - pend) * t * t
  }
  return 1
}

function buildHull(spec: HullSpec) {
  const { length: L, beam: B, depth: D, draft: T } = spec
  const NU = 80
  const NV = 18
  const bulwark = 0.32
  const deckAt = (u: number) => D - T + spec.forecastleSheer * smoothstep(0.84, 0.9, u)
  const xAt = (u: number, h: number) => {
    const xs = -L / 2 + 0.05 * L * Math.pow(1 - clamp(h, 0, 1), 2)
    const xb = L / 2 - 0.035 * L * Math.pow(1 - clamp(h, 0, 1), 1.2)
    return xs + (xb - xs) * u
  }
  const halfBreadth = (u: number, y: number) => {
    const h = (y + T) / D
    const eta = clamp((y + T) / T, 0, 1)
    const e = 0.08 + 0.5 * (1 - fullness(u))
    const s = Math.pow(eta, e)
    const flare = 1 + 0.14 * smoothstep(0.7, 1, u) * clamp(y / (D - T), 0, 1.4)
    return (B / 2) * planform(u, h) * s * flare
  }

  const positions: number[] = []
  const indices: number[] = []
  const side = (sign: 1 | -1) => {
    const base = positions.length / 3
    for (let iu = 0; iu <= NU; iu++) {
      const u = iu / NU
      const top = deckAt(u) + bulwark
      for (let iv = 0; iv <= NV; iv++) {
        const v = iv / NV
        // Concentrate rows near the waterline for crisp boot-top.
        const y = -T + (top + T) * v
        const h = (y + T) / D
        positions.push(xAt(u, h), y, sign * halfBreadth(u, y))
      }
    }
    for (let iu = 0; iu < NU; iu++) {
      for (let iv = 0; iv < NV; iv++) {
        const a = base + iu * (NV + 1) + iv
        const b = a + NV + 1
        const c = a + 1
        const d = b + 1
        if (sign > 0) indices.push(a, b, c, b, d, c)
        else indices.push(a, c, b, b, c, d)
      }
    }
  }
  side(1)
  side(-1)

  // Transom.
  {
    const base = positions.length / 3
    const top = deckAt(0) + bulwark
    const cx = xAt(0, 0.6)
    positions.push(cx, (top - T) / 2, 0)
    for (let iv = 0; iv <= NV; iv++) {
      const y = -T + (top + T) * (iv / NV)
      const h = (y + T) / D
      positions.push(xAt(0, h), y, halfBreadth(0, y))
    }
    for (let iv = NV; iv >= 0; iv--) {
      const y = -T + (top + T) * (iv / NV)
      const h = (y + T) / D
      positions.push(xAt(0, h), y, -halfBreadth(0, y))
    }
    const n = (NV + 1) * 2
    for (let i = 0; i < n - 1; i++) indices.push(base, base + 1 + i + 1, base + 1 + i)
  }

  const hull = new THREE.BufferGeometry()
  hull.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  hull.setIndex(indices)
  hull.computeVertexNormals()

  // Deck surface.
  const dp: number[] = []
  const di: number[] = []
  for (let iu = 0; iu <= NU; iu++) {
    const u = iu / NU
    const y = deckAt(u)
    const h = (y + T) / D
    const x = xAt(u, h)
    const w = Math.max(halfBreadth(u, y) - 0.05, 0)
    dp.push(x, y, w, x, y, -w)
    if (iu < NU) {
      const a = iu * 2
      di.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  }
  const deck = new THREE.BufferGeometry()
  deck.setAttribute("position", new THREE.Float32BufferAttribute(dp, 3))
  deck.setIndex(di)
  deck.computeVertexNormals()

  return { hull, deck, deckAt, halfBreadth, xAt }
}

function addBox(
  parent: THREE.Object3D,
  mat: THREE.Material | THREE.Material[],
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y + h / 2, z)
  m.castShadow = true
  m.receiveShadow = true
  parent.add(m)
  return m
}

/** Accommodation block with window textures scaled to its faces. */
function accommodation(parent: THREE.Object3D, w: number, decks: number, d: number, x: number, y: number, beam: number) {
  const deckH = 0.62
  const h = decks * deckH
  const base = windowTexture()
  const mk = (repX: number) => {
    const t = base.clone()
    t.repeat.set(repX, decks)
    t.needsUpdate = true
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.55, metalness: 0.1 })
  }
  const wall = std(0xe9e7e1, 0.6, 0.1)
  const sideMat = mk(Math.max(1, Math.round(w / 0.9)))
  const frontMat = mk(Math.max(1, Math.round(d / 0.9)))
  const block = addBox(parent, [frontMat, frontMat, wall, wall, sideMat, sideMat], w, h, d, x, y, 0)

  // Navigation bridge with wings spanning the beam.
  const bt = bridgeTexture().clone()
  bt.repeat.set(Math.round(d * 1.3), 1)
  bt.needsUpdate = true
  const bridgeFront = new THREE.MeshStandardMaterial({ map: bt, roughness: 0.3, metalness: 0.2 })
  const bs = bridgeTexture().clone()
  bs.repeat.set(Math.max(1, Math.round(w * 0.9)), 1)
  bs.needsUpdate = true
  const bridgeSide = new THREE.MeshStandardMaterial({ map: bs, roughness: 0.3, metalness: 0.2 })
  const bw = w * 0.75
  addBox(parent, [bridgeFront, bridgeFront, wall, wall, bridgeSide, bridgeSide], bw, deckH * 1.1, d * 1.02, x + (w - bw) / 2, y + h, 0)
  const wingD = Math.max((beam - d) / 2 - 0.05, 0.3)
  const wingW = bw * 0.55
  const wingMat = std(0xe2dfd8, 0.6, 0.1)
  addBox(parent, wingMat, wingW, 0.12, wingD, x + (w - wingW) / 2, y + h + 0.1, d / 2 + wingD / 2)
  addBox(parent, wingMat, wingW, 0.12, wingD, x + (w - wingW) / 2, y + h + 0.1, -d / 2 - wingD / 2)
  // Roof and radar mast.
  addBox(parent, std(0xcfcbc2, 0.7, 0.1), bw * 1.02, 0.08, d * 1.05, x + (w - bw) / 2, y + h + deckH * 1.1, 0)
  const mastY = y + h + deckH * 1.1
  const mast = addBox(parent, std(0xf2f0ea, 0.5, 0.3), 0.18, 1.9, 0.18, x + (w - bw) / 2, mastY, 0)
  mast.castShadow = true
  addBox(parent, std(0xf2f0ea, 0.5, 0.3), 0.12, 0.08, d * 0.5, x + (w - bw) / 2, mastY + 1.3, 0)
  const radar = new THREE.Group()
  radar.position.set(x + (w - bw) / 2 + 0.4, mastY + 0.9, 0)
  const scanner = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 1.4), std(0xf7f7f7, 0.4, 0.1))
  radar.add(scanner)
  parent.add(radar)

  // Running lights on the wing tips.
  const red = new THREE.MeshStandardMaterial({ color: 0xff2020, emissive: 0xff1010, emissiveIntensity: 3 })
  const green = new THREE.MeshStandardMaterial({ color: 0x20ff40, emissive: 0x10ff30, emissiveIntensity: 3 })
  addBox(parent, green, 0.12, 0.12, 0.12, x + w / 2 - 0.1, y + h + 0.22, d / 2 + wingD - 0.05)
  addBox(parent, red, 0.12, 0.12, 0.12, x + w / 2 - 0.1, y + h + 0.22, -d / 2 - wingD + 0.05)

  return { block, top: y + h + deckH * 1.1, radar }
}

function funnel(parent: THREE.Object3D, x: number, y: number, h: number, w: number, main: number, band: number) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.12, h, 28), std(main, 0.5, 0.2))
  body.scale.set(w * 0.8, 1, w * 0.45)
  body.position.y = h / 2
  body.castShadow = true
  g.add(body)
  const b = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.04, h * 0.22, 28), std(band, 0.5, 0.2))
  b.scale.copy(body.scale)
  b.position.y = h * 0.62
  g.add(b)
  const top = new THREE.Mesh(new THREE.CylinderGeometry(1.01, 1.01, h * 0.12, 28), std(0x151515, 0.8, 0.2))
  top.scale.copy(body.scale)
  top.position.y = h * 0.94
  g.add(top)
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.6, 10), std(0x222222, 0.7, 0.4))
  pipe.position.set(-0.2, h + 0.2, 0)
  g.add(pipe)
  g.position.set(x, y, 0)
  g.rotation.z = 0.06
  parent.add(g)
  return new THREE.Vector3(x - 0.2, y + h + 0.5, 0)
}

function lifeboats(parent: THREE.Object3D, x: number, y: number, z: number) {
  const mat = std(0xff6a00, 0.5, 0.1)
  const cap = new THREE.CapsuleGeometry(0.28, 1.2, 4, 10)
  cap.rotateZ(Math.PI / 2)
  for (const s of [1, -1]) {
    const m = new THREE.Mesh(cap, mat)
    m.position.set(x, y, z * s)
    m.castShadow = true
    parent.add(m)
  }
}

function forecastle(parent: THREE.Object3D, L: number, deckY: number) {
  const mat = std(0xd8d4cc, 0.5, 0.3)
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.6, 8), mat)
  mast.position.set(L / 2 - 4, deckY + 1.3, 0)
  mast.castShadow = true
  parent.add(mast)
  const winch = std(0x2a3a2a, 0.6, 0.4)
  for (const s of [1, -1]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 12), winch)
    w.rotation.x = Math.PI / 2
    w.position.set(L / 2 - 5.5, deckY + 0.3, s * 0.9)
    w.castShadow = true
    parent.add(w)
  }
}

function hullName(parent: THREE.Object3D, text: string, x: number, y: number, z: number, len: number, color = "#ffffff") {
  const tex = textTexture(text, color)
  const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, depthWrite: false, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2 })
  const geo = new THREE.PlaneGeometry(len, len / 8)
  for (const s of [1, -1]) {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, s * z)
    m.rotation.y = s > 0 ? 0 : Math.PI
    parent.add(m)
  }
}

function assembleHull(group: THREE.Group, spec: HullSpec) {
  const built = buildHull(spec)
  const hull = new THREE.Mesh(built.hull, hullMaterial(spec))
  hull.castShadow = true
  hull.receiveShadow = true
  group.add(hull)
  const deck = new THREE.Mesh(built.deck, std(spec.colors.deck, 0.85, 0.1))
  deck.receiveShadow = true
  group.add(deck)
  // Bulbous bow.
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), std(spec.colors.bottom, 0.5, 0.3))
  bulb.scale.set(spec.length * 0.045, spec.draft * 0.3, spec.beam * 0.11)
  bulb.position.set(spec.length / 2 - spec.length * 0.045, -spec.draft * 0.6, 0)
  group.add(bulb)
  return built
}

// ---------------------------------------------------------------------------
// Vessel types

const CONTAINER_COLORS = [0x2f5f9e, 0x2f5f9e, 0xb8302a, 0x1f6b3a, 0x8a8f94, 0xe7e3dc, 0xd46a1c, 0x6e3a24, 0xd9b233, 0x224466, 0x9b1d20, 0x3d7ca8]

export function createContainerShip(name = "MERIDIAN STAR"): ShipModel {
  const spec: HullSpec = {
    length: 52,
    beam: 7.9,
    depth: 4.6,
    draft: 2.5,
    forecastleSheer: 0.7,
    colors: { hull: 0x1d3557, boot: 0x141414, bottom: 0x8e2b22, deck: 0x6d7a6a, stripe: 0xf4f1ea },
  }
  const group = new THREE.Group()
  const built = assembleHull(group, spec)
  const deckY = spec.depth - spec.draft
  const L = spec.length

  const acc = accommodation(group, 4.2, 7, spec.beam * 0.78, -L / 2 + 7, deckY, spec.beam)
  const funnelTop = funnel(group, -L / 2 + 3, deckY, acc.top - deckY - 0.4, 1.9, 0x1d3557, 0xf2f0ea)
  lifeboats(group, -L / 2 + 7.6, deckY + 2.4, spec.beam * 0.46)
  forecastle(group, L, deckY + spec.forecastleSheer)

  // Container bays.
  const tex = containerTexture()
  const cGeo = new THREE.BoxGeometry(2.42, 0.51, 0.48)
  const cMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7, metalness: 0.25 })
  const rand = mulberry32(7)
  const slots: { x: number; y: number; z: number; color: number }[] = []
  const hatch = std(0x5b6660, 0.8, 0.3)
  const lashing = std(0xc9c4b8, 0.6, 0.4)
  for (let bx = -L / 2 + 11.6; bx < L / 2 - 9.2; bx += 2.62) {
    const u = (bx + L / 2) / L
    const half = Math.min(built.halfBreadth(u, deckY), built.halfBreadth(u + 1.3 / L, deckY)) - 0.25
    const rows = Math.max(2, Math.floor((half * 2) / 0.5))
    const width = rows * 0.5
    addBox(group, hatch, 2.5, 0.25, width + 0.1, bx, deckY, 0)
    addBox(group, lashing, 0.08, 1.6, width, bx + 1.3, deckY + 0.25, 0)
    const fwd = u > 0.75 ? 1 - smoothstep(0.75, 0.9, u) : 1
    const maxTiers = Math.max(2, Math.round((4 + rand() * 3) * (0.55 + 0.45 * fwd)))
    for (let r = 0; r < rows; r++) {
      const z = -width / 2 + 0.25 + r * 0.5
      const edge = r === 0 || r === rows - 1 ? 1 : 0
      const tiers = clamp(maxTiers - edge - (rand() < 0.2 ? 1 : 0), 1, 7)
      for (let t = 0; t < tiers; t++) {
        slots.push({ x: bx, y: deckY + 0.25 + t * 0.52 + 0.255, z, color: CONTAINER_COLORS[Math.floor(rand() * CONTAINER_COLORS.length)] })
      }
    }
  }
  const containers = new THREE.InstancedMesh(cGeo, cMat, slots.length)
  const m = new THREE.Matrix4()
  const col = new THREE.Color()
  slots.forEach((s, i) => {
    m.makeTranslation(s.x, s.y, s.z)
    containers.setMatrixAt(i, m)
    col.set(s.color).multiplyScalar(0.85 + rand() * 0.25)
    containers.setColorAt(i, col)
  })
  containers.castShadow = true
  containers.receiveShadow = true
  group.add(containers)

  hullName(group, name, 6, deckY - 0.75, spec.beam / 2 + 0.02, 14)

  return { group, length: L, beam: spec.beam, draft: spec.draft, depth: spec.depth, deckY, funnelTop, radar: acc.radar }
}

export interface TankerOptions {
  length: number
  beam: number
  depth: number
  draft: number
  hull: number
  deck: number
  funnel: number
  band: number
  name: string
  stripe?: number
}

function pipe(parent: THREE.Object3D, mat: THREE.Material, r: number, len: number, x: number, y: number, z: number, axis: "x" | "z") {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 8), mat)
  if (axis === "x") m.rotation.z = Math.PI / 2
  else m.rotation.x = Math.PI / 2
  m.position.set(x, y, z)
  m.castShadow = true
  parent.add(m)
  return m
}

export function createTanker(o: TankerOptions): ShipModel {
  const spec: HullSpec = {
    length: o.length,
    beam: o.beam,
    depth: o.depth,
    draft: o.draft,
    forecastleSheer: 0.5,
    colors: { hull: o.hull, boot: 0x151515, bottom: 0x7d2620, deck: o.deck, stripe: o.stripe ?? o.hull },
  }
  const group = new THREE.Group()
  const built = assembleHull(group, spec)
  const deckY = spec.depth - spec.draft
  const L = o.length
  const B = o.beam
  const acc = accommodation(group, 5, 6, B * 0.72, -L / 2 + 6.2, deckY, B)
  const funnelTop = funnel(group, -L / 2 + 2.2, deckY + 0.3, acc.top - deckY - 0.2, 2.1, o.funnel, o.band)
  lifeboats(group, -L / 2 + 6.4, deckY + 2.2, B * 0.42)
  forecastle(group, L, deckY + 0.5)

  const pipeMat = std(0xb9b39f, 0.5, 0.5)
  const start = -L / 2 + 11
  const end = L / 2 - 6
  const len = end - start
  const mid = (start + end) / 2
  // Main pipe rack along the centre line.
  for (let i = 0; i < 4; i++) pipe(group, pipeMat, 0.1, len, mid, deckY + 0.35 + (i % 2) * 0.22, -0.35 + i * 0.23, "x")
  for (let x = start; x < end; x += 3) addBox(group, pipeMat, 0.1, 0.5, 1.1, x, deckY, 0)
  // Elevated catwalk.
  addBox(group, std(0xd8d4c4, 0.6, 0.3), len, 0.08, 0.55, mid, deckY + 1.15, 1.1)
  for (let x = start; x < end; x += 4) addBox(group, pipeMat, 0.08, 1.15, 0.08, x, deckY, 1.1)
  // Cargo manifold midships with hose cranes.
  for (let i = 0; i < 6; i++) pipe(group, pipeMat, 0.13, B * 0.9, mid - 1 + i * 0.4, deckY + 0.45, 0, "z")
  for (const s of [1, -1]) {
    addBox(group, std(0xd9c63a, 0.5, 0.3), 0.35, 2.2, 0.35, mid + 1.8, deckY, s * B * 0.3)
    const jib = addBox(group, std(0xd9c63a, 0.5, 0.3), 3.5, 0.2, 0.2, mid + 1.8 - 1.2, deckY + 2.0, s * B * 0.3)
    jib.rotation.z = 0.35
  }
  // Tank domes and vents.
  const dome = std(0x8f8a79, 0.6, 0.4)
  for (let x = start + 1.5; x < end - 1; x += 4.2) {
    for (const s of [1, -1]) {
      const d = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.35, 12), dome)
      d.position.set(x, deckY + 0.18, s * B * 0.22)
      d.castShadow = true
      group.add(d)
    }
  }
  hullName(group, o.name.toUpperCase(), -L / 2 + 16, deckY - 0.7, B / 2 + 0.02, 12)
  return { group, length: L, beam: B, draft: spec.draft, depth: spec.depth, deckY, funnelTop, radar: acc.radar }
}

export function createLngCarrier(name: string): ShipModel {
  const spec: HullSpec = {
    length: 58,
    beam: 9.8,
    depth: 5.2,
    draft: 2.6,
    forecastleSheer: 0.6,
    colors: { hull: 0x7a1f1f, boot: 0x141414, bottom: 0x3d3d3d, deck: 0x5f6b5c, stripe: 0xf4f1ea },
  }
  const group = new THREE.Group()
  assembleHull(group, spec)
  const deckY = spec.depth - spec.draft
  const L = spec.length
  const acc = accommodation(group, 4.6, 6, spec.beam * 0.72, -L / 2 + 5.8, deckY, spec.beam)
  const funnelTop = funnel(group, -L / 2 + 2.2, deckY, acc.top - deckY + 0.5, 2, 0xf2f0ea, 0x1f5fa8)
  lifeboats(group, -L / 2 + 6, deckY + 2.3, spec.beam * 0.42)
  forecastle(group, L, deckY + 0.6)
  const sphereMat = std(0xe8e2d0, 0.55, 0.15)
  const skirt = std(0xc9c3b0, 0.6, 0.2)
  const r = 4.1
  for (let i = 0; i < 4; i++) {
    const x = -L / 2 + 13 + i * 10
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 36, 20, 0, Math.PI * 2, 0, Math.PI * 0.62), sphereMat)
    s.position.set(x, deckY + 0.8, 0)
    s.castShadow = true
    s.receiveShadow = true
    group.add(s)
    const sk = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.94, r * 0.98, 1.4, 36), skirt)
    sk.position.set(x, deckY + 0.3, 0)
    sk.castShadow = true
    group.add(sk)
    const domeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.5, 12), std(0x9a9a92, 0.5, 0.4))
    domeTop.position.set(x, deckY + 0.8 + r + 0.1, 0)
    group.add(domeTop)
  }
  const pipeMat = std(0xb9b39f, 0.5, 0.5)
  pipe(group, pipeMat, 0.14, 40, -L / 2 + 28, deckY + 0.5, spec.beam * 0.42, "x")
  pipe(group, pipeMat, 0.14, 40, -L / 2 + 28, deckY + 0.5, -spec.beam * 0.42, "x")
  hullName(group, name.toUpperCase(), 4, deckY - 0.8, spec.beam / 2 + 0.02, 13)
  return { group, length: L, beam: spec.beam, draft: spec.draft, depth: spec.depth, deckY, funnelTop, radar: acc.radar }
}

export function createTug(): ShipModel {
  const spec: HullSpec = {
    length: 6.4,
    beam: 2.4,
    depth: 1.5,
    draft: 0.8,
    forecastleSheer: 0.25,
    colors: { hull: 0xb3261e, boot: 0x141414, bottom: 0x3a3a3a, deck: 0x444a44, stripe: 0x111111 },
  }
  const group = new THREE.Group()
  assembleHull(group, spec)
  const deckY = spec.depth - spec.draft
  addBox(group, std(0xf2f0ea, 0.5, 0.1), 2, 0.7, 1.6, 0.4, deckY, 0)
  addBox(group, std(0xf2f0ea, 0.5, 0.1), 1.2, 0.55, 1.4, 0.6, deckY + 0.7, 0)
  addBox(group, std(0x1a2530, 0.3, 0.3), 1.22, 0.2, 1.42, 0.6, deckY + 1.0, 0)
  const f = funnel(group, -0.6, deckY + 0.7, 0.8, 0.5, 0xb3261e, 0x111111)
  // Fender belt.
  const fender = new THREE.Mesh(new THREE.TorusGeometry(1, 0.12, 6, 30), std(0x151515, 0.9, 0))
  fender.scale.set(3.2, 1.2, 1)
  fender.rotation.x = Math.PI / 2
  fender.position.y = deckY - 0.1
  group.add(fender)
  return { group, length: spec.length, beam: spec.beam, draft: spec.draft, depth: spec.depth, deckY, funnelTop: f }
}
