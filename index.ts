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
  return data.sort(function (a, b) {
    return (
      Math.round(new Date(a.start).getTime() / 1000) -
      Math.round(new Date(b.start).getTime() / 1000)
    );
  });
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
      eventsArray.push(rawDataV2[dataValue]); //simplifying results, credits to https://github.com/muness/obsidian-ics for this implementations
    } else {
      const currentYear = new Date().getFullYear()
      const dates = event.rrule.between(
        new Date(2021, 0, 1, 0, 0, 0, 0),
        new Date(currentYear, 11, 31, 0, 0, 0, 0)
      );
      console.log(dates);
      if (dates.length === 0) continue;

      console.log("Summary:", event.summary);
      console.log("Original start:", event.start);
      console.log(
        "RRule start:",
        `${event.rrule.origOptions.dtstart} [${event.rrule.origOptions.tzid}]`
      );

      dates.forEach((date) => {
        let newDate;
        if (event.rrule.origOptions.tzid) {
          // tzid present (calculate offset from recurrence start)
          const dateTimezone = moment.tz.zone("UTC");
          const localTimezone = moment.tz.guess();
          
          const tz =
            event.rrule.origOptions.tzid === localTimezone
              ? event.rrule.origOptions.tzid
              : localTimezone;
          const timezone = moment.tz.zone(tz);
          const offset =
            timezone.utcOffset(date) - dateTimezone.utcOffset(date);
          // newDate = moment(date).add(offset, "minutes").toDate();
          // console.log(offset)
          newDate = date
          //FIXME: this is a hack to get around the fact that the offset is not being calculated correctly
        } else {
          // tzid not present (calculate offset from original start)
          newDate = new Date(
            date.setHours(
              date.getHours() -
                (event.start.getTimezoneOffset() - date.getTimezoneOffset()) /
                  60
            )
          );
        }
        const start = moment(newDate);
        const secondaryEvent = { ...event, start: start["_d"] };
        eventsArray.push(secondaryEvent);
      });

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

async function formatTime(rawTimeStamp) {
  let formattedTimeStamp = new Date(rawTimeStamp);
  let initialHours = formattedTimeStamp.getHours();
  let hours;
  if (initialHours == 0) {
    hours = "00";
  } else {
    hours = initialHours;
    if (formattedTimeStamp.getHours() < 10) {
      hours = "0" + formattedTimeStamp.getHours();
    }
  }
  var formattedTime;
  if (formattedTimeStamp.getMinutes() < 10) {
    formattedTime = hours + ":" + "0" + formattedTimeStamp.getMinutes();
  } else {
    formattedTime = hours + ":" + formattedTimeStamp.getMinutes();
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
  for (const dataKey in data) {
    try {
      let description = data[dataKey]["description"]; //Parsing result from rawParser into usable data for templateFormatter
      let formattedStart = new Date(data[dataKey]["start"]);
      let startDate = getDateForPageWithoutBrackets(
        formattedStart,
        preferredDateFormat
      );
      let startTime = await formatTime(formattedStart) ;
      let endTime = await formatTime(data[dataKey]["end"]);
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
        var currentBlock = await logseq.Editor.insertBlock(
          startBlock.uuid,
          `${headerString.replaceAll("\\n", "\n")}`,
          { sibling: false }
        );
        if (logseq.settings?.templateLine2 != "") {
          let SecondTemplateLine = templateFormatter(
            logseq.settings?.templateLine2,
            description,
            startDate,
            startTime,
            endTime,
            summary,
            location
          );
          await logseq.Editor.insertBlock(
            currentBlock!.uuid,
            `${SecondTemplateLine.replaceAll("\\n", "\n")}`,
            { sibling: false }
          );
        }
      }
    } catch (error) {
      console.log(data[dataKey]);
      console.log("error");
      console.log(error);
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
    let response2 = await axios.get(url);
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
