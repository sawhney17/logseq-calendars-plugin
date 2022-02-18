>If this plugin helps you, I'd really appreciate your support. You can [buy me a coffee here. ](https://www.buymeacoffee.com/sawhney17)

# Logseq Calendars Plugin

A plugin that allows you to import calendar events from GCal, iCloud, Outlook and web based subscriptions in the iCal format. This appends all of the events scheduled for the current day to that days daily note page. 

## Usage
- Three ways to import events
    1. Use the command pallet via `mod+shift+p` and select a specific calendar to import
    2. Use the keyboard shortcut you defined in the settings to import that specific calendar
    3. Click the icon in the toolbar to import **all** calendars to daily note page 
- Import events from past days
    - When you are on either a non journal page, the home page or the current daily note, Logseq will import the current days events to the current days daily note
    - When you are in a journal page for a different day, that dates events will be added to that dates daily note page (How cool!)
## Setup
1. Get the ics link from each calendar provider using the below steps
2. In Logseq, navigate to the entry in the plugins list for "Logseq Calendar Plugins
3. Click the gear and then "Open Settings"
4. In settings, enter the following: 
```json
{
  "disabled": false,
  "template": "{Start} - {End}: {Title}", 
  "templateLine2": "{Description}, Location: {Location}", 
  "accounts": {
    "Google Calendar": [
      "https://calendar.google.com/calendar/ical/rao6fvrrsq6mdorf9n30fs6mk4%40group.calendar.google.com/private-18ccd424400ef24c5d343ec93b289590/basic.ics"
    ],
    "iCloud": [ 
      "https://p54-caldav.icloud.com/published/2/MTcyOTMzMjIwNTAxNzI5M-ibrzX3UhprTcakzWiFfAyvzHuJSIuassVxcCUrtpJD"
    ]
  },
  "timeFormat": 12
}
```
- `disabled` is required and is defined by logseq itself, you don't need to do anything here
- `template` is the text that will go on the parent block(more on the syntax below)
    - Underneath the block titled the calendar name, you will see blocks in this format
- `templateLine2` is a block indented after `template`
- `accounts` are defined in the format `"AccountName": ["IcsUrl", "Shortcut"]`
    - You can add more accounts, just seperate them by `,`
    - `AccountName` can be whatever you want
    - `IcsUrl` follow [next step](#getting-the-ics-url) to get the url
    - (optional) `Shortcut`
- `timeFormat` can be 12 or 24. The choice is regarding whether you want 24 hours time(19:00) or 12 hour time. (7:00 pm)

## Getting the ICS URL 
### Google Calendar
1. In the website, go to your calendar
2. Go to the settings for the specific calendar you want
3. Get your secret address 
    - <img width="665" alt="Screen Shot 2022-01-28 at 1 22 06 AM" src="https://user-images.githubusercontent.com/80150109/151445777-2b31f5a6-79ca-41e8-86b8-3c52c4d05415.png">
4. This is the link you need

### iCloud
1. Make calendar public 
    - <img width="293" alt="Screen Shot 2022-01-28 at 1 23 12 AM" src="https://user-images.githubusercontent.com/80150109/151445928-88037551-92b0-4b96-a919-ba957e270e68.png">
2. Right click the calendar again and click share publish link. 
3. This should bring you to an email with a link in the body.
4. The link will be in the format webcal://p54-caldav.icloud.com/published/2/xjshdkljshvkjsldhsdkhsdkj
5. Remove the `webcal://` from the beginning
6. Take the link as `p54-caldav.icloud.com/published/2/xjshdkljshvkjsldhsdkhsdkj`
7. This is the link you need

### Outlook
1. Go to the calendar on the side bar, hit the three dots and click share. When prompted enter another one of your email addresses. 
    - <img width="359" alt="Screen Shot 2022-01-28 at 1 29 56 AM" src="https://user-images.githubusercontent.com/80150109/151446831-71ab965b-e2c8-4d97-b09a-6dcf2f719faa.png">
2. Give them permission to view all details
    - <img width="327" alt="Screen Shot 2022-01-28 at 1 31 29 AM" src="https://user-images.githubusercontent.com/80150109/151447006-d93423ff-5636-4c76-bd50-ba725954638f.png"> 
3. Open the email you would've received. 
4. At the bottom of the email, there will be a response in this form
    - <img width="481" alt="Screen Shot 2022-01-28 at 1 33 48 AM" src="https://user-images.githubusercontent.com/80150109/151447351-37743cdc-337d-47f8-8628-069777f3c666.png">
5. Copy the link that the text `this link` points to. 
6. This is the linkk you need

## Custom templates

-  to set custom templates, you can use the following placeholders
    -  `{Description}`
    -  `{Title}`
    -  `{Start}`
    -  `{End}`
    -  `{Date}`
    -  `{Location}`
- Templates are the format by which the events are inserted
    -  You can define templates in settings
- Difference between `template` and `templateline2`
<img width="993" alt="Screen Shot 2022-01-28 at 3 05 54 PM" src="https://user-images.githubusercontent.com/80150109/151536767-c4ca96aa-a57c-4ee6-9c7b-ee36b3d448ce.png">


## Credits
- <a href="https://www.flaticon.com/free-icons/calendar" title="calendar icons">Calendar icons created by Freepik - Flaticon</a>
- Credits to @hkgnp for his logseq-dateutil library
- Credits to https://github.com/jens-maus/node-ical
