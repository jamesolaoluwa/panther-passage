# Demo walkthrough

Open `http://localhost:5173/` after `npm run dev`. All people, events, guides, and RSVPs are simulated.

## Reset before presenting

1. Open Profile.
2. Choose the student for the story.
3. Choose Reset current scenario, then Confirm reset of this scenario.

Reset restores that student’s seed. It does not erase the other two students.

## Jordan Ellis — new student

1. Welcome. Activate the drawn Get Started control. It opens onboarding.
2. Tell us about yourself. Continue only works when the required fields are valid. The student ID is demo text, not a login.
3. Choose one direction, then at least one priority.
4. Enter My Journey. The dashboard opens and milestone progress stays at the start.
5. My Passage shows the campus artwork and lists M01 as the current step. Later steps stay locked.
6. Open Name Your North Star. Write the north-star note, then Continue milestone. M02 becomes the current step.
7. The finale stays closed. Readiness explains that this is not university clearance.

## Avery Brooks — in progress

1. From Profile, load Avery Brooks — In Progress. The app opens Home.
2. Home shows 7 of 15 preparation steps and 5 of 11 required steps, with Practice the Interview as the next step.
3. Two chapter crests are already earned: Find Your Footing and Build Your Toolkit.
4. Explore can search, filter, and save a simulated guide.
5. Events can save and cancel a simulated RSVP.
6. My Chapter can save a goal. Reflections can save a private note.

## Morgan Reed — almost graduated

1. Load Morgan Reed — Almost Graduated.
2. M01 through M14 are complete. M15, Cross the Threshold, is the current required step.
3. The finale page stays closed and lists the remaining required step.
4. Open M15 and mark its three action steps. The finale then opens and links to My Next Chapter.
5. Optional milestones do not decide whether the finale opens.

## If the browser cannot save

A warning appears when local storage fails. Progress then lasts only for that visit. Use reset after the warning clears if the story needs the original seed.

## Recording the demo on an iPad simulator

These steps record a clean demo on an iPad simulator over the macOS loopback network. No real iPad or Wi-Fi setup is needed.

1. Serve the production build, not the dev server, so there is no reload flicker:
   - `npm run build`
   - `npm run preview -- --port 4173 --host`
2. Boot an iPad and open the Simulator window. Any of these work; the layout was audited on all of them:
   - `xcrun simctl boot "iPad Air 13-inch (M3)"` then `open -a Simulator`
   - Portrait and landscape are both supported. Rotate with Device, then Rotate Left or Rotate Right, or Command and the Left or Right arrow.
3. Standardize the status bar so it reads the same in every take:
   - `xcrun simctl status_bar booted override --time "9:41" --batteryState charged --batteryLevel 100 --wifiBars 3 --cellularMode notSupported`
4. Open the app in the simulator Safari:
   - `xcrun simctl openurl booted "http://localhost:4173"`
5. Optional, for a recording with no Safari chrome: in the simulator Safari, use the Share control, then Add to Home Screen, then launch Panther Passage from the home screen. The web app manifest and the Apple web-app meta tags make it open full screen. There is no custom home-screen icon, because the approved logo must not be approximated into one; iPadOS uses a snapshot of the page instead.
6. Reset the scenario you will show first, following the reset steps above, inside the simulator.
7. Record:
   - Start: `xcrun simctl io booted recordVideo --codec=h264 --force ~/Desktop/panther_passage_demo.mp4`
   - Stop with Control and C in that terminal when the take is done.
   - QuickTime Player, with New Movie Recording and the simulator as the source, is an equivalent alternative.

Walk the Jordan, Avery, and Morgan stories above. Switching students is on the Profile screen, which is intentionally outside the main navigation.

Known simulator notes:
- `xcrun simctl openurl` can print an "Operation timed out" message while still opening the page. Give Safari a few seconds and take a screenshot to confirm.
- The bottom navigation is sticky. On a long screen such as Profile, scroll up a little to clear the navigation before tapping a control near the very bottom.
