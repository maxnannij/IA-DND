import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import type { GameSave, Character, InventoryItem, ChatMessage, WorldState } from '../types'

const defaultCharacter: Character = {
  name: 'Aventurero',
  class: 'Guerrero',
  level: 1,
  hp: 12,
  maxHp: 12,
  stats: { str: 14, dex: 12, con: 13, int: 10, wis: 10, cha: 8 },
}

const defaultInventory: InventoryItem[] = [
  { id: '1', name: 'Espada corta', qty: 1, description: 'Arma simple' },
  { id: '2', name: 'Raciones', qty: 3, description: 'Comida para un día' },
  { id: '3', name: 'Antorcha', qty: 2 },
]

const defaultWorld: WorldState = {
  location: 'Posada del Cuervo Negro, en el pueblo de Valdorn',
  notes: 'Es de noche. Hay un cartel de recompensa en la pared.',
}

export function getDefaultSave(): GameSave {
  return {
    character: defaultCharacter,
    inventory: defaultInventory,
    chatHistory: [],
    worldState: defaultWorld,
    updatedAt: Date.now(),
  }
}

export async function loadSave(uid: string): Promise<GameSave> {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return snap.data() as GameSave
  }
  const fresh = getDefaultSave()
  await setDoc(ref, fresh)
  return fresh
}

export async function saveGame(
  uid: string,
  data: Partial<GameSave>
): Promise<void> {
  const ref = doc(db, 'users', uid)
  await setDoc(ref, { ...data, updatedAt: Date.now() }, { merge: true })
}

export async function appendMessage(
  uid: string,
  history: ChatMessage[],
  msg: ChatMessage
): Promise<ChatMessage[]> {
  const next = [...history, msg]
  await saveGame(uid, { chatHistory: next })
  return next
}
