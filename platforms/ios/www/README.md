###KIOSK TABLET/MOBILE CORDOVA APP

- for the check in piece on mobile/table
- later, will have scheduling piece integrated (like the shortpath visual update that's existent on /shortpath branch visitor_update_2.0)
- timeline is to do in next month (around end of Feb '15)
- want to show off at Las Vegas tradeshow in April '15
- accounts for Food & Drug, National Cancer Institute

- workflow for PIV-card holders and non-PIV-card holders
- non PIV card holders validate the license
- PIV-card holders don't need license validation

- if they are not scheduled how can they use the kiosk to check in?
- perhaps use twilio to make a phone call, to hit a button on that phone and then authorize that person on click

- can have tenant give authorization via phone number presses using twilio and their comp voice
- "press 1 to allow entry, 2 is they need escort, 5 to call them" - and will call at the kiosk, maybe even facetime

#####RIGHT NOW
- tenant needs to have approved visitor
- visitor checks in with guard
- guard prints out badge and allows entry if visitor is approved by tenant in system

#####POTENTIAL SOLUTION
- PIV and TWIT card credentials, maybe give them auth to unlock doors to get to host
- passport/driver license, id 150, powered by Assurtec
- they can input their own info
- twilio to host if they do not have (SMS)

- kiosk based on windows machine to start
- assuretec on ipad?

#####COMPLETED USER STORIES
X as a user i want to scan my barcode, DL, passport, or PIV card
X as a user, once I'm validated from the first step, I want to check to see if I am a scheduled visitor
X as a user, i want to search the tenants and respective visits scheduled and select my visit time
X Convert to Angular/Put in Rails public app for now?
X Get seach working with fake service layer
X Hook up Webcam piece after search and visitor is found
X pic starts on load
X retake options
X after pic taken, pass all that info with the selected visitor and pic to printer
X back navigation
X double tapping in search page is highlighting DOM margin/elements
X print badge button positioning issue
X on search, if not on schedule can call Tenant
X if leaving webcam page, kill the webcam to reduce memory usage
X use Twilio to call tenant and then tenant can escort or allow access (notifies guard) - for now, just build out the call interface
X user can insert PIV card and read information, but prompted to PIN number before the overlay (can show picture), PIV card inserted and reads and identifies PIN number with the card (check validity or revoked after that from system) - showing photo before the picture
X modify workflow: preregistered PIV card and scheduled, other ID and scheduled, preregistered PIV card and NOT scheduled, other ID and NOT scheduled
X add UI (call time and positioning fix) for call page
X home page on scan, trigger event to show overlay
X webcam auto allow (need to be hosted on HTTPS, otherwise prompted each time, and right now bugged in Chrome to add new address -_-. But should remember if we allow once on a HTTPS domain)
X as a user, i want to take the badge and go to my visit
X when a visitor checks in and is on schedule guard can see who is checked in for "Today's visits" - changed by status on todays visit
X past visits all in "past visits"
X visits should show who made the visit request from the company (i.e. "Paul Lee from Building Intelligence")
X visits should show who is expected - maybe link a profile of the visitor (only if they are pre-registered, otherwise will need to confirm via call and then the state of the visit changes)
X guard should be able to log in
  - this should exist as a web interface
  - sign in as home page (currentUser held in localStorage like mobile app)
  - after signing in, can search visitors, visits
  - can search PIV card authorizations
X guard should be able to check and confirm tenant's visitor and visitor identity
X guard should allow visitor temporarily access with PIV card
X OR guard should be able to call escort from tenant directly
X guard should be able to let program know that he/she let person through

X QUESTIONS FOR THE KIOSK - in basecamp
X OPTIMUM CONFIRMATION: 08739B (March 5th, 2-5 PM, first time $85, then $60/mo for year)

--------------------------

#####TO DO - LARGE SCREEN UPATES
X Bigger text for info overlays and search text buttons
X Splash art to scale on guard page
X after being idle for 1 min, have a video overlay/screensaver
O Header on home page for visitors saying welcome
O Change images to GIF/video tutorials of PIV scan and DLN/Passport scan
O add plugin for scanners and trigger overlay on 'scan' completed event

O back-end/API integrate (endpoints already set but need to add in the POST requests for actually granting permissions)

X guard additions: who is currently visiting the building
X check out interface
O who checked in at the kiosk and which kisok
