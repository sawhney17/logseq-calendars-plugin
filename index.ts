import '@logseq/libs';
import { safetyPathNormalize } from '@logseq/libs/dist/helpers';
import { PageEntity } from '@logseq/libs/dist/LSPlugin.user';
const ical = require('node-ical');
const axios = require('axios');
import { getDateForPage} from 'logseq-dateutils';
import { start } from 'repl';


let calendarName = "Gcal"
async function rawParser(rawData) {
  logseq.App.showMsg("Parsing Calendar Items")
  console.log("hello")
	var eventsArray = []
  var rawDataV2 = ical.parseICS(rawData)
	for (const dataValue in rawDataV2) {
		eventsArray.push(rawDataV2[dataValue]); //simplifying results, credits to https://github.com/muness/obsidian-ics for this implementations
	}
  console.log(eventsArray)
	return eventsArray;
}

function templateFormatter(template, description = "No Description", date = "No Date", start = "No Start", end = "No End", title = "No Title"){
  let properDescription
  if (description == ""){
    properDescription = "No Description"
  }
  else{
    properDescription = description
  }
  let subsitutions = {"{Description}": properDescription, "{Date}" :date, "{Start}": start, "{End}": end, "{Title}":title}
var templatex1 = template

for (const substitute in subsitutions){
  let template2 = templatex1.replace(substitute, subsitutions[substitute])
  let template3 = template2.replace(substitute.toLowerCase(), subsitutions[substitute])
  templatex1 = template3
}
return templatex1
}

function formatTime(rawTimeStamp, settings){
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
  if (typeof settings.timeFormat != "undefined"){
    return new Date('1970-01-01T' + formattedTime + 'Z')
    .toLocaleTimeString('en-US',
      {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
    );
  
  }
else{
  return formattedTime}
}

// const getDateForPage = (d: Date, preferredDateFormat: string) => {
//   const getYear = d.getFullYear();
//   const getMonth = d.toString().substring(4, 7);
//   const getMonthNumber = d.getMonth() + 1;
//   const getDate = d.getDate();

//   if (preferredDateFormat === 'MMM do yyyy') {
//     return `${getMonth} ${getOrdinalNum(getDate)}, ${getYear}`;
//   } else if (
//     preferredDateFormat.includes('yyyy') &&
//     preferredDateFormat.includes('MM') &&
//     preferredDateFormat.includes('dd') &&
//     ('-' || '_' || '/')
//   ) {
//     var mapObj = {
//       yyyy: getYear,
//       dd: ('0' + getDate).slice(-2),
//       MM: ('0' + getMonthNumber).slice(-2),
//     };
//     let dateStr = preferredDateFormat;
//     dateStr = dateStr.replace(/yyyy|dd|MM/gi, function (matched) {
//       return mapObj[matched];
//     });
//     return `${dateStr}`;
//   } else {
//     return `${getMonth} ${getOrdinalNum(getDate)}, ${getYear}`;
//   }
// };

// const getOrdinalNum = (n: number) => {
//   return (
//     n +
//     (n > 0
//       ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
//       : '')
//   );
// };

function removeBrackets(input){
  return(input.replace("[[", "").replace("]]", ""))
}
async function insertJournalBlocks(data, preferredDateFormat:string, calendarName, settings){
  let today = (getDateForPage(new Date(), preferredDateFormat))
  let emptyToday = removeBrackets(today)
  let pageID: PageEntity = await logseq.Editor.createPage(emptyToday)
  // logseq.App.pushState('page', { name: pageID.name })
  let pageBlocks = await logseq.Editor.getPageBlocksTree(pageID.name)
  let footerBlock = pageBlocks[pageBlocks.length -1]
  let startBlock = await logseq.Editor.insertBlock(footerBlock.uuid, calendarName, {sibling:true})
  console.log("hello")
  for (const dataKey in data){
    let description = data[dataKey]["description"]
    let formattedStart = new Date(data[dataKey]["start"])
    let startDate = removeBrackets(getDateForPage(formattedStart, preferredDateFormat))
    let startTime = formatTime(formattedStart, settings)
    let endTime = formatTime(data[dataKey]["end"], settings)
    let summary = data[dataKey]["summary"]
    console.log(startDate)
      let headerString = templateFormatter(settings.template, description, startDate, startTime, endTime, summary)
      console.log("failure")
      console.log(emptyToday)
      if (startDate == emptyToday){
        console.log("Success")
    var currentBlock = await logseq.Editor.insertBlock(startBlock.uuid, `${headerString}`, {sibling:false})
    if (settings.templateLine2 != ""){
      console.log(startBlock)
    let SecondTemplateLine = templateFormatter(settings.templateLine2, description, startDate, startTime, endTime, summary)
    console.log(currentBlock)
    logseq.Editor.insertBlock(currentBlock.uuid, `${SecondTemplateLine}`, {sibling:false})}}
    console.log("hello")
  }
}
async function openCalendar2 (preferredDateFormat, calendarName, url, settings) {
  try{
  logseq.App.showMsg("Fetching Calendar Items")
  let response2 = await axios.get(url)
  var hello = await rawParser(response2.data)
  insertJournalBlocks(hello, preferredDateFormat, calendarName, settings)
}
  catch(err){
    console.log(`There was an error: ${err}`)
  }
}
async function main () {
  const userConfigs = await logseq.App.getUserConfigs();
  const preferredDateFormat2 = userConfigs.preferredDateFormat;
  // logseq.updateSettings({disabled: false, template: "{Start} - {End}: {Title}", templateLine2: "{Description}", accounts: {"Account 1": ["", "f 1"], "ManageBac": ["", "f 2"]}})
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
  // console.log(await logseq.settings.accounts)
  let fullSettings = await logseq.settings
  let accountSetting  = fullSettings.accounts[accountName]
    logseq.App.registerCommandPalette(
      {
        key: `logseq-${accountName}-sync`,
        label: `Syncing with ${accountName}`,
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
        <i class="ti ti-calendar"></i>
      </a>
    `,
  })
   
  }
logseq.ready(main).catch(console.error);





