import { TutorialManager } from '../TutorialManager'
import { MoveToStationStep } from './MoveToStationStep'
import { InteractionStep } from './InteractionStep'

export function setupBasicTutorial(manager: TutorialManager) {
  // 1. Move to Counter (Ingredients)
  manager.addStep(
    new MoveToStationStep(
      'move_crate',
      'Welcome Chef! Move to the [Counter] to find ingredients.',
      'counter'
    )
  )

  // 2. Pick up item (Simulated event for now)
  // In real game, this event implies they interacted
  manager.addStep(
    new InteractionStep(
      'pick_tomato',
      'Press Interact to pick up a Tomato.',
      'PLAYER_PICKUP' // Need to ensure game emits this
    )
  )

  // 3. Move to Stove
  manager.addStep(
    new MoveToStationStep('move_stove', 'Good! Now take it to the [Stove] to cook.', 'stove')
  )

  // 4. Cook
  manager.addStep(new InteractionStep('cook_soup', 'Cook the tomato into soup!', 'PLAYER_COOK'))

  // 5. Serve
  manager.addStep(
    new InteractionStep(
      'serve',
      'Great! Now serve it to the customer.',
      'PLAYER_SERVE' // Hypothethical event
    )
  )
}
