# Panther Passage iPad shell

Thin Expo SDK 53 wrapper for recording. It does not reimplement the product. It loads the Panther Passage web app in a full-screen WebView.

Recording device: iPad Pro 13-inch (M4) Simulator. Orientation is `default`, so portrait and landscape both work.

## URL it loads

`app.json` → `expo.extra.webUrl` sets the URL. It is currently `http://localhost:4174`, a local production server on this Mac, so the latest fixes show immediately without waiting on a redeploy. The deployed fallback is `https://panther-passage.onrender.com` (used only if `extra.webUrl` is removed).

## Run it

1. From the repo root, serve the production build and keep it running:
   ```bash
   npm run build
   npm run preview -- --port 4174 --host
   ```
2. In another terminal, start the shell:
   ```bash
   cd ipad-shell
   npx expo start --ios
   ```

The preview server must stay running while recording. If the shell shows the "Couldn’t reach Panther Passage" screen, the server stopped — restart step 1.

## Public URL note

Render auto-deploy does not fire on push, because the repo was added by public URL without the GitHub App connection. To refresh `https://panther-passage.onrender.com`, either connect GitHub to the Render service or use Manual Deploy → Deploy latest commit in the Render dashboard.
