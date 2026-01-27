import { GameAsset } from '../models/GameState'

// Sprite asset configuration for the cooking game
export const SPRITE_ASSETS: GameAsset[] = [
  // Characters (using existing assets)
  { alias: 'char-boy-1', src: '/characters/char-boy-1.png' },
  { alias: 'char-boy-2', src: '/characters/char-boy-2.png' },
  { alias: 'char-boy-3', src: '/characters/char-boy-3.png' },
  { alias: 'char-girl-1', src: '/characters/char-girl-1.png' },
  { alias: 'char-girl-2', src: '/characters/char-girl-2.png' },
  { alias: 'char-girl-3', src: '/characters/char-girl-3.png' },
  { alias: 'char-girl-4', src: '/characters/char-girl-4.png' },
  { alias: 'char-girl-5', src: '/characters/char-girl-5.png' },

  // Stations
  { alias: 'station-stove', src: '/sprites/stations/stove.png' },
  { alias: 'station-cutting', src: '/sprites/stations/cutting_board.png' },
  { alias: 'station-fridge', src: '/sprites/stations/fridge.png' },
  { alias: 'station-plate', src: '/sprites/stations/plate.png' },
  { alias: 'station-sink', src: '/sprites/stations/sink.png' },

  // Plates
  { alias: 'plate-clean', src: '/sprites/items/clean_plate.png' },
  { alias: 'plate-dirty', src: '/sprites/items/dirty_plate.png' },

  // Ingredients
  { alias: 'item-tomato', src: '/sprites/items/tomato.png' },
  { alias: 'item-lettuce', src: '/sprites/items/lettuce.png' },
  { alias: 'item-meat', src: '/sprites/items/meat.png' },
  { alias: 'item-bread', src: '/sprites/items/bread.png' },
  { alias: 'item-cheese', src: '/sprites/items/cheese.png' },

  // Cooking Equipment
  { alias: 'item-pan', src: '/sprites/items/pan.png' },
  { alias: 'item-pot', src: '/sprites/items/pot.png' },
  { alias: 'item-knife', src: '/sprites/items/knife.png' },

  // Dishes
  { alias: 'dish-salad', src: '/sprites/dishes/salad.png' },
  { alias: 'dish-burger', src: '/sprites/dishes/burger.png' },
  { alias: 'dish-soup', src: '/sprites/dishes/soup.png' },
  { alias: 'dish-steak', src: '/sprites/dishes/steak.png' },
]

// Station type to sprite alias mapping
export const STATION_SPRITES: Record<string, string> = {
  stove: 'station-stove',
  cutting: 'station-cutting',
  fridge: 'station-fridge',
  plate: 'station-plate',
  sink: 'station-sink',
  dish_return: 'station-plate', // Reuse plate station sprite
}

// Character texture mapping (using existing characters)
export const CHARACTER_SPRITES = {
  player1: 'char-boy-1',
  player2: 'char-girl-1',
  ai1: 'char-boy-2',
  ai2: 'char-girl-2',
  // All available characters
  available: [
    'char-boy-1',
    'char-boy-2',
    'char-boy-3',
    'char-girl-1',
    'char-girl-2',
    'char-girl-3',
    'char-girl-4',
    'char-girl-5',
  ],
}

// Item type to sprite alias mapping
export const ITEM_SPRITES: Record<string, string> = {
  tomato: 'item-tomato',
  lettuce: 'item-lettuce',
  meat: 'item-meat',
  bread: 'item-bread',
  cheese: 'item-cheese',
  pan: 'item-pan',
  pot: 'item-pot',
  knife: 'item-knife',
}

// Dish type to sprite alias mapping
export const DISH_SPRITES: Record<string, string> = {
  salad: 'dish-salad',
  burger: 'dish-burger',
  soup: 'dish-soup',
  steak: 'dish-steak',
}

// Load all game assets
export async function loadGameAssets(): Promise<void> {
  const { Assets } = await import('pixi.js')

  // Add all assets to loader
  for (const asset of SPRITE_ASSETS) {
    Assets.add(asset)
  }

  // Load all at once
  await Assets.load(SPRITE_ASSETS.map((a) => a.alias))

  console.log('[Assets] All game sprites loaded')
}
