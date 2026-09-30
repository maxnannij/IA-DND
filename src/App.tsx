import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { v4 as uuid } from 'uuid'
import { auth } from './firebase'
import { loadSave, saveGame, getDefaultSave } from './lib/save'
import { sendToDM } from './lib/gemini'
import type { GameSave, ChatMessage, InventoryItem } from './types'
import Chat from './components/Chat'
import Inventory from './components/Inventory'
import './App.css'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  const [save, setSave] = useState<GameSave | null>(null)
  const [loading, setLoading] = useState(false)
  const [gameLoading, setGameLoading] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async u => {
      setUser(u)
      setAuthLoading(false)
      if (u) {
        setGameLoading(true)
        try {
          const data = await loadSave(u.uid)
          setSave(data)
        } catch (e) {
          console.error(e)
          setSave(getDefaultSave())
        } finally {
          setGameLoading(false)
        }
      } else {
        setSave(null)
      }
    })
    return unsub
  }, [])

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setAuthError('')
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error de autenticación'
      setAuthError(msg)
    }
  }

  async function handleSend(text: string) {
    if (!user || !save || loading) return
    setLoading(true)

    const userMsg: ChatMessage = {
      id: uuid(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }
    const historyWithUser = [...save.chatHistory, userMsg]
    setSave(s => (s ? { ...s, chatHistory: historyWithUser } : s))

    try {
      const reply = await sendToDM(
        save.chatHistory.map(m => ({ role: m.role, content: m.content })),
        text,
        save.character,
        save.inventory,
        save.worldState
      )

      const dmMsg: ChatMessage = {
        id: uuid(),
        role: 'model',
        content: reply,
        timestamp: Date.now(),
      }
      const full = [...historyWithUser, dmMsg]
      setSave(s => (s ? { ...s, chatHistory: full } : s))
      await saveGame(user.uid, { chatHistory: full })
    } catch (err) {
      console.error(err)
      const errMsg: ChatMessage = {
        id: uuid(),
        role: 'model',
        content: 'El DM no responde. Revisa tu API key de Gemini o la conexión.',
        timestamp: Date.now(),
      }
      setSave(s =>
        s ? { ...s, chatHistory: [...historyWithUser, errMsg] } : s
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleInventory(items: InventoryItem[]) {
    if (!user || !save) return
    setSave(s => (s ? { ...s, inventory: items } : s))
    await saveGame(user.uid, { inventory: items })
  }

  if (authLoading) {
    return <div className="center-screen">Cargando…</div>
  }

  if (!user) {
    return (
      <div className="auth-screen">
        <div className="auth-box">
          <h1>IA-DND</h1>
          <p className="auth-sub">El DM no te va a ayudar.</p>
          <form onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            {authError && <p className="auth-error">{authError}</p>}
            <button type="submit" className="btn-primary">
              {isRegister ? 'Crear cuenta' : 'Entrar'}
            </button>
          </form>
          <button
            type="button"
            className="btn-link"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Ya tengo cuenta' : 'Crear cuenta nueva'}
          </button>
        </div>
      </div>
    )
  }

  if (gameLoading || !save) {
    return <div className="center-screen">Cargando partida…</div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>IA-DND</h1>
        <div className="header-right">
          <span className="user-email">{user.email}</span>
          <button type="button" className="btn-ghost" onClick={() => signOut(auth)}>
            Salir
          </button>
        </div>
      </header>

      <main className="app-main">
        <Chat
          messages={save.chatHistory}
          loading={loading}
          onSend={handleSend}
        />
        <Inventory
          character={save.character}
          inventory={save.inventory}
          onUpdateInventory={handleInventory}
        />
      </main>
    </div>
  )
}
