import { Assets } from 'pixi.js'

export class AssetManager {
  public static readonly CHARACTERS = [
    { alias: 'char-boy-1', src: '/characters/char-boy-1.png' },
    { alias: 'char-boy-2', src: '/characters/char-boy-2.png' },
    { alias: 'char-boy-3', src: '/characters/char-boy-3.png' },
    { alias: 'char-girl-1', src: '/characters/char-girl-1.png' },
    { alias: 'char-girl-2', src: '/characters/char-girl-2.png' },
    { alias: 'char-girl-3', src: '/characters/char-girl-3.png' },
    { alias: 'char-girl-4', src: '/characters/char-girl-4.png' },
    { alias: 'char-girl-5', src: '/characters/char-girl-5.png' },
  ]

  public static async loadGlobalAssets() {
    await Assets.load(this.CHARACTERS)
  }
}
