import * as THREE from "three"
import { MapControls } from "three/examples/jsm/controls/MapControls.js"
import { Sky } from "three/examples/jsm/objects/Sky.js"
import { createOcean, waveHeight, WAVE_GLSL, waveUniforms, MAX_FIRE_LIGHTS } from "./ocean"
import { BERTH, createBathymetryTexture, createLand, groundHeight, QUAY } from "./world"
import { createShipyard } from "./shipyard"
import { createContainerShip, createLngCarrier, createTanker, type ShipModel } from "./ships"
import { Effects, type OilSlick } from "./effects"
import { GameAudio } from "./audio"
import { LANES } from "./lanes"
import {
  PLAYER_SHIP,
  TANKERS,
  computeGrounding,
  computeImpact,
  spilledAt,
  type GroundingReport,
  type ImpactReport,
  type VesselSpec,
} from "./impact"

export type ShipStatus = "moored" | "underway" | "arrived" | "aground" | "collided"

export interface Contact {
  id: string
  name: string
  type: string
  cargo: string
  distanceNm: number
  speedKn: number
  status: "underway" | "stricken"
  targeted: boolean
}

export interface HudState {
  status: ShipStatus
  drawing: boolean
  speedKn: number
  headingDeg: number
  loggedNm: number
  routeNm: number
  progress: number
  target: string | null
  spilledBbl: number | null
  follow: boolean
  contacts: Contact[]
}

export interface EngineCallbacks {
  onHud: (s: HudState) => void
  onCollision: (r: ImpactReport) => void
  onAground: (r: GroundingReport) => void
  onFollowChange: (f: boolean) => void
}

// Display conversions: world units are ~5 m, and ship speed is time-compressed for play.
const KN_PER_UNIT = 1.4
const NM_PER_UNIT = 5 / 1852
const CRUISE = 13

const tmpV = new THREE.Vector3()
const tmpV2 = new THREE.Vector3()

function wrapAngle(a: number) {
  while (a > Math.PI) a -= Math.PI * 2
  while (a < -Math.PI) a += Math.PI * 2
  return a
}

const forwardOf = (heading: number) => new THREE.Vector2(Math.cos(heading), -Math.sin(heading))

interface Vessel {
  model: ShipModel
  x: number
  z: number
  heading: number
  speed: number
  roll: number
  pitch: number
  bob: number
  listAngle: number
  sink: number
  wakeAcc: number
}

interface Tanker extends Vessel {
  spec: VesselSpec
  curve: THREE.CatmullRomCurve3
  length: number
  u: number
  laneSpeed: number
  dir: 1 | -1
  hit: boolean
  hitTime: number
  label: HTMLDivElement
}

function obbOverlap(a: Vessel, b: Vessel, pad = 0) {
  const axesA = [forwardOf(a.heading), forwardOf(a.heading + Math.PI / 2)]
  const axesB = [forwardOf(b.heading), forwardOf(b.heading + Math.PI / 2)]
  const ha = [a.model.length * 0.49, a.model.beam * 0.5]
  const hb = [b.model.length * 0.49, b.model.beam * 0.5]
  const d = new THREE.Vector2(b.x - a.x, b.z - a.z)
  for (const axis of [...axesA, ...axesB]) {
    const ra = ha[0] * Math.abs(axesA[0].dot(axis)) + ha[1] * Math.abs(axesA[1].dot(axis))
    const rb = hb[0] * Math.abs(axesB[0].dot(axis)) + hb[1] * Math.abs(axesB[1].dot(axis))
    if (Math.abs(d.dot(axis)) > ra + rb + pad) return false
  }
  return true
}

function routeMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { ...waveUniforms(), uTime: { value: 0 }, uDone: { value: 0 }, uDrawing: { value: 0 } },
    vertexShader: /* glsl */ `
      uniform float uTime;
      ${WAVE_GLSL}
      attribute float aDist;
      attribute float aLand;
      attribute float aSide;
      varying float vDist;
      varying float vLand;
      varying float vSide;
      void main() {
        vec3 n; float j;
        vec3 wp = position;
        vec3 d = gerstner(wp.xz, uTime, n, j);
        wp.y = d.y + 0.9;
        vDist = aDist;
        vLand = aLand;
        vSide = aSide;
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uDone;
      uniform float uDrawing;
      varying float vDist;
      varying float vLand;
      varying float vSide;
      void main() {
        float edge = 1.0 - smoothstep(0.55, 1.0, abs(vSide));
        float dash = smoothstep(0.0, 0.08, fract(vDist / 9.0 - uTime * 0.9)) * (1.0 - smoothstep(0.55, 0.62, fract(vDist / 9.0 - uTime * 0.9)));
        vec3 col = mix(vec3(1.0, 0.33, 0.05), vec3(1.0, 0.1, 0.1), vLand);
        float done = step(vDist, uDone);
        float a = edge * mix(0.45 + 0.55 * dash, 0.18, done);
        gl_FragColor = vec4(col * (0.9 + dash * 0.5), a);
      }
    `,
    transparent: true,
    depthWrite: false,
  })
}

export class ShipRouteEngine {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera: THREE.PerspectiveCamera
  private controls: MapControls
  private sun: THREE.DirectionalLight
  private sunDir: THREE.Vector3
  private ocean: ReturnType<typeof createOcean>
  private effects: Effects
  private audio = new GameAudio()
  private clock = new THREE.Clock()
  private time = 0
  private raf = 0
  private disposed = false
  private resizeObs: ResizeObserver

  private player!: Vessel
  private tankers: Tanker[] = []
  private status: ShipStatus = "moored"
  private route: THREE.Vector2[] = []
  private routeCum: number[] = []
  private routeIdx = 0
  private routeMesh: THREE.Mesh
  private routeMat: THREE.ShaderMaterial
  private drawing = false
  private drawPts: THREE.Vector2[] = []
  private pointerId: number | null = null
  private target: Tanker | null = null
  private logged = 0
  private startRing: THREE.Mesh
  private endMarker: THREE.Mesh
  private reticle: THREE.Mesh
  private moorLines: THREE.Line[] = []
  private moorPoints: { ship: THREE.Vector3; shore: THREE.Vector3 }[] = []
  private report: ImpactReport | null = null
  private impactTime = 0
  private slick: OilSlick | null = null
  private follow = true
  private timeScale = 1
  private shake = 0
  private hudAcc = 0
  private fly: { fromT: THREE.Vector3; toT: THREE.Vector3; fromP: THREE.Vector3; toP: THREE.Vector3; t: number; dur: number } | null = null
  private raycaster = new THREE.Raycaster()
  private waterPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  private labels: { el: HTMLDivElement; pos: () => THREE.Vector3 }[] = []
  private playerLabel: HTMLDivElement
  private cb: EngineCallbacks
  private dom: HTMLElement
  private labelLayer: HTMLElement

  constructor(container: HTMLElement, labelLayer: HTMLElement, cb: EngineCallbacks, quality: "high" | "low") {
    this.cb = cb
    this.labelLayer = labelLayer
    const high = quality === "high"

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, high ? 1.75 : 1.25))
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.52
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.dom = this.renderer.domElement
    this.dom.style.touchAction = "none"
    this.dom.style.display = "block"
    container.appendChild(this.dom)

    this.camera = new THREE.PerspectiveCamera(48, container.clientWidth / container.clientHeight, 2, 400000)

    // Sky, environment reflections and sunlight.
    this.sunDir = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - 21), THREE.MathUtils.degToRad(148))
    const makeSky = () => {
      const sky = new Sky()
      sky.scale.setScalar(300000)
      const u = sky.material.uniforms
      u.turbidity.value = 3.2
      u.rayleigh.value = 1.3
      u.mieCoefficient.value = 0.004
      u.mieDirectionalG.value = 0.86
      u.sunPosition.value.copy(this.sunDir)
      return sky
    }
    this.scene.add(makeSky())
    const skyScene = new THREE.Scene()
    skyScene.add(makeSky())
    const cubeRT = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter })
    new THREE.CubeCamera(1, 400000, cubeRT).update(this.renderer, skyScene)
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.scene.environment = pmrem.fromScene(skyScene as unknown as THREE.Scene, 0, 1, 400000).texture
    this.scene.environmentIntensity = 0.55
    pmrem.dispose()

    const sunColor = new THREE.Color(1.0, 0.9, 0.78)
    this.sun = new THREE.DirectionalLight(sunColor, 3.2)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.setScalar(high ? 4096 : 2048)
    const sc = this.sun.shadow.camera
    sc.left = sc.bottom = -260
    sc.right = sc.top = 260
    sc.near = 10
    sc.far = 2000
    this.sun.shadow.bias = -0.0004
    this.sun.shadow.normalBias = 0.35
    this.scene.add(this.sun, this.sun.target)
    this.scene.add(new THREE.HemisphereLight(0xa8c8ff, 0x1a2a33, 0.35))

    // Effects map must exist before the ocean samples it.
    this.effects = new Effects((x, z) => waveHeight(x, z, this.time))
    this.scene.add(this.effects.scene)

    this.ocean = createOcean({
      envMap: cubeRT.texture,
      bathymetry: createBathymetryTexture(high ? 512 : 384),
      effects: this.effects.target.texture,
      sunDir: this.sunDir,
      sunColor: new THREE.Color(sunColor).multiplyScalar(6),
      segments: high ? 560 : 320,
    })
    this.scene.add(this.ocean.mesh)

    this.scene.add(createLand())
    const yard = createShipyard()
    this.scene.add(yard.group)

    // Player vessel at the berth.
    const pm = createContainerShip()
    this.scene.add(pm.group)
    this.player = this.makeVessel(pm, BERTH.x, BERTH.z, BERTH.heading)
    this.effects.addExhaust(() => this.funnelWorld(this.player), 3)
    this.setupMooring(yard.bollards)

    // Tanker traffic.
    const models: Record<string, () => ShipModel> = {
      vlcc: () => createTanker({ length: 66, beam: 11.6, depth: 5.8, draft: 3.9, hull: 0x2b2b2e, deck: 0x7a3b2a, funnel: 0x2b2b2e, band: 0xd4a017, name: "Nordic Titan", stripe: 0x2b2b2e }),
      suezmax: () => createTanker({ length: 55, beam: 9.6, depth: 5.0, draft: 3.4, hull: 0x7d1d1a, deck: 0x3f5a3a, funnel: 0xf2f0ea, band: 0x1f5fa8, name: "Coral Horizon" }),
      aframax: () => createTanker({ length: 49, beam: 8.8, depth: 4.6, draft: 3.1, hull: 0x14365e, deck: 0x8a3a24, funnel: 0x14365e, band: 0xe0e0e0, name: "Atlas Meridian" }),
      product: () => createTanker({ length: 37, beam: 6.4, depth: 3.6, draft: 2.3, hull: 0x2e6b4f, deck: 0x6b6f5c, funnel: 0xe8e6df, band: 0x2e6b4f, name: "Sea Harmony" }),
      lng: () => createLngCarrier("Polar Spirit"),
    }
    for (const spec of TANKERS) {
      const lane = LANES[spec.id]
      const model = models[spec.id]()
      this.scene.add(model.group)
      const curve = new THREE.CatmullRomCurve3(lane.points.map(([x, z]) => new THREE.Vector3(x, 0, z)), true, "centripetal")
      const v = this.makeVessel(model, 0, 0, 0) as Tanker
      Object.assign(v, {
        spec,
        curve,
        length: curve.getLength(),
        u: lane.phase,
        laneSpeed: lane.speed,
        dir: lane.reverse ? -1 : 1,
        hit: false,
        hitTime: 0,
        label: this.makeLabel(spec.name, spec.type, "tanker"),
      })
      v.speed = lane.speed
      this.placeOnLane(v, 0)
      this.tankers.push(v)
      this.effects.addExhaust(() => (v.hit ? null : this.funnelWorld(v)), 2)
      this.labels.push({ el: v.label, pos: () => tmpV.set(v.x, v.model.deckY + 16 - v.sink, v.z) })
    }
    this.playerLabel = this.makeLabel(PLAYER_SHIP.name, "Your ship · tap & drag to plot a course", "player")
    this.labels.push({ el: this.playerLabel, pos: () => tmpV.set(this.player.x, 17 - this.player.sink, this.player.z) })
    const yardLabel = this.makeLabel("Meridian Shipyard", "Berth 3", "place")
    this.labels.push({ el: yardLabel, pos: () => tmpV.set((QUAY.minX + QUAY.maxX) / 2 - 10, 18, QUAY.minZ + 40) })

    // Route ribbon + markers.
    this.routeMat = routeMaterial()
    this.routeMesh = new THREE.Mesh(new THREE.BufferGeometry(), this.routeMat)
    this.routeMesh.frustumCulled = false
    this.routeMesh.renderOrder = 6
    this.scene.add(this.routeMesh)

    this.startRing = new THREE.Mesh(
      new THREE.RingGeometry(0.92, 1, 72),
      new THREE.MeshBasicMaterial({ color: 0xff6a1a, transparent: true, opacity: 0.8, depthWrite: false, side: THREE.DoubleSide }),
    )
    this.startRing.rotation.x = -Math.PI / 2
    this.startRing.renderOrder = 7
    this.scene.add(this.startRing)

    this.endMarker = new THREE.Mesh(
      new THREE.RingGeometry(3, 4.2, 40),
      new THREE.MeshBasicMaterial({ color: 0xff5a14, transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide }),
    )
    this.endMarker.rotation.x = -Math.PI / 2
    this.endMarker.visible = false
    this.endMarker.renderOrder = 7
    this.scene.add(this.endMarker)

    this.reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.9, 1, 4, 1, Math.PI / 4),
      new THREE.MeshBasicMaterial({ color: 0xff2a2a, transparent: true, opacity: 0.95, depthWrite: false, side: THREE.DoubleSide }),
    )
    this.reticle.rotation.x = -Math.PI / 2
    this.reticle.visible = false
    this.reticle.renderOrder = 7
    this.scene.add(this.reticle)

    // Camera.
    this.controls = new MapControls(this.camera, this.dom)
    this.dom.addEventListener("pointerdown", this.onPointerDown, { capture: true })
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 35
    this.controls.maxDistance = 2600
    this.controls.maxPolarAngle = 1.4
    this.controls.zoomToCursor = true
    const t0 = new THREE.Vector3(BERTH.x + 190, 0, BERTH.z - 40)
    this.controls.target.copy(t0)
    this.camera.position.set(t0.x + 170, 230, t0.z + 330)
    this.controls.update()

    window.addEventListener("pointermove", this.onPointerMove)
    window.addEventListener("pointerup", this.onPointerUp)
    window.addEventListener("pointercancel", this.onPointerUp)
    this.dom.addEventListener("pointermove", this.onHover)

    this.resizeObs = new ResizeObserver(() => this.resize(container))
    this.resizeObs.observe(container)

    this.clock.start()
    const loop = () => {
      if (this.disposed) return
      this.raf = requestAnimationFrame(loop)
      this.tick()
    }
    loop()
  }

  // ---------------------------------------------------------------------------
  // Public API

  reset() {
    this.effects.reset()
    this.report = null
    this.slick = null
    this.target = null
    this.setRoute([])
    this.status = "moored"
    this.logged = 0
    const p = this.player
    Object.assign(p, { x: BERTH.x, z: BERTH.z, heading: BERTH.heading, speed: 0, sink: 0, listAngle: 0 })
    this.moorLines.forEach((l) => (l.visible = true))
    for (const t of this.tankers) {
      t.hit = false
      t.sink = 0
      t.listAngle = 0
      t.speed = t.laneSpeed
      t.model.group.visible = true
    }
    this.effects.firePoints = []
    this.shake = 0
    this.flyTo(new THREE.Vector3(BERTH.x + 190, 0, BERTH.z - 40), new THREE.Vector3(170, 230, 330), 1.4)
    this.setFollow(true)
    this.pushHud(true)
  }

  setFollow(f: boolean) {
    if (this.follow === f) return
    this.follow = f
    this.cb.onFollowChange(f)
  }

  overview() {
    this.setFollow(false)
    this.flyTo(new THREE.Vector3(0, 0, -40), new THREE.Vector3(0, 1500, 820), 1.8)
  }

  focusContact(id: string) {
    const t = this.tankers.find((x) => x.spec.id === id)
    if (!t) return
    this.setFollow(false)
    this.flyTo(new THREE.Vector3(t.x, 0, t.z), new THREE.Vector3(120, 150, 220), 1.4)
  }

  focusPlayer() {
    this.flyTo(new THREE.Vector3(this.player.x, 0, this.player.z), new THREE.Vector3(130, 190, 280), 1.2)
    this.setFollow(true)
  }

  setTimeScale(s: number) {
    this.timeScale = s
  }

  setMuted(m: boolean) {
    this.audio.setMuted(m)
  }

  clearRoute() {
    if (this.status === "underway") {
      this.setRoute([])
      this.status = "arrived"
      this.pushHud(true)
    }
  }

  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.resizeObs.disconnect()
    window.removeEventListener("pointermove", this.onPointerMove)
    window.removeEventListener("pointerup", this.onPointerUp)
    window.removeEventListener("pointercancel", this.onPointerUp)
    this.dom.removeEventListener("pointerdown", this.onPointerDown, { capture: true })
    this.dom.removeEventListener("pointermove", this.onHover)
    this.controls.dispose()
    this.audio.dispose()
    this.labels.forEach((l) => l.el.remove())
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.geometry) m.geometry.dispose()
      const mat = m.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
      else mat?.dispose()
    })
    this.effects.target.dispose()
    this.renderer.dispose()
    this.dom.remove()
  }

  // ---------------------------------------------------------------------------
  // Setup helpers

  private makeVessel(model: ShipModel, x: number, z: number, heading: number): Vessel {
    return { model, x, z, heading, speed: 0, roll: 0, pitch: 0, bob: 0, listAngle: 0, sink: 0, wakeAcc: 0 }
  }

  private makeLabel(title: string, sub: string, kind: "tanker" | "player" | "place") {
    const el = document.createElement("div")
    el.className = `sr-label sr-label-${kind}`
    const t = document.createElement("div")
    t.className = "sr-label-title"
    t.textContent = title
    const s = document.createElement("div")
    s.className = "sr-label-sub"
    s.textContent = sub
    el.append(t, s)
    this.labelLayer.appendChild(el)
    return el
  }

  private funnelWorld(v: Vessel) {
    return v.model.group.localToWorld(tmpV2.copy(v.model.funnelTop))
  }

  private setupMooring(bollards: THREE.Vector3[]) {
    const L = this.player.model.length
    const deck = this.player.model.deckY + 0.3
    const shipPts = [
      new THREE.Vector3(-L * 0.46, deck, -2.5),
      new THREE.Vector3(-L * 0.36, deck, -3.6),
      new THREE.Vector3(L * 0.36, deck + 0.6, -3.2),
      new THREE.Vector3(L * 0.44, deck + 0.6, -2),
    ]
    const shipWorldZ = (p: THREE.Vector3) => BERTH.z - p.x // heading north: local +x → world -z
    const pick = (z: number) => bollards.reduce((best, b) => (Math.abs(b.z - z) < Math.abs(best.z - z) ? b : best), bollards[0])
    const offsets = [18, 4, -4, -18]
    const mat = new THREE.LineBasicMaterial({ color: 0x1b1b1b })
    shipPts.forEach((sp, i) => {
      const shore = pick(shipWorldZ(sp) + offsets[i])
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
      const line = new THREE.Line(geo, mat)
      line.frustumCulled = false
      this.scene.add(line)
      this.moorLines.push(line)
      this.moorPoints.push({ ship: sp, shore: shore.clone() })
    })
  }

  private placeOnLane(t: Tanker, dt: number) {
    t.u = (t.u + (t.dir * t.speed * dt) / t.length + 1) % 1
    const p = t.curve.getPointAt(t.u)
    const tan = t.curve.getTangentAt(t.u).multiplyScalar(t.dir)
    t.x = p.x
    t.z = p.z
    const h = Math.atan2(-tan.z, tan.x)
    t.heading = dt === 0 ? h : t.heading + wrapAngle(h - t.heading) * Math.min(1, dt * 2)
  }

  private resize(container: HTMLElement) {
    const w = container.clientWidth
    const h = container.clientHeight
    if (!w || !h) return
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  private flyTo(target: THREE.Vector3, offset: THREE.Vector3, dur: number) {
    this.fly = {
      fromT: this.controls.target.clone(),
      toT: target.clone(),
      fromP: this.camera.position.clone(),
      toP: target.clone().add(offset),
      t: 0,
      dur,
    }
  }

  // ---------------------------------------------------------------------------
  // Input: drawing a course from the ship

  private pointerNdc(e: PointerEvent) {
    const r = this.dom.getBoundingClientRect()
    return new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
  }

  private waterPoint(e: PointerEvent) {
    this.raycaster.setFromCamera(this.pointerNdc(e), this.camera)
    const hit = this.raycaster.ray.intersectPlane(this.waterPlane, new THREE.Vector3())
    return hit ? new THREE.Vector2(hit.x, hit.z) : null
  }

  private canCommand() {
    return this.status === "moored" || this.status === "underway" || this.status === "arrived"
  }

  private overPlayer(e: PointerEvent) {
    if (!this.canCommand()) return false
    const p = this.waterPoint(e)
    const P = this.player
    if (p) {
      const f = forwardOf(P.heading)
      const d = new THREE.Vector2(p.x - P.x, p.y - P.z)
      const along = Math.abs(d.dot(f))
      const across = Math.abs(d.x * -f.y + d.y * f.x)
      if (along < P.model.length * 0.55 && across < P.model.beam * 1.6 + 4) return true
    }
    // Screen-space fallback for small on-screen ships (touch friendly).
    const r = this.dom.getBoundingClientRect()
    const s = tmpV.set(P.x, 2, P.z).project(this.camera)
    const sx = ((s.x + 1) / 2) * r.width + r.left
    const sy = ((1 - s.y) / 2) * r.height + r.top
    return Math.hypot(sx - e.clientX, sy - e.clientY) < 42
  }

  private onHover = (e: PointerEvent) => {
    if (this.drawing) return
    this.dom.style.cursor = this.overPlayer(e) ? "crosshair" : ""
  }

  private onPointerDown = (e: PointerEvent) => {
    this.audio.ensure()
    if (e.button !== 0 && e.pointerType === "mouse") return
    if (this.overPlayer(e)) {
      e.stopImmediatePropagation()
      e.preventDefault()
      this.drawing = true
      this.pointerId = e.pointerId
      this.controls.enabled = false
      this.fly = null
      this.drawPts = [new THREE.Vector2(this.player.x, this.player.z)]
      this.pushHud(true)
      return
    }
    if (this.follow && e.button === 0) this.setFollow(false)
  }

  private onPointerMove = (e: PointerEvent) => {
    if (!this.drawing || e.pointerId !== this.pointerId) return
    const p = this.waterPoint(e)
    if (!p) return
    const last = this.drawPts[this.drawPts.length - 1]
    const d = last.distanceTo(p)
    if (d < 3) return
    const steps = Math.ceil(d / 6)
    for (let i = 1; i <= steps; i++) this.drawPts.push(last.clone().lerp(p, i / steps))
    this.updateRouteMesh(this.smooth(this.drawPts), true)
  }

  private onPointerUp = (e: PointerEvent) => {
    if (!this.drawing || e.pointerId !== this.pointerId) return
    this.drawing = false
    this.pointerId = null
    this.controls.enabled = true
    const pts = this.smooth(this.drawPts)
    let len = 0
    for (let i = 1; i < pts.length; i++) len += pts[i].distanceTo(pts[i - 1])
    if (len < 25) {
      this.updateRouteMesh(this.route, false)
      this.pushHud(true)
      return
    }
    this.commitRoute(pts, new THREE.Vector2(e.clientX, e.clientY))
  }

  private smooth(raw: THREE.Vector2[]) {
    if (raw.length < 3) return raw.map((p) => p.clone())
    // Thin out, then resample a centripetal Catmull-Rom at ~2 unit spacing.
    const thin: THREE.Vector2[] = [raw[0]]
    for (const p of raw) if (p.distanceTo(thin[thin.length - 1]) >= 8) thin.push(p)
    if (thin[thin.length - 1] !== raw[raw.length - 1]) thin.push(raw[raw.length - 1])
    if (thin.length < 3) return thin.map((p) => p.clone())
    const curve = new THREE.CatmullRomCurve3(thin.map((p) => new THREE.Vector3(p.x, 0, p.y)), false, "centripetal")
    const n = Math.max(8, Math.round(curve.getLength() / 2))
    return curve.getSpacedPoints(n).map((v) => new THREE.Vector2(v.x, v.z))
  }

  private setRoute(pts: THREE.Vector2[]) {
    this.route = pts
    this.routeCum = [0]
    for (let i = 1; i < pts.length; i++) this.routeCum.push(this.routeCum[i - 1] + pts[i].distanceTo(pts[i - 1]))
    this.routeIdx = 0
    this.updateRouteMesh(pts, false)
    this.endMarker.visible = pts.length > 1
    if (pts.length > 1) {
      const e = pts[pts.length - 1]
      this.endMarker.position.set(e.x, 1.4, e.y)
    }
  }

  /** Screen-space distance (px) from a client point to a tanker's hull outline. */
  private screenDistance(t: Tanker, client: THREE.Vector2) {
    const r = this.dom.getBoundingClientRect()
    const f = forwardOf(t.heading)
    let best = Infinity
    for (let k = -0.5; k <= 0.5; k += 0.125) {
      const s = tmpV.set(t.x + f.x * t.model.length * k, t.model.deckY * 0.6, t.z + f.y * t.model.length * k).project(this.camera)
      if (s.z > 1) continue
      const sx = ((s.x + 1) / 2) * r.width + r.left
      const sy = ((1 - s.y) / 2) * r.height + r.top
      best = Math.min(best, Math.hypot(sx - client.x, sy - client.y))
    }
    return best
  }

  private commitRoute(pts: THREE.Vector2[], release?: THREE.Vector2) {
    const wasMoored = this.status === "moored"
    this.setRoute(pts)
    this.status = "underway"
    // Lock on to a tanker if the course ends on (or runs across) one.
    this.target = null
    const end = pts[pts.length - 1]
    let best: { t: Tanker; d: number } | null = null
    for (const t of this.tankers) {
      if (t.hit) continue
      const dEnd = Math.hypot(t.x - end.x, t.z - end.y)
      if (dEnd < t.model.length * 0.6 + 40 && (!best || dEnd < best.d)) best = { t, d: dEnd }
    }
    if (!best && release) {
      // Far-off ships are only a few pixels tall, so also accept a release close on screen.
      for (const t of this.tankers) {
        if (t.hit) continue
        const px = this.screenDistance(t, release)
        if (px < 56 && (!best || px < best.d)) best = { t, d: px }
      }
    }
    if (!best) {
      for (const t of this.tankers) {
        if (t.hit) continue
        for (let i = 0; i < pts.length; i += 3) {
          const d = Math.hypot(t.x - pts[i].x, t.z - pts[i].y)
          if (d < t.model.length * 0.45 && (!best || d < best.d)) best = { t, d }
        }
      }
    }
    this.target = best?.t ?? null
    if (wasMoored) {
      this.moorLines.forEach((l) => (l.visible = false))
      this.audio.horn()
    }
    this.setFollow(true)
    this.pushHud(true)
  }

  private updateRouteMesh(pts: THREE.Vector2[], drawing: boolean) {
    const geo = this.routeMesh.geometry
    if (pts.length < 2) {
      geo.setDrawRange(0, 0)
      return
    }
    const n = pts.length
    const pos = new Float32Array(n * 2 * 3)
    const dist = new Float32Array(n * 2)
    const land = new Float32Array(n * 2)
    const side = new Float32Array(n * 2)
    const idx: number[] = []
    let acc = 0
    const width = 2.6
    for (let i = 0; i < n; i++) {
      const p = pts[i]
      if (i > 0) acc += p.distanceTo(pts[i - 1])
      const a = pts[Math.max(0, i - 1)]
      const b = pts[Math.min(n - 1, i + 1)]
      const tx = b.x - a.x
      const tz = b.y - a.y
      const l = Math.hypot(tx, tz) || 1
      const nx = -tz / l
      const nz = tx / l
      const onLand = groundHeight(p.x, p.y) > -2 ? 1 : 0
      for (let s = 0; s < 2; s++) {
        const sg = s === 0 ? -1 : 1
        const k = i * 2 + s
        pos[k * 3] = p.x + nx * width * sg
        pos[k * 3 + 1] = 0
        pos[k * 3 + 2] = p.y + nz * width * sg
        dist[k] = acc
        land[k] = onLand
        side[k] = sg
      }
      if (i < n - 1) {
        const k = i * 2
        idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2)
      }
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
    geo.setAttribute("aDist", new THREE.BufferAttribute(dist, 1))
    geo.setAttribute("aLand", new THREE.BufferAttribute(land, 1))
    geo.setAttribute("aSide", new THREE.BufferAttribute(side, 1))
    geo.setIndex(idx)
    geo.setDrawRange(0, idx.length)
    this.routeMat.uniforms.uDrawing.value = drawing ? 1 : 0
  }

  // ---------------------------------------------------------------------------
  // Simulation

  private updatePlayer(dt: number) {
    const P = this.player
    if (this.status === "underway" && this.route.length > 1) {
      // Advance the projection index along the route.
      let bestI = this.routeIdx
      let bestD = Infinity
      const lim = Math.min(this.route.length - 1, this.routeIdx + 40)
      for (let i = this.routeIdx; i <= lim; i++) {
        const d = (this.route[i].x - P.x) ** 2 + (this.route[i].y - P.z) ** 2
        if (d < bestD) {
          bestD = d
          bestI = i
        }
      }
      this.routeIdx = bestI
      const total = this.routeCum[this.routeCum.length - 1]
      const remaining = total - this.routeCum[bestI]
      // Look-ahead must stay well beyond the turning circle or pure pursuit orbits.
      const look = P.model.length * 0.7 + P.speed * 1.6
      let li = bestI
      while (li < this.route.length - 1 && this.routeCum[li] - this.routeCum[bestI] < look) li++
      let aim = this.route[li]

      const T = this.target
      let ramming = false
      if (T && !T.hit) {
        const dT = Math.hypot(T.x - P.x, T.z - P.z)
        if (remaining < 90 || dT < 140) {
          // Intercept: lead the moving tanker.
          const tf = forwardOf(T.heading)
          const lead = Math.min(dT / Math.max(P.speed, 4), 20)
          aim = new THREE.Vector2(T.x + tf.x * T.speed * lead, T.z + tf.y * T.speed * lead)
          ramming = true
        }
      }

      const desired = Math.atan2(-(aim.y - P.z), aim.x - P.x)
      const err = wrapAngle(desired - P.heading)
      // Tugs and thrusters let her pivot at low speed; the rudder takes over once moving.
      const maxTurn = 0.2 + 0.12 * Math.min(P.speed / CRUISE, 1)
      const turn = THREE.MathUtils.clamp(err * 1.5 * dt, -maxTurn * dt, maxTurn * dt)
      P.heading += turn
      P.roll += (-(turn / dt) * 0.35 * Math.min(P.speed / CRUISE, 1) - P.roll) * Math.min(1, dt * 1.5)

      let targetSpeed = Math.abs(err) > 1.1 ? 0.8 : CRUISE * THREE.MathUtils.clamp(1 - Math.abs(err) / 1.4, 0.15, 1)
      if (ramming) targetSpeed = CRUISE * 1.15 * THREE.MathUtils.clamp(1 - Math.abs(err) / 2, 0.4, 1)
      else if (remaining < 70) targetSpeed *= Math.max(remaining / 70, 0.1)
      const accel = targetSpeed > P.speed ? 1.3 : 2.6
      P.speed += THREE.MathUtils.clamp(targetSpeed - P.speed, -accel * dt, accel * dt)

      if (!ramming && (remaining < 4 || (bestI >= this.route.length - 2 && P.speed < 1))) {
        this.status = "arrived"
        this.target = null
        this.pushHud(true)
      }
      this.routeMat.uniforms.uDone.value = this.routeCum[bestI]
    } else if (this.status === "arrived") {
      P.speed = Math.max(0, P.speed - dt * 1.5)
      P.roll *= 1 - Math.min(1, dt)
    } else if (this.status === "aground" || this.status === "collided") {
      P.speed = Math.max(0, P.speed - dt * 6)
    }

    const f = forwardOf(P.heading)
    P.x += f.x * P.speed * dt
    P.z += f.y * P.speed * dt
    this.logged += P.speed * dt

    // Grounding check at the bow, shoulders and midships.
    if (this.status === "underway" && P.speed > 0.5) {
      const L = P.model.length
      const probes = [0.47, 0.3, 0]
      for (const k of probes) {
        const h = groundHeight(P.x + f.x * L * k, P.z + f.y * L * k)
        if (h > -P.model.draft * 0.95) {
          this.runAground()
          break
        }
      }
    }

    // Collision with tankers.
    if (this.status === "underway") {
      for (const t of this.tankers) {
        if (t.hit) continue
        if (Math.hypot(t.x - P.x, t.z - P.z) > (t.model.length + P.model.length) / 2 + 5) continue
        if (obbOverlap(P, t)) {
          this.collide(t)
          break
        }
      }
    }
  }

  private runAground() {
    const P = this.player
    const kn = P.speed * KN_PER_UNIT
    this.status = "aground"
    this.target = null
    const r = computeGrounding(kn)
    const f = forwardOf(P.heading)
    const bx = P.x + f.x * P.model.length * 0.45
    const bz = P.z + f.y * P.model.length * 0.45
    this.effects.splash(bx, bz, 3)
    this.slick = this.effects.addSlick(P.x, P.z, 18 + kn * 1.5)
    this.slick.drift.set(0.2, 0.1)
    P.speed *= 0.2
    P.listAngle = 0.07
    this.shake = 0.35
    this.audio.crunch()
    this.cb.onAground(r)
    this.pushHud(true)
  }

  private collide(t: Tanker) {
    const P = this.player
    const kn = P.speed * KN_PER_UNIT
    const rel = Math.abs(wrapAngle(P.heading - t.heading))
    const angleDeg = THREE.MathUtils.radToDeg(rel)
    const f = forwardOf(P.heading)
    // Impact point: our bow projected onto the tanker's side.
    const bow = new THREE.Vector3(P.x + f.x * P.model.length * 0.47, 1.5, P.z + f.y * P.model.length * 0.47)
    const report = computeImpact(t.spec, Math.max(kn, 3), angleDeg, this.nearestShoreKm(bow.x, bow.z))
    this.report = report
    this.impactTime = this.time
    this.status = "collided"
    this.target = null
    t.hit = true
    t.hitTime = this.time
    P.speed *= 0.15
    P.listAngle = 0.1

    const lng = t.spec.kind === "lng"
    const power = THREE.MathUtils.clamp(0.9 + (kn / 18) * 0.5, 0.9, 1.5) * (lng ? 1.35 : 1)
    this.effects.explode(bow, power, lng)
    this.audio.explosion(power)
    this.shake = 1.4

    const visualR = THREE.MathUtils.clamp(55 + 150 * (Math.log10(Math.max(report.totalOilBbl, 1000) / 5000) / 2.6), 45, 230)
    this.slick = this.effects.addSlick(bow.x, bow.z, visualR)
    this.effects.addFire(bow.x, 0.5, bow.z, lng ? 2.2 : 1.6, 260)
    const tankerFire = () => (t.model.group.visible ? t.model.group.localToWorld(tmpV2.set(0, t.model.deckY, 0)) : null)
    this.effects.addFire(0, 0, 0, 1.3, 320, tankerFire)
    const playerFire = () => P.model.group.localToWorld(tmpV2.set(P.model.length * 0.38, P.model.deckY + 1, 0))
    this.effects.addFire(0, 0, 0, 0.8, 200, playerFire)
    for (let i = 0; i < 4; i++) {
      const a = Math.random() * Math.PI * 2
      const d = 20 + Math.random() * visualR * 0.35
      this.effects.addFire(bow.x + Math.cos(a) * d, 0.4, bow.z + Math.sin(a) * d, 0.9, 90 + Math.random() * 120)
    }
    this.effects.firePoints = [
      { pos: bow.clone().setY(8), intensity: 1.6 },
      { pos: new THREE.Vector3(t.x, 10, t.z), intensity: 1 },
    ]
    this.flyTo(bow.clone().setY(0), new THREE.Vector3(150, 120, 240), 2.2)
    this.setFollow(false)
    this.cb.onCollision(report)
    this.pushHud(true)
  }

  private nearestShoreKm(x: number, z: number) {
    for (let r = 10; r <= 1500; r += 10) {
      for (let a = 0; a < 24; a++) {
        const ang = (a / 24) * Math.PI * 2
        if (groundHeight(x + Math.cos(ang) * r, z + Math.sin(ang) * r) > 0) return (r * 5) / 1000
      }
    }
    return 7.5
  }

  private updateTankers(dt: number) {
    for (const t of this.tankers) {
      if (!t.hit) {
        this.placeOnLane(t, dt)
      } else {
        const since = this.time - t.hitTime
        t.speed = Math.max(0, t.speed - dt * 0.6)
        const f = forwardOf(t.heading)
        t.x += f.x * t.speed * dt
        t.z += f.y * t.speed * dt
        // Flooding: take a list, then settle by the stern.
        t.listAngle = THREE.MathUtils.lerp(t.listAngle, Math.min(0.28, since * 0.004), Math.min(1, dt))
        t.sink = Math.min(t.model.depth * 1.35, Math.max(0, since - 8) * 0.012 + Math.max(0, since - 120) * 0.02)
      }
    }
  }

  private poseVessel(v: Vessel, dt: number, sternDown = 0) {
    const f = forwardOf(v.heading)
    const L = v.model.length * 0.4
    const B = v.model.beam * 0.5
    const t = this.time
    const hc = waveHeight(v.x, v.z, t)
    const hb = waveHeight(v.x + f.x * L, v.z + f.y * L, t)
    const hs = waveHeight(v.x - f.x * L, v.z - f.y * L, t)
    const hp = waveHeight(v.x + f.y * B, v.z - f.x * B, t)
    const hst = waveHeight(v.x - f.y * B, v.z + f.x * B, t)
    const k = Math.min(1, dt * 3)
    v.bob += ((hc + hb + hs) / 3 * 0.85 - v.bob) * k
    v.pitch += (Math.atan2(hb - hs, 2 * L) * 0.7 - v.pitch) * k
    const rollWave = -Math.atan2(hst - hp, 2 * B) * 0.5
    const g = v.model.group
    g.position.set(v.x, v.bob - v.sink, v.z)
    g.rotation.set(rollWave + v.roll + v.listAngle, v.heading, v.pitch - sternDown, "YZX")
    // Wake.
    if (v.speed > 0.4) {
      // Lay stamps evenly along the distance covered this frame so large steps leave no gaps.
      const spacing = 2.4
      v.wakeAcc += v.speed * dt
      while (v.wakeAcc > spacing) {
        v.wakeAcc -= spacing
        const back = v.wakeAcc
        const age = back / v.speed
        const sx = v.x - f.x * (v.model.length * 0.45 + back)
        const sz = v.z - f.y * (v.model.length * 0.45 + back)
        this.effects.wake(sx, sz, v.heading, v.model.beam, Math.min(1, 0.35 + v.speed / 10), v.speed, 5.5, age)
        const bx = v.x + f.x * (v.model.length * 0.2 - back)
        const bz = v.z + f.y * (v.model.length * 0.2 - back)
        this.effects.wake(bx, bz, v.heading, v.model.beam * 0.9, Math.min(0.55, v.speed / 18), v.speed, 5.5, age)
      }
    }
  }

  private pushHud(force = false) {
    if (!force && this.hudAcc < 0.12) return
    this.hudAcc = 0
    const P = this.player
    const total = this.routeCum.length ? this.routeCum[this.routeCum.length - 1] : 0
    const done = this.routeCum.length ? this.routeCum[this.routeIdx] : 0
    const contacts: Contact[] = this.tankers.map((t) => ({
      id: t.spec.id,
      name: t.spec.name,
      type: t.spec.type,
      cargo: t.spec.kind === "lng" ? `${(t.spec.cargoBbl / 1000).toFixed(0)}k m³ LNG` : `${(t.spec.cargoBbl / 1e6).toFixed(2)}M bbl · ${t.spec.cargo}`,
      distanceNm: Math.hypot(t.x - P.x, t.z - P.z) * NM_PER_UNIT,
      speedKn: t.speed * KN_PER_UNIT,
      status: t.hit ? "stricken" : "underway",
      targeted: this.target === t,
    }))
    let hdg = 90 - THREE.MathUtils.radToDeg(P.heading)
    hdg = ((hdg % 360) + 360) % 360
    this.cb.onHud({
      status: this.status,
      drawing: this.drawing,
      speedKn: P.speed * KN_PER_UNIT,
      headingDeg: hdg,
      loggedNm: this.logged * NM_PER_UNIT,
      routeNm: total * NM_PER_UNIT,
      progress: total ? done / total : 0,
      target: this.target?.spec.name ?? null,
      spilledBbl: this.report ? spilledAt(this.report, this.time - this.impactTime) : null,
      follow: this.follow,
      contacts,
    })
  }

  private updateCamera(dt: number) {
    if (this.fly) {
      const f = this.fly
      f.t += dt / f.dur
      const e = f.t >= 1 ? 1 : 1 - Math.pow(1 - f.t, 3)
      this.controls.target.lerpVectors(f.fromT, f.toT, e)
      this.camera.position.lerpVectors(f.fromP, f.toP, e)
      if (f.t >= 1) this.fly = null
    } else if (this.follow && !this.drawing) {
      const P = this.player
      const desired = tmpV.set(P.x, 0, P.z)
      const delta = desired.sub(this.controls.target).multiplyScalar(Math.min(1, dt * 2.2))
      this.controls.target.add(delta)
      this.camera.position.add(delta)
    }
    this.controls.update()
  }

  private updateLabels() {
    const w = this.dom.clientWidth
    const h = this.dom.clientHeight
    for (const l of this.labels) {
      const p = l.pos().clone()
      const dist = p.distanceTo(this.camera.position)
      p.project(this.camera)
      const visible = p.z < 1 && Math.abs(p.x) < 1.1 && Math.abs(p.y) < 1.1 && dist < 2600
      if (!visible) {
        l.el.style.opacity = "0"
        continue
      }
      const x = ((p.x + 1) / 2) * w
      const y = ((1 - p.y) / 2) * h
      l.el.style.opacity = dist > 1500 ? "0.55" : "1"
      l.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`
    }
    const showHint = this.status === "moored" || this.status === "arrived"
    this.playerLabel.classList.toggle("sr-label-hint", showHint)
  }

  private tick() {
    const real = Math.min(this.clock.getDelta(), 0.25)
    const dt = real * this.timeScale
    this.hudAcc += real

    // Fixed-ish substeps keep steering and collision checks stable under time warp.
    const steps = Math.max(1, Math.ceil(dt / 0.034))
    for (let i = 0; i < steps; i++) {
      this.time += dt / steps
      this.updatePlayer(dt / steps)
      this.updateTankers(dt / steps)
    }
    const P = this.player
    this.poseVessel(P, dt)
    for (const t of this.tankers) this.poseVessel(t, dt, t.hit ? Math.min(0.08, t.sink * 0.02) : 0)
    if (P.model.radar) P.model.radar.rotation.y += dt * 2.5
    for (const t of this.tankers) if (t.model.radar && !t.hit) t.model.radar.rotation.y += dt * 2.2

    // Bow spray at speed.
    if (P.speed > 7 && Math.random() < dt * 20) {
      const f = forwardOf(P.heading)
      this.effects.bowSpray(P.x + f.x * P.model.length * 0.48, P.bob, P.z + f.y * P.model.length * 0.48, f.x, f.y, P.speed)
    }

    // Mooring lines.
    if (this.moorLines[0]?.visible) {
      this.moorLines.forEach((line, i) => {
        const a = P.model.group.localToWorld(this.moorPoints[i].ship.clone())
        const attr = line.geometry.attributes.position as THREE.BufferAttribute
        attr.setXYZ(0, a.x, a.y, a.z)
        const b = this.moorPoints[i].shore
        attr.setXYZ(1, b.x, b.y, b.z)
        attr.needsUpdate = true
      })
    }

    // Markers.
    const canCmd = this.canCommand() && this.status !== "underway" && !this.drawing
    this.startRing.visible = canCmd
    if (canCmd) {
      const pulse = (this.time * 0.6) % 1
      this.startRing.position.set(P.x, P.bob + 0.8, P.z)
      this.startRing.scale.setScalar(P.model.length * 0.55 + pulse * 22)
      ;(this.startRing.material as THREE.MeshBasicMaterial).opacity = 0.85 * (1 - pulse)
    }
    if (this.endMarker.visible) {
      const e = this.endMarker.position
      e.y = waveHeight(e.x, e.z, this.time) + 1.2
      this.endMarker.scale.setScalar(1 + Math.sin(this.time * 4) * 0.12)
    }
    const T = this.target
    this.reticle.visible = !!T && !T.hit
    if (T && !T.hit) {
      this.reticle.position.set(T.x, T.bob + 1.5, T.z)
      this.reticle.scale.setScalar(T.model.length * 0.72 + Math.sin(this.time * 5) * 2)
      this.reticle.rotation.z = this.time * 0.8
    }
    if (this.status !== "underway" && !this.drawing && this.route.length && this.status !== "moored") {
      // Keep the finished course faintly visible until a new one is drawn.
      this.routeMat.uniforms.uDone.value = this.routeCum[this.routeCum.length - 1]
    }

    // Burning wreck lights on the water.
    const firePos = this.ocean.uniforms.uFirePos.value
    const fireCol = this.ocean.uniforms.uFireCol.value
    for (let i = 0; i < MAX_FIRE_LIGHTS; i++) {
      const fp = this.effects.firePoints[i]
      if (!fp) {
        fireCol[i].set(0, 0, 0)
        continue
      }
      const since = this.time - this.impactTime
      const flicker = 0.85 + Math.sin(this.time * 13 + i) * 0.1 + Math.sin(this.time * 5.1 + i * 2) * 0.08
      const fade = Math.max(0.15, 1 - since / 320)
      firePos[i].copy(fp.pos)
      fireCol[i].set(2.6, 0.95, 0.3).multiplyScalar(fp.intensity * flicker * fade)
    }

    this.effects.update(dt, this.renderer)
    this.ocean.uniforms.uTime.value = this.time
    this.routeMat.uniforms.uTime.value = this.time

    this.updateCamera(real)
    // Keep the shadow frustum centred on what the camera is looking at, snapped to texels.
    const tgt = this.controls.target
    const texel = 520 / this.sun.shadow.mapSize.x
    const sx = Math.round(tgt.x / texel) * texel
    const sz = Math.round(tgt.z / texel) * texel
    this.sun.target.position.set(sx, 0, sz)
    this.sun.position.set(sx + this.sunDir.x * 900, this.sunDir.y * 900, sz + this.sunDir.z * 900)

    // Camera shake after impacts.
    let shakeOffset: THREE.Vector3 | null = null
    if (this.shake > 0.001) {
      this.shake *= Math.exp(-real * 1.6)
      const s = this.shake * 3.2
      shakeOffset = new THREE.Vector3(Math.sin(this.time * 41) * s, Math.sin(this.time * 37 + 1) * s, Math.sin(this.time * 29 + 2) * s)
      this.camera.position.add(shakeOffset)
    }
    this.renderer.render(this.scene, this.camera)
    if (shakeOffset) this.camera.position.sub(shakeOffset)

    this.updateLabels()
    this.pushHud()
  }
}
