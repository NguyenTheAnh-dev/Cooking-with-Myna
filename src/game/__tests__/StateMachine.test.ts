import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StateMachine, State } from '../ai/StateMachine'

// Mock NPCBrain type for testing
interface MockNPCBrain {
  npc: { velocity: { x: number; y: number } }
}

describe('StateMachine', () => {
  let stateMachine: StateMachine
  let mockBrain: MockNPCBrain

  beforeEach(() => {
    mockBrain = {
      npc: { velocity: { x: 0, y: 0 } },
    }
    stateMachine = new StateMachine(mockBrain as never)
  })

  describe('changeState', () => {
    it('should call enter on new state', () => {
      const enterFn = vi.fn()
      const mockState: State = {
        name: 'test',
        enter: enterFn,
        update: vi.fn(),
        exit: vi.fn(),
      }

      stateMachine.changeState(mockState)

      expect(enterFn).toHaveBeenCalledWith(mockBrain)
    })

    it('should call exit on previous state', () => {
      const exitFn = vi.fn()
      const state1: State = {
        name: 'state1',
        enter: vi.fn(),
        update: vi.fn(),
        exit: exitFn,
      }
      const state2: State = {
        name: 'state2',
        enter: vi.fn(),
        update: vi.fn(),
        exit: vi.fn(),
      }

      stateMachine.changeState(state1)
      stateMachine.changeState(state2)

      expect(exitFn).toHaveBeenCalledWith(mockBrain)
    })

    it('should not call exit/enter when changing to same state', () => {
      const enterFn = vi.fn()
      const exitFn = vi.fn()
      const mockState: State = {
        name: 'test',
        enter: enterFn,
        update: vi.fn(),
        exit: exitFn,
      }

      stateMachine.changeState(mockState)
      stateMachine.changeState(mockState)

      // Enter called once, exit never called
      expect(enterFn).toHaveBeenCalledTimes(1)
      expect(exitFn).not.toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('should call update on current state', () => {
      const updateFn = vi.fn()
      const mockState: State = {
        name: 'test',
        enter: vi.fn(),
        update: updateFn,
        exit: vi.fn(),
      }

      stateMachine.changeState(mockState)
      stateMachine.update(16)

      expect(updateFn).toHaveBeenCalledWith(mockBrain, 16)
    })

    it('should not throw if no current state', () => {
      expect(() => stateMachine.update(16)).not.toThrow()
    })
  })

  describe('getCurrentStateName', () => {
    it('should return current state name', () => {
      const mockState: State = {
        name: 'idle',
        enter: vi.fn(),
        update: vi.fn(),
        exit: vi.fn(),
      }

      stateMachine.changeState(mockState)

      expect(stateMachine.getCurrentStateName()).toBe('idle')
    })

    it('should return "none" if no state', () => {
      expect(stateMachine.getCurrentStateName()).toBe('none')
    })
  })
})
