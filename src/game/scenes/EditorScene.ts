import { Container, Graphics } from 'pixi.js'
import { EditableEntity } from '../editor/EditableEntity'
import { Station, StationType } from '../entities/Station'
import { KitchenLoader } from '../editor/KitchenLoader'

export class EditorScene extends Container {
  public editorLayer: Container
  public gridLayer: Graphics
  private entities: EditableEntity[] = []

  constructor() {
    super()

    // 1. Grid
    this.gridLayer = new Graphics()
    this.drawGrid()
    this.addChild(this.gridLayer)

    // 2. Editor Layer (Where entities go)
    this.editorLayer = new Container()
    this.editorLayer.sortableChildren = true
    this.addChild(this.editorLayer)

    // 3. UI (HTML Overlay handled external to Pixi typically, or we simulate)
    this.setupHTMLInterface()
  }

  private drawGrid() {
    this.gridLayer.clear()
    this.gridLayer.stroke({ width: 1, color: 0xcccccc })

    const gridSize = 50
    const w = 1200
    const h = 800

    for (let x = 0; x <= w; x += gridSize) {
      this.gridLayer.moveTo(x, 0)
      this.gridLayer.lineTo(x, h)
    }
    for (let y = 0; y <= h; y += gridSize) {
      this.gridLayer.moveTo(0, y)
      this.gridLayer.lineTo(w, y)
    }
  }

  public addStation(type: StationType) {
    const id = `station-${Date.now()}` // Simple unique ID
    const station = new Station(id, type, 0, 0) // Wrapped will handle position

    const editable = new EditableEntity(station)
    editable.x = 400 // Center-ish spawn
    editable.y = 400

    this.editorLayer.addChild(editable)
    this.entities.push(editable)
  }

  public exportLevel() {
    // Unwrap entities to get their configs
    // Note: EditableEntity.getEntityConfig is a helper we made
    const configs = this.entities.map((e) => e.getEntityConfig())

    const layout = KitchenLoader.export(
      configs.map((c) => {
        // Mocking the object expected by export, or we just construct layout directly here
        return { ...c, id: c.id, type: c.subtype, x: c.x, y: c.y }
        // Wait, KitchenLoader.export expects raw entities or configs?
        // KitchenLoader.export expects "any[]" checking instanceof.
        // Since we have the wrapper, we can't pass 'editable.gameEntity' directly because its X/Y is 0,0 relative to wrapper.
        // Correct approach: Just build layout here manually or update KitchenLoader to accept configs.
      })
    )

    // Let's redefine export slightly in our head or just do it here:
    const json = JSON.stringify(
      {
        id: 'custom_level',
        width: 1200,
        height: 800,
        entities: configs,
      },
      null,
      2
    )

    console.log('--- EXPORTED LEVEL ---')
    console.log(json)
    alert('Level JSON exported to Console!')
  }

  private setupHTMLInterface() {
    // Helper to create buttons on top of canvas
    // In a real app this belongs in React/DOM layer

    const createBtn = (label: string, onClick: () => void, top: number) => {
      const btn = document.createElement('button')
      btn.innerText = label
      btn.style.position = 'absolute'
      btn.style.top = `${top}px`
      btn.style.right = '20px'
      btn.style.zIndex = '1000'
      btn.onclick = onClick
      document.body.appendChild(btn)
      return btn
    }

    // For cleanup later strictly we should track these
    createBtn('Add Stove', () => this.addStation('stove'), 50)
    createBtn('Add Cut', () => this.addStation('cut'), 80)
    createBtn('Add Plate', () => this.addStation('plate'), 110)
    createBtn('EXPORT JSON', () => this.exportLevel(), 150)
  }
}
