# How to Publish to GitHub Packages

This document explains how to publish the SDK to GitHub Packages (replacement
for NPM). Since publishing requires GitHub Actions workflow files and the
current PAT lacks `workflow` scope, **you must create the workflow manually**.

## Step 1 — Create the workflow file (manual, ~30 seconds)

Go to: **https://github.com/rickygaude-rgb/gaud-e-sdk/new/main**

- **File name:** `.github/workflows/publish.yml`
- **Content:**

```yaml
name: Publish to GitHub Packages
on:
  release:
    types: [published]
  workflow_dispatch:
permissions:
  contents: read
  packages: write
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@rickygaude-rgb'
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Click **Commit changes**.

## Step 2 — Trigger first publish

### Option A — Create a Release (recommended)
1. Go to https://github.com/rickygaude-rgb/gaud-e-sdk/releases/new
2. **Choose a tag:** `v2.2.0` (create new tag)
3. **Release title:** `GAUD-E SDK v2.2.0 — Commercial License`
4. Click **Publish release**
5. Workflow runs automatically → package goes to GitHub Packages

### Option B — Manual trigger
1. Go to https://github.com/rickygaude-rgb/gaud-e-sdk/actions
2. Click **Publish to GitHub Packages** workflow
3. Click **Run workflow** → select `main` → **Run**

## Step 3 — Verify package published

Visit: **https://github.com/rickygaude-rgb/gaud-e-sdk/pkgs/npm/gaud-e-sdk**

Should show `@rickygaude-rgb/gaud-e-sdk` v2.2.0 listed.

## How buyers install (after paying for license)

```bash
# 1. Buyer generates their own PAT with scope `read:packages`
echo "//npm.pkg.github.com/:_authToken=PAT" >> ~/.npmrc
echo "@rickygaude-rgb:registry=https://npm.pkg.github.com" >> ~/.npmrc

# 2. Install
npm install @rickygaude-rgb/gaud-e-sdk
```

You control access by:
- Keeping the GitHub repo **private** (only collaborators can install)
- Or making it public but enforcing the commercial license legally

## Alternative registries (if you don't want GitHub Packages)

- **JSR (Deno):** https://jsr.io — supports TS/ESM natively
- **Cloudflare Workers + paid API gating:** custom paywall before download
- **Vercel + signed URL distribution:** host tarballs behind auth

But GitHub Packages is the most direct since the code is already on GitHub.
