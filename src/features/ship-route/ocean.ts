import * as THREE from "three"
import { MAP_RECT, BERTH } from "./world"
import { mulberry32 } from "./noise"

// Gerstner swell shared by the GPU ocean and the CPU buoyancy sampler.
interface Wave {
  dir: [number, number]
  length: number
  amp: number
  steep: number
}

const WAVES: Wave[] = [
  { dir: [0.94, 0.34], length: 150, amp: 1.05, steep: 0.55 },
  { dir: [0.52, 0.85], length: 104, amp: 0.7, steep: 0.5 },
  { dir: [-0.35, 0.94], length: 71, amp: 0.42, steep: 0.45 },
  { dir: [0.87, -0.49], length: 49, amp: 0.26, steep: 0.4 },
  { dir: [-0.8, -0.6], length: 37, amp: 0.15, steep: 0.35 },
]
const GRAVITY = 3.2

const waveData = WAVES.map((w) => {
  const len = Math.hypot(w.dir[0], w.dir[1])
  const dx = w.dir[0] / len
  const dz = w.dir[1] / len
  const k = (Math.PI * 2) / w.length
  const omega = Math.sqrt(GRAVITY * k)
  const qa = w.steep / (k * WAVES.length)
  return { dx, dz, k, amp: w.amp, qa, omega }
})

const HARBOR_CALM = { x: BERTH.x + 60, z: BERTH.z }

function waveAtten(x: number, z: number) {
  const d = Math.max(Math.abs(x), Math.abs(z))
  const far = 1 - smooth(820, 1250, d)
  const harbor = smooth(40, 260, Math.hypot(x - HARBOR_CALM.x, z - HARBOR_CALM.z))
  return far * (0.18 + 0.82 * harbor)
}

function smooth(e0: number, e1: number, x: number) {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1)
  return t * t * (3 - 2 * t)
}

export function waveHeight(x: number, z: number, t: number): number {
  const att = waveAtten(x, z)
  let y = 0
  for (const w of waveData) y += w.amp * att * Math.sin(w.k * (w.dx * x + w.dz * z) - w.omega * t)
  return y
}

const WAVE_GLSL = /* glsl */ `
uniform vec4 uWaveA[${WAVES.length}];
uniform vec2 uWaveB[${WAVES.length}];
uniform vec2 uHarbor;
float waveAtten(vec2 p) {
  float d = max(abs(p.x), abs(p.y));
  float far = 1.0 - smoothstep(820.0, 1250.0, d);
  float harbor = smoothstep(40.0, 260.0, length(p - uHarbor));
  return far * (0.18 + 0.82 * harbor);
}
vec3 gerstner(vec2 p, float t, out vec3 n, out float jac) {
  float att = waveAtten(p);
  vec3 disp = vec3(0.0);
  n = vec3(0.0, 1.0, 0.0);
  float jxx = 1.0, jzz = 1.0, jxz = 0.0;
  for (int i = 0; i < ${WAVES.length}; i++) {
    vec4 a = uWaveA[i];
    vec2 b = uWaveB[i];
    float A = a.w * att;
    float QA = b.x * att;
    float f = a.z * dot(a.xy, p) - b.y * t;
    float c = cos(f);
    float s = sin(f);
    disp.x += QA * a.x * c;
    disp.z += QA * a.y * c;
    disp.y += A * s;
    n.x -= a.x * a.z * A * c;
    n.z -= a.y * a.z * A * c;
    n.y -= a.z * QA * s;
    jxx -= a.z * QA * a.x * a.x * s;
    jzz -= a.z * QA * a.y * a.y * s;
    jxz -= a.z * QA * a.x * a.y * s;
  }
  jac = jxx * jzz - jxz * jxz;
  n = normalize(n);
  return disp;
}
`

export function waveUniforms() {
  return {
    uWaveA: { value: waveData.map((w) => new THREE.Vector4(w.dx, w.dz, w.k, w.amp)) },
    uWaveB: { value: waveData.map((w) => new THREE.Vector2(w.qa, w.omega)) },
    uHarbor: { value: new THREE.Vector2(HARBOR_CALM.x, HARBOR_CALM.z) },
  }
}

export { WAVE_GLSL }

/** Tileable detail normal map (RGB) with height in alpha, built from integer-frequency sines. */
function createDetailTexture(size = 256) {
  const rand = mulberry32(42)
  const comps: { fx: number; fy: number; a: number; ph: number }[] = []
  for (let i = 0; i < 64; i++) {
    const fx = Math.round((rand() * 2 - 1) * 18)
    const fy = Math.round((rand() * 2 - 1) * 18)
    const f = Math.hypot(fx, fy)
    if (f < 1.5) continue
    comps.push({ fx, fy, a: 1 / Math.pow(f, 1.35), ph: rand() * Math.PI * 2 })
  }
  const h = new Float32Array(size * size)
  let min = Infinity
  let max = -Infinity
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let v = 0
      const u = x / size
      const w = y / size
      for (const c of comps) v += c.a * Math.sin(Math.PI * 2 * (c.fx * u + c.fy * w) + c.ph)
      h[y * size + x] = v
      if (v < min) min = v
      if (v > max) max = v
    }
  }
  const data = new Uint8Array(size * size * 4)
  const strength = 7
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const l = h[y * size + ((x - 1 + size) % size)]
      const r = h[y * size + ((x + 1) % size)]
      const d = h[((y - 1 + size) % size) * size + x]
      const u = h[((y + 1) % size) * size + x]
      let nx = (l - r) * strength
      let ny = (d - u) * strength
      let nz = 1
      const len = Math.hypot(nx, ny, nz)
      nx /= len
      ny /= len
      nz /= len
      const k = (y * size + x) * 4
      data[k] = Math.round((nx * 0.5 + 0.5) * 255)
      data[k + 1] = Math.round((ny * 0.5 + 0.5) * 255)
      data[k + 2] = Math.round((nz * 0.5 + 0.5) * 255)
      data[k + 3] = Math.round(((h[y * size + x] - min) / (max - min)) * 255)
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.generateMipmaps = true
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

/** Square grid with dense centre and exponentially stretched rim out to the horizon. */
function createOceanGeometry(segments: number) {
  const geo = new THREE.PlaneGeometry(2, 2, segments, segments)
  geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position as THREE.BufferAttribute
  const inner = 0.74
  const innerSize = 1000
  const outerSize = 24000
  const k = Math.log(outerSize / innerSize) / (1 - inner)
  const map = (u: number) => {
    const a = Math.abs(u)
    const v = a <= inner ? (a / inner) * innerSize : innerSize * Math.exp(k * (a - inner))
    return Math.sign(u) * v
  }
  for (let i = 0; i < pos.count; i++) {
    pos.setX(i, map(pos.getX(i)))
    pos.setZ(i, map(pos.getZ(i)))
  }
  geo.computeBoundingSphere()
  return geo
}

export interface OceanOptions {
  envMap: THREE.Texture
  bathymetry: THREE.Texture
  effects: THREE.Texture
  sunDir: THREE.Vector3
  sunColor: THREE.Color
  segments: number
}

export const MAX_FIRE_LIGHTS = 4

export function createOcean(opts: OceanOptions) {
  const uniforms = {
    ...waveUniforms(),
    uTime: { value: 0 },
    uEnv: { value: opts.envMap },
    uDetail: { value: createDetailTexture() },
    uBathy: { value: opts.bathymetry },
    uEffects: { value: opts.effects },
    uMapRect: { value: new THREE.Vector4(MAP_RECT.minX, MAP_RECT.minZ, 1 / MAP_RECT.size, 1 / MAP_RECT.size) },
    uSunDir: { value: opts.sunDir.clone() },
    uSunColor: { value: opts.sunColor.clone() },
    uFirePos: { value: Array.from({ length: MAX_FIRE_LIGHTS }, () => new THREE.Vector3()) },
    uFireCol: { value: Array.from({ length: MAX_FIRE_LIGHTS }, () => new THREE.Vector3()) },
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      uniform float uTime;
      ${WAVE_GLSL}
      varying vec3 vWorld;
      varying vec3 vNormal;
      varying vec2 vBase;
      varying float vJac;
      varying float vHeight;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vBase = wp.xz;
        vec3 n;
        float jac;
        vec3 d = gerstner(wp.xz, uTime, n, jac);
        wp.xyz += d;
        vWorld = wp.xyz;
        vNormal = n;
        vJac = jac;
        vHeight = d.y;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform samplerCube uEnv;
      uniform sampler2D uDetail;
      uniform sampler2D uBathy;
      uniform sampler2D uEffects;
      uniform vec4 uMapRect;
      uniform vec3 uSunDir;
      uniform vec3 uSunColor;
      uniform vec3 uFirePos[${MAX_FIRE_LIGHTS}];
      uniform vec3 uFireCol[${MAX_FIRE_LIGHTS}];
      varying vec3 vWorld;
      varying vec3 vNormal;
      varying vec2 vBase;
      varying float vJac;
      varying float vHeight;

      vec3 detailN(vec2 uv) { return texture2D(uDetail, uv).xyz * 2.0 - 1.0; }

      void main() {
        vec3 toCam = cameraPosition - vWorld;
        float dist = length(toCam);
        vec3 V = toCam / dist;

        vec2 muv = (vBase - uMapRect.xy) * uMapRect.zw;
        float inMap = step(0.0, muv.x) * step(muv.x, 1.0) * step(0.0, muv.y) * step(muv.y, 1.0);
        vec4 fx = texture2D(uEffects, muv) * inMap;
        float seabed = mix(-40.0, texture2D(uBathy, muv).r * 80.0 - 40.0, inMap);
        float depth = max(-seabed, 0.0);
        float oil = clamp(fx.g, 0.0, 1.0);

        // Capillary detail, damped by distance (anti-aliasing) and by oil (oil calms ripples).
        vec2 p = vWorld.xz;
        vec3 d1 = detailN(p / 43.0 + uTime * vec2(0.011, 0.007));
        vec3 d2 = detailN(p / 16.0 + uTime * vec2(-0.012, 0.019));
        vec3 d3 = detailN(p / 170.0 + uTime * vec2(0.003, -0.004));
        vec2 slope = d1.xy * 0.55 + d2.xy * 0.4 + d3.xy * 0.7;
        float fade = mix(1.0, 0.18, smoothstep(120.0, 2600.0, dist)) * (1.0 - 0.85 * oil);
        vec3 N = normalize(vNormal + vec3(slope.x, 0.0, slope.y) * 0.3 * fade);

        float NdV = max(dot(N, V), 0.0);
        float F = 0.02 + 0.98 * pow(1.0 - NdV, 5.0);
        vec3 R = reflect(-V, N);
        R.y = abs(R.y);
        vec3 refl = textureCube(uEnv, R).rgb;

        // Water body: deep blue with sun-driven scattering through the crests.
        float sunUp = clamp(uSunDir.y * 1.6, 0.0, 1.0);
        vec3 deep = vec3(0.004, 0.028, 0.055);
        vec3 scatter = vec3(0.02, 0.2, 0.2);
        float crest = clamp(vHeight * 0.5 + 0.35, 0.0, 1.0);
        float backLit = pow(clamp(dot(-V, uSunDir) * 0.5 + 0.5, 0.0, 1.0), 3.0);
        vec3 body = deep + scatter * crest * (0.25 + 1.2 * backLit) * sunUp;
        // Shallow shelf: turquoise tint and sand showing through.
        float shallow = exp(-depth / 7.0);
        body = mix(body, vec3(0.04, 0.34, 0.33) * (0.35 + sunUp), shallow * 0.9);
        body = mix(body, vec3(0.42, 0.4, 0.3) * (0.3 + sunUp * 0.6), exp(-depth / 1.4) * 0.6);

        vec3 color = mix(body, refl, F);

        // Sun glitter.
        vec3 Hs = normalize(uSunDir + V);
        float NdH = max(dot(N, Hs), 0.0);
        float gloss = mix(1400.0, 2600.0, oil);
        float spec = pow(NdH, gloss) * 45.0 + pow(NdH, 160.0) * 0.8;
        color += uSunColor * spec * F * 4.0;

        // Oil: near-black heavy crude with thin-film iridescence at the sheen edges.
        if (oil > 0.001) {
          float thin = 1.0 - smoothstep(0.08, 0.55, oil);
          vec3 irid = 0.5 + 0.5 * cos(6.2831 * (oil * 3.2 + F * 2.0 + vec3(0.0, 0.33, 0.67)));
          vec3 crude = vec3(0.012, 0.009, 0.006);
          vec3 oilCol = mix(crude, crude + irid * 0.18, thin * 0.8);
          oilCol = mix(oilCol, refl, F * 0.7);
          color = mix(color, oilCol, smoothstep(0.0, 0.25, oil) * 0.96);
        }

        // Foam: steep crests, shoreline surf and ship wakes.
        float foamTex = texture2D(uDetail, p / 9.0 + uTime * vec2(0.02, 0.013)).a;
        float foamTex2 = texture2D(uDetail, p / 23.0 - uTime * vec2(0.01, 0.02)).a;
        float crestFoam = smoothstep(0.62, 0.2, vJac) * smoothstep(0.35, 0.75, foamTex);
        float surf = (1.0 - smoothstep(0.0, 3.2, depth)) * inMap;
        surf *= 0.55 + 0.45 * sin(depth * 2.2 - uTime * 1.6 + foamTex2 * 6.0);
        float wake = clamp(fx.r, 0.0, 1.0);
        float foam = clamp(crestFoam * 0.7 + surf * smoothstep(0.25, 0.6, foamTex2) + wake * smoothstep(0.1, 0.55, foamTex * 0.6 + wake * 0.6), 0.0, 1.0);
        foam *= 1.0 - oil * 0.9;
        vec3 foamCol = vec3(0.92, 0.95, 0.97) * (0.35 + 0.75 * sunUp);
        color = mix(color, foamCol, foam * 0.92);

        // Firelight from burning wreckage.
        for (int i = 0; i < ${MAX_FIRE_LIGHTS}; i++) {
          vec3 fc = uFireCol[i];
          if (fc.r + fc.g + fc.b <= 0.0) continue;
          vec3 lp = uFirePos[i] - vWorld;
          float l2 = dot(lp, lp);
          vec3 L = lp * inversesqrt(l2);
          float refl2 = pow(max(dot(R, L), 0.0), 40.0) * 3.0;
          color += fc * (max(dot(N, L), 0.0) * 0.4 + refl2 + 0.15) / (1.0 + l2 * 0.0009);
        }

        // Aerial perspective toward the horizon.
        vec3 fogDir = normalize(vec3(-V.x, 0.035, -V.z));
        vec3 horizon = textureCube(uEnv, fogDir).rgb;
        color = mix(color, horizon, smoothstep(1800.0, 16000.0, dist) * 0.95);

        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  })

  const mesh = new THREE.Mesh(createOceanGeometry(opts.segments), material)
  mesh.frustumCulled = false
  mesh.renderOrder = -1
  return { mesh, uniforms, detail: uniforms.uDetail.value as THREE.Texture }
}
