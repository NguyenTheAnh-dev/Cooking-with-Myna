import { describe, it, expect } from 'vitest'
import { RecipeSystem } from '../systems/RecipeSystem'

describe('RecipeSystem', () => {
  describe('getRecipe', () => {
    it('should return a recipe by id', () => {
      const recipe = RecipeSystem.getRecipe('tomato_soup')

      expect(recipe).toBeDefined()
      expect(recipe?.id).toBe('tomato_soup')
      expect(recipe?.name).toBe('Tomato Soup')
    })

    it('should return undefined for unknown recipe', () => {
      const recipe = RecipeSystem.getRecipe('unknown_recipe')

      expect(recipe).toBeUndefined()
    })

    it('should have steak recipe', () => {
      const recipe = RecipeSystem.getRecipe('steak')

      expect(recipe).toBeDefined()
      expect(recipe?.id).toBe('steak')
    })
  })

  describe('getNextStep', () => {
    it('should return first step for raw tomato', () => {
      const step = RecipeSystem.getNextStep('tomato_soup', 'tomato', 'raw')

      expect(step).toBeDefined()
      expect(step?.station).toBe('stove')
      expect(step?.action).toBe('cook')
    })

    it('should return plating step for cooked tomato', () => {
      const step = RecipeSystem.getNextStep('tomato_soup', 'tomato', 'cooked')

      expect(step).toBeDefined()
      expect(step?.station).toBe('plate')
      expect(step?.action).toBe('plate')
    })

    it('should return null for invalid recipe', () => {
      const step = RecipeSystem.getNextStep('invalid', 'tomato', 'raw')

      expect(step).toBeNull()
    })

    it('should return null for item state not in recipe', () => {
      const step = RecipeSystem.getNextStep('tomato_soup', 'tomato', 'plated')

      expect(step).toBeNull()
    })
  })
})
