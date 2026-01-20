import "@logseq/libs";
import { BlockEntity, PageEntity, SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import ical from "node-ical";
import axios from "axios";
import {
  getDateForPage,
  getDateForPageWithoutBrackets,
} from "logseq-dateutils";
import moment from "moment-timezone";
import urlRegexSafe from 'url-regex-safe';

let mainBlockUUID = ""
// const md = require('markdown-it')().use(require('markdown-it-mark'));

const settingsTemplate: SettingSchemaDesc[] = [
  {
    key: "template",
    type: "string",
    default: "{Start} - {End}: {Title}",
    title: "Customizing the Event's Insertion",
    description:
      "The first block that is inserted right under the calendar name for each event. You can use placeholder variables to customize the block. The following variables are available: {Description}, {Date}, {Start}, {End}, {Title}, {Location}, {RawLocation}",
  },
  {
    key: "useJSON",
    type: "boolean",
    default: false,
    title: "Use JSON to store calendar data",
    description:
      "If you require more than 5 calendars, select this option so that you can manually define calendars via json",
  },
  {
    key: "IndentCommonBlock",
    type: "boolean",
    default: false,
    title: "Indent all events under the same block",
    description: "If you want to indent all events under the same block, irrespective of the calendar they belong to",
  },
  {
    key: "templateLine2",
    type: "string",
    default: "{Description}",
    title: "Optional: A second block under the event",
    description:
      "Optionally insert a second block indented under the event. Leave blank if you don't want to insert a second blockYou can use placeholder variables to customize the block. The following variables are available: {Description}, {Date}, {Start}, {End}, {Title}, {Location}, {RawLocation}.",
  },
  {
    key: "timeFormat",
    type: "enum",
    default: ["12 hour time", "24 hour time"],
    title: "Select between 12 and 24 hour time",
    description:
      "Select between 12 and 24 hour time. This option will be followed whenever you call {end} or {start} in the template.",
    enumChoices: ["12 hour time", "24 hour time"],
    enumPicker: "select",
  },
  {
    key: "userEmail",
    type: "string",
    default: "",
    title: "Your Email Address (Optional)",
    description:
      "Enter your email address to filter out events you've declined. Leave blank to show all events. Example: user@example.com",
  },
  {
    key: "hideDeclinedEvents",
    type: "boolean",
    default: true,
    title: "Hide Events You've Declined",
    description:
      "When your email is configured above, automatically hide events where you've declined the invitation.",
  },
  {
    key: "calendar1Name",
    type: "string",
    default: "Calendar 1",
    title: "What would you like to name the calendar?",
    description:
      "Choose a name for the calendar. This will be the name of the calendar block that is inserted.",
  },
  {
    key: "calendar1URL",
    type: "string",
    default: "https://calendar.google.com/calendar/ical/...",
    title: "Enter the iCal URL for calendar 1",
    description:
      "Refer to the readme if you're unsure how to get this link for your platform. This is the link to the calendar's ical file. To test if the link is working, open the link in an incognito browser tab and see if it downloads a file with the extension ics",
  },
  {
    key: "calendar2Name",
    type: "string",
    default: "",
    title: "Optional: What would you like to name the calendar?",
    description:
      "Optional: Leave blank if you don't want this calendar to be inserted",
  },
  {
    key: "calendar2URL",
    type: "string",
    default: "",
    title: "Optional: enter the iCAL URL for calendar 2",
    description:
      "Optional: Leave blank if you don't want this calendar to be inserted",
  },
  {
    key: "calendar3Name",
    type: "string",
    default: "",
    title: "Optional: What would you like to name the calendar?",
    description:
      "Optional: Leave blank if you don't want this calendar to be inserted",
  },
  {
    key: "calendar3URL",
    type: "string",
    default: "",
    title: "Optional: enter the iCAL URL for calendar 3",
    description:
      "Optional: Leave blank if you don't want this calendar to be inserted",
  },
  {
    key: "calendar4Name",
    type: "string",
    default: "",
    title: "Optional: What would you like to name the calendar?",
    description:
      "Optional: Leave blank if you don't want this calendar to be inserted",
  },
  {
    key: "calendar4URL",
    type: "string",
    default: "",
    title: "Optional: enter the iCAL URL for calendar 4",
    description:
      "Optional: Leave blank if you don't want this calendar to be inserted",
  },
  {
    key: "calendar5Name",
    type: "string",
    default: "",
    title: "Optional: What would you like to name the calendar?",
    description:
      "Optional: Leave blank if you don't want this calendar to be inserted",
  },
  {
    key: "calendar5URL",
    type: "string",
    default: "",
    title: "Optional: enter the iCAL URL for calendar 5",
    description:
      "Optional: Leave blank if you don't want this calendar to be inserted",
  },
];
logseq.useSettingsSchema(settingsTemplate);

function sortDate(data) {
  // Filter out events with invalid dates
  const validEvents = data.filter(event => {
    if (!event.start) {
      return false;
    }
    const startDate = new Date(event.start);
    if (isNaN(startDate.getTime())) {
      return false;
    }
    return true;
  });

  const sorted = validEvents.sort(function (a, b) {
    // Sort by the displayed date/time in each event's timezone
    // This ensures events sort by what the user sees (14:30) not absolute time
    let aMoment, bMoment;

    if (a.timezone) {
      aMoment = moment(a.start).tz(a.timezone);
    } else {
      aMoment = moment(a.start);
    }

    if (b.timezone) {
      bMoment = moment(b.start).tz(b.timezone);
    } else {
      bMoment = moment(b.start);
    }

    // Compare by date/time components (year, month, day, hour, minute)
    // This gives us the "displayed" sort order
    const aSort = aMoment.year() * 100000000 +
                  (aMoment.month() + 1) * 1000000 +
                  aMoment.date() * 10000 +
                  aMoment.hour() * 100 +
                  aMoment.minute();
    const bSort = bMoment.year() * 100000000 +
                  (bMoment.month() + 1) * 1000000 +
                  bMoment.date() * 10000 +
                  bMoment.hour() * 100 +
                  bMoment.minute();

    return aSort - bSort;
  });

  return sorted;
}

function shouldFilterDeclinedEvent(event, userEmail) {
  // Only filter if email is configured and feature is enabled
  if (!userEmail || userEmail.trim() === "" || logseq.settings?.hideDeclinedEvents === false) {
    return false;
  }

  // If event has no attendees, don't filter
  if (!event.attendee) {
    return false;
  }

  // Normalize attendee to array
  const attendees = Array.isArray(event.attendee) ? event.attendee : [event.attendee];
  const normalizedUserEmail = userEmail.trim().toLowerCase();

  // Find user in attendee list
  const userAttendee = attendees.find(attendee => {
    if (!attendee.val) return false;
    const attendeeEmail = attendee.val.replace('mailto:', '').toLowerCase();
    return attendeeEmail === normalizedUserEmail;
  });

  // Filter if user declined
  if (userAttendee && userAttendee.params?.PARTSTAT === 'DECLINED') {
    console.log(`Filtering declined event: ${event.summary}`);
    return true;
  }

  return false;
}

function isCancelledEvent(event) {
  // Check if event status is CANCELLED
  // The status property may be a string or an object with val property
  if (!event.status) {
    return false;
  }

  // Handle both string format and object format from node-ical
  const statusValue = typeof event.status === 'string'
    ? event.status
    : event.status.val || event.status;

  const normalizedStatus = statusValue.toString().toUpperCase().trim();

  if (normalizedStatus === 'CANCELLED') {
    console.log(`Filtering cancelled event: ${event.summary}`);
    return true;
  }

  return false;
}

async function findDate(preferredDateFormat) {
  if ((await logseq.Editor.getCurrentPage()) != null) {
    //@ts-expect-error
    if ((await logseq.Editor.getCurrentPage())["journal?"] == false) {
      const date = getDateForPageWithoutBrackets(
        new Date(),
        preferredDateFormat
      );
      logseq.App.showMsg("Filtering Calendar Items for " + date);
      // insertJournalBlocks(hello, preferredDateFormat, calendarName, settings, date)
      return date;
    } else {
      //@ts-expect-error
      const date = (await logseq.Editor.getCurrentPage()).name;
      logseq.App.showMsg(`Filtering Calendar Items for ${date}`);
      return date;
    }
  } else {
    return getDateForPageWithoutBrackets(new Date(), preferredDateFormat);
  }
}
function rawParser(rawData) {
  logseq.App.showMsg("Parsing Calendar Items");
  var eventsArray = [];
  var rawDataV2 = ical.parseICS(rawData);
  for (const dataValue in rawDataV2) {
    const event = rawDataV2[dataValue];
    if (typeof event.rrule == "undefined") {
      //@ts-expect-error
      if (!shouldFilterDeclinedEvent(event, logseq.settings?.userEmail) &&
          !isCancelledEvent(event)) {
        eventsArray.push(rawDataV2[dataValue]); //simplifying results, credits to https://github.com/muness/obsidian-ics for this implementations
      }
    } else {
      // Generate recurring events from 1 year ago to 2 years in the future
      const today = new Date();
      const startDate = new Date(today.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
      const endDate = new Date(today.getFullYear() + 2, 11, 31, 23, 59, 59, 999);
      const dates = event.rrule.between(startDate, endDate);
      console.log(dates);
      if (!dates || !Array.isArray(dates) || dates.length === 0) continue;

      console.log("Summary:", event.summary);
      console.log("Original start:", event.start);
      console.log(
        "RRule start:",
        `${event.rrule.origOptions.dtstart} [${event.rrule.origOptions.tzid}]`
      );

      // Normalize exdate to an array for easier checking
      let exdateArray = [];
      if (event.exdate) {
        if (typeof event.exdate === 'object') {
          // exdate can be an array or object with date values
          // Use Object.values() to extract dates regardless of structure
          // This handles both [{date}, {date}] and {'2026-01-22': {date}} formats
          const values = Object.values(event.exdate);

          // Filter to get only valid date values (skip nested objects)
          exdateArray = values.filter(v => v instanceof Date || (v && typeof v === 'object' && (v.getTime || v._d)));

          console.log(`Excluding ${exdateArray.length} date(s) for ${event.summary}`);
        } else {
          // Single date
          exdateArray = [event.exdate];
        }
      }

      try {
        dates.forEach((date) => {
          // Check if this date is in the exception list (EXDATE)
          // Compare dates ignoring time components
          const isExcluded = exdateArray.some((exdate) => {
            const exd = new Date(exdate);
            return (
              exd.getFullYear() === date.getFullYear() &&
              exd.getMonth() === date.getMonth() &&
              exd.getDate() === date.getDate()
            );
          });

          // Skip this occurrence if it's been excluded (deleted)
          if (isExcluded) {
            console.log(`Skipping excluded date for ${event.summary}: ${date.toISOString().split('T')[0]}`);
            return;
          }

          // Check if this occurrence has been modified (rescheduled)
          // The recurrences property contains modified instances keyed by YYYY-MM-DD
          if (event.recurrences) {
            const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            if (event.recurrences[dateKey]) {
              console.log(`Skipping original occurrence for ${event.summary} on ${dateKey} (has been rescheduled)`);
              return;
            }
          }

          let newDate;
          let newEndDate;
          if (event.rrule.origOptions.tzid) {
            // tzid present - properly handle timezone conversion
            const originalStartTime = moment(event.rrule.origOptions.dtstart);
            const hours = originalStartTime.hours();
            const minutes = originalStartTime.minutes();
            const seconds = originalStartTime.seconds();

            // Create moment in the event's timezone with the recurrence date and original time
            // Use the date components from the recurrence date, time from original event
            newDate = moment.tz({
              year: date.getFullYear(),
              month: date.getMonth(),
              date: date.getDate(),
              hour: hours,
              minute: minutes,
              second: seconds
            }, event.rrule.origOptions.tzid).toDate();

            // Calculate end time based on original duration
            if (event.end) {
              const duration = moment(event.end).diff(moment(event.start));
              newEndDate = moment(newDate).add(duration, 'milliseconds').toDate();
            }
          } else {
            // tzid not present (calculate offset from original start)
            const hours = event.start.getHours();
            const minutes = event.start.getMinutes();
            const seconds = event.start.getSeconds();

            newDate = new Date(date);
            newDate.setHours(hours, minutes, seconds);

            // Calculate end time based on original duration
            if (event.end) {
              const duration = event.end.getTime() - event.start.getTime();
              newEndDate = new Date(newDate.getTime() + duration);
            }
          }
          const start = moment(newDate);
          const secondaryEvent = {
            ...event,
            start: start["_d"],
            end: newEndDate || event.end,
            // Preserve timezone info for proper time formatting later
            timezone: event.rrule.origOptions.tzid
          };

          if (!shouldFilterDeclinedEvent(secondaryEvent, logseq.settings?.userEmail) &&
              !isCancelledEvent(secondaryEvent)) {
            eventsArray.push(secondaryEvent);
          }
        });
      } catch (error) {
        console.error("Error processing recurring event:", event.summary, error);
        continue;
      }

      // Add rescheduled/modified instances from the recurrences property
      if (event.recurrences) {
        try {
          for (const recKey in event.recurrences) {
            const recEvent = event.recurrences[recKey];

            if (!shouldFilterDeclinedEvent(recEvent, logseq.settings?.userEmail) &&
                !isCancelledEvent(recEvent)) {
              // Each recurrence is a modified instance of the recurring event
              // Add it to the events array with its rescheduled date/time
              eventsArray.push({
                ...recEvent,
                // Preserve timezone info if available
                timezone: event.rrule.origOptions.tzid
              });
              console.log(`Added rescheduled instance of ${event.summary}: ${recKey} -> ${new Date(recEvent.start).toISOString().split('T')[0]}`);
            }
          }
        } catch (error) {
          console.error("Error processing recurrence modifications:", event.summary, error);
        }
      }

      console.log(
        "-----------------------------------------------------------------------------------------"
      );
    }
  }
  console.log(eventsArray);
  return sortDate(eventsArray);
}

function parseLocation(rawLocation){
  const matches = rawLocation.match(urlRegexSafe());
  var parsed = rawLocation;
  var linkDesc;

  // If no matches found, return the raw location
  if (!matches || matches.length === 0) {
    return parsed;
  }

  for (const match of matches) {
    try{
      var url = new URL(match);
      linkDesc = url.hostname + '/...';
    } catch (e){
      //this really shouldn't happen
      //but if the regex returns a url that URL doesn't like, just use the whole link
      linkDesc = match;
    }
    //console.log('match', match);
    parsed = parsed.replace(match, '[' + linkDesc + '](' + match + ')');
  }
  return parsed;
}

function templateFormatter(
  template,
  description = "No Description",
  date = "No Date",
  start = "No Start",
  end = "No End",
  title = "No Title",
  location = "No Location"
) {
  let properDescription;
  let properLocation;
  let parsedLocation;
  if (description == "") {
    properDescription = "No Description";
  } else {
    properDescription = description;
  }
  if (location == "") {
    properLocation = "No Location";
  } else {
    properLocation = location;
  }
  parsedLocation = parseLocation(properLocation);
  let subsitutions = {
    "{Description}": properDescription,
    "{Date}": date,
    "{Start}": start,
    "{End}": end,
    "{Title}": title,
    "{RawLocation}": properLocation,
    "{Location}": parsedLocation,
  };
  var templatex1 = template;

  for (const substitute in subsitutions) {
    let template2 = templatex1.replace(substitute, subsitutions[substitute]);
    let template3 = template2.replace(
      substitute.toLowerCase(),
      subsitutions[substitute]
    );
    templatex1 = template3;
  }
  return templatex1;
}

async function formatTime(rawTimeStamp, timezone = null) {
  let formattedTimeStamp;
  let initialHours;
  let minutes;

  // If timezone is provided, use moment-timezone to get the correct time in that timezone
  if (timezone) {
    const momentTime = moment(rawTimeStamp).tz(timezone);
    initialHours = momentTime.hours();
    minutes = momentTime.minutes();
  } else {
    // No timezone provided, use local time (original behavior)
    formattedTimeStamp = new Date(rawTimeStamp);
    initialHours = formattedTimeStamp.getHours();
    minutes = formattedTimeStamp.getMinutes();
  }

  let hours;
  if (initialHours == 0) {
    hours = "00";
  } else {
    hours = initialHours;
    if (initialHours < 10) {
      hours = "0" + initialHours;
    }
  }
  var formattedTime;
  if (minutes < 10) {
    formattedTime = hours + ":" + "0" + minutes;
  } else {
    formattedTime = hours + ":" + minutes;
  }
  if (
    typeof logseq.settings?.timeFormat == "undefined" ||
    logseq.settings?.timeFormat == "12 hour time"
  ) {
    return new Date("1970-01-01T" + formattedTime + "Z").toLocaleTimeString(
      "en-US",
      { timeZone: "UTC", hour12: true, hour: "numeric", minute: "numeric" }
    );
  } else {
    return formattedTime;
  }
}

async function insertJournalBlocks(
  data,
  preferredDateFormat: string,
  calendarName,
  emptyToday,
  useCommonBlock = false
) {
  // let emptyToday = (getDateForPageWithoutBrackets(new Date(), preferredDateFormat))
  console.log(`Current Date: ${emptyToday}`);
  let pageID = await logseq.Editor.createPage(emptyToday, {
    createFirstBlock: true,
  });
  // logseq.App.pushState('page', { name: pageID.name })
  // let pageBlocks = await logseq.Editor.getPageBlocksTree(pageID.name)
  // let footerBlock = pageBlocks[pageBlocks.length -1]
  let startBlock = (await logseq.Editor.insertBlock(pageID!.name, calendarName, {
    sibling: true,
    isPageBlock: true,
  })) as BlockEntity;

  // Collect all events for today first, then insert them in order
  const eventsToInsert = [];
  for (const dataKey in data) {
    try {
      let description = data[dataKey]["description"]; //Parsing result from rawParser into usable data for templateFormatter
      let formattedStart = new Date(data[dataKey]["start"]);
      let startDate = getDateForPageWithoutBrackets(
        formattedStart,
        preferredDateFormat
      );
      let timezone = data[dataKey]["timezone"] || null;
      let startTime = await formatTime(formattedStart, timezone);
      let endTime = await formatTime(data[dataKey]["end"], timezone);
      let location = data[dataKey]["location"];
      let summary;
      summary = data[dataKey]["summary"];
      // }
      // using user provided template
      let headerString = templateFormatter(
        logseq.settings?.template,
        description,
        startDate,
        startTime,
        endTime,
        summary,
        location
      );
      if (startDate.toLowerCase() == emptyToday.toLowerCase()) {
        eventsToInsert.push({
          summary,
          startTime,
          headerString,
          description,
          startDate,
          endTime,
          location
        });
      }
    } catch (error) {
      console.log(data[dataKey]);
      console.log("error");
      console.log(error);
    }
  }

  // Insert events in forward order (sibling:false appends as last child)
  for (let i = 0; i < eventsToInsert.length; i++) {
    const event = eventsToInsert[i];
    var currentBlock = await logseq.Editor.insertBlock(
      startBlock.uuid,
      `${event.headerString.replaceAll("\\n", "\n")}`,
      { sibling: false }
    );
    if (logseq.settings?.templateLine2 != "") {
      let SecondTemplateLine = templateFormatter(
        logseq.settings?.templateLine2,
        event.description,
        event.startDate,
        event.startTime,
        event.endTime,
        event.summary,
        event.location
      );
      await logseq.Editor.insertBlock(
        currentBlock!.uuid,
        `${SecondTemplateLine.replaceAll("\\n", "\n")}`,
        { sibling: false }
      );
    }
  }
  let updatedBlock = await logseq.Editor.getBlock(startBlock.uuid, {
    includeChildren: true,
  })
  if (updatedBlock?.children?.length == 0) {
    logseq.Editor.removeBlock(startBlock.uuid);
    logseq.App.showMsg("No events for the day detected");
  }
}
async function openCalendar2(calendarName, url) {
  try {
    const userConfigs = await logseq.App.getUserConfigs();
    const preferredDateFormat = userConfigs.preferredDateFormat;
    logseq.App.showMsg("Fetching Calendar Items");

    // Add cache-busting parameter to force fresh calendar data
    const cacheBuster = `?nocache=${new Date().getTime()}`;
    const urlWithCacheBuster = url.includes('?') ? `${url}&nocache=${new Date().getTime()}` : url + cacheBuster;

    let response2 = await axios.get(urlWithCacheBuster);
    console.log(response2);
    var hello = await rawParser(response2.data);
    const date = await findDate(preferredDateFormat);
    insertJournalBlocks(
      hello,
      preferredDateFormat,
      calendarName,
      date
    );
  } catch (err) {
    if (`${err}` == `Error: Request failed with status code 404`) {
      logseq.App.showMsg("Calendar not found: Check your URL");
    }
    console.log(err);
  }
}
async function main() {

  let accounts2 = {};
  if (logseq.settings?.useJSON) {
    accounts2 = logseq.settings.accountsDetails
  }
  else {
    if (
      logseq.settings?.calendar2Name != "" &&
      logseq.settings?.calendar2URL != ""
    ) {
      accounts2[logseq.settings?.calendar2Name] = logseq.settings?.calendar2URL;
    }
    if (
      logseq.settings?.calendar3Name != "" &&
      logseq.settings?.calendar3URL != ""
    ) {
      accounts2[logseq.settings?.calendar3Name] = logseq.settings?.calendar3URL;
    }
    if (
      logseq.settings?.calendar1Name != "" &&
      logseq.settings?.calendar1URL != ""
    ) {
      accounts2[logseq.settings?.calendar1Name] = logseq.settings?.calendar1URL;
    }
    if (
      logseq.settings?.calendar4Name != "" &&
      logseq.settings?.calendar4URL != ""
    ) {
      accounts2[logseq.settings?.calendar4Name] = logseq.settings?.calendar4URL;
    }
    if (
      logseq.settings?.calendar5Name != "" &&
      logseq.settings?.calendar5URL != ""
    ) {
      accounts2[logseq.settings?.calendar5Name] = logseq.settings?.calendar5URL;
    }
    logseq.updateSettings({ accountsDetails: accounts2 });
  }
  logseq.provideModel({
    async openCalendar2() {
      for (const accountName in accounts2) {
        openCalendar2(accountName, accounts2[accountName]);
      }
    },
  });

  for (const accountName in accounts2) {
   
    let accountSetting = accounts2[accountName];
    logseq.App.registerCommandPalette(
      {
        key: `logseq-${encodeURIComponent(accountName)}-sync`,
        label: `Syncing with ${accountName}`,
      },
      () => {
        openCalendar2(accountName, accountSetting);
      }
    );
  }

  logseq.App.registerUIItem("toolbar", {
    key: "open-calendar2",
    template: `
      <a class="button" data-on-click="openCalendar2">
        <i class="ti ti-notebook"></i>
      </a>
    `,
  });
}
logseq.ready(main).catch(console.error);
