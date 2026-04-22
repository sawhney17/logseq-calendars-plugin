# Logseq iCal Sync

> **This is a community-maintained fork** of the original
> [logseq-calendars-plugin](https://github.com/sawhney17/logseq-calendars-plugin)
> by [Aryan Sawhney](https://github.com/sawhney17). The original plugin is a
> wonderful piece of work and this fork would not exist without it. We forked
> because the original repository appears to be unmaintained and several
> important bug fixes could not be merged upstream.
>
> This fork is released under the same [ISC License](./LICENSE.md) as the original.

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
