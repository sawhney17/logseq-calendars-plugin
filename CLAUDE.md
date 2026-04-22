# CLAUDE.md — logseq-ical-sync

This file documents the history, bug fixes, and publishing work done on this fork of the Logseq Calendars Plugin.

## What This Repo Is

This is a community-maintained fork of [sawhney17/logseq-calendars-plugin](https://github.com/sawhney17/logseq-calendars-plugin), published to the Logseq marketplace as **logseq-ical-sync** (plugin ID: `logseq-ical-sync`).

The original plugin was forked because the upstream maintainer was unresponsive and several important bugs could not be merged. The fork is released under the same ISC license as the original.

- **Fork repo:** https://github.com/CR0CKER/logseq-calendars-plugin
- **Marketplace PR:** https://github.com/logseq/marketplace/pull/772
- **Current release:** v3.0.0

All bug fixes in this fork were developed with the assistance of [Claude Code](https://claude.ai/code).

---

## Bug Fixes Applied (vs. upstream)

All fixes are in `index.ts`. They were developed across several feature branches and merged to `main`.

### 1. Recurring events cut off after 2023
**Branch:** original fix commit  
**Problem:** The original code had a hardcoded date range (2021–2023) for generating recurring event occurrences.  
**Fix:** Replaced with a dynamic range: 1 year ago → 2 years in the future.  
**Location in code:** `rawParser` function, rrule `between()` call.

### 2. Recurring event times in wrong timezone
**Branch:** `fix-timezone-event-sorting` (merged)  
**Problem:** Timezone conversion for recurring events was incorrect across DST boundaries — events appeared at the wrong time.  
**Fix:** When `tzid` is present in rrule options, `moment-timezone` is used to create dates in the event's own timezone before converting to local time. When `tzid` is absent, hours/minutes are copied from the original start time.  
**Location in code:** `rawParser`, lines ~196–221.

### 3. Rescheduled recurring events appearing on original dates
**Branch:** `fix-rescheduled-events` (merged)  
**Problem:** When a single occurrence of a recurring event was rescheduled, the original occurrence still appeared on its original date.  
**Fix:** Recurring event exceptions (rescheduled occurrences) are detected and used to override the generated occurrence for that date.

### 4. Event sorting ignored timezone
**Branch:** `fix-timezone-event-sorting` (merged)  
**Problem:** Events were sorted by raw timestamp, not by their display time in the local timezone, causing wrong ordering.  
**Fix:** Sort key is now the timezone-aware display time.  
**Location in code:** `sortDate` function.

### 5. Deleted calendar events still appearing
**Branch:** `feature/filter-declined-events` (merged)  
**Problem:** Events with a CANCELLED status were still shown.  
**Fix:** Events with `status === 'CANCELLED'` are filtered out during parsing.

### 6. Declined events appearing (optional filter)
**Branch:** `feature/filter-declined-events` (merged)  
**Problem:** Events the user had declined still appeared in the daily note.  
**Fix:** New optional setting `filterDeclined` — when enabled, events where the user's RSVP is DECLINED are hidden.

---

## Build & CI

### Local build
```bash
npm install
npm run build
# Output: dist/index.html
```

### CI (GitHub Actions)
**File:** `.github/workflows/publish.yml`  
**Trigger:** Any pushed git tag (e.g. `v3.0.0`)  
**What it does:** Installs deps, builds with Parcel, zips the output, creates a GitHub release with the zip attached.

**Key CI fix:** Parcel was pinned at 2.2.1 which bundled lmdb 2.1.6 — a native module with no prebuilt binaries for Node 20 that also couldn't compile on Node 20 due to `nan` incompatibility. Fixed by upgrading parcel to `^2.12.0` in `package.json`. Do not downgrade parcel below 2.9.

### Cutting a new release
```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```
The workflow runs automatically and attaches the zip to the GitHub release. Verify at https://github.com/CR0CKER/logseq-calendars-plugin/releases before any marketplace updates.

---

## Marketplace Submission

The plugin is listed in the [logseq/marketplace](https://github.com/logseq/marketplace) under `packages/logseq-ical-sync/`.

### Manifest location (in the marketplace repo)
`packages/logseq-ical-sync/manifest.json`

```json
{
  "title": "Logseq iCal Sync",
  "description": "Import events from Google Calendar, iCloud, Outlook, and any iCal-compatible source into your daily notes. Community-maintained fork of the Calendar Plugin with fixes for recurring event timezones, deleted/declined event filtering, and rescheduled event handling.",
  "author": "CR0CKER",
  "repo": "CR0CKER/logseq-calendars-plugin",
  "icon": "./icon.png",
  "effect": true,
  "supportsDB": false
}
```

`"effect": true` is required because the plugin fetches external calendar URLs.

### To update the marketplace listing
The marketplace entry does not auto-update when you push a new release — it just points to the repo. The marketplace installer always fetches the latest release zip from GitHub. So for most updates, just tag a new release; no marketplace PR needed.

Only open a new marketplace PR if you need to change the manifest itself (description, title, icon, flags).

---

## Plugin Identity

| Field | Value |
|-------|-------|
| Plugin ID (`logseq.id`) | `logseq-ical-sync` |
| npm name | `logseq-ical-sync` |
| Display title | Logseq iCal Sync |
| Author | CR0CKER |
| Version | 3.0.0 |
| License | ISC (same as original) |
| Upstream original | sawhney17/logseq-calendars-plugin |

---

## Original Authors & Contributors

Full credit to everyone who contributed to the original plugin:

| Contributor | Contribution |
|-------------|--------------|
| [Aryan Sawhney](https://github.com/sawhney17) | Original author, core plugin |
| [Grace Dinh](https://github.com/gdinh) | Clickable URL rendering in location fields |
| [Petra Jaros](https://github.com/Peeja) | Calendar 5 settings title fix |
| [Zhenbo Li](https://github.com/Endle) | Documentation fix |
| [Gaga Pan](https://github.com/gaga5lala) | README corrections |
