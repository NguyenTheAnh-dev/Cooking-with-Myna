import levelData1 from '../data/level_1.json'

export interface LevelConfig {
  id: string
  name: string
  background: string
  difficulty: 'easy' | 'medium' | 'hard'
  orderInterval: number // ms between orders
  timeLimit: number // ms total game time
  maxOrders: number
  stations: StationPlacement[]
  unlockScore?: number // Score needed to unlock this level
}

export interface StationPlacement {
  id: string
  type: string
  subtype: string
  x: number
  y: number
}

// Level configurations
const LEVEL_CONFIGS: Record<number, LevelConfig> = {
  1: {
    id: 'level_1',
    name: 'Starter Kitchen',
    background: 'bg_level_1',
    difficulty: 'easy',
    orderInterval: 8000,
    timeLimit: 180000, // 3 minutes
    maxOrders: 3,
    stations: levelData1.entities as StationPlacement[],
  },
  2: {
    id: 'level_2',
    name: 'Home Kitchen',
    background: 'bg_level_2',
    difficulty: 'easy',
    orderInterval: 7500,
    timeLimit: 180000,
    maxOrders: 3,
    stations: [],
  },
  3: {
    id: 'level_3',
    name: 'Cozy Cafe',
    background: 'bg_level_3',
    difficulty: 'easy',
    orderInterval: 7000,
    timeLimit: 180000,
    maxOrders: 4,
    stations: [],
  },
  4: {
    id: 'level_4',
    name: 'Busy Bistro',
    background: 'bg_level_4',
    difficulty: 'medium',
    orderInterval: 6000,
    timeLimit: 200000,
    maxOrders: 4,
    stations: [],
    unlockScore: 500,
  },
  5: {
    id: 'level_5',
    name: 'Food Truck',
    background: 'bg_level_5',
    difficulty: 'medium',
    orderInterval: 5500,
    timeLimit: 200000,
    maxOrders: 5,
    stations: [],
    unlockScore: 800,
  },
  6: {
    id: 'level_6',
    name: 'Downtown Diner',
    background: 'bg_level_6',
    difficulty: 'medium',
    orderInterval: 5000,
    timeLimit: 220000,
    maxOrders: 5,
    stations: [],
    unlockScore: 1200,
  },
  7: {
    id: 'level_7',
    name: 'Steakhouse',
    background: 'bg_level_7',
    difficulty: 'hard',
    orderInterval: 4500,
    timeLimit: 240000, // 4 minutes
    maxOrders: 6,
    stations: [],
    unlockScore: 1800,
  },
  8: {
    id: 'level_8',
    name: 'Fine Dining',
    background: 'bg_level_8',
    difficulty: 'hard',
    orderInterval: 4000,
    timeLimit: 240000,
    maxOrders: 6,
    stations: [],
    unlockScore: 2500,
  },
  9: {
    id: 'level_9',
    name: 'Master Chef',
    background: 'bg_level_9',
    difficulty: 'hard',
    orderInterval: 3500,
    timeLimit: 270000,
    maxOrders: 7,
    stations: [],
    unlockScore: 3500,
  },
  10: {
    id: 'level_10',
    name: "Myna's Kitchen",
    background: 'bg_level_10',
    difficulty: 'hard',
    orderInterval: 3000,
    timeLimit: 300000, // 5 minutes
    maxOrders: 8,
    stations: [],
    unlockScore: 5000,
  },
}

export class LevelSystem {
  private static currentLevel = 1

  static getLevelConfig(level: number): LevelConfig {
    return LEVEL_CONFIGS[level] || LEVEL_CONFIGS[1]
  }

  static getAllLevels(): LevelConfig[] {
    return Object.values(LEVEL_CONFIGS)
  }

  static getCurrentLevel(): number {
    return this.currentLevel
  }

  static setCurrentLevel(level: number) {
    if (level >= 1 && level <= 10) {
      this.currentLevel = level
    }
  }

  static getBackgroundPath(level: number): string {
    const config = this.getLevelConfig(level)
    return `/backgrounds/${config.background}.png`
  }

  static getDifficultyMultiplier(level: number): number {
    const config = this.getLevelConfig(level)
    switch (config.difficulty) {
      case 'easy':
        return 1
      case 'medium':
        return 1.3
      case 'hard':
        return 1.6
      default:
        return 1
    }
  }

  static isLevelUnlocked(level: number, totalScore: number): boolean {
    const config = this.getLevelConfig(level)
    if (!config.unlockScore) return true
    return totalScore >= config.unlockScore
  }
}
