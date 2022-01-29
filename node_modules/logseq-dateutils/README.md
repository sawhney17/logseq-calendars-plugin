# Overview

Provides some date utilities for developing Logseq plugins, in particular to cater to handling multiple user-defined date formats.

# Installation

With npm:

```
npm i logseq-dateutils
```

Import (you may also import only selective functions for your needs):

```
import { getDateForPage, getDayInText, getScheduledDeadlineDateDay, getScheduledDeadlineDateDayTime } from 'logseq-dateutils';
```

# Usage

Below is an elaboration of the functions available:

## getDateForPage

Returns the specified date based on the user's preferred date format. Accepts 2 arguments.

```
import { getDateForPage, getDayInText, getScheduledDeadlineDate } from 'logseq-dateutils';

const preferredDateFormat = 'yyyy/MM/dd';
const today = new Date();

const todayDateInUserFormat = getDateForPage(today, preferredDateFormat);
console.log(todayDateInUserFormat);
```

## getDayInText

Returns the day, based on the specified date.

```
const today = new Date();

const todayDay = getDayInText(today);
```

## getScheduledDeadlineDateDay

Returns the date format that is needed (without the time) if your plugin requires creation of `SCHEDULED` or `DEADLINE` items.

```
const today = new Date();

await logseq.Editor.updateBlock(uuid, `A quick brown fox
SCHEDULED: <getScheduledDeadlineFormat(today)>`)
```

## getScheduledDeadlineDateDayTime

Returns the date format that is needed (including the time) if your plugin requires creation of `SCHEDULED` or `DEADLINE` items.

```
const today = new Date();

await logseq.Editor.updateBlock(uuid, `A quick brown fox
DEADLINE: <getScheduledDeadlineDateDayTime(today)>`)
```

# Getting Help

Do join [Logseq's Discord](https://discord.gg/KpN4eHY) and look for me there!
