// Tiny synthesized soundscape: surf ambience, ship horn and explosions. No audio assets.

export class GameAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private noise: AudioBuffer | null = null
  private muted = false

  /** Must be called from a user gesture. */
  ensure() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume()
      return
    }
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return
    const ctx = new Ctor()
    this.ctx = ctx
    this.master = ctx.createGain()
    this.master.gain.value = this.muted ? 0 : 0.8
    this.master.connect(ctx.destination)

    // Brown noise buffer shared by all effects.
    const len = ctx.sampleRate * 4
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    let last = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      last = (last + 0.02 * w) / 1.02
      d[i] = last * 3.5
    }
    this.noise = buf
    this.ambient()
  }

  setMuted(m: boolean) {
    this.muted = m
    if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.8, this.ctx.currentTime, 0.1)
  }

  dispose() {
    void this.ctx?.close()
    this.ctx = null
  }

  private ambient() {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    src.loop = true
    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.frequency.value = 520
    const g = ctx.createGain()
    g.gain.value = 0.22
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.12
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.1
    lfo.connect(lfoGain).connect(g.gain)
    src.connect(lp).connect(g).connect(this.master!)
    src.start()
    lfo.start()
  }

  horn() {
    const ctx = this.ctx
    if (!ctx || !this.master) return
    const t = ctx.currentTime
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.22, t + 0.25)
    g.gain.setValueAtTime(0.22, t + 2.1)
    g.gain.exponentialRampToValueAtTime(0.001, t + 3.2)
    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.frequency.value = 700
    lp.connect(g).connect(this.master)
    for (const f of [73, 110, 146.5]) {
      const o = ctx.createOscillator()
      o.type = "sawtooth"
      o.frequency.value = f
      o.connect(lp)
      o.start(t)
      o.stop(t + 3.3)
    }
  }

  explosion(big = 1) {
    const ctx = this.ctx
    if (!ctx || !this.master || !this.noise) return
    const t = ctx.currentTime
    const boom = (at: number, gain: number, dur: number) => {
      const src = ctx.createBufferSource()
      src.buffer = this.noise
      src.playbackRate.value = 0.7
      const lp = ctx.createBiquadFilter()
      lp.type = "lowpass"
      lp.frequency.setValueAtTime(3200, at)
      lp.frequency.exponentialRampToValueAtTime(140, at + dur)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, at)
      g.gain.exponentialRampToValueAtTime(gain, at + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
      src.connect(lp).connect(g).connect(this.master!)
      src.start(at, Math.random() * 2)
      src.stop(at + dur + 0.1)

      const sub = ctx.createOscillator()
      sub.type = "sine"
      sub.frequency.setValueAtTime(62, at)
      sub.frequency.exponentialRampToValueAtTime(22, at + 1.4)
      const sg = ctx.createGain()
      sg.gain.setValueAtTime(gain * 0.9, at)
      sg.gain.exponentialRampToValueAtTime(0.0001, at + 1.6)
      sub.connect(sg).connect(this.master!)
      sub.start(at)
      sub.stop(at + 1.7)
    }
    boom(t, 1.2 * big, 4.5)
    boom(t + 0.35, 0.7 * big, 3)
    boom(t + 0.9, 0.5 * big, 3.5)
    // Metal crunch.
    const o = ctx.createOscillator()
    o.type = "square"
    o.frequency.setValueAtTime(180, t)
    o.frequency.exponentialRampToValueAtTime(40, t + 0.6)
    const og = ctx.createGain()
    og.gain.setValueAtTime(0.12, t)
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.7)
    o.connect(og).connect(this.master)
    o.start(t)
    o.stop(t + 0.8)
  }

  crunch() {
    const ctx = this.ctx
    if (!ctx || !this.master || !this.noise) return
    const t = ctx.currentTime
    const src = ctx.createBufferSource()
    src.buffer = this.noise
    const bp = ctx.createBiquadFilter()
    bp.type = "bandpass"
    bp.frequency.value = 260
    bp.Q.value = 0.8
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.9, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2)
    src.connect(bp).connect(g).connect(this.master)
    src.start(t)
    src.stop(t + 2.3)
  }
}
