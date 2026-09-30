# IA-DND — Aventura D&D con IA

Chat de aventura estilo D&D. La IA actúa como Dungeon Master **estricto**:
- No es condescendiente
- No facilita las cosas
- **Siempre** pide tiradas de dados
- **Nunca** decide por el jugador

Inventario lateral + progreso en Firebase.

**URL en producción:** https://maxnannij.github.io/IA-DND/

## Stack

- React + Vite + TypeScript
- Google Gemini (API)
- Firebase Auth + Firestore
- Deploy: **GitHub Pages** (Actions)

## Configuración para GitHub Pages (obligatorio)

### 1. Secrets del repositorio

En el repo → **Settings → Secrets and variables → Actions → New repository secret**

Agregá uno por uno:

| Nombre del secret | Valor |
|-------------------|--------|
| `VITE_FIREBASE_API_KEY` | de Firebase |
| `VITE_FIREBASE_AUTH_DOMAIN` | `tu-proyecto.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | id del proyecto |
| `VITE_FIREBASE_STORAGE_BUCKET` | `tu-proyecto.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | número |
| `VITE_FIREBASE_APP_ID` | `1:...:web:...` |
| `VITE_GEMINI_API_KEY` | de Google AI Studio |

### 2. Activar GitHub Pages

Repo → **Settings → Pages**:

- **Source:** GitHub Actions

(No elijas “Deploy from a branch”.)

### 3. Firebase: dominio autorizado

Firebase Console → Authentication → Settings → **Authorized domains**

Agregá:

```
maxnannij.github.io
```

### 4. Firestore

Creá la base. Para pruebas, reglas en modo test o algo como:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Deploy

Cada push a `main` (o “Run workflow” en Actions) hace build y publica.

Primera vez: Actions → workflow “Deploy to GitHub Pages” → esperar a que termine en verde.

Luego abrí: **https://maxnannij.github.io/IA-DND/**

## Advertencia de seguridad

Las keys de Firebase y Gemini se embeben en el JS del cliente. Eso es normal en apps 100 % frontend:

- Firebase se protege con **reglas de Firestore** y dominios autorizados.
- La key de Gemini queda expuesta: cualquiera puede sacarla del bundle. Para uso personal está bien; para público real conviene un backend/proxy.

## Desarrollo local (opcional)

```bash
git clone https://github.com/maxnannij/IA-DND.git
cd IA-DND
cp .env.example .env   # completá las mismas variables
npm install
npm run dev
```

Para local, en `vite.config.ts` podés poner temporalmente `base: '/'`.

## Reglas del DM

- Narración fría, sin facilitarle al jugador
- Exige tiradas (1d20 + mod, CD) antes de resolver acciones de riesgo
- No decide por el jugador
- Espera el número del dado antes de continuar

## Datos en Firestore

```
users/{uid}/
  character, inventory, chatHistory, worldState, updatedAt
```
