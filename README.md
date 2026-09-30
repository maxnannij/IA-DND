# IA-DND — Aventura D&D con IA

Chat de aventura estilo D&D donde la IA actúa como Dungeon Master **estricto**:
- No es condescendiente
- No facilita las cosas
- **Siempre** pide tiradas de dados
- **Nunca** decide por el jugador

Inventario lateral + guardado de progreso en Firebase.

## Stack

- **Frontend**: React + Vite + TypeScript
- **IA**: Google Gemini (API)
- **Backend / DB**: Firebase (Auth + Firestore)
- **Deploy**: GitHub Pages o Vercel

## Requisitos previos

1. Cuenta de Firebase → crea un proyecto
2. Habilita **Authentication** (Email/Password o Google)
3. Crea una base **Firestore**
4. Google AI Studio → genera una API Key de Gemini
5. Node.js 18+

## Configuración

```bash
git clone https://github.com/maxnannij/IA-DND.git
cd IA-DND
npm install
```

Copia `.env.example` a `.env` y completa:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEMINI_API_KEY=
```

## Desarrollo

```bash
npm run dev
```

## Build + Deploy (GitHub Pages)

```bash
npm run build
# Luego sube la carpeta dist/ o configura GitHub Actions
```

## Reglas del DM (system prompt)

La IA está configurada para:
- Narrar el mundo de forma fría y realista
- Exigir tiradas de dados (1d20 + modificadores) para cualquier acción con riesgo
- Nunca decir "lo lograste fácilmente" ni "puedes hacerlo sin problema"
- Esperar la respuesta del jugador con el resultado del dado antes de continuar
- Mantener coherencia con el inventario y el estado guardado

## Estructura de datos en Firestore

```
users/{uid}/
  character: { name, class, level, hp, maxHp, stats... }
  inventory: [ { id, name, qty, description } ]
  chatHistory: [ { role, content, timestamp } ]
  worldState: { location, quests, npcs... }
```

---

Hecho para que la aventura duela un poco.
