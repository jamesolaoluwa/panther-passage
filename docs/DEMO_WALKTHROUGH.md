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
5. My Passage opens on a winding path with campus art as the trailhead. M01 is the current step, with a START bubble. Later nodes stay locked. Tapping a node opens a pop-up; Start step opens the milestone.
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

## Recording the demo on iPad Pro 13-inch (M4)

The recording target is the **iPad Pro 13-inch (M4) Simulator**, portrait or landscape. The product is the Panther Passage web app, loaded by a thin Expo Go WebView so Safari chrome is not in the frame. Use your own external recorder.

The shell currently loads a **local production server** (`http://localhost:4174`) so the latest fixes show immediately. Keep `npm run preview -- --port 4174 --host` running from the repo root during the session. See `ipad-shell/README.md`. The deployed `https://panther-passage.onrender.com` is the fallback.

The simulator has already been prepared in this session:

- Device: iPad Pro 13-inch (M4), UDID `2D66C81E-3E7A-4C18-B083-431CAC287FA5`
- Erased, light appearance, hardware keyboard off
- Status bar override: 9:41, full Wi-Fi, full battery
- Expo Go running `ipad-shell/`, which loads the live site

If you need to start it again later:

1. `cd ipad-shell && npx expo start --ios`
2. Confirm Simulator is the 13-inch (M4) in portrait. Pixel Accurate is Device → Pixel Accurate (⌘1).
3. Re-apply the status bar if iOS resets it:
   - `xcrun simctl status_bar booted override --time "9:41" --batteryState charged --batteryLevel 100 --wifiBars 3 --cellularMode notSupported`
4. If Expo Go shows its first-run developer sheet, tap Continue (or close it). Then wait a second so Fraunces and Manrope finish loading.
5. Reset the first student from Profile before you roll.

Walk the Jordan, Avery, and Morgan stories above. Switching students is on the Profile screen, which is intentionally outside the main navigation.

Known simulator notes:
- The first Expo Go launch can show a developer menu. Dismiss it once; it is not part of the product.
- The bottom navigation is sticky. On a long screen such as Profile, scroll up a little to clear the navigation before tapping a control near the very bottom.
- Reduced motion is honored through `MotionConfig reducedMotion="user"`. To demo it, enable Settings → Accessibility → Motion → Reduce Motion in the simulator.
