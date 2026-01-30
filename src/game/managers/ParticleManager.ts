import { Container, Sprite, Texture } from 'pixi.js'

type ParticleType = 'smoke' | 'fire' | 'sparkle'

interface Particle extends Sprite {
  life: number
  maxLife: number
  vx: number
  vy: number
  type: ParticleType
}

export class ParticleManager extends Container {
  private particles: Particle[] = []

  // Reusable textures (generated programmatically or loaded)
  private smokeTexture: Texture = Texture.WHITE
  private fireTexture: Texture = Texture.WHITE
  private sparkleTexture: Texture = Texture.WHITE

  constructor() {
    super()
    this.createTextures()
  }

  private createTextures() {
    // For now, use white texture and tinting
    // In a real game, load actual assets
  }

  public spawn(type: ParticleType, x: number, y: number, count: number = 1) {
    for (let i = 0; i < count; i++) {
      const p = new Sprite(Texture.WHITE) as Particle
      p.anchor.set(0.5)
      p.x = x + (Math.random() - 0.5) * 20
      p.y = y + (Math.random() - 0.5) * 20
      p.type = type

      // Initialize based on type
      if (type === 'smoke') {
        p.tint = 0xcccccc
        p.maxLife = 1.0 + Math.random() * 0.5
        p.vx = (Math.random() - 0.5) * 20
        p.vy = -30 - Math.random() * 30
        p.scale.set(0.5 + Math.random() * 0.5)
      } else if (type === 'fire') {
        p.tint = 0xff4500
        p.maxLife = 0.5 + Math.random() * 0.5
        p.vx = (Math.random() - 0.5) * 30
        p.vy = -50 - Math.random() * 50
        p.rotation = Math.random() * Math.PI * 2
      } else if (type === 'sparkle') {
        p.tint = 0xffff00
        p.maxLife = 0.8
        p.vx = (Math.random() - 0.5) * 50
        p.vy = -50 - Math.random() * 50
        p.scale.set(0.3)
      }

      p.life = p.maxLife
      this.addChild(p)
      this.particles.push(p)
    }
  }

  public update(dt: number) {
    // dt is in seconds
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.life -= dt

      if (p.life <= 0) {
        this.removeChild(p)
        this.particles.splice(i, 1)
        continue
      }

      // Physics
      p.x += p.vx * dt
      p.y += p.vy * dt

      // Visuals
      const lifePct = p.life / p.maxLife
      p.alpha = lifePct

      if (p.type === 'smoke') {
        p.scale.x += dt * 0.5
        p.scale.y += dt * 0.5
      } else if (p.type === 'sparkle') {
        p.rotation += 10 * dt
      }
    }
  }
}
