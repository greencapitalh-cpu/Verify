# UDoChain Verify Map

This repository appears to serve the frontend for `verify.udochain.com`.

## Current Role

The active frontend files live under `public/` and are served by `server.js` as static files.

Important public files:

- `public/index.html`
- `public/verify.js`
- `public/verify-public.html`
- `public/verify-public.js`
- `public/verify-private.html`
- `public/verify-private.js`
- `public/styles.css`
- `public/logo-udochain.png`
- `public/icon-camera.svg`
- `public/icon-gallery.svg`

## Backend Source Of Truth

The frontend scripts in this repository call the main API at:

- `https://api.udochain.com/validate/api/verify`

That API lives in the `apiudo` repository under:

- `modules/validate/routes/verifyRoutes.js`
- `modules/validate/controllers/verifyController.js`

So the backend source of truth for verification appears to be `apiudo/modules/validate`, not this repository.

## Local Backend In This Repository

This repository also has a small Express backend:

- `server.js`
- `routes/verifyRoutes.js`
- `controllers/verifyController.js`
- `models/VerifyEvidence.js`
- `models/Validation.js`

That backend proxies or complements Validate, but based on current frontend code it does not look like the main source of truth for verification data.

## Public Pages

Likely active:

- `/` serves or redirects toward the public Verify UI.
- `/records` serves `public/records.html`, but `public/records.js` is currently empty, so this page may be incomplete.
- `verify-public.html` reads validation details from the Validate Verify API.
- `verify-private.html` reads private validation details and download state from the Validate Verify API.

## Probable Legacy Or Backup Files

These naming patterns look like historical copies or backups:

- `*.html999`
- `*.js999`
- `*.css999`
- `view.html9034809`
- `view.jsggffd`
- files under `vacio/`

Do not delete these yet without comparing them to active files. Some may contain previous working versions.

## Cleanup Plan

1. Keep `public/index.html`, `verify.js`, `verify-public.*`, `verify-private.*`, `styles.css`, and image assets untouched until behavior is verified.
2. Confirm which routes are served by the deployed `verify.udochain.com` service.
3. Compare backup-suffixed files against active public files.
4. Merge useful differences into active files.
5. Archive or remove unused files in a dedicated cleanup branch after deploy verification.
