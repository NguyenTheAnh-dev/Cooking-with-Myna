import { StationType } from '../entities/Station'
import { ItemType, CookingState } from '../entities/Item'

export interface RecipeStep {
  requiredItem: ItemType
  requiredState: CookingState
  station: StationType
  action: 'chop' | 'cook' | 'plate' | 'serve' | 'idle'
  nextState: CookingState
  duration: number // Processing time in seconds
  burnDuration?: number // Optional: Time before overcooked/burnt
}

export interface Recipe {
  id: string
  name: string
  steps: RecipeStep[]
  finalItem: ItemType
}

export class RecipeSystem {
  private static recipes: Map<string, Recipe> = new Map()

  static {
    // 1. Tomato Soup (Simplest)
    // Tomato -> Chop -> Pot -> Bowl
    // For this demo: Tomato -> Stove -> Served
    this.recipes.set('tomato_soup', {
      id: 'tomato_soup',
      name: 'Tomato Soup',
      finalItem: 'tomato', // In a real game this would change type, keeping simple
      steps: [
        {
          requiredItem: 'tomato',
          requiredState: 'raw',
          station: 'stove',
          action: 'cook',
          nextState: 'cooked',
          duration: 3,
          burnDuration: 5,
        },
        {
          requiredItem: 'tomato',
          requiredState: 'cooked',
          station: 'plate',
          action: 'plate',
          nextState: 'plated',
          duration: 0.5, // Instant plating
        },
      ],
    })

    // 2. Steak
    this.recipes.set('steak', {
      id: 'steak',
      name: 'Steak',
      finalItem: 'steak',
      steps: [
        {
          requiredItem: 'steak',
          requiredState: 'raw',
          station: 'stove',
          action: 'cook',
          nextState: 'cooked',
          duration: 5,
          burnDuration: 4,
        },
      ],
    })
  }

  static getRecipe(id: string): Recipe | undefined {
    return this.recipes.get(id)
  }

  static getAllRecipes(): Map<string, Recipe> {
    return this.recipes
  }

  /**
   * Returns the next step needed for an item to progress in a recipe.
   */
  static getNextStep(
    recipeId: string,
    itemType: ItemType,
    itemState: CookingState
  ): RecipeStep | null {
    const recipe = this.recipes.get(recipeId)
    if (!recipe) return null

    // Find the first step that matches current state
    const step = recipe.steps.find(
      (s) => s.requiredItem === itemType && s.requiredState === itemState
    )

    return step || null
  }
}
