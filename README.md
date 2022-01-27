>If this plugin helps you, I'd really appreciate your support. You can [buy me a coffee here. ](https://www.buymeacoffee.com/sawhney17)

# Logseq Calendars Plugin

A plugin that allows you to import calendar events from GCal, iCloud, Outlook and web based subscriptions in the iCal format. 

## Setup
1. Get the ics link from each calendar provider using the below steps
2. In Logseq, navigate to the entry in the plugins list for "Logseq Calendar Plugins
3. Click the gear and then "Open Settings"
4. In settings, enter the following: 

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

