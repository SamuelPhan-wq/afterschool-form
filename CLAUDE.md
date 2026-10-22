# After-School Interest Form (Diamond International School)

## What this is
A very simple, bilingual (English / Lao) web page where parents tell the school which after-school
activities their children are interested in. Answers are saved to a Google Sheet in the school's Google Drive.
Parents are not technical and Google Forms was too complicated for them, so the page must stay
extremely straightforward: big buttons, few steps, works on any phone, no sign-in.

## Files
- `index.html`  The parent-facing page. One self-contained file (HTML + CSS + JS), no frameworks, no build step.
  It sends answers to the Apps Script link in `APPS_SCRIPT_URL` (top of the script block).
- `img/`  School logo (`logo.png`) and the round activity badges made for the parent group chat
  (`soccer.jpg`, `chinese.jpg`, `lao.jpg`, `swimming.jpg`, 200px copies; originals were in Sam's Downloads/files 2).
  Each activity in `ACTS` names its badge in `img`. Colours come from the logo: blue #1f6ea8, navy #182f63, orange #f5650f.
- `Code.gs`  Google Apps Script receiver (`doPost`). Saves one row per child into a Google Sheet
  ("After-School Interest Responses") and creates the sheet the first time. `setup()` creates it and logs the URL.

## How it works
1. Screen 1: choose language (English or ພາສາລາວ)
2. Screen 2: parent name and phone/WhatsApp
3. Screen 3: child's grade (Pre-K to Grade 5; Grade 6 was removed on purpose) and name
4. Screen 4: tap activities; only if two chosen activities are on the same days, pick a first choice among those
   (otherwise the sheet's First choice column is left blank)
5. Screen 5: summary of all children, "Add another child" (siblings keep the same parent details), then Send
6. Thank-you screen

Sheet columns: Timestamp, Language, Parent name, Phone / WhatsApp, Child name, Grade, Interested in, First choice, Children in family.

## Program details (all programs run 4:00-5:00 PM)
Each activity only shows for its grades (`grades` in `ACTS`):
- Soccer boys: Grades 3-5, Tue & Thu. Soccer girls: Grades 3-5, Mon & Wed. Cards say "Some fees may apply" (uniform/equipment).
- Chinese: Kinder-Grade 5, Tue & Thu, 3,500 THB/month (seats are limited: 10 seats ages 5-7, 3 seats ages 7-12)
- Lao Language: Kinder-Grade 5, Tue & Thu, 3,200 THB/month, starts November 2, 2026. One class (Mathematics was removed on purpose).
- Swimming: Pre-K-Grade 3, 4,200 THB/month, twice a week. Pre-K and Kinder Mon & Wed; Grades 1-3 Tue & Thu.
- Pre-K children only see Swimming.
- Some programs share days, so parents choose a first choice, but only among the same-day ones they picked.

## Decisions already made (don't undo without asking)
- Google Forms was rejected as too complicated. Google Apps Script serving the page directly also failed to load
  for the user, so the page is a standalone `index.html` hosted elsewhere, with Apps Script used only to save data.
- The page posts JSON with `Content-Type: text/plain` to avoid CORS preflight problems with Apps Script.
- Apps Script template literals mangle `\'` escapes; this is why the page is no longer embedded in `Code.gs`.
- Keep it one file, plain JavaScript, mobile first, large tap targets.
- Claude can't sign in to Google, so it can't edit or redeploy Apps Script. `Code.gs` (v2) is therefore generic and
  should never need changing: the page sends `{ rows: [{ 'Column name': value }] }`, and any new column name is added
  to the sheet's header automatically. Make all changes (new questions, new columns) in `index.html` only.
- Hosting: GitHub Pages from this folder's public repo `afterschool-form` (GitHub user SamuelPhan-wq), branch
  `main`, root. Parent link: https://samuelphan-wq.github.io/afterschool-form/ . Everything lives in this one folder
  (the older `DIS/AfterSchoolProgram` folder was the previous home). The repo is public, so never put phone numbers,
  passwords or the sheet's link in these files. To publish a change, Claude commits here; Sam presses Push in GitHub Desktop.

## Known to-dos / open items
- Publish the repo in GitHub Desktop and turn on Pages (Settings > Pages > main / root).
- Done: `Code.gs` v2 is deployed as a web app (Execute as: Me, Who has access: Anyone); the link says
  "receiver is running (v2)". If it ever must change, Sam pastes it and makes a NEW VERSION under
  Deploy > Manage deployments so the same link updates.
- Test end to end with a two-child family and confirm two rows appear in the sheet.
- The Lao translations were written by Claude and need review by a native Lao speaker.
- Possible extras: QR code for the link, a reply deadline message on the thank-you screen, a Chinese seat-limit note,
  a dashboard/summary tab in the sheet counting interest per program.

## Working style
The school's head of school (Sam) prefers short, plain, warm explanations and wants to make their own edits
between rounds. Prefer small targeted changes over rewrites, and say plainly what changed.
