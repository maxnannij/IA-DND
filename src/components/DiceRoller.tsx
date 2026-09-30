import { useState } from 'react'

interface Props {
  onRoll: (result: string) => void
}

export default function DiceRoller({ onRoll }: Props) {
  const [last, setLast] = useState<number | null>(null)
  const [sides, setSides] = useState(20)
  const [mod, setMod] = useState(0)

  function roll() {
    const raw = Math.floor(Math.random() * sides) + 1
    const total = raw + mod
    setLast(total)
    const text =
      mod === 0
        ? `Tiro 1d${sides}: ${raw}`
        : `Tiro 1d${sides}${mod >= 0 ? '+' : ''}${mod}: ${raw} → total ${total}`
    onRoll(text)
  }

  return (
    <div className="dice-roller">
      <div className="dice-controls">
        <label>
          Dados
          <select value={sides} onChange={e => setSides(Number(e.target.value))}>
            {[4, 6, 8, 10, 12, 20, 100].map(n => (
              <option key={n} value={n}>d{n}</option>
            ))}
          </select>
        </label>
        <label>
          Mod
          <input
            type="number"
            value={mod}
            onChange={e => setMod(Number(e.target.value))}
            style={{ width: 56 }}
          />
        </label>
        <button type="button" className="btn-dice" onClick={roll}>
          Tirar
        </button>
      </div>
      {last !== null && <div className="dice-result">{last}</div>}
    </div>
  )
}
