import * as THREE from "three"
import { GLSL_NOISE, fbm2, mulberry32 } from "./noise"
import { MAP_RECT } from "./world"

// ---------------------------------------------------------------------------
// Billboard particles (instanced quads, CPU simulated)

function puffTexture(kind: "smoke" | "fire" | "spark") {
  const size = 128
  const c = document.createElement("canvas")
  c.width = c.height = size
  const g = c.getContext("2d")!
  const img = g.createImageData(size, size)
  const seed = kind === "smoke" ? 3 : kind === "fire" ? 11 : 5
  const rand = mulberry32(seed)
  // A cauliflower of soft blobs gives billowing smoke and ragged flame edges.
  const blobs = Array.from({ length: kind === "smoke" ? 9 : 6 }, (_, i) => {
    const a = rand() * Math.PI * 2
    const d = i === 0 ? 0 : 0.18 + rand() * 0.28
    return { x: Math.cos(a) * d, y: Math.sin(a) * d * 0.9, r: i === 0 ? 0.55 : 0.28 + rand() * 0.22 }
  })
  const density = (u: number, v: number) => {
    let d = 0
    for (const b of blobs) {
      const q = Math.hypot(u - b.x, v - b.y) / b.r
      if (q < 1) d = Math.max(d, Math.pow(1 - q, 1.4))
    }
    const n = fbm2(u * 3.1 + seed, v * 3.1 - seed, 5) * 0.5 + 0.5
    return Math.min(1, d * (0.55 + n * 0.9))
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * 2 - 1
      const v = (y / size) * 2 - 1
      const r = Math.sqrt(u * u + v * v)
      let a = 0
      let shade = 1
      if (kind === "spark") {
        a = Math.max(0, 1 - r) ** 3
      } else {
        a = density(u, v)
        if (kind === "fire") a = Math.pow(a, 0.8)
        else {
          // Light from above: bright where density falls away toward the top.
          const lit = density(u + 0.07, v + 0.1) - density(u - 0.07, v - 0.1)
          shade = Math.min(1, Math.max(0.3, 0.62 + lit * 1.6 - v * 0.12))
        }
      }
      const k = (y * size + x) * 4
      img.data[k] = img.data[k + 1] = img.data[k + 2] = Math.round(shade * 255)
      img.data[k + 3] = Math.round(Math.min(1, a) * 255)
    }
  }
  g.putImageData(img, 0, 0)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export interface ParticleSpawn {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  life: number
  size0: number
  size1: number
  color0: THREE.Color
  color1: THREE.Color
  alpha: number
  drag?: number
  gravity?: number
  buoyant?: boolean
  delay?: number
}

class ParticleSystem {
  readonly mesh: THREE.Mesh
  private max: number
  private count = 0
  private pos: Float32Array
  private vel: Float32Array
  private life: Float32Array // age, maxLife
  private sizes: Float32Array // s0, s1
  private cols: Float32Array // r0 g0 b0 r1 g1 b1
  private alpha: Float32Array
  private phys: Float32Array // drag, gravity, delay, rot
  private iPos: THREE.InstancedBufferAttribute
  private iSize: THREE.InstancedBufferAttribute
  private iColor: THREE.InstancedBufferAttribute
  private geo: THREE.InstancedBufferGeometry

  constructor(max: number, texture: THREE.Texture, blending: THREE.Blending, renderOrder: number, private spin = 1) {
    this.max = max
    this.pos = new Float32Array(max * 3)
    this.vel = new Float32Array(max * 3)
    this.life = new Float32Array(max * 2)
    this.sizes = new Float32Array(max * 2)
    this.cols = new Float32Array(max * 6)
    this.alpha = new Float32Array(max)
    this.phys = new Float32Array(max * 4)
    const base = new THREE.PlaneGeometry(1, 1)
    this.geo = new THREE.InstancedBufferGeometry()
    this.geo.index = base.index
    this.geo.setAttribute("position", base.attributes.position)
    this.geo.setAttribute("uv", base.attributes.uv)
    this.iPos = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3)
    this.iSize = new THREE.InstancedBufferAttribute(new Float32Array(max * 2), 2)
    this.iColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 4), 4)
    this.iPos.setUsage(THREE.DynamicDrawUsage)
    this.iSize.setUsage(THREE.DynamicDrawUsage)
    this.iColor.setUsage(THREE.DynamicDrawUsage)
    this.geo.setAttribute("iPos", this.iPos)
    this.geo.setAttribute("iSize", this.iSize)
    this.geo.setAttribute("iColor", this.iColor)
    this.geo.instanceCount = 0
    const material = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: texture } },
      vertexShader: /* glsl */ `
        attribute vec3 iPos;
        attribute vec2 iSize;
        attribute vec4 iColor;
        varying vec2 vUv;
        varying vec4 vColor;
        void main() {
          vUv = uv;
          vColor = iColor;
          vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
          vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
          float c = cos(iSize.y), s = sin(iSize.y);
          vec2 p = vec2(position.x * c - position.y * s, position.x * s + position.y * c) * iSize.x;
          vec3 wp = iPos + right * p.x + up * p.y;
          gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        varying vec2 vUv;
        varying vec4 vColor;
        void main() {
          vec4 t = texture2D(uMap, vUv);
          gl_FragColor = vec4(vColor.rgb * t.rgb, t.a * vColor.a);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `,
      transparent: true,
      depthWrite: false,
      blending,
    })
    this.mesh = new THREE.Mesh(this.geo, material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = renderOrder
  }

  spawn(p: ParticleSpawn, rand: () => number) {
    if (this.count >= this.max) return
    const i = this.count++
    this.pos.set([p.x, p.y, p.z], i * 3)
    this.vel.set([p.vx, p.vy, p.vz], i * 3)
    this.life[i * 2] = -(p.delay ?? 0)
    this.life[i * 2 + 1] = p.life
    this.sizes[i * 2] = p.size0
    this.sizes[i * 2 + 1] = p.size1
    this.cols.set([p.color0.r, p.color0.g, p.color0.b, p.color1.r, p.color1.g, p.color1.b], i * 6)
    this.alpha[i] = p.alpha
    this.phys[i * 4] = p.drag ?? 0.5
    this.phys[i * 4 + 1] = p.gravity ?? 0
    this.phys[i * 4 + 2] = (rand() - 0.5) * Math.PI * 2 * this.spin
    this.phys[i * 4 + 3] = (rand() - 0.5) * 0.6 * this.spin
  }

  clear() {
    this.count = 0
    this.geo.instanceCount = 0
  }

  update(dt: number, waterY: (x: number, z: number) => number) {
    let n = 0
    const ip = this.iPos.array as Float32Array
    const is = this.iSize.array as Float32Array
    const ic = this.iColor.array as Float32Array
    for (let i = 0; i < this.count; i++) {
      const age = this.life[i * 2] + dt
      const max = this.life[i * 2 + 1]
      if (age >= max) {
        // Swap-remove with the last live particle.
        const last = this.count - 1
        if (i !== last) {
          this.pos.copyWithin(i * 3, last * 3, last * 3 + 3)
          this.vel.copyWithin(i * 3, last * 3, last * 3 + 3)
          this.life.copyWithin(i * 2, last * 2, last * 2 + 2)
          this.sizes.copyWithin(i * 2, last * 2, last * 2 + 2)
          this.cols.copyWithin(i * 6, last * 6, last * 6 + 6)
          this.alpha[i] = this.alpha[last]
          this.phys.copyWithin(i * 4, last * 4, last * 4 + 4)
        }
        this.count--
        i--
        continue
      }
      this.life[i * 2] = age
      if (age < 0) continue
      const drag = Math.exp(-this.phys[i * 4] * dt)
      this.vel[i * 3] *= drag
      this.vel[i * 3 + 1] = this.vel[i * 3 + 1] * drag + this.phys[i * 4 + 1] * dt
      this.vel[i * 3 + 2] *= drag
      this.pos[i * 3] += this.vel[i * 3] * dt
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt
      if (this.phys[i * 4 + 1] < 0) {
        const wy = waterY(this.pos[i * 3], this.pos[i * 3 + 2])
        if (this.pos[i * 3 + 1] < wy) {
          this.pos[i * 3 + 1] = wy
          this.life[i * 2] = Math.max(age, max - 0.15)
        }
      }
      this.phys[i * 4 + 2] += this.phys[i * 4 + 3] * dt
      const t = age / max
      const fadeIn = Math.min(1, age / Math.min(0.25, max * 0.15))
      const a = this.alpha[i] * fadeIn * (1 - t) * (1 - t * 0.3)
      ip[n * 3] = this.pos[i * 3]
      ip[n * 3 + 1] = this.pos[i * 3 + 1]
      ip[n * 3 + 2] = this.pos[i * 3 + 2]
      is[n * 2] = this.sizes[i * 2] + (this.sizes[i * 2 + 1] - this.sizes[i * 2]) * Math.sqrt(t)
      is[n * 2 + 1] = this.phys[i * 4 + 2]
      const c = this.cols
      ic[n * 4] = c[i * 6] + (c[i * 6 + 3] - c[i * 6]) * t
      ic[n * 4 + 1] = c[i * 6 + 1] + (c[i * 6 + 4] - c[i * 6 + 1]) * t
      ic[n * 4 + 2] = c[i * 6 + 2] + (c[i * 6 + 5] - c[i * 6 + 2]) * t
      ic[n * 4 + 3] = a
      n++
    }
    this.geo.instanceCount = n
    this.iPos.needsUpdate = true
    this.iSize.needsUpdate = true
    this.iColor.needsUpdate = true
  }
}

// ---------------------------------------------------------------------------
// Effects map: wakes (R) and oil thickness (G) drawn top-down into a texture

const MAP_VERT = /* glsl */ `
  uniform vec4 uRect;
  vec4 mapClip(vec2 world) {
    vec2 uv = (world - uRect.xy) / uRect.z;
    return vec4(uv * 2.0 - 1.0, 0.0, 1.0);
  }
`

const MAX_STAMPS = 1600

class WakeLayer {
  readonly mesh: THREE.Mesh
  private a: THREE.InstancedBufferAttribute
  private b: THREE.InstancedBufferAttribute
  private next = 0
  private geo: THREE.InstancedBufferGeometry
  readonly uniforms: { uTime: { value: number }; uRect: { value: THREE.Vector4 } }

  constructor() {
    const base = new THREE.PlaneGeometry(1, 1)
    this.geo = new THREE.InstancedBufferGeometry()
    this.geo.index = base.index
    this.geo.setAttribute("position", base.attributes.position)
    this.a = new THREE.InstancedBufferAttribute(new Float32Array(MAX_STAMPS * 4), 4)
    this.b = new THREE.InstancedBufferAttribute(new Float32Array(MAX_STAMPS * 4), 4)
    // Mark all as expired.
    for (let i = 0; i < MAX_STAMPS; i++) (this.a.array as Float32Array)[i * 4 + 3] = -1e6
    this.a.setUsage(THREE.DynamicDrawUsage)
    this.b.setUsage(THREE.DynamicDrawUsage)
    this.geo.setAttribute("iA", this.a)
    this.geo.setAttribute("iB", this.b)
    this.geo.instanceCount = MAX_STAMPS
    this.uniforms = {
      uTime: { value: 0 },
      uRect: { value: new THREE.Vector4(MAP_RECT.minX, MAP_RECT.minZ, MAP_RECT.size, 0) },
    }
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: /* glsl */ `
        uniform float uTime;
        ${MAP_VERT}
        attribute vec4 iA; // x, z, heading, birth
        attribute vec4 iB; // beam, strength, speed, length
        varying vec2 vLocal;
        varying float vAge;
        varying float vStrength;
        varying float vSeed;
        void main() {
          float age = uTime - iA.w;
          vAge = age;
          vStrength = iB.y * (1.0 - smoothstep(0.0, 34.0, age));
          vLocal = position.xy + 0.5;
          vSeed = iA.w * 13.1;
          float width = iB.x * 1.3 + age * iB.z * 0.62;
          vec2 dir = vec2(cos(iA.z), -sin(iA.z));
          vec2 perp = vec2(-dir.y, dir.x);
          vec2 w = iA.xy + dir * position.x * iB.w + perp * position.y * width;
          gl_Position = age < 0.0 || age > 34.0 ? vec4(2.0, 2.0, 2.0, 1.0) : mapClip(w);
        }
      `,
      fragmentShader: /* glsl */ `
        ${GLSL_NOISE}
        varying vec2 vLocal;
        varying float vAge;
        varying float vStrength;
        varying float vSeed;
        void main() {
          float u = vLocal.y * 2.0 - 1.0;
          float n = srNoise(vec2(vLocal.x * 3.0 + vSeed, u * 6.0 + vSeed * 0.3));
          float turb = exp(-u * u * mix(9.0, 3.0, smoothstep(0.0, 20.0, vAge))) * (1.0 - smoothstep(2.0, 24.0, vAge));
          float arms = smoothstep(0.72, 0.93, abs(u)) * (1.0 - smoothstep(0.93, 1.0, abs(u))) * (1.0 - smoothstep(4.0, 30.0, vAge));
          float foam = (turb * (0.55 + 0.6 * n) + arms * 0.55 * (0.5 + n)) * vStrength;
          gl_FragColor = vec4(foam, 0.0, 0.0, 1.0);
        }
      `,
      blending: THREE.CustomBlending,
      blendEquation: THREE.MaxEquation,
      depthTest: false,
      depthWrite: false,
    })
    this.mesh = new THREE.Mesh(this.geo, mat)
    this.mesh.frustumCulled = false
  }

  stamp(x: number, z: number, heading: number, time: number, beam: number, strength: number, speed: number, length: number) {
    const i = this.next
    this.next = (this.next + 1) % MAX_STAMPS
    ;(this.a.array as Float32Array).set([x, z, heading, time], i * 4)
    ;(this.b.array as Float32Array).set([beam, strength, speed, length], i * 4)
    this.a.addUpdateRange(i * 4, 4)
    this.b.addUpdateRange(i * 4, 4)
    this.a.needsUpdate = true
    this.b.needsUpdate = true
  }

  clear() {
    const arr = this.a.array as Float32Array
    for (let i = 0; i < MAX_STAMPS; i++) arr[i * 4 + 3] = -1e6
    this.a.clearUpdateRanges()
    this.a.needsUpdate = true
  }
}

export class OilSlick {
  readonly mesh: THREE.Mesh
  readonly uniforms: {
    uRect: { value: THREE.Vector4 }
    uCenter: { value: THREE.Vector2 }
    uRadius: { value: number }
    uSeed: { value: number }
    uStretch: { value: THREE.Vector2 }
    uTime: { value: number }
  }
  maxRadius: number
  age = 0
  drift = new THREE.Vector2(0.9, -0.35)

  constructor(x: number, z: number, maxRadius: number, seed: number) {
    this.maxRadius = maxRadius
    this.uniforms = {
      uRect: { value: new THREE.Vector4(MAP_RECT.minX, MAP_RECT.minZ, MAP_RECT.size, 0) },
      uCenter: { value: new THREE.Vector2(x, z) },
      uRadius: { value: 1 },
      uSeed: { value: seed },
      uStretch: { value: new THREE.Vector2(1.5, 0.8) },
      uTime: { value: 0 },
    }
    const geo = new THREE.PlaneGeometry(2, 2)
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: /* glsl */ `
        ${MAP_VERT}
        uniform vec2 uCenter;
        uniform float uRadius;
        varying vec2 vP;
        void main() {
          vP = position.xy * uRadius * 2.4;
          gl_Position = mapClip(uCenter + vP);
        }
      `,
      fragmentShader: /* glsl */ `
        ${GLSL_NOISE}
        uniform float uRadius;
        uniform float uSeed;
        uniform vec2 uStretch;
        uniform float uTime;
        varying vec2 vP;
        void main() {
          vec2 q = vP / uRadius;
          // Elongate along the drift axis (wind + current).
          vec2 ax = normalize(vec2(0.93, -0.36));
          vec2 local = vec2(dot(q, ax) / uStretch.x, dot(q, vec2(-ax.y, ax.x)) / uStretch.y);
          float warp = srFbm(q * 1.6 + uSeed) - 0.5;
          float d = length(local + warp * 0.55);
          float body = 1.0 - smoothstep(0.35, 1.0, d);
          float streaks = srFbm(vec2(dot(q, ax) * 1.2, dot(q, vec2(-ax.y, ax.x)) * 7.0) + uSeed + uTime * 0.01);
          float sheen = (1.0 - smoothstep(0.7, 1.35, d)) * smoothstep(0.35, 0.75, streaks) * 0.35;
          float thick = max(body * (0.55 + 0.6 * streaks), sheen);
          thick *= smoothstep(0.0, 0.25, 1.0 - smoothstep(0.9, 1.4, d));
          gl_FragColor = vec4(0.0, clamp(thick, 0.0, 1.0), 0.0, 1.0);
        }
      `,
      blending: THREE.CustomBlending,
      blendEquation: THREE.MaxEquation,
      depthTest: false,
      depthWrite: false,
    })
    this.mesh = new THREE.Mesh(geo, mat)
    this.mesh.frustumCulled = false
  }

  update(dt: number) {
    this.age += dt
    const grow = 1 - Math.exp(-this.age / 55)
    this.uniforms.uRadius.value = 4 + this.maxRadius * grow
    const stretch = 1 + Math.min(this.age / 90, 1) * 0.9
    this.uniforms.uStretch.value.set(stretch, 1 / Math.sqrt(stretch))
    this.uniforms.uCenter.value.addScaledVector(this.drift, dt * 0.35)
    this.uniforms.uTime.value = this.age
  }
}

/** Foam rings from explosions and splashes, also drawn into the effects map. */
class FoamRing {
  readonly mesh: THREE.Mesh
  readonly uniforms: { uRect: { value: THREE.Vector4 }; uCenter: { value: THREE.Vector2 }; uRadius: { value: number }; uFade: { value: number } }
  age = 0
  constructor(x: number, z: number, public maxRadius: number, public life: number) {
    this.uniforms = {
      uRect: { value: new THREE.Vector4(MAP_RECT.minX, MAP_RECT.minZ, MAP_RECT.size, 0) },
      uCenter: { value: new THREE.Vector2(x, z) },
      uRadius: { value: 1 },
      uFade: { value: 1 },
    }
    this.mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: /* glsl */ `
          ${MAP_VERT}
          uniform vec2 uCenter;
          uniform float uRadius;
          varying vec2 vP;
          void main() {
            vP = position.xy * (uRadius + 12.0);
            gl_Position = mapClip(uCenter + vP);
          }
        `,
        fragmentShader: /* glsl */ `
          ${GLSL_NOISE}
          uniform float uRadius;
          uniform float uFade;
          varying vec2 vP;
          void main() {
            float d = length(vP);
            float n = srNoise(vP * 0.15);
            float ring = exp(-pow((d - uRadius) / (4.0 + uRadius * 0.08), 2.0));
            float inner = (1.0 - smoothstep(0.0, uRadius, d)) * 0.55;
            gl_FragColor = vec4((ring + inner) * uFade * (0.6 + 0.5 * n), 0.0, 0.0, 1.0);
          }
        `,
        blending: THREE.CustomBlending,
        blendEquation: THREE.MaxEquation,
        depthTest: false,
        depthWrite: false,
      }),
    )
    this.mesh.frustumCulled = false
  }
  update(dt: number) {
    this.age += dt
    const t = Math.min(this.age / this.life, 1)
    this.uniforms.uRadius.value = this.maxRadius * (1 - Math.pow(1 - t, 3))
    this.uniforms.uFade.value = 1 - t
    return t < 1
  }
}

// ---------------------------------------------------------------------------

interface Debris {
  pos: THREE.Vector3
  vel: THREE.Vector3
  rot: THREE.Euler
  spin: THREE.Vector3
  scale: THREE.Vector3
  floating: boolean
  sink: number
}

interface Emitter {
  x: number
  y: number
  z: number
  rate: number
  acc: number
  life: number
  age: number
  kind: "fire" | "smoke" | "exhaust"
  scale: number
  follow?: () => THREE.Vector3 | null
}

export class Effects {
  readonly scene = new THREE.Scene()
  readonly mapScene = new THREE.Scene()
  readonly target: THREE.WebGLRenderTarget
  private mapCamera = new THREE.Camera()
  private fire: ParticleSystem
  private smoke: ParticleSystem
  private spray: ParticleSystem
  private wakes = new WakeLayer()
  private slicks: OilSlick[] = []
  private rings: FoamRing[] = []
  private emitters: Emitter[] = []
  private debris: Debris[] = []
  private debrisMesh: THREE.InstancedMesh
  private shock: THREE.Mesh
  private shockAge = 99
  private rand = mulberry32(2024)
  private time = 0
  readonly flash: THREE.PointLight
  readonly glow: THREE.PointLight
  private flashAge = 99
  firePoints: { pos: THREE.Vector3; intensity: number }[] = []

  constructor(private waterY: (x: number, z: number) => number) {
    this.target = new THREE.WebGLRenderTarget(1024, 1024, {
      type: THREE.UnsignedByteType,
      magFilter: THREE.LinearFilter,
      minFilter: THREE.LinearFilter,
      depthBuffer: false,
    })
    this.fire = new ParticleSystem(2600, puffTexture("fire"), THREE.AdditiveBlending, 12)
    this.smoke = new ParticleSystem(2600, puffTexture("smoke"), THREE.NormalBlending, 11, 0.12)
    this.spray = new ParticleSystem(1800, puffTexture("spark"), THREE.NormalBlending, 10)
    this.scene.add(this.smoke.mesh, this.fire.mesh, this.spray.mesh)
    this.mapScene.add(this.wakes.mesh)

    const dGeo = new THREE.DodecahedronGeometry(1, 0)
    this.debrisMesh = new THREE.InstancedMesh(
      dGeo,
      new THREE.MeshStandardMaterial({ color: 0x2a2522, roughness: 0.85, metalness: 0.4 }),
      80,
    )
    this.debrisMesh.count = 0
    this.debrisMesh.castShadow = true
    this.debrisMesh.frustumCulled = false
    this.scene.add(this.debrisMesh)

    this.shock = new THREE.Mesh(
      new THREE.RingGeometry(0.85, 1, 96, 1),
      new THREE.MeshBasicMaterial({ color: 0xfff1d6, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }),
    )
    this.shock.rotation.x = -Math.PI / 2
    this.shock.visible = false
    this.scene.add(this.shock)

    this.flash = new THREE.PointLight(0xffb866, 0, 0, 2)
    this.glow = new THREE.PointLight(0xff7a2a, 0, 0, 2)
    this.scene.add(this.flash, this.glow)
  }

  get elapsed() {
    return this.time
  }

  wake(x: number, z: number, heading: number, beam: number, strength: number, speed: number, length: number, age = 0) {
    this.wakes.stamp(x, z, heading, this.time - age, beam, strength, speed, length)
  }

  addExhaust(follow: () => THREE.Vector3 | null, rate: number) {
    this.emitters.push({ x: 0, y: 0, z: 0, rate, acc: 0, life: Infinity, age: 0, kind: "exhaust", scale: 1, follow })
  }

  bowSpray(x: number, y: number, z: number, dirX: number, dirZ: number, speed: number) {
    const r = this.rand
    const white = new THREE.Color(0.95, 0.97, 1)
    for (let i = 0; i < 2; i++) {
      const side = r() < 0.5 ? -1 : 1
      this.spray.spawn(
        {
          x: x + (r() - 0.5),
          y: y + 0.3,
          z: z + (r() - 0.5),
          vx: dirX * speed * 0.6 + -dirZ * side * (2 + r() * 3),
          vy: 2 + r() * 3,
          vz: dirZ * speed * 0.6 + dirX * side * (2 + r() * 3),
          life: 0.8 + r() * 0.6,
          size0: 0.5,
          size1: 2.2,
          color0: white,
          color1: white,
          alpha: 0.5,
          gravity: -9,
          drag: 0.6,
        },
        r,
      )
    }
  }

  /** Big collision explosion at a world point. */
  explode(at: THREE.Vector3, power: number, lng: boolean) {
    const r = this.rand
    const P = power
    const white = new THREE.Color(4, 3.6, 3)
    const yellow = new THREE.Color(3.2, 1.9, 0.6)
    const orange = new THREE.Color(2.2, 0.75, 0.15)
    const red = new THREE.Color(0.8, 0.12, 0.02)
    const soot = new THREE.Color(0.08, 0.072, 0.065)
    const grey = new THREE.Color(0.34, 0.33, 0.32)
    const water = new THREE.Color(0.85, 0.9, 0.95)

    // Fireball bursts.
    const bursts = lng ? 5 : 3
    for (let b = 0; b < bursts; b++) {
      const delay = b * 0.28
      const ox = (r() - 0.5) * 14 * P
      const oz = (r() - 0.5) * 14 * P
      const n = Math.round(220 * P)
      for (let i = 0; i < n; i++) {
        const th = r() * Math.PI * 2
        const ph = Math.acos(r() * 1.6 - 0.6)
        const sp = (10 + r() * 40) * P * (lng ? 1.3 : 1)
        this.fire.spawn(
          {
            x: at.x + ox,
            y: at.y + 2,
            z: at.z + oz,
            vx: Math.cos(th) * Math.sin(ph) * sp,
            vy: Math.cos(ph) * sp * 0.9 + 8,
            vz: Math.sin(th) * Math.sin(ph) * sp,
            life: 1.4 + r() * 1.9,
            size0: 8 * P,
            size1: (30 + r() * 40) * P,
            color0: r() < 0.3 ? white : yellow,
            color1: r() < 0.5 ? red : orange,
            alpha: 0.9,
            drag: 1.6,
            gravity: 4,
            delay: delay + r() * 0.15,
          },
          r,
        )
      }
    }
    // Rising fireball that rolls over into the smoke column.
    for (let i = 0; i < 90 * P; i++) {
      const th = r() * Math.PI * 2
      const sp = r() * 6
      this.fire.spawn(
        {
          x: at.x + (r() - 0.5) * 10,
          y: at.y + 6,
          z: at.z + (r() - 0.5) * 10,
          vx: Math.cos(th) * sp,
          vy: 18 + r() * 20,
          vz: Math.sin(th) * sp,
          life: 2.6 + r() * 1.8,
          size0: 14 * P,
          size1: (45 + r() * 30) * P,
          color0: yellow,
          color1: red,
          alpha: 0.75,
          drag: 0.5,
          gravity: 2,
          delay: 0.3 + r() * 0.7,
        },
        r,
      )
    }
    // Billowing smoke.
    for (let i = 0; i < 150 * P; i++) {
      const th = r() * Math.PI * 2
      const sp = 2 + r() * 6 * P
      this.smoke.spawn(
        {
          x: at.x + (r() - 0.5) * 18,
          y: at.y + 8 + r() * 14,
          z: at.z + (r() - 0.5) * 18,
          vx: Math.cos(th) * sp + 3,
          vy: 14 + r() * 14,
          vz: Math.sin(th) * sp,
          life: 10 + r() * 8,
          size0: 14 * P,
          size1: (70 + r() * 60) * P,
          color0: soot,
          color1: grey,
          alpha: 0.62,
          drag: 0.45,
          gravity: 1.2,
          delay: 0.7 + r() * 1.6,
        },
        r,
      )
    }
    // Sparks and burning fragments.
    for (let i = 0; i < 320 * P; i++) {
      const th = r() * Math.PI * 2
      const sp = 20 + r() * 70
      this.fire.spawn(
        {
          x: at.x,
          y: at.y + 3,
          z: at.z,
          vx: Math.cos(th) * sp * 0.6,
          vy: 15 + r() * 55,
          vz: Math.sin(th) * sp * 0.6,
          life: 1.5 + r() * 2.5,
          size0: 1.4,
          size1: 0.4,
          color0: yellow,
          color1: red,
          alpha: 1,
          drag: 0.3,
          gravity: -26,
        },
        r,
      )
    }
    // Water columns thrown up by the blast.
    for (let i = 0; i < 380 * P; i++) {
      const th = r() * Math.PI * 2
      const rad = 6 + r() * 20
      const sp = 8 + r() * 26
      this.spray.spawn(
        {
          x: at.x + Math.cos(th) * rad,
          y: this.waterY(at.x, at.z),
          z: at.z + Math.sin(th) * rad,
          vx: Math.cos(th) * sp * 0.4,
          vy: 18 + r() * 42,
          vz: Math.sin(th) * sp * 0.4,
          life: 2 + r() * 2,
          size0: 2,
          size1: 9,
          color0: water,
          color1: water,
          alpha: 0.55,
          drag: 0.4,
          gravity: -24,
          delay: r() * 0.3,
        },
        r,
      )
    }

    // Debris.
    const count = Math.min(80, Math.round(50 * P))
    this.debris = []
    for (let i = 0; i < count; i++) {
      const th = r() * Math.PI * 2
      const sp = 15 + r() * 45
      this.debris.push({
        pos: at.clone().add(new THREE.Vector3(0, 3, 0)),
        vel: new THREE.Vector3(Math.cos(th) * sp * 0.5, 20 + r() * 40, Math.sin(th) * sp * 0.5),
        rot: new THREE.Euler(r() * 6, r() * 6, r() * 6),
        spin: new THREE.Vector3(r() * 6 - 3, r() * 6 - 3, r() * 6 - 3),
        scale: new THREE.Vector3(0.3 + r() * 1.4, 0.1 + r() * 0.4, 0.3 + r() * 1.1),
        floating: false,
        sink: 0,
      })
    }
    this.debrisMesh.count = count

    this.rings.push(new FoamRing(at.x, at.z, 170 * P, 7))
    this.rings.forEach((ring) => this.mapScene.add(ring.mesh))
    this.shockAge = 0
    this.shock.position.set(at.x, this.waterY(at.x, at.z) + 0.6, at.z)
    this.shock.visible = true
    this.flashAge = 0
    this.flash.position.set(at.x, at.y + 20, at.z)
    this.glow.position.set(at.x, at.y + 8, at.z)
  }

  addFire(x: number, y: number, z: number, scale: number, life: number, follow?: () => THREE.Vector3 | null) {
    this.emitters.push({ x, y, z, rate: 44 * scale, acc: 0, life, age: 0, kind: "fire", scale, follow })
    this.emitters.push({ x, y, z, rate: 6 * scale, acc: 0, life: life * 1.2, age: 0, kind: "smoke", scale, follow })
  }

  addSlick(x: number, z: number, maxRadius: number) {
    const s = new OilSlick(x, z, maxRadius, this.rand() * 50)
    this.slicks.push(s)
    this.mapScene.add(s.mesh)
    return s
  }

  get slickList() {
    return this.slicks
  }

  reset() {
    this.fire.clear()
    this.smoke.clear()
    this.spray.clear()
    this.wakes.clear()
    this.slicks.forEach((s) => this.mapScene.remove(s.mesh))
    this.rings.forEach((s) => this.mapScene.remove(s.mesh))
    this.slicks = []
    this.rings = []
    this.emitters = this.emitters.filter((e) => e.kind === "exhaust")
    this.debris = []
    this.debrisMesh.count = 0
    this.flash.intensity = 0
    this.glow.intensity = 0
    this.shock.visible = false
    this.firePoints = []
  }

  private emit(e: Emitter, dt: number) {
    const r = this.rand
    let x = e.x
    let y = e.y
    let z = e.z
    if (e.follow) {
      const p = e.follow()
      if (!p) return
      x = p.x
      y = p.y
      z = p.z
    }
    e.acc += e.rate * dt
    const fade = e.life === Infinity ? 1 : Math.max(0, 1 - e.age / e.life)
    while (e.acc >= 1) {
      e.acc -= 1
      if (e.kind === "exhaust") {
        this.smoke.spawn(
          {
            x,
            y,
            z,
            vx: 1.5 + r() * 0.5,
            vy: 2.5 + r(),
            vz: -0.6 + r() * 0.4,
            life: 5 + r() * 3,
            size0: 0.8,
            size1: 6,
            color0: new THREE.Color(0.25, 0.24, 0.23),
            color1: new THREE.Color(0.6, 0.6, 0.6),
            alpha: 0.28,
            drag: 0.3,
          },
          r,
        )
      } else if (e.kind === "fire") {
        const s = e.scale * (0.4 + fade * 0.6)
        this.fire.spawn(
          {
            x: x + (r() - 0.5) * 12 * e.scale,
            y: y + r() * 2,
            z: z + (r() - 0.5) * 12 * e.scale,
            vx: (r() - 0.5) * 2.5 + 1,
            vy: 8 + r() * 10,
            vz: (r() - 0.5) * 2.5,
            life: 0.7 + r() * 0.8,
            size0: 4 * s,
            size1: 11 * s,
            color0: new THREE.Color(3, 1.5, 0.45),
            color1: new THREE.Color(0.7, 0.1, 0.02),
            alpha: 0.85 * fade + 0.1,
            drag: 0.8,
            gravity: 3,
          },
          r,
        )
      } else {
        this.smoke.spawn(
          {
            x: x + (r() - 0.5) * 8 * e.scale,
            y: y + 8 + r() * 4,
            z: z + (r() - 0.5) * 8 * e.scale,
            vx: 4.5 + r() * 2,
            vy: 17 + r() * 8,
            vz: -1.6 + r(),
            life: 15 + r() * 7,
            size0: 9 * e.scale,
            size1: (80 + r() * 40) * e.scale,
            color0: new THREE.Color(0.07, 0.064, 0.058),
            color1: new THREE.Color(0.46, 0.45, 0.44),
            alpha: 0.55 * (0.4 + 0.6 * fade),
            drag: 0.12,
            gravity: 0.3,
          },
          r,
        )
      }
    }
  }

  update(dt: number, renderer: THREE.WebGLRenderer) {
    this.time += dt
    this.wakes.uniforms.uTime.value = this.time

    for (const e of this.emitters) {
      e.age += dt
      if (e.age < e.life) this.emit(e, dt)
    }
    this.emitters = this.emitters.filter((e) => e.age < e.life)

    this.fire.update(dt, this.waterY)
    this.smoke.update(dt, this.waterY)
    this.spray.update(dt, this.waterY)

    for (const s of this.slicks) s.update(dt)
    this.rings = this.rings.filter((ring) => {
      const alive = ring.update(dt)
      if (!alive) this.mapScene.remove(ring.mesh)
      return alive
    })

    // Debris ballistic motion, then bobbing and slowly sinking.
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    this.debris.forEach((d, i) => {
      const wy = this.waterY(d.pos.x, d.pos.z)
      if (!d.floating) {
        d.vel.y -= 26 * dt
        d.pos.addScaledVector(d.vel, dt)
        d.rot.x += d.spin.x * dt
        d.rot.y += d.spin.y * dt
        d.rot.z += d.spin.z * dt
        if (d.pos.y < wy && d.vel.y < 0) {
          d.floating = true
          this.splash(d.pos.x, d.pos.z, 0.5)
        }
      } else {
        d.sink += dt
        d.pos.y = wy - 0.2 - Math.max(0, d.sink - 25) * 0.08
        d.pos.x += 0.3 * dt
      }
      q.setFromEuler(d.rot)
      m.compose(d.pos, q, d.scale)
      this.debrisMesh.setMatrixAt(i, m)
    })
    if (this.debris.length) this.debrisMesh.instanceMatrix.needsUpdate = true

    // Shockwave and flash.
    this.shockAge += dt
    if (this.shock.visible) {
      const t = this.shockAge / 1.6
      const s = 8 + 260 * (1 - Math.pow(1 - Math.min(t, 1), 2.5))
      this.shock.scale.setScalar(s)
      ;(this.shock.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - t) * 0.8
      if (t >= 1) this.shock.visible = false
    }
    this.flashAge += dt
    const f = Math.max(0, 1 - this.flashAge / 1.8)
    this.flash.intensity = f * f * 1.6e5
    const burning = this.firePoints.reduce((a, p) => a + p.intensity, 0)
    this.glow.intensity = Math.min(burning, 3) * (5000 + Math.sin(this.time * 17) * 500 + Math.sin(this.time * 7.3) * 700)

    // Draw the top-down effects map.
    const prevTarget = renderer.getRenderTarget()
    const prevColor = renderer.getClearColor(new THREE.Color())
    const prevAlpha = renderer.getClearAlpha()
    renderer.setRenderTarget(this.target)
    renderer.setClearColor(0x000000, 0)
    renderer.clear(true, false, false)
    renderer.render(this.mapScene, this.mapCamera)
    renderer.setRenderTarget(prevTarget)
    renderer.setClearColor(prevColor, prevAlpha)
  }

  splash(x: number, z: number, scale: number) {
    const r = this.rand
    const c = new THREE.Color(0.9, 0.93, 0.96)
    const y = this.waterY(x, z)
    for (let i = 0; i < 14 * scale; i++) {
      const th = r() * Math.PI * 2
      this.spray.spawn(
        {
          x,
          y,
          z,
          vx: Math.cos(th) * 3,
          vy: 6 + r() * 8,
          vz: Math.sin(th) * 3,
          life: 0.9 + r() * 0.5,
          size0: 0.8,
          size1: 3,
          color0: c,
          color1: c,
          alpha: 0.6,
          gravity: -20,
        },
        r,
      )
    }
  }
}
