import type { InventoryItem, Character } from '../types'

interface Props {
  character: Character
  inventory: InventoryItem[]
  onUpdateInventory: (items: InventoryItem[]) => void
}

export default function Inventory({ character, inventory, onUpdateInventory }: Props) {
  function removeItem(id: string) {
    onUpdateInventory(inventory.filter(i => i.id !== id))
  }

  function changeQty(id: string, delta: number) {
    onUpdateInventory(
      inventory
        .map(i => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter(i => i.qty > 0)
    )
  }

  return (
    <aside className="inventory-panel">
      <h2>Personaje</h2>
      <div className="char-card">
        <div className="char-name">{character.name}</div>
        <div className="char-meta">
          {character.class} · Nivel {character.level}
        </div>
        <div className="hp-bar">
          <div
            className="hp-fill"
            style={{
              width: `${Math.max(0, (character.hp / character.maxHp) * 100)}%`,
            }}
          />
        </div>
        <div className="hp-text">
          HP {character.hp}/{character.maxHp}
        </div>
        <div className="stats-grid">
          {Object.entries(character.stats).map(([k, v]) => (
            <div key={k} className="stat">
              <span className="stat-label">{k.toUpperCase()}</span>
              <span className="stat-val">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <h2>Inventario</h2>
      <ul className="inv-list">
        {inventory.length === 0 && (
          <li className="empty">Vacío. La muerte también es una opción.</li>
        )}
        {inventory.map(item => (
          <li key={item.id} className="inv-item">
            <div className="inv-name">
              {item.name}
              {item.description && (
                <span className="inv-desc">{item.description}</span>
              )}
            </div>
            <div className="inv-qty">
              <button type="button" onClick={() => changeQty(item.id, -1)}>−</button>
              <span>{item.qty}</span>
              <button type="button" onClick={() => changeQty(item.id, 1)}>+</button>
              <button type="button" className="btn-remove" onClick={() => removeItem(item.id)}>
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
