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
  ingredients: ItemType[] // List of required ingredients
  steps: RecipeStep[]
  finalItem: ItemType
  difficulty: 'easy' | 'medium' | 'hard'
  points: number // Score for completing this recipe
}

export class RecipeSystem {
  private static recipes: Map<string, Recipe> = new Map()

  static {
    // 1. Tomato Soup (Easy) - Single ingredient, single step
    this.recipes.set('tomato_soup', {
      id: 'tomato_soup',
      name: 'Tomato Soup',
      ingredients: ['tomato'],
      finalItem: 'tomato',
      difficulty: 'easy',
      points: 50,
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
          duration: 0.5,
        },
      ],
    })

    // 2. Steak (Easy) - Single ingredient, cook only
    this.recipes.set('steak', {
      id: 'steak',
      name: 'Steak',
      ingredients: ['meat'],
      finalItem: 'steak',
      difficulty: 'easy',
      points: 75,
      steps: [
        {
          requiredItem: 'meat',
          requiredState: 'raw',
          station: 'stove',
          action: 'cook',
          nextState: 'cooked',
          duration: 5,
          burnDuration: 4,
        },
        {
          requiredItem: 'meat',
          requiredState: 'cooked',
          station: 'plate',
          action: 'plate',
          nextState: 'plated',
          duration: 0.5,
        },
      ],
    })

    // 3. Salad (Medium) - Multiple ingredients, chop required
    this.recipes.set('salad', {
      id: 'salad',
      name: 'Fresh Salad',
      ingredients: ['lettuce', 'tomato'],
      finalItem: 'salad',
      difficulty: 'medium',
      points: 100,
      steps: [
        {
          requiredItem: 'lettuce',
          requiredState: 'raw',
          station: 'cut',
          action: 'chop',
          nextState: 'chopped',
          duration: 2,
        },
        {
          requiredItem: 'tomato',
          requiredState: 'raw',
          station: 'cut',
          action: 'chop',
          nextState: 'chopped',
          duration: 2,
        },
        {
          requiredItem: 'lettuce',
          requiredState: 'chopped',
          station: 'plate',
          action: 'plate',
          nextState: 'plated',
          duration: 0.5,
        },
      ],
    })

    // 4. Burger (Hard) - Multiple ingredients, chop + cook + assemble
    this.recipes.set('burger', {
      id: 'burger',
      name: 'Classic Burger',
      ingredients: ['bread', 'meat', 'lettuce'],
      finalItem: 'burger',
      difficulty: 'hard',
      points: 150,
      steps: [
        {
          requiredItem: 'meat',
          requiredState: 'raw',
          station: 'stove',
          action: 'cook',
          nextState: 'cooked',
          duration: 4,
          burnDuration: 5,
        },
        {
          requiredItem: 'lettuce',
          requiredState: 'raw',
          station: 'cut',
          action: 'chop',
          nextState: 'chopped',
          duration: 1.5,
        },
        {
          requiredItem: 'bread',
          requiredState: 'raw',
          station: 'plate',
          action: 'plate',
          nextState: 'plated',
          duration: 0.5,
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

  static getRecipesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Recipe[] {
    return Array.from(this.recipes.values()).filter((r) => r.difficulty === difficulty)
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

  /**
   * Get the list of required ingredients for a recipe
   */
  static getIngredients(recipeId: string): ItemType[] {
    const recipe = this.recipes.get(recipeId)
    return recipe?.ingredients || []
  }

  /**
   * Get recipe IDs suitable for a given difficulty level
   */
  static getRecipeIdsForLevel(level: number): string[] {
    if (level <= 3) {
      // Easy levels: Only easy recipes
      return ['tomato_soup', 'steak']
    } else if (level <= 6) {
      // Medium levels: Easy + Medium recipes
      return ['tomato_soup', 'steak', 'salad']
    } else {
      // Hard levels: All recipes
      return ['tomato_soup', 'steak', 'salad', 'burger']
    }
  }
}
