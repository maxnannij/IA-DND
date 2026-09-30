import { useEffect, useRef, useState } from 'react'
import type { ChatMessage } from '../types'
import DiceRoller from './DiceRoller'

interface Props {
  messages: ChatMessage[]
  loading: boolean
  onSend: (text: string) => void
}

export default function Chat({ messages, loading, onSend }: Props) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const t = input.trim()
    if (!t || loading) return
    onSend(t)
    setInput('')
  }

  function handleDice(result: string) {
    setInput(prev => (prev ? `${prev} ${result}` : result))
  }

  return (
    <section className="chat-panel">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            El DM espera tu primera acción. No esperes piedad.
          </div>
        )}
        {messages.map(m => (
          <div
            key={m.id}
            className={`msg ${m.role === 'user' ? 'msg-player' : 'msg-dm'}`}
          >
            <div className="msg-role">
              {m.role === 'user' ? 'Tú' : 'Dungeon Master'}
            </div>
            <div className="msg-content">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="msg msg-dm">
            <div className="msg-role">Dungeon Master</div>
            <div className="msg-content typing">…</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <DiceRoller onRoll={handleDice} />

      <form className="chat-form" onSubmit={submit}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Describe tu acción o pega el resultado del dado…"
          rows={2}
          disabled={loading}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit(e)
            }
          }}
        />
        <button type="submit" className="btn-send" disabled={loading || !input.trim()}>
          Enviar
        </button>
      </form>
    </section>
  )
}
