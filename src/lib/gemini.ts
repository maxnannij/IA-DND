import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Character, InventoryItem, WorldState } from '../types'

const SYSTEM_PROMPT = `Eres el Dungeon Master de una partida de D&D 5e. Reglas absolutas e inquebrantables:

1. NUNCA seas condescendiente, amable en exceso ni proteccionista.
2. NUNCA hagas las cosas fáciles. El mundo es hostil, injusto y peligroso.
3. NUNCA tomes decisiones por el jugador. No digas "decides atacar" ni "logras saltar". Espera siempre su acción explícita.
4. SIEMPRE pide tirada de dados cuando una acción tenga riesgo, incertidumbre o conflicto. Formato obligatorio:
   "Tira 1d20 + [modificador]. Dificultad (CD): X."
   No continues la escena hasta que el jugador te dé el resultado del dado.
5. Si el jugador no tira o inventa el resultado sin decir el número, exige la tirada de nuevo.
6. Narra en segunda persona ("ves", "sientes", "el orco te mira").
7. Sé breve y cortante. Máximo 3-4 párrafos cortos por respuesta.
8. Mantén coherencia con el inventario, ubicación y estado del personaje que te pasan.
9. Si el jugador intenta algo imposible o estúpido, descríbelo con consecuencias reales (daño, pérdida de objeto, muerte posible).
10. No uses emojis. No uses lenguaje moderno de internet. Tono medieval sombrío.

Cuando el jugador diga el resultado de un dado, aplícalo de forma justa y dura según la CD que fijaste.`

export function buildContext(
  character: Character,
  inventory: InventoryItem[],
  world: WorldState
): string {
  const inv = inventory.map(i => `${i.name} x${i.qty}`).join(', ') || 'vacío'
  return `
[ESTADO ACTUAL]
Personaje: ${character.name}, ${character.class} nivel ${character.level}
HP: ${character.hp}/${character.maxHp}
Stats: STR ${character.stats.str} | DEX ${character.stats.dex} | CON ${character.stats.con} | INT ${character.stats.int} | WIS ${character.stats.wis} | CHA ${character.stats.cha}
Inventario: ${inv}
Ubicación: ${world.location}
Notas del mundo: ${world.notes || 'ninguna'}
`.trim()
}

export async function sendToDM(
  history: { role: 'user' | 'model'; content: string }[],
  userMessage: string,
  character: Character,
  inventory: InventoryItem[],
  world: WorldState
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('Falta VITE_GEMINI_API_KEY en .env')

  const genAI = new GoogleGenerativeAI(apiKey)
  // gemini-1.5-flash ya no existe; usar modelo actual de la API
  const model = genAI.getGenerativeModel({
    model: 'gemini-3.5-flash',
    systemInstruction: SYSTEM_PROMPT,
  })

  const context = buildContext(character, inventory, world)

  const chat = model.startChat({
    history: [
      { role: 'user', parts: [{ text: context }] },
      { role: 'model', parts: [{ text: 'Entendido. El mundo está listo. Espero la acción del jugador.' }] },
      ...history.map(m => ({
        role: m.role,
        parts: [{ text: m.content }],
      })),
    ],
  })

  const result = await chat.sendMessage(userMessage)
  return result.response.text()
}
