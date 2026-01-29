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

  public static readonly BACKGROUNDS = [
    { alias: 'bg_level_1', src: '/backgrounds/bg_level_1.png' },
    { alias: 'bg_level_2', src: '/backgrounds/bg_level_2.png' },
    { alias: 'bg_level_3', src: '/backgrounds/bg_level_3.png' },
    { alias: 'bg_level_4', src: '/backgrounds/bg_level_4.png' },
    { alias: 'bg_level_5', src: '/backgrounds/bg_level_5.png' },
    { alias: 'bg_level_6', src: '/backgrounds/bg_level_6.png' },
    { alias: 'bg_level_7', src: '/backgrounds/bg_level_7.png' },
    { alias: 'bg_level_8', src: '/backgrounds/bg_level_8.png' },
    { alias: 'bg_level_9', src: '/backgrounds/bg_level_9.png' },
    { alias: 'bg_level_10', src: '/backgrounds/bg_level_10.png' },
  ]

  public static async loadGlobalAssets() {
    await Assets.load([...this.CHARACTERS, ...this.BACKGROUNDS])
  }
}
