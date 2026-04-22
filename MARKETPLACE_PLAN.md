# Plan: Publish Forked Logseq Calendars Plugin to Marketplace

## Context

The Logseq Calendars Plugin (originally by Aryan Sawhney, https://github.com/sawhney17/logseq-calendars-plugin) is unmaintained — PRs are not being reviewed or merged. A working fork has been created at https://github.com/CR0CKER/logseq-calendars-plugin with 10+ bug fixes applied. The goal is to publish this fork to the official Logseq marketplace so users can install it without running Logseq in developer mode.

## What Has Already Been Done

The fork (CR0CKER/logseq-calendars-plugin) contains these fixes:
- Fix recurring events not appearing after 2023 (hardcoded date range bug)
- Fix timezone handling for recurring events
- Fix rescheduled recurring events appearing on original dates
- Fix event sorting by timezone-aware display time
- Fix filtering for deleted calendar events
- Add optional filtering for declined calendar events
- Fix recurring event times displaying in wrong timezone
- URL parsing fixes
- CORS handling fixes

The `publish.yml` GitHub Actions workflow already exists but has bugs (see Step 2 below).

**Important:** 5 of the above fixes are on `feature/filter-declined-events` and have NOT yet been merged to `main`. Step 1 below addresses this first.

---

## What Needs To Be Done

### Step 1: Merge feature branch into main (FIRST)
All fixes must land on `main` before tagging a release.

```bash
git checkout main
git merge feature/filter-declined-events
git push origin main
```

### Step 2: Fix publish.yml (Critical — current workflow will fail)
**File:** `.github/workflows/publish.yml`

The current workflow has three bugs that will cause GitHub Actions builds to fail:

1. **Missing `npm install`** — the build step runs `npm run build` with no `npm ci` first, so it will fail on a clean Ubuntu runner
2. **Deprecated action versions** — `actions/checkout@v2`, `actions/setup-node@v1`, `actions/upload-release-asset@v1` are all outdated and may stop working
3. **Deprecated `set-output` syntax** — `echo "::set-output name=..."` is deprecated; must use `$GITHUB_OUTPUT`

Additionally:
- Update Node.js from `16.x` to `20.x` (16 is EOL)
- Update `PLUGIN_NAME` env var to `logseq-ical-sync`

Corrected workflow:
```yaml
name: Build plugin

on:
  push:
    tags:
      - '*'

env:
  PLUGIN_NAME: logseq-ical-sync

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - name: Install dependencies
        run: npm ci
      - name: Build
        id: build
        run: |
          npm run build
          mkdir ${{ env.PLUGIN_NAME }}
          cp README.md package.json icon.png ${{ env.PLUGIN_NAME }}
          mv dist ${{ env.PLUGIN_NAME }}
          zip -r ${{ env.PLUGIN_NAME }}.zip ${{ env.PLUGIN_NAME }}
          echo "tag_name=$(git tag --sort version:refname | tail -n 1)" >> $GITHUB_OUTPUT
      - name: Create Release
        uses: ncipollo/release-action@v1
        id: create_release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          allowUpdates: true
          draft: false
          prerelease: false
      - name: Upload zip file
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./${{ env.PLUGIN_NAME }}.zip
          asset_name: ${{ env.PLUGIN_NAME }}-${{ steps.build.outputs.tag_name }}.zip
          asset_content_type: application/zip
      - name: Upload package.json
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./package.json
          asset_name: package.json
          asset_content_type: application/json
```

### Step 3: Update package.json
**File:** `package.json`

- `"name"`: `"logseq-ical-sync"`
- `"author"`: `"CR0CKER"`
- `"version"`: `"3.0.0"` (major bump — signals this is a new fork)
- `"logseq.id"`: `"logseq-ical-sync"`
- `"logseq.title"`: `"Logseq iCal Sync"`

### Step 4: Update README.md — REQUIRES USER REVIEW BEFORE PUBLISHING
**File:** `README.md`

The README must be reviewed and approved by the user before the marketplace PR is opened. Draft below.

---

#### DRAFT README (for user review)

```markdown
# Logseq iCal Sync

> **This is a community-maintained fork** of the original
> [logseq-calendars-plugin](https://github.com/sawhney17/logseq-calendars-plugin)
> by [Aryan Sawhney](https://github.com/sawhney17). The original plugin is a
> wonderful piece of work and this fork would not exist without it. We forked
> because the original repository appears to be unmaintained and several
> important bug fixes could not be merged upstream.
>
> This fork is released under the same
> [ISC License](./LICENSE.md) as the original.

A plugin that imports calendar events from Google Calendar, iCloud, Outlook,
and any iCal-compatible source into your Logseq daily notes.

## What's Fixed in This Fork

The following bugs were identified and fixed after the original repository
became inactive. All fixes were developed with the assistance of
[Claude Code](https://claude.ai/code) by Anthropic.

- **Recurring events cut off after 2023** — the original had a hardcoded date
  range; events now generate dynamically from 1 year ago to 2 years ahead
- **Recurring event times in wrong timezone** — timezone conversion for
  recurring events was incorrect across DST boundaries
- **Rescheduled recurring events on wrong date** — exceptions to recurring
  series now override the original occurrence correctly
- **Event sorting ignored timezone** — events now sort by their display time
  in the correct local timezone
- **Deleted calendar events still appearing** — cancelled/deleted events are
  now filtered out
- **Declined events appearing** — optional setting added to hide events you
  have declined

## Usage

- Three ways to import events:
  1. Command palette (`mod+shift+p`) → select a specific calendar
  2. Keyboard shortcut defined in settings
  3. Toolbar icon → imports **all** calendars to the current daily note
- To import events for a past day: navigate to that journal page first

## Setup

1. Get the `.ics` link from your calendar provider (see below)
2. In Logseq, go to Plugins → Logseq iCal Sync → Settings
3. Enter your calendar name and URL for each calendar slot
4. Configure your template and time format

## Getting the ICS URL

### Google Calendar
1. Go to calendar Settings → your calendar → "Secret address in iCal format"

### iCloud
1. Right-click the calendar → Share → enable Public Calendar
2. Copy the `webcal://` link and replace `webcal://` with `https://`

### Outlook
1. Calendar → three dots → Share → share with yourself
2. Open the email received → copy the ICS link at the bottom

## Template Placeholders

| Placeholder | Description |
|-------------|-------------|
| `{Title}` | Event title |
| `{Start}` | Start time |
| `{End}` | End time |
| `{Date}` | Event date |
| `{Description}` | Event description |
| `{Location}` | Location (URLs shortened to clickable links) |
| `{RawLocation}` | Location (original text preserved) |

## Credits & Acknowledgements

This fork stands on the shoulders of everyone who contributed to the original
plugin. Full credit to:

- **[Aryan Sawhney](https://github.com/sawhney17)** — original author and
  creator of the plugin
- **[Grace Dinh](https://github.com/gdinh)** — clickable URL rendering in
  location fields
- **[Petra Jaros](https://github.com/Peeja)** — Calendar 5 settings title fix
- **[Zhenbo Li](https://github.com/Endle)** — documentation fix
- **[Gaga Pan](https://github.com/gaga5lala)** — README corrections

Bug fixes in this fork were developed by
[CR0CKER](https://github.com/CR0CKER) with the assistance of
[Claude Code](https://claude.ai/code).

## License

[ISC License](./LICENSE.md) — same as the original plugin.
```

---

### Step 5: Commit changes to main and push
```bash
git add package.json .github/workflows/publish.yml README.md
git commit -m "Rename to logseq-ical-sync, fix publish workflow, update credits"
git push origin main
```

### Step 6: Create a GitHub Release
```bash
git tag v3.0.0
git push origin v3.0.0
```

**Verify before Step 7:** Confirm the GitHub Actions build passes and a zip is attached to the release. If the build fails, fix it before submitting to the marketplace.

### Step 7: Submit to the Logseq Marketplace — REQUIRES USER REVIEW
Open a PR against https://github.com/logseq/marketplace with the following new file.

**File:** `packages/logseq-ical-sync/manifest.json`

#### DRAFT marketplace description (for user review):

```json
{
  "title": "Logseq iCal Sync",
  "description": "Import events from Google Calendar, iCloud, Outlook, and any iCal source into your daily notes. Community-maintained fork of logseq-calendars-plugin with fixes for recurring event timezones, deleted/declined event filtering, and rescheduled event handling.",
  "author": "CR0CKER",
  "repo": "CR0CKER/logseq-calendars-plugin",
  "icon": "icon.png"
}
```

Also copy `icon.png` to `packages/logseq-ical-sync/icon.png` in the marketplace fork.

### Step 8: Optional cleanup
Delete merged local branches `fix-rescheduled-events` and `fix-timezone-event-sorting` after verifying they are already in `main`.

---

## Files to Modify

| File | Change |
|------|--------|
| `package.json` | Update id, author, version, title |
| `.github/workflows/publish.yml` | Fix missing npm ci, update action versions, fix set-output, Node 20.x |
| `README.md` | Full rewrite with fork notice, credits, license, fix list |

## Marketplace manifest (new file, in marketplace repo fork)
`packages/logseq-ical-sync/manifest.json`

---

## Verification

1. After merging to main: `git log main` shows all fixes
2. After pushing tag `v3.0.0`: GitHub Actions passes, zip attached to release
3. Manually test: load the release zip in Logseq developer mode
4. After marketplace PR is merged: search "iCal" in the Logseq marketplace

## Plugin Name/ID: **logseq-ical-sync** (chosen)

Fresh name, no reference to being a fork. Package ID, title, and marketplace manifest all use `logseq-ical-sync` / `"Logseq iCal Sync"`.

The GitHub repository URL remains `CR0CKER/logseq-calendars-plugin` — renaming the repo is optional but not required for marketplace submission.
