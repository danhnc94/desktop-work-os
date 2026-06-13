# Desktop Work OS

A static single-page web app for task management and activity logging.

The app runs entirely in the browser. It has no Electron shell, no backend, no SQLite database, and no local Node runtime requirement for end users. Data is stored in each browser with `localStorage`.

## Features

- Task list with add, edit, complete, and delete
- Activity log for task events
- Manual file-entry logging
- Clean single-page UI
- Static hosting support for Vercel

## Project Structure

```text
desktop-work-os/
  package.json
  vercel.json
  README.md
  scripts/
    build.mjs
    dev-server.mjs
  src/
    web/
      index.html
      styles.css
      app.js
```

## Run Locally

No local app runtime is required. You can open this file directly in a browser:

```text
src/web/index.html
```

Optional local preview with npm:

```bash
npm install
npm run dev
```

Build the production static site:

```bash
npm run build
```

The production site is generated in `dist/`.

## DEPLOY TO VERCEL

1. Push this project to a Git repository.
2. Open Vercel and create a new project from that repository.
3. Use these settings:
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Deploy.

After deployment, open the Vercel URL from any device to use the app.

## Data Note

This app has no backend. Tasks and activity logs are saved in the browser on the device being used. Different devices will have their own local data unless a backend is added later.
