import '@logseq/libs';
import { PageEntity } from '@logseq/libs/dist/LSPlugin.user';
import ical from 'node-ical';
import axios from 'axios';
import { getDateForPage, getDateForPageWithoutBrackets} from 'logseq-dateutils';


//If calendar 2 name AND URL is found, push to accounts

const settingsTemplate = [{
  key: "template",
  type: 'string',
  default: "{Start} - {End}: {Title}",
  title: "Customizing the Event's Insertion",
  description: "The first block that is inserted right under the calendar name for each event. You can use placeholder variables to customize the block. The following variables are available: {Description}, {Date}, {Start}, {End}, {Title}, {Location}",
}, 
{
  key: "templateLine2",
  type: 'string',
  default: "{Description}",
  title: "Optional: A second block under the event",
  description: "Optionally insert a second block indented under the event. Leave blank if you don't want to insert a second blockYou can use placeholder variables to customize the block. The following variables are available: {Description}, {Date}, {Start}, {End}, {Title}, {Location}.",
}, 
{
  key: "calendar1Name",
  type: 'string',
  default: "Calendar 1",
  title: "What would you like to name the calendar?",
  description: "Choose a name for the calendar. This will be the name of the calendar block that is inserted.",
}, 
{
  key: "calendar1URL",
  type: 'string',
  default: "https://calendar.google.com/calendar/ical/...",
  title: "Enter the iCal URL for calendar 1",
  description: "Refer to the readme if you're unsure how to get this link for your platform. This is the link to the calendar's ical file. To test if the link is working, open the link in an incognito browser tab and see if it downloads a file with the extension ics",
}, 
{
  key: "calendar2Name",
  type: 'string',
  default: "",
  title: "Optional: What would you like to name the calendar?",
  description: "Optional: Leave blank if you don't want this calendar to be inserted",
}, 
{
  key: "calendar2URL",
  type: 'string',
  default: "",
  title: "Optional: enter the iCAL URL for calendar 2",
  description: "Optional: Leave blank if you don't want this calendar to be inserted",
}, 
{
  key: "calendar3Name",
  type: 'string',
  default: "",
  title: "Optional: What would you like to name the calendar?",
  description: "Optional: Leave blank if you don't want this calendar to be inserted",
}, 
{
  key: "calendar3URL",
  type: 'string',
  default: "",
  title: "Optional: enter the iCAL URL for calendar 3",
  description: "Optional: Leave blank if you don't want this calendar to be inserted",
}, 
{
  key: "timeFormat",
  type: 'enum',
  // default: ["12 hour time", "24 hour time"],
  title: "Select between 12 and 24 hour time",
  description: "Select between 12 and 24 hour time. This option will be followed whenever you call {end} or {start} in the template.",
  enumChoices: ["12 hour time", "24 hour time"],
  enumPicker: 'select'
},] 
logseq.useSettingsSchema(settingsTemplate)


function sortDate(data){
return data.sort(function(a, b){return (Math.round(new Date(a.start).getTime()/1000)
  - (Math.round(new Date(b.start).getTime()/1000)))}
  )
}
async function findDate(preferredDateFormat){
const hello = 1
  if (await logseq.Editor.getCurrentPage()!=null){
    if ((await logseq.Editor.getCurrentPage())['journal?'] == false){
      // console.log(await logseq.Editor.getCurrentPage()['journal?'])
    const date = getDateForPageWithoutBrackets(new Date(), preferredDateFormat)
    logseq.App.showMsg("Filtering Calendar Items for " + date)
    // insertJournalBlocks(hello, preferredDateFormat, calendarName, settings, date)
    return date
    }
    else {
      // console.log(await logseq.Editor.getCurrentPage()['journal?'])
      const date = (await logseq.Editor.getCurrentPage()).name
      logseq.App.showMsg(`Filtering Calendar Items for ${date}`)
      return date
    }
  }
  else{
    return getDateForPageWithoutBrackets(new Date(), preferredDateFormat)
  }
}
function rawParser(rawData) {
  logseq.App.showMsg("Parsing Calendar Items")
	var eventsArray = []
  var rawDataV2 = ical.parseICS(rawData)
	for (const dataValue in rawDataV2) {
		eventsArray.push(rawDataV2[dataValue]); //simplifying results, credits to https://github.com/muness/obsidian-ics for this implementations
	}
  console.log(eventsArray)
  console.log(sortDate(eventsArray))
	return sortDate(eventsArray);
}

function templateFormatter(template, description = "No Description", date = "No Date", start = "No Start", end = "No End", title = "No Title", location = "No Location"){
  let properDescription
  let properLocation
  if (description == ""){
    properDescription = "No Description"
  }
  else{
    properDescription = description
  }
  if (location == ""){
    properLocation = "No Location"
  }
  else{
    properLocation = location
  }
  let subsitutions = {"{Description}": properDescription, "{Date}" :date, "{Start}": start, "{End}": end, "{Title}":title, "{Location}":properLocation}
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
  // console.log(formattedTimeStamp)
  let initialHours = formattedTimeStamp.getHours()
  let hours;
  if (initialHours == 0){
    hours = "00"
  }
  else {
    hours = initialHours
    if (formattedTimeStamp.getHours() < 10){
      hours = "0" + formattedTimeStamp.getHours()
    }
  }
  var formattedTime
  if (formattedTimeStamp.getMinutes() <10){
    formattedTime = hours + ":" + "0"+(formattedTimeStamp.getMinutes())
  }
  else{
    formattedTime = hours + ":" + (formattedTimeStamp.getMinutes())
}
  if (typeof settings.timeFormat == "undefined" || settings.timeFormat == "12 hour time"){
    return new Date('1970-01-01T' + formattedTime + 'Z')
    .toLocaleTimeString('en-US',
      {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
    );
  
  }
else{
  return formattedTime}
}

async function insertJournalBlocks(data, preferredDateFormat:string, calendarName, settings, emptyToday){
  // let emptyToday = (getDateForPageWithoutBrackets(new Date(), preferredDateFormat))
  console.log(`Current Date: ${emptyToday}`)
  let pageID: PageEntity = await logseq.Editor.createPage(emptyToday, {createFirstBlock: true})
  // logseq.App.pushState('page', { name: pageID.name })
  // let pageBlocks = await logseq.Editor.getPageBlocksTree(pageID.name)
  // let footerBlock = pageBlocks[pageBlocks.length -1]
  let startBlock = await logseq.Editor.insertBlock(pageID.name, calendarName, {sibling:true, isPageBlock:true})
  for (const dataKey in data){
    let description = data[dataKey]["description"] //Parsing result from rawParser into usable data for templateFormatter
    
    let formattedStart = new Date(data[dataKey]["start"])
    let startDate = getDateForPageWithoutBrackets(formattedStart, preferredDateFormat)
    let startTime = formatTime(formattedStart, settings)
    let endTime = formatTime(data[dataKey]["end"], settings)
    let location = data[dataKey]["location"]
    let summary
    if (data[dataKey]["summary"]["val"]){
      summary = data[dataKey]["summary"]["val"]
    }
    else{
      summary = data[dataKey]["summary"]
    }
    // using user provided template
      let headerString = templateFormatter(settings.template, description, startDate, startTime, endTime, summary, location)
      if (startDate.toLowerCase() == emptyToday.toLowerCase()){
    var currentBlock = await logseq.Editor.insertBlock(startBlock.uuid, `${headerString}`, {sibling:false})
    if (settings.templateLine2 != ""){
    let SecondTemplateLine = templateFormatter(settings.templateLine2, description, startDate, startTime, endTime, summary, location)
    await logseq.Editor.insertBlock(currentBlock.uuid, `${SecondTemplateLine}`, {sibling:false})}}
  }
  let updatedBlock = await logseq.Editor.getBlock(startBlock.uuid, {includeChildren: true})
  if ( updatedBlock.children.length == 0){
logseq.Editor.removeBlock(startBlock.uuid)
    logseq.App.showMsg("No events for the day detected")

  }
}
async function openCalendar2 (calendarName, url, settings) {
  try{
  const userConfigs = await logseq.App.getUserConfigs();
  const preferredDateFormat = userConfigs.preferredDateFormat;
  logseq.App.showMsg("Fetching Calendar Items")
  let response2 = await axios.get(url)
  var hello = await rawParser(response2.data)
  // console.log("inserting")
  // if (await (await logseq.Editor.getCurrentPage())['journal?'] == false){
  // const date = getDateForPageWithoutBrackets(new Date(), preferredDateFormat)
  // logseq.App.showMsg("Fetching Calendar Items")
  // insertJournalBlocks(hello, preferredDateFormat, calendarName, settings, date)
  // }
  // else{
  //   const date = (await logseq.Editor.getCurrentPage()).name
  //   logseq.App.showMsg("Fetching Calendar Items")
    
  // }
  const date = await findDate(preferredDateFormat)
  insertJournalBlocks(hello, preferredDateFormat, calendarName, settings, date)
  }
  catch(err){
    if (`${err}` == `Error: Request failed with status code 404`){
      logseq.App.showMsg("Calendar not found: Check your URL")
    }
    console.log(err)
  }
  
}
async function main () {

  let initialSettings =  logseq.settings
  let accounts2 = {}
  if (initialSettings.calendar2Name != "" && initialSettings.calendar2URL != ""){
    accounts2[initialSettings.calendar2Name] = initialSettings.calendar2URL
    }
    if (initialSettings.calendar3Name != "" && initialSettings.calendar3URL != ""){
      accounts2[initialSettings.calendar3Name] = initialSettings.calendar3URL
    }
    if (initialSettings.calendar1Name != "" && initialSettings.calendar1URL != ""){
      accounts2[initialSettings.calendar1Name] = initialSettings.calendar1URL
    }
    // logseq.updateSettings({"accounts": {}})
    // logseq.updateSettings({"accounts": accounts2})
  const userConfigs = await logseq.App.getUserConfigs();
  // const preferredDateFormat2 = userConfigs.preferredDateFormat;
  // logseq.updateSettings({disabled: false, template: "{Start} - {End}: {Title}", templateLine2: "{Description}", accounts: {"Account 1": ["", "f 1"], "ManageBac": ["", "f 2"]}})
  logseq.provideModel({
   async openCalendar2(){
    const userConfigs = await logseq.App.getUserConfigs();
    const preferredDateFormat = userConfigs.preferredDateFormat;
     let initialSettings = await logseq.settings
     const accounts2 = {}
if (initialSettings.calendar2Name != "" && initialSettings.calendar2URL != ""){
  accounts2[initialSettings.calendar2Name] = [initialSettings.calendar2URL]
  }
  if (initialSettings.calendar3Name != "" && initialSettings.calendar3URL != ""){
    accounts2[initialSettings.calendar3Name] = [initialSettings.calendar3URL]
  }
  if (initialSettings.calendar1Name != "" && initialSettings.calendar1URL != ""){
    accounts2[initialSettings.calendar1Name] = [initialSettings.calendar1URL]
  }
   initialSettings = await logseq.settings
// logseq.updateSettings({"accounts": {}})
// logseq.updateSettings({"accounts": accounts2})
// let settings = logseq.settings.accounts
     for (const accountName in accounts2){
    openCalendar2(accountName, accounts2[accountName][0], initialSettings)}
   }
   }
)

for (const accountName in accounts2){
  let initialSettings = await logseq.settings
  const accounts2 = {}
if (initialSettings.calendar2Name != "" && initialSettings.calendar2URL != ""){
accounts2[initialSettings.calendar2Name] = [initialSettings.calendar2URL]
}
if (initialSettings.calendar3Name != "" && initialSettings.calendar3URL != ""){
 accounts2[initialSettings.calendar3Name] = [initialSettings.calendar3URL]
}
if (initialSettings.calendar1Name != "" && initialSettings.calendar1URL != ""){
 accounts2[initialSettings.calendar1Name] = [initialSettings.calendar1URL]
}
  let accountSetting  = accounts2[accountName]
    logseq.App.registerCommandPalette(
      {
        key: `logseq-${accountName}-sync`,
        label: `Syncing with ${accountName}`,
      },
      () => {
          openCalendar2(accountName, accountSetting[0], initialSettings);
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





