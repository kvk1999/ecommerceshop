# TODO

- [ ] Create mobile app wrapper using Capacitor (Android + desktop build running in WebView)
  - [ ] Update `client/package.json` with Capacitor deps and scripts
  - [ ] Update `client/src/main.jsx` to use `HashRouter` instead of `BrowserRouter` (mobile WebView routing)
  - [ ] (If needed) Update `client/src/api/http.js` to use configurable API baseURL (no hardcoded localhost)
  - [ ] Add Capacitor config: `npx cap init`
  - [ ] Add Android platform: `npx cap add android`
  - [ ] Add `build:mobile` script: `vite build` + `npx cap sync`
  - [ ] Run `npm run build:mobile` and test via `npx cap open android`

