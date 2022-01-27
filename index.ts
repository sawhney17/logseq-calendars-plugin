import { calendar } from '@googleapis/calendar';
import '@logseq/libs';
import { PageEntity } from '@logseq/libs/dist/LSPlugin.user';
const ical = require('node-ical');
const axios = require('axios');

// let url  = "https://calendar.google.com/calendar/ical/rao6fvrrsq6mdorf9n30fs6mk4%40group.calendar.google.com/private-18ccd424400ef24c5d343ec93b289590/basic.ics"
let calendarName = "Gcal"
async function rawParser(rawData) {
  logseq.App.showMsg("Parsing Calendar Items")
	var eventsArray = []
  var rawDataV2 = ical.parseICS(rawData)
  // console.log("rawData")
  // console.log(rawData)
  
	for (const dataValue in rawDataV2) {
		eventsArray.push(rawDataV2[dataValue]); //simplifying results, credits to https://github.com/muness/obsidian-ics for this implementations
	}
	return eventsArray;
}

function templateFormatter(template, description = "", date = "", start = "", end = "", title = ""){
let subsitutions = {"{Description}": description, "{Date}" :date, "{Start}": start, "{End}": end, "{Title}":title}
var templatex1 = template
for (const substitute in subsitutions){
  let template2 = templatex1.replace(substitute, subsitutions[substitute])
  let template3 = template2.replace(substitute.toLowerCase(), subsitutions[substitute])
  templatex1 = template3
}
return templatex1
}

function formatTime(rawTimeStamp){
  let formattedTimeStamp = new Date(rawTimeStamp)
  let initialHours = formattedTimeStamp.getHours()
  let hours;
  if (initialHours == 0){
    hours = "00"
  }
  else {
    hours = initialHours
  }
  let formattedTime
  if (formattedTimeStamp.getMinutes() <10){
    formattedTime = hours + ":" + "0"+(formattedTimeStamp.getMinutes())
  }
  else{formattedTime = hours + ":" + (formattedTimeStamp.getMinutes())
}
  return formattedTime
}
// function timeConverter(x){
//   var a = new Date(x * 1000);
//   // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
//   var year = a.getFullYear();
//   // var month = months[a.getMonth()];
//   var month = a.getMonth()+1
//   var date = a.getDate();
//   var time = `${year}-${month}-${date}`;
//   return time
// }

const getDateForPage = (d: Date, preferredDateFormat: string) => {
  const getYear = d.getFullYear();
  const getMonth = d.toString().substring(4, 7);
  const getMonthNumber = d.getMonth() + 1;
  const getDate = d.getDate();

  if (preferredDateFormat === 'MMM do yyyy') {
    return `${getMonth} ${getOrdinalNum(getDate)}, ${getYear}`;
  } else if (
    preferredDateFormat.includes('yyyy') &&
    preferredDateFormat.includes('MM') &&
    preferredDateFormat.includes('dd') &&
    ('-' || '_' || '/')
  ) {
    var mapObj = {
      yyyy: getYear,
      dd: ('0' + getDate).slice(-2),
      MM: ('0' + getMonthNumber).slice(-2),
    };
    let dateStr = preferredDateFormat;
    dateStr = dateStr.replace(/yyyy|dd|MM/gi, function (matched) {
      return mapObj[matched];
    });
    return `${dateStr}`;
  } else {
    return `${getMonth} ${getOrdinalNum(getDate)}, ${getYear}`;
  }
};

const getOrdinalNum = (n: number) => {
  return (
    n +
    (n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : '')
  );
};

async function insertJournalBlocks(data, preferredDateFormat:string, calendarName, settings){
  let pageID: PageEntity = await logseq.Editor.createPage(getDateForPage(new Date(), preferredDateFormat))
  // logseq.App.pushState('page', { name: pageID.name })
  let pageBlocks = await logseq.Editor.getPageBlocksTree(pageID.name)
  let footerBlock = pageBlocks[pageBlocks.length -1]
  let startBlock = await logseq.Editor.insertBlock(footerBlock.uuid, calendarName, {sibling:true})
  console.log(data)
  for (const dataKey in data){
    // let date = Math.floor(new Date(data[dataKey]["start"]).getTime() / 1000)
    let description = data[dataKey]["description"]
    let startDate = data[dataKey]["start"]
    let startTime = formatTime(startDate)
    let endTime = formatTime(data[dataKey]["end"])
    let summary = data[dataKey]["summary"]
      let headerString = templateFormatter(settings.template, description, startDate, startTime, endTime, summary)
      if (getDateForPage(new Date(startDate), preferredDateFormat) == getDateForPage(new Date(), preferredDateFormat)){
    let currentBlock = await logseq.Editor.insertBlock(startBlock.uuid, `${headerString}`, {sibling:false})}
  }
}

// async function insertBlocks(data){
//   logseq.App.showMsg("Inserting Google Calendar items!")
//   logseq.Editor.deletePage("Google Calendar Import")
//   try {
//     var pageID = await logseq.Editor.getPage("Google Calendar Import")
//     if (pageID == null){
//       logseq.Editor.createPage("Google Calendar Import")
//   }
  
//   pageID = await logseq.Editor.getPage("Google Calendar Import")
//   // logseq.App.pushState('page', { name: pageID.name })
//   for (const dataKey in data){
//     let date = Math.floor(new Date(data[dataKey]["start"]).getTime() / 1000)
//     let convertedStartDate = timeConverter(date)
//     let currentBlock = await logseq.Editor.insertBlock(pageID.name, `${data[dataKey]["summary"]}\nSCHEDULED: <${convertedStartDate} MON>`, {isPageBlock: true})
//     if (data[dataKey]["description"] != ""){    
//       await logseq.Editor.insertBlock(currentBlock.uuid, `${data[dataKey]["description"]}`, {sibling: false})
//     }
    
//   }
// // }
//   catch(err){
//     console.log(err)
//     logseq.App.showMsg(`There was an error`)
    
//   }
  
// }
async function openCalendar2 (preferredDateFormat, calendarName, url, settings) {
  try{
  logseq.App.showMsg("Fetching Google Calendar Items")
  let response2 = await axios.get(url)
  var hello = await rawParser(response2.data)
  // insertBlocks(hello)
  insertJournalBlocks(hello, preferredDateFormat, calendarName, settings)
}
  catch(err){
    console.log(`There was an error: ${err}`)
  }
}
async function main () {
  const userConfigs = await logseq.App.getUserConfigs();
  const preferredDateFormat2 = userConfigs.preferredDateFormat;
  logseq.updateSettings({disabled: false, template: "{Start} - {End}: {Title}", templateLine2: "{Description}", accounts: {"Google Calendar": ["https://calendar.google.com/calendar/ical/rao6fvrrsq6mdorf9n30fs6mk4%40group.calendar.google.com/private-18ccd424400ef24c5d343ec93b289590/basic.ics", "n t"], "ManageBac": ["https://diadubai.managebac.com/student/events/token/da3d0b00-f79c-0139-3e73-068251f11fb2.ics", "n a"]}})
  logseq.provideModel({
   async openCalendar2(){
     let fullSettings = await logseq.settings
     let settings = await fullSettings["accounts"]
     for (const accountName in settings){
    openCalendar2(preferredDateFormat2, accountName, settings[accountName][0], fullSettings), fullSettings}
   }
   }
)
for (const accountName in logseq.settings.accounts){
  console.log(await logseq.settings.accounts)
  let fullSettings = await logseq.settings
  let accountSetting  = fullSettings.accounts[accountName]
    logseq.App.registerCommandPalette(
      {
        key: `logseq-${accountName}-sync`,
        label: `Syncing with ${accountName}`,
        keybinding: {
          binding: accountSetting[1],
        },
      },
      () => {
          openCalendar2(preferredDateFormat2, accountName, accountSetting[0], fullSettings);
      }
    );
    }

  logseq.App.registerUIItem('toolbar', {
    key: 'open-calendar2',
    template: `
      <a class="button" data-on-click="openCalendar2">
        <i class="ti ti-calendar-event"></i>
      </a>
    `,
  })
   
  }
logseq.ready(main).catch(console.error);





