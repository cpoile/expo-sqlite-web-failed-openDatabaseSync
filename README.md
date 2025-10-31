# expo-sqlite Web: SharedArrayBuffer Error & Solutions

## The Problem

Using `expo-sqlite` sync API on web throws:
```
Uncaught ReferenceError: SharedArrayBuffer is not defined
```

**Why?**
- Sync methods (`getFirstSync`, `openDatabaseSync`) require `SharedArrayBuffer`
- SharedArrayBuffer requires COEP/COOP HTTP headers on the HTML document
- Without these headers, browsers disable SharedArrayBuffer for security (Spectre vulnerability)

## Solutions

### Solution 1: Use Async API (Recommended)

**No special headers needed!** Async methods don't use SharedArrayBuffer, and `SQLiteProvider` already handles React Strict Mode.

```tsx
// ✅ Works without headers
import {SQLiteProvider, useSQLiteContext} from 'expo-sqlite';

<SQLiteProvider databaseName="test.db">
  <YourComponent />
</SQLiteProvider>

function YourComponent() {
  const db = useSQLiteContext();
  const result = await db.getFirstAsync('SELECT * FROM users');
}
```

That's it! No custom providers or workarounds needed.

### Solution 2: Add COEP/COOP Headers (For Sync API)

If you must use sync API, add these headers to your HTML document:

```
Cross-Origin-Embedder-Policy: credentialless
Cross-Origin-Opener-Policy: same-origin
```

**Development:** Use the proxy server (applies headers to all responses including HTML):
```bash
# Terminal 1
yarn web

# Terminal 2
node proxy-server.js
# Visit http://localhost:8082
```

**Production:** Configure your web server (nginx/apache/cloudflare) to add headers.

## Demo

```bash
yarn install
yarn web
```

Toggle between:
- **Async (Works)** - `SQLiteProvider` with async API
- **Sync (Breaks)** - `SQLiteProvider` with sync API (requires proxy with headers)

## Security Note

(need to double check this...)

COEP/COOP headers **increase security** by isolating your app from cross-origin content. They're required for SharedArrayBuffer to prevent timing attacks (Spectre). For E2E encrypted apps, these restrictions are actually beneficial.

## Recommendation

**Use async API for web.** Reserve sync operations for native mobile apps where there are no browser security restrictions.
