import { describe, it, expect, beforeEach } from 'vitest'
import { EventBus } from '../core/EventBus'

describe('EventBus', () => {
  let eventBus: EventBus

  beforeEach(() => {
    // Reset singleton for each test
    // @ts-expect-error - accessing private for testing
    EventBus.instance = undefined
    eventBus = EventBus.getInstance()
  })

  describe('getInstance', () => {
    it('should return the same instance', () => {
      const instance1 = EventBus.getInstance()
      const instance2 = EventBus.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('on and emit', () => {
    it('should call handler when event is emitted', () => {
      let received: unknown = null
      eventBus.on('TEST_EVENT', (payload) => {
        received = payload
      })

      eventBus.emit('TEST_EVENT', { data: 'test' })

      expect(received).toEqual({ data: 'test' })
    })

    it('should call multiple handlers for same event', () => {
      let count = 0
      eventBus.on('TEST_EVENT', () => count++)
      eventBus.on('TEST_EVENT', () => count++)

      eventBus.emit('TEST_EVENT', {})

      expect(count).toBe(2)
    })

    it('should not call handler for different event', () => {
      let called = false
      eventBus.on('EVENT_A', () => {
        called = true
      })

      eventBus.emit('EVENT_B', {})

      expect(called).toBe(false)
    })
  })

  describe('off', () => {
    it('should remove handler', () => {
      let count = 0
      const handler = () => count++

      eventBus.on('TEST_EVENT', handler)
      eventBus.emit('TEST_EVENT', {})
      expect(count).toBe(1)

      eventBus.off('TEST_EVENT', handler)
      eventBus.emit('TEST_EVENT', {})
      expect(count).toBe(1)
    })
  })
})
