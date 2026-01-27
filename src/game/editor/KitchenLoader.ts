import { Container } from 'pixi.js'
import { KitchenLayout } from '../types/KitchenLayout'
import { Station, StationType } from '../entities/Station'

export class KitchenLoader {
  public static load(scene: Container, layout: KitchenLayout): Station[] {
    const loadedEntities: Station[] = []

    layout.entities.forEach((config) => {
      if (config.type === 'station') {
        const station = new Station(config.id, config.subtype as StationType, config.x, config.y)
        scene.addChild(station)
        loadedEntities.push(station)
      }
    })

    return loadedEntities
  }

  public static export(entities: Station[], id: string = 'custom_level'): KitchenLayout {
    const layout: KitchenLayout = {
      id: id,
      name: 'Custom Kitchen',
      width: 1200, // Default world size
      height: 800,
      entities: [],
    }

    entities.forEach((entity) => {
      // Identify entity type
      if (entity instanceof Station) {
        layout.entities.push({
          id: entity.id,
          type: 'station',
          subtype: entity.type,
          x: entity.x,
          y: entity.y,
        })
      }
      // Add other types
    })

    return layout
  }
}
