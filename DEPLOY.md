Netlify & Vercel deployment notes
===============================

This repo has both Vercel and Netlify deployment configs.

Quick checklist to fix failing CI/deploy checks

1. Vercel builds may fail if the Node version is incompatible with `react-scripts`.
   - We pinned Node in `package.json` using `"engines": { "node": "18.x" }`.
   - In the Vercel Project Settings, confirm the Node version is set to 18.x or leave it to detect `package.json`.

2. Netlify GitHub Action requires two repository secrets (set these in GitHub → Settings → Secrets and variables → Actions):
   - `NETLIFY_AUTH_TOKEN` — a Netlify personal access token (Team Settings → Applications → Personal access tokens)
   - `NETLIFY_SITE_ID` — the Site ID from the Netlify site dashboard (Site settings → Site information → Site ID)

3. If you prefer local/manual deploys, use the Netlify CLI via `npx` to avoid installing globally:
   ```powershell
   npm ci
   npm run build
   npx netlify-cli deploy --dir=build --prod --site YOUR_SITE_ID
   ```

4. If local `npm ci` fails on Windows with file locks (EBUSY):
   - Close editors/terminals that might be locking files.
   - Delete `node_modules` and retry: `rm -r node_modules` (PowerShell: `Remove-Item -Recurse -Force node_modules`).
   - Try running the install again: `npm ci`.

5. If the GitHub Action fails, open the Actions tab in GitHub, inspect the logs for the failing step, and ensure the secrets are present.

If you want, I can:
- Add the secrets for you (you must provide them or set them in GitHub UI).
- Set the Vercel project Node version in the Vercel dashboard (I can guide you step-by-step).
