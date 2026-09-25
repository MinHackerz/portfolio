import * as THREE from "three"
import { QUAY, BERTH } from "./world"
import { containerTexture, createTug, windowTexture } from "./ships"
import { mulberry32 } from "./noise"

function concreteTexture() {
  const c = document.createElement("canvas")
  c.width = c.height = 256
  const g = c.getContext("2d")!
  g.fillStyle = "#9a968e"
  g.fillRect(0, 0, 256, 256)
  const rand = mulberry32(5)
  for (let i = 0; i < 4000; i++) {
    const v = 120 + Math.floor(rand() * 60)
    g.fillStyle = `rgba(${v},${v - 3},${v - 8},0.25)`
    g.fillRect(rand() * 256, rand() * 256, 2 + rand() * 3, 2 + rand() * 3)
  }
  g.strokeStyle = "rgba(60,58,54,0.35)"
  g.lineWidth = 1
  for (let i = 0; i <= 256; i += 64) {
    g.beginPath()
    g.moveTo(i, 0)
    g.lineTo(i, 256)
    g.moveTo(0, i)
    g.lineTo(256, i)
    g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 8
  return t
}

function box(parent: THREE.Object3D, mat: THREE.Material | THREE.Material[], w: number, h: number, d: number, x: number, y: number, z: number) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y + h / 2, z)
  m.castShadow = true
  m.receiveShadow = true
  parent.add(m)
  return m
}

/** Ship-to-shore gantry crane with its boom reaching out over the berth (+X). */
function stsCrane(parent: THREE.Object3D, x: number, z: number, top: number) {
  const red = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.6, metalness: 0.4 })
  const white = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.6, metalness: 0.4 })
  const g = new THREE.Group()
  const legH = 13
  const span = 6
  const gauge = 5
  for (const sx of [-span / 2, span / 2]) {
    for (const sz of [-gauge / 2, gauge / 2]) box(g, red, 0.6, legH, 0.6, sx, 0, sz)
  }
  box(g, red, span + 0.6, 0.7, 0.6, 0, legH * 0.45, gauge / 2)
  box(g, red, span + 0.6, 0.7, 0.6, 0, legH * 0.45, -gauge / 2)
  box(g, white, 34, 1.1, gauge + 0.6, 7, legH, 0)
  box(g, red, 3.2, 2, 2.4, -2, legH + 1.1, 0)
  // A-frame and stays.
  const aframe = box(g, red, 0.5, 6, 0.5, -1, legH + 1.1, 0)
  aframe.rotation.z = -0.15
  const stay = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 22, 6), white)
  stay.position.set(10, legH + 4, 0)
  stay.rotation.z = Math.PI / 2 + 0.3
  g.add(stay)
  box(g, new THREE.MeshStandardMaterial({ color: 0x2d3e50, roughness: 0.4 }), 1.4, 1.1, 1.4, 14, legH - 1.2, 0)
  g.position.set(x, top, z)
  parent.add(g)
}

export function createShipyard() {
  const group = new THREE.Group()
  group.name = "shipyard"
  const w = QUAY.maxX - QUAY.minX
  const d = QUAY.maxZ - QUAY.minZ
  const cx = (QUAY.minX + QUAY.maxX) / 2
  const cz = (QUAY.minZ + QUAY.maxZ) / 2

  const tex = concreteTexture()
  const topTex = tex.clone()
  topTex.repeat.set(w / 20, d / 20)
  topTex.needsUpdate = true
  const sideTex = tex.clone()
  sideTex.repeat.set(d / 20, 0.6)
  sideTex.needsUpdate = true
  const concreteTop = new THREE.MeshStandardMaterial({ map: topTex, roughness: 0.92 })
  const concreteSide = new THREE.MeshStandardMaterial({ map: sideTex, roughness: 0.95, color: 0xbab5aa })
  const quay = new THREE.Mesh(new THREE.BoxGeometry(w, QUAY.top + 12, d), [
    concreteSide, concreteSide, concreteTop, concreteSide, concreteSide, concreteSide,
  ])
  quay.position.set(cx, (QUAY.top - 12) / 2, cz)
  quay.receiveShadow = true
  quay.castShadow = true
  group.add(quay)

  const yellow = new THREE.MeshStandardMaterial({ color: 0xf2c200, roughness: 0.7 })
  box(group, yellow, 0.4, 0.04, d - 4, QUAY.maxX - 2.2, QUAY.top, cz)

  // Rubber fenders and bollards along the berth.
  const rubber = new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.95 })
  const iron = new THREE.MeshStandardMaterial({ color: 0x262a2e, roughness: 0.5, metalness: 0.6 })
  const bollards: THREE.Vector3[] = []
  for (let z = QUAY.minZ + 8; z < QUAY.maxZ - 4; z += 12) {
    const f = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 3.2, 12), rubber)
    f.position.set(QUAY.maxX + 0.35, 0.6, z)
    group.add(f)
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.7, 10), iron)
    b.position.set(QUAY.maxX - 1, QUAY.top + 0.35, z + 6)
    b.castShadow = true
    group.add(b)
    bollards.push(new THREE.Vector3(QUAY.maxX - 1, QUAY.top + 0.6, z + 6))
  }

  stsCrane(group, QUAY.maxX - 4, BERTH.z - 12, QUAY.top)
  stsCrane(group, QUAY.maxX - 4, BERTH.z + 16, QUAY.top)

  // Sheds and workshop.
  const shedMat = new THREE.MeshStandardMaterial({ color: 0x5d7890, roughness: 0.7, metalness: 0.3 })
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x9aa3a8, roughness: 0.6, metalness: 0.5 })
  const sheds = [
    { x: QUAY.minX + 30, z: QUAY.minZ + 40, w: 22, d: 46, h: 8 },
    { x: QUAY.minX + 30, z: QUAY.minZ + 110, w: 22, d: 40, h: 7 },
    { x: QUAY.minX + 28, z: QUAY.maxZ - 45, w: 18, d: 50, h: 9 },
  ]
  for (const s of sheds) {
    box(group, shedMat, s.w, s.h, s.d, s.x, QUAY.top, s.z)
    const r = s.w * 0.7071
    const roofGeo = new THREE.CylinderGeometry(r, r, s.d, 24, 1, true, (Math.PI * 3) / 4, Math.PI / 2)
    roofGeo.rotateX(Math.PI / 2)
    const roof = new THREE.Mesh(roofGeo, roofMat)
    roof.material.side = THREE.DoubleSide
    roof.position.set(s.x, QUAY.top + s.h - r * 0.7071, s.z)
    roof.castShadow = true
    group.add(roof)
  }

  // Office block.
  const win = windowTexture().clone()
  win.repeat.set(10, 6)
  win.needsUpdate = true
  const officeMat = new THREE.MeshStandardMaterial({ map: win, roughness: 0.5 })
  box(group, officeMat, 12, 6 * 0.62 * 1.3, 9, QUAY.minX + 62, QUAY.top, QUAY.maxZ - 20)

  // Yard container stacks.
  const rand = mulberry32(21)
  const colors = [0x2f5f9e, 0xb8302a, 0x1f6b3a, 0x8a8f94, 0xd46a1c, 0xe7e3dc, 0x6e3a24]
  const slots: THREE.Vector3[] = []
  for (let bx = 0; bx < 4; bx++) {
    for (let bz = 0; bz < 16; bz++) {
      const tiers = 1 + Math.floor(rand() * 4)
      for (let t = 0; t < tiers; t++) slots.push(new THREE.Vector3(QUAY.minX + 58 + bx * 3.2, QUAY.top + 0.26 + t * 0.52, QUAY.minZ + 30 + bz * 0.62 * 1.05 + Math.floor(bz / 4) * 3))
    }
  }
  for (let bx = 0; bx < 3; bx++) {
    for (let bz = 0; bz < 20; bz++) {
      const tiers = 1 + Math.floor(rand() * 3)
      for (let t = 0; t < tiers; t++) slots.push(new THREE.Vector3(QUAY.minX + 58 + bx * 3.2, QUAY.top + 0.26 + t * 0.52, QUAY.minZ + 130 + bz * 0.62 + Math.floor(bz / 5) * 2.5))
    }
  }
  const cMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(2.42, 0.51, 0.5),
    new THREE.MeshStandardMaterial({ map: containerTexture(), roughness: 0.7, metalness: 0.25 }),
    slots.length,
  )
  const m = new THREE.Matrix4()
  const col = new THREE.Color()
  slots.forEach((p, i) => {
    m.makeTranslation(p.x, p.y, p.z)
    cMesh.setMatrixAt(i, m)
    cMesh.setColorAt(i, col.set(colors[Math.floor(rand() * colors.length)]))
  })
  cMesh.castShadow = true
  cMesh.receiveShadow = true
  group.add(cMesh)

  // Flood-light masts.
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x777b80, roughness: 0.5, metalness: 0.6 })
  const lampMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff3d0, emissiveIntensity: 1.5 })
  for (let z = QUAY.minZ + 20; z < QUAY.maxZ; z += 60) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 11, 8), poleMat)
    p.position.set(QUAY.maxX - 12, QUAY.top + 5.5, z)
    p.castShadow = true
    group.add(p)
    box(group, lampMat, 0.8, 0.3, 1.6, QUAY.maxX - 12, QUAY.top + 11, z)
  }

  const tug = createTug()
  tug.group.position.set(QUAY.maxX + 1.6, 0, QUAY.minZ + 12)
  tug.group.rotation.y = Math.PI / 2
  group.add(tug.group)

  return { group, bollards, tug }
}
