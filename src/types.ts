export interface InventoryItem {
  id: string
  name: string
  qty: number
  description?: string
}

export interface Character {
  name: string
  class: string
  level: number
  hp: number
  maxHp: number
  stats: {
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
  }
}

export interface ChatMessage {
  id: string
  role: 'user' | 'model'
  content: string
  timestamp: number
}

export interface WorldState {
  location: string
  notes: string
}

export interface GameSave {
  character: Character
  inventory: InventoryItem[]
  chatHistory: ChatMessage[]
  worldState: WorldState
  updatedAt: number
}
