import { type FC, useCallback, useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet-async"
import {
  AlertTriangle,
  ArrowLeft,
  Crosshair,
  Flame,
  HelpCircle,
  Map as MapIcon,
  RotateCcw,
  Ship,
  Volume2,
  VolumeX,
  X,
} from "lucide-react"
import type { ShipRouteEngine, HudState } from "@/features/ship-route/engine"
import type { GroundingReport, ImpactReport } from "@/features/ship-route/impact"
import { PLAYER_SHIP } from "@/features/ship-route/impact"
import "@/features/ship-route/ship-route.css"

const int = (n: number) => Math.round(n).toLocaleString("en-US")
const compact = (n: number, digits = 1) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: digits }).format(n)
const usd = (n: number) => `$${compact(n, 1)}`

function useCountUp(value: number, duration = 1400, run = true) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    const start = performance.now()
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / duration)
      setV(value * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration, run])
  return v
}

const STATUS_TEXT: Record<HudState["status"], { label: string; color: string }> = {
  moored: { label: "Moored · Berth 3", color: "text-sky-300 border-sky-400/40 bg-sky-400/10" },
  underway: { label: "Underway", color: "text-emerald-300 border-emerald-400/40 bg-emerald-400/10" },
  arrived: { label: "Holding position", color: "text-amber-200 border-amber-300/40 bg-amber-300/10" },
  aground: { label: "Aground", color: "text-orange-300 border-orange-400/50 bg-orange-400/10" },
  collided: { label: "Collision · On fire", color: "text-red-300 border-red-500/50 bg-red-500/15" },
}

const Stat: FC<{ label: string; value: string; unit?: string; sub?: string; tone?: "red" | "amber" | "default" }> = ({
  label,
  value,
  unit,
  sub,
  tone = "default",
}) => (
  <div className="border border-white/10 bg-white/[0.03] px-3 py-2.5">
    <div className="text-[9.5px] font-mono uppercase tracking-widest text-zinc-400">{label}</div>
    <div
      className={`mt-1 font-mono tabular-nums text-lg leading-tight ${
        tone === "red" ? "text-red-300" : tone === "amber" ? "text-amber-200" : "text-zinc-50"
      }`}
    >
      {value}
      {unit && <span className="ml-1 text-[11px] text-zinc-400">{unit}</span>}
    </div>
    {sub && <div className="mt-0.5 text-[10.5px] leading-snug text-zinc-400">{sub}</div>}
  </div>
)

const ReportModal: FC<{ report: ImpactReport; onClose: () => void; onReset: () => void }> = ({ report, onClose, onReset }) => {
  const r = report
  const lng = r.tanker.kind === "lng"
  const bbl = useCountUp(r.totalOilBbl, 1800)
  const birds = useCountUp(r.seabirds, 2000)
  const maxBbl = Math.max(r.totalOilBbl, ...r.comparisons.map((c) => c.bbl))
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/55 p-0 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="sr-report-title">
      <div className="sr-panel sr-rise sr-scroll w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-white/10 bg-[#0a0f15]/95 px-4 sm:px-6 py-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-red-400">
              <Flame className="h-3.5 w-3.5" /> Damage assessment
            </div>
            <h2 id="sr-report-title" className="mt-1 !text-white text-xl sm:text-2xl">{r.tanker.name}</h2>
            <p className="mt-1 text-[12px] text-zinc-400">
              {r.tanker.type} · {r.tanker.flag} flag · {r.tanker.lengthM} m · {int(r.tanker.dwt)} DWT · {r.tanker.cargo}
            </p>
          </div>
          <button onClick={onClose} className="shrink-0 border border-white/15 p-1.5 text-zinc-300 hover:bg-white/10" aria-label="Close report">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 px-4 sm:px-6 py-5">
          <p className="text-[13px] leading-relaxed text-zinc-300">
            {PLAYER_SHIP.name} struck the {lng ? "gas carrier" : "tanker"} at{" "}
            <span className="text-white">{r.impactSpeedKn.toFixed(1)} kn</span> on a{" "}
            <span className="text-white">{Math.round(r.impactAngleDeg)}°</span> heading difference, rupturing{" "}
            <span className="text-red-300">
              {r.breachedTanks} of {r.tanker.cargoTanks} {lng ? "containment spheres" : "cargo tanks"}
            </span>
            . {lng
              ? "Escaping LNG boils off into a flammable vapour cloud; once ignited it becomes a pool fire burning above 1,000 °C. The oil in the water is the ships' own bunker fuel."
              : "Crude pours out until the oil level inside the tanks matches the sea outside, then keeps leaking as waves pump the breach."}
          </p>

          <section>
            <h3 className="mb-2 text-[11px] font-mono uppercase tracking-[0.2em] !text-zinc-300">Oil in the water</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="col-span-2 border border-red-500/30 bg-red-500/10 px-3 py-2.5">
                <div className="text-[9.5px] font-mono uppercase tracking-widest text-red-300/90">Barrels spilled</div>
                <div className="mt-1 font-mono tabular-nums text-3xl text-red-200">{int(bbl)}</div>
                <div className="mt-0.5 text-[10.5px] text-zinc-400">
                  {int(r.cargoSpilledBbl)} cargo + {int(r.bunkerSpilledBbl)} bunker fuel · {compact(r.totalOilBbl * 42)} US gallons
                </div>
              </div>
              <Stat label="Tonnes of oil" value={int(r.oilTonnes)} unit="t" />
              <Stat label="Litres" value={compact(r.litres)} sub={`≈ ${r.olympicPools.toFixed(1)} Olympic pools`} />
              {lng && <Stat label="LNG released" value={int(r.lngReleasedM3)} unit="m³" tone="amber" sub="Vaporises & burns" />}
              <Stat label="Burned at sea" value={int(r.burnedTonnes)} unit="t" sub={`${int(r.co2Tonnes)} t CO₂ + soot plume`} tone="amber" />
              <Stat label="Slick · 24 h" value={int(r.slick24hKm2)} unit="km²" />
              <Stat label="Slick · 1 week" value={int(r.slickWeekKm2)} unit="km²" sub="Sheen spreads far wider" />
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] font-mono uppercase tracking-[0.2em] !text-zinc-300">Marine life (estimated deaths)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Stat label="Seabirds" value={`~${int(birds)}`} tone="red" sub="Oiled feathers lose insulation → hypothermia, drowning" />
              <Stat label="Marine mammals" value={`~${int(r.marineMammals)}`} tone="red" sub="Otters, seals, dolphins, whales" />
              <Stat label="Sea turtles" value={`~${int(r.seaTurtles)}`} tone="red" sub="Surface to breathe inside the slick" />
              <Stat label="Fish eggs & larvae" value={`${compact(r.fishLarvaeBillions * 1e9)}`} tone="red" sub="PAHs cause heart defects in embryos" />
              <Stat label="Reef & seagrass" value={int(r.coralHa)} unit="ha" sub="Smothered or poisoned by dispersed oil" />
              <Stat label="Shoreline oiled" value={int(r.coastlineKm)} unit="km" sub="Beaches, mangroves, tidal flats" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[12.5px] leading-relaxed text-zinc-400 list-disc pl-5">
              <li>Plankton and shellfish absorb toxic hydrocarbons that move up the food chain for years.</li>
              <li>Oil on the seabed keeps leaching: after Exxon Valdez, Prince William Sound&apos;s herring fishery collapsed in 1993 and never fully recovered.</li>
              <li>Dispersants break the slick into droplets that sink into the water column, where corals and fish larvae are exposed.</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] font-mono uppercase tracking-[0.2em] !text-zinc-300">Human & economic cost</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Stat label="Crew at risk" value={int(r.crewAtRisk)} sub="Both vessels, fire on deck" tone="amber" />
              <Stat label="Fisheries closed" value={compact(r.fisheryClosureKm2)} unit="km²" />
              <Stat label="Cleanup & claims" value={usd(r.cleanupUsd)} />
              <Stat label="Ecosystem recovery" value={`${r.recoveryYears[0]}–${r.recoveryYears[1]}`} unit="yrs" />
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] font-mono uppercase tracking-[0.2em] !text-zinc-300">Compared with real disasters</h3>
            <div className="space-y-2">
              {[{ label: "This collision", bbl: r.totalOilBbl, ratio: 1, self: true }, ...r.comparisons.map((c) => ({ ...c, self: false }))].map((c) => (
                <div key={c.label} className="text-[12px]">
                  <div className="flex justify-between gap-3 text-zinc-300">
                    <span className={c.self ? "text-red-300" : ""}>{c.label}</span>
                    <span className="font-mono tabular-nums text-zinc-400">
                      {compact(c.bbl)} bbl{!c.self && ` · you: ${c.ratio >= 10 ? c.ratio.toFixed(0) : c.ratio.toFixed(2)}×`}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 bg-white/5">
                    <div
                      className={c.self ? "h-full bg-red-500" : "h-full bg-zinc-500"}
                      style={{ width: `${Math.max(1.5, (c.bbl / maxBbl) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-zinc-500">
              Real-world parallels: the 2018 <span className="text-zinc-300">Sanchi</span> tanker burned for a week after colliding with the bulk carrier CF Crystal and sank with all 32 crew; the 1979{" "}
              <span className="text-zinc-300">Atlantic Empress</span> / Aegean Captain collision off Tobago is still the largest ship-source oil spill on record.
            </p>
          </section>

          <p className="border-t border-white/10 pt-4 text-[10.5px] leading-relaxed text-zinc-500">
            Illustrative estimates only. Figures are scaled from published damage assessments for Exxon Valdez (1989), Deepwater Horizon (2010), Prestige (2002) and Sanchi (2018), using the
            barrels spilled, the burned fraction, and how close the wreck is to shore. Real outcomes depend on oil type, weather, currents and how fast responders arrive. Game time and ship speed are compressed.
          </p>

          <div className="flex flex-wrap gap-2 pb-1">
            <button onClick={onReset} className="flex items-center gap-2 bg-[#FF4F00] px-4 py-2 text-[12px] font-mono uppercase tracking-widest text-white hover:bg-[#ff6a26]">
              <RotateCcw className="h-3.5 w-3.5" /> Reset scenario
            </button>
            <button onClick={onClose} className="border border-white/20 px-4 py-2 text-[12px] font-mono uppercase tracking-widest text-zinc-200 hover:bg-white/10">
              Watch the aftermath
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const IntroModal: FC<{ onStart: () => void; ready: boolean }> = ({ onStart, ready }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 p-4">
    <div className="sr-panel sr-rise w-full max-w-md px-5 py-5">
      <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#FF7832]">Ship Route · maritime sandbox</div>
      <h1 className="mt-2 !text-white text-2xl">Plot a course. Face the consequences.</h1>
      <ol className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-zinc-300">
        <li className="flex gap-3">
          <span className="font-mono text-[#FF7832]">01</span>
          <span>
            Your container ship <span className="text-white">{PLAYER_SHIP.name}</span> is moored at the shipyard, ringed in orange.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-[#FF7832]">02</span>
          <span>Press on the ship and drag across the sea to draw a route. Let go and she casts off and follows it.</span>
        </li>
        <li className="flex gap-3">
          <span className="font-mono text-[#FF7832]">03</span>
          <span>
            End the route on an oil tanker and your ship locks on and rams it. Afterwards you get a report on the oil spilled and the harm to sea life.
          </span>
        </li>
      </ol>
      <p className="mt-4 text-[11.5px] text-zinc-500">Drag the empty sea to pan · right-drag or two fingers to rotate · scroll or pinch to zoom.</p>
      <button
        onClick={onStart}
        disabled={!ready}
        className="mt-5 w-full bg-[#FF4F00] px-4 py-2.5 text-[12px] font-mono uppercase tracking-widest text-white hover:bg-[#ff6a26] disabled:cursor-wait disabled:opacity-60"
      >
        {ready ? "Take the helm" : "Building the ocean…"}
      </button>
    </div>
  </div>
)

const ShipRoute: FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<ShipRouteEngine | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [intro, setIntro] = useState(true)
  const [hud, setHud] = useState<HudState | null>(null)
  const [report, setReport] = useState<ImpactReport | null>(null)
  const [showReport, setShowReport] = useState(false)
  const [grounding, setGrounding] = useState<GroundingReport | null>(null)
  const [flashKey, setFlashKey] = useState(0)
  const [muted, setMuted] = useState(false)
  const [follow, setFollow] = useState(true)
  const [warp, setWarp] = useState(1)
  const [contactsOpen, setContactsOpen] = useState(() => typeof window !== "undefined" && window.innerWidth >= 900)

  useEffect(() => {
    const mount = mountRef.current
    const labels = labelRef.current
    if (!mount || !labels) return
    let cancelled = false
    let engine: ShipRouteEngine | null = null
    let reportTimer = 0

    const probe = document.createElement("canvas")
    if (!probe.getContext("webgl2")) {
      setError("This experience needs WebGL 2, which isn't available in this browser.")
      return
    }

    const timer = window.setTimeout(async () => {
      try {
        const { ShipRouteEngine } = await import("@/features/ship-route/engine")
        if (cancelled) return
        const low = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 800
        engine = new ShipRouteEngine(
          mount,
          labels,
          {
            onHud: setHud,
            onCollision: (r) => {
              setReport(r)
              setFlashKey((k) => k + 1)
              window.clearTimeout(reportTimer)
              reportTimer = window.setTimeout(() => setShowReport(true), 11000)
            },
            onAground: (g) => setGrounding(g),
            onFollowChange: setFollow,
          },
          low ? "low" : "high",
        )
        engineRef.current = engine
        setReady(true)
      } catch (err) {
        console.error(err)
        setError("Couldn't start the 3D scene on this device.")
      }
    }, 60)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      window.clearTimeout(reportTimer)
      engine?.dispose()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setMuted(muted)
  }, [muted])

  useEffect(() => {
    engineRef.current?.setTimeScale(warp)
  }, [warp, ready])

  const reset = useCallback(() => {
    engineRef.current?.reset()
    setReport(null)
    setShowReport(false)
    setGrounding(null)
  }, [])

  const status = hud?.status ?? "moored"
  const st = STATUS_TEXT[status]

  const hint = hud?.drawing
    ? "Release to set the course"
    : status === "moored"
      ? "Press on your ship and drag across the sea to plot a course"
      : status === "underway"
        ? hud?.target
          ? `Target locked: ${hud.target}. Collision course.`
          : "Underway. Press on the ship to redraw the course."
        : status === "arrived"
          ? "Course complete. Draw another from the ship."
          : status === "aground"
            ? "Hull breached on the rocks. Reset to try again."
            : "The wreck is burning. Watch the slick spread, or open the report."

  return (
    <div className="sr-root fixed inset-0 overflow-hidden select-none">
      <Helmet>
        <title>Ship Route · Draw a course, face the consequences — Menajul Hoque</title>
        <meta
          name="description"
          content="An interactive 3D maritime sandbox: draw a route for a container ship across a realistic ocean, dodge or ram moving oil tankers, and see the environmental cost of an oil spill."
        />
        <link rel="canonical" href="https://menajul.com/ship-route" />
      </Helmet>

      <div ref={mountRef} className="absolute inset-0" />
      <div ref={labelRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" />
      {flashKey > 0 && <div key={flashKey} className="sr-flash pointer-events-none absolute inset-0 z-20" />}

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-2 p-3 sm:p-4">
        <div className="sr-panel pointer-events-auto px-3 py-2 max-w-[62vw]">
          <a href="/" className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white">
            <ArrowLeft className="h-3 w-3" /> menajul.com
          </a>
          <div className="mt-1 font-dot text-[17px] sm:text-[19px] leading-none tracking-wider text-white">SHIP ROUTE</div>
          <div className="mt-1 hidden sm:block text-[11px] text-zinc-400">Draw a course. Face the consequences.</div>
        </div>
        <div className="pointer-events-auto flex gap-1.5">
          {[
            { icon: <Crosshair className="h-4 w-4" />, label: "Follow ship", on: follow, action: () => engineRef.current?.focusPlayer() },
            { icon: <MapIcon className="h-4 w-4" />, label: "Overview", on: false, action: () => engineRef.current?.overview() },
            { icon: muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />, label: muted ? "Unmute" : "Mute", on: false, action: () => setMuted((m) => !m) },
            { icon: <RotateCcw className="h-4 w-4" />, label: "Reset scenario", on: false, action: reset },
            { icon: <HelpCircle className="h-4 w-4" />, label: "How to play", on: false, action: () => setIntro(true) },
          ].map((b) => (
            <button
              key={b.label}
              onClick={b.action}
              title={b.label}
              aria-label={b.label}
              className={`sr-panel p-2 transition-colors hover:bg-white/15 ${b.on ? "text-[#FF7832] border-[#FF4F00]/50" : "text-zinc-200"}`}
            >
              {b.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Vessel telemetry */}
      {hud && (
        <div className="sr-panel pointer-events-auto absolute left-3 bottom-16 sm:left-4 sm:bottom-4 z-30 w-[min(290px,calc(100vw-24px))] px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Ship className="h-4 w-4 text-emerald-300" />
              <div>
                <div className="text-[12px] font-semibold text-white leading-tight">{PLAYER_SHIP.name}</div>
                <div className="text-[9.5px] font-mono text-zinc-500">{PLAYER_SHIP.type}</div>
              </div>
            </div>
          </div>
          <div className={`mt-2 inline-block border px-2 py-0.5 text-[9.5px] font-mono uppercase tracking-widest ${st.color}`}>{st.label}</div>
          <div className="mt-2 grid grid-cols-3 gap-1.5 font-mono">
            {[
              { k: "SPD", v: hud.speedKn.toFixed(1), u: "kn" },
              { k: "HDG", v: String(Math.round(hud.headingDeg)).padStart(3, "0"), u: "°" },
              { k: "LOG", v: hud.loggedNm.toFixed(2), u: "nm" },
            ].map((x) => (
              <div key={x.k} className="border border-white/10 bg-white/[0.03] px-2 py-1.5">
                <div className="text-[8.5px] tracking-widest text-zinc-500">{x.k}</div>
                <div className="tabular-nums text-[14px] text-white">
                  {x.v}
                  <span className="ml-0.5 text-[9px] text-zinc-500">{x.u}</span>
                </div>
              </div>
            ))}
          </div>
          {hud.routeNm > 0 && status === "underway" && (
            <div className="mt-2">
              <div className="flex justify-between text-[9.5px] font-mono text-zinc-400">
                <span>COURSE</span>
                <span className="tabular-nums">
                  {(hud.routeNm * hud.progress).toFixed(2)} / {hud.routeNm.toFixed(2)} nm
                </span>
              </div>
              <div className="mt-1 h-1 bg-white/10">
                <div className="h-full bg-[#FF4F00]" style={{ width: `${Math.min(100, hud.progress * 100)}%` }} />
              </div>
            </div>
          )}
          {hud.target && status === "underway" && (
            <div className="mt-2 flex items-center gap-1.5 border border-red-500/40 bg-red-500/10 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-red-300">
              <Crosshair className="h-3 w-3" /> Target: {hud.target}
            </div>
          )}
          {hud.spilledBbl !== null && (
            <div className="mt-2 border border-red-500/40 bg-red-500/10 px-2 py-1.5">
              <div className="text-[9px] font-mono uppercase tracking-widest text-red-300/90">Oil released so far</div>
              <div className="font-mono tabular-nums text-[18px] text-red-200">{int(hud.spilledBbl)} bbl</div>
            </div>
          )}
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500">TIME</span>
            {[1, 2, 4].map((w) => (
              <button
                key={w}
                onClick={() => setWarp(w)}
                aria-pressed={warp === w}
                className={`flex-1 border py-0.5 text-[10px] font-mono ${warp === w ? "border-[#FF4F00]/60 bg-[#FF4F00]/15 text-[#FF9a66]" : "border-white/10 text-zinc-400 hover:bg-white/10"}`}
              >
                {w}×
              </button>
            ))}
            {status === "underway" && (
              <button onClick={() => engineRef.current?.clearRoute()} className="flex-[2] border border-white/15 py-0.5 text-[10px] font-mono uppercase tracking-widest text-zinc-300 hover:bg-white/10">
                All stop
              </button>
            )}
          </div>
        </div>
      )}

      {/* AIS contacts */}
      {hud && (
        <div className="pointer-events-auto absolute right-3 top-[76px] sm:right-4 sm:top-[84px] z-30 w-[min(300px,calc(100vw-24px))]">
          <button
            onClick={() => setContactsOpen((o) => !o)}
            className="sr-panel flex w-full items-center justify-between px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300 hover:bg-white/10"
            aria-expanded={contactsOpen}
          >
            <span>AIS contacts · {hud.contacts.length}</span>
            <span className="text-zinc-500">{contactsOpen ? "−" : "+"}</span>
          </button>
          {contactsOpen && (
            <div className="sr-panel sr-scroll max-h-[46vh] overflow-y-auto border-t-0">
              {hud.contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => engineRef.current?.focusContact(c.id)}
                  className={`block w-full border-b border-white/5 px-3 py-2 text-left hover:bg-white/10 ${c.targeted ? "bg-red-500/10" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[12px] font-medium ${c.status === "stricken" ? "text-red-300" : "text-white"}`}>{c.name}</span>
                    <span className="font-mono tabular-nums text-[10px] text-zinc-400">{c.distanceNm.toFixed(1)} nm</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">{c.type}</div>
                  <div className="mt-0.5 flex items-center justify-between gap-2 text-[9.5px] font-mono text-zinc-500">
                    <span className="truncate">{c.cargo}</span>
                    <span className={c.status === "stricken" ? "text-red-400" : c.targeted ? "text-red-300" : "text-emerald-400/80"}>
                      {c.status === "stricken" ? "ON FIRE" : c.targeted ? "TARGETED" : `${c.speedKn.toFixed(1)} kn`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hint */}
      {ready && !intro && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 sm:bottom-5 z-20 flex justify-center px-3">
          <div className="sr-panel max-w-[92vw] px-3 py-1.5 text-center text-[11.5px] font-mono tracking-wide text-zinc-200 sm:ml-[300px]">{hint}</div>
        </div>
      )}

      {/* Collision banner */}
      {report && !showReport && (
        <div className="pointer-events-none absolute inset-x-0 top-[88px] sm:top-4 z-30 flex justify-center px-4">
          <div className="sr-panel sr-rise pointer-events-auto border-red-500/50 px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" /> Collision
            </div>
            <div className="mt-1 font-dot text-[17px] text-white">{report.tanker.name} is ablaze</div>
            <div className="mt-1 text-[12px] text-zinc-400">
              {report.tanker.kind === "lng" ? "LNG containment breached" : `${report.breachedTanks} cargo tanks ruptured`} · {int(report.totalOilBbl)} bbl expected to spill
            </div>
            <button
              onClick={() => setShowReport(true)}
              className="mt-2 bg-red-600 px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-white hover:bg-red-500"
            >
              View damage report
            </button>
          </div>
        </div>
      )}

      {/* Grounding */}
      {grounding && !report && (
        <div className="pointer-events-none absolute inset-x-0 top-[88px] sm:top-4 z-30 flex justify-center px-4">
          <div className="sr-panel sr-rise pointer-events-auto max-w-sm border-orange-400/50 px-4 py-3 text-center">
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-orange-300">Ran aground</div>
            <div className="mt-1 text-[13px] leading-relaxed text-zinc-300">
              Hit the shallows at {grounding.speedKn.toFixed(1)} kn. The breached fuel tanks are leaking about{" "}
              <span className="text-white">{int(grounding.bunkerSpilledBbl)} bbl</span> of heavy fuel oil, and roughly{" "}
              <span className="text-white">{grounding.reefDamageHa} ha</span> of reef and seagrass has been crushed.
            </div>
            <div className="mt-3 flex justify-center gap-2">
              <button onClick={reset} className="bg-[#FF4F00] px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-white hover:bg-[#ff6a26]">
                Reset
              </button>
              <button onClick={() => setGrounding(null)} className="border border-white/20 px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest text-zinc-200 hover:bg-white/10">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {report && showReport && <ReportModal report={report} onClose={() => setShowReport(false)} onReset={reset} />}
      {intro && !error && <IntroModal ready={ready} onStart={() => setIntro(false)} />}

      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
          <div className="sr-panel max-w-sm px-5 py-4 text-center">
            <div className="text-[13px] text-zinc-200">{error}</div>
            <a href="/" className="mt-3 inline-block text-[11px] font-mono uppercase tracking-widest text-[#FF7832]">
              Back to menajul.com
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShipRoute
