# MedScope — Frontend Demo

MedScope is a beginner-friendly frontend MVP for a mini project on
medical image analysis. The long-term goal is a binary chest X-ray
classifier (Normal vs. Pneumonia) built with Python and a pretrained
model.
**This version is the user interface only: there is no AI, no backend,
and no real diagnosis.**

Built with plain **HTML5, CSS3 and vanilla JavaScript** — no frameworks,
no libraries, no build step, no installation needed.

## Features

- Demo sign-in and sign-up screens with form validation
- Overview dashboard (workflow steps + project status)
- PNG/JPEG upload with type and size checks (2 MB limit)
- Image preview with file name, type, size and dimensions
- Brightness, contrast, grayscale, zoom and rotation display controls
- Hold-to-compare original vs. adjusted view
- Brightness histogram of the uploaded image (pixel counts only)
- Sample report page with `.txt` download and printing
- Sidebar workflow checkmarks (upload / adjusted / report)
- Dashboard "continue where you left off" notice
- Responsive layout (desktop sidebar, mobile menu)
- Keyboard focus indicators and accessible labels

## Folder structure

```text
MedScope/
├── index.html      → Overview dashboard
├── login.html      → Demo sign-in screen
├── signup.html     → Demo account creation screen
├── upload.html     → Image upload and preview
├── analysis.html   → Image preview + display controls
├── results.html    → Sample report page
├── about.html      → Project description and limitations
├── css/
│   └── styles.css  → The one shared stylesheet
├── js/
│   └── app.js      → The one shared JavaScript file
├── serve.py        → One-command local server launcher
├── start.bat       → Windows double-click launcher
└── README.md       → This file
```

What each file is for, in simple language:

| File | Purpose |
|---|---|
| `index.html` | Dashboard: intro, Upload button, Upload → Analyze → Review steps, status |
| `login.html` | Demo sign-in form (email + password, validation only) |
| `signup.html` | Demo sign-up form (name + email + password, validation only) |
| `upload.html` | Pick a PNG/JPEG, see a preview with dimensions, remove/replace it |
| `analysis.html` | View the image; brightness/contrast/grayscale/zoom/rotate, compare button, histogram (display only) |
| `results.html` | Sample report layout + download as `.txt` + print |
| `about.html` | Objective, technologies, features, limitations, Python plans |
| `css/styles.css` | All styling: theme, sidebar, cards, forms, responsive rules |
| `js/app.js` | All behaviour: sidebar, auth demo, upload, filters, report |
| `serve.py` | One-command launcher: serves the folder, opens the browser |
| `start.bat` | Windows double-click launcher (runs `serve.py`) |

## How to open and run

No installation. Any modern browser + Python 3 works.

**Single command (recommended):**

```powershell
py serve.py
```

This serves the folder, prints the address, and opens MedScope in
your browser automatically. Stop it with Ctrl+C. On some systems use
`python serve.py` instead of `py serve.py`. Windows users can also
just double-click `start.bat`.

**Manual alternative:** double-click `login.html` to open it directly,
or serve the folder with `python -m http.server 8000` and open
`http://localhost:8000` yourself.

Suggested demo flow for your project guide:
`signup.html` → `index.html` → `upload.html` → `analysis.html` →
`results.html` → `about.html`.

## How to use the upload and analysis pages

**Upload (`upload.html`):**

1. Click **Choose image** (or drag a file onto the upload area).
2. Pick one PNG or JPEG image, max 2 MB.
3. The preview panel shows the image plus its file name, type, size
   and dimensions (width × height).
4. Use **Replace image** to pick a different file, or **Remove image**
   to clear it.
5. Click **Continue to analysis** when ready.
6. Invalid files (wrong type, too large) show a friendly error message.

**Analysis (`analysis.html`):**

1. The uploaded image is shown on the left.
2. Move the **Brightness** and **Contrast** sliders (50–150%).
3. Tick **Grayscale preview** for a black-and-white view.
4. Use the **Zoom** slider (50–200%) and **Rotate** buttons to inspect
   details.
5. Hold **Hold to compare original** to peek at the untouched image.
6. The **Brightness distribution** chart counts dark vs. light pixels —
   it describes exposure only, not disease.
7. **Reset adjustments** returns everything to default.
8. Click **Continue to report** to open the sample report.

These controls are plain browser CSS filters and transforms. They only
change how the image looks on your screen — they do not enhance the
image medically and they detect nothing.

## The authentication demo (please read)

`login.html` and `signup.html` exist so you can demonstrate a full app
workflow (sign up → use the app → sign out). They are **frontend-only
demo screens**:

- Validation is format-only (valid email, password length).
- Passwords are **never stored** in `localStorage`/`sessionStorage`,
  never sent anywhere, and never checked.
- Only a non-sensitive display name/email is kept in `sessionStorage`
  for the open tab, so the sidebar can greet you.
- **Sign out** (in the sidebar footer) clears that name.
- There are no real accounts and no security. Do not enter a password
  you use anywhere else.
- Real authentication must be built securely on a backend later.

## How the JavaScript file works (`js/app.js`)

One shared file, small commented functions, each guarded so it only
runs on pages that have the elements it needs:

- `buildSidebar()` — inserts the left sidebar (Overview, Upload,
  Analysis, Results, About) into `#nav-root`, highlights the current
  page from `body[data-page]`, adds the mobile Menu toggle, and shows
  the demo user + Sign out button.
- `initSignIn()` / `initSignUp()` — validate the auth forms, store
  display info only, redirect to `index.html`.
- `readImage()` / `saveImage()` / `clearImage()` — keep the selected
  image as a data URL in `sessionStorage` (temporary, tab-only,
  small images only) so Upload, Analysis and Results can share it
  without a server.
- `initUpload()` — file picker + drag-and-drop, PNG/JPEG and 2 MB
  validation, preview panel, replace/remove.
- `initAnalysis()` — loads the image, applies brightness/contrast/
  grayscale via CSS `filter` plus zoom/rotation via CSS `transform`,
  hold-to-compare, reset button, and draws the histogram.
- `initResults()` — fills the sample report, builds the downloadable
  `.txt` report with a `Blob`, and offers printing.
- `drawHistogram()` — counts dark-to-light pixels on a small canvas
  copy and draws a 32-bin bar chart (real counts, no interpretation).
- `progressTickFor()` — decides the sidebar ✓ checkmarks from real
  tab state (image stored, display adjusted, report opened).
- `fillDimensions()` — measures real pixel size with an `Image`
  object and shares it between pages.

## Current limitations

- **No AI.** Nothing analyses images or predicts conditions.
- **No real security.** Auth screens are a demo (see above).
- Display controls are CSS filters, not medical image enhancement.
- The image lives only in the current browser tab (max 2 MB).
- The report is a sample layout with no findings.
- Not a medical device. Not for diagnosis or clinical use.

## Future Python integration plan

1. Add a Python backend (e.g. Flask or FastAPI) with an `/upload`
   endpoint that receives the image from this frontend.
2. Preprocess with Pillow or OpenCV (resize, normalise).
3. Run a pretrained image-classification network adapted for
   Normal vs. Pneumonia, and return the result to `results.html`.
4. Move sign-in/account handling to the backend with proper password
   hashing and sessions.
5. Real classification needs an appropriate labeled dataset, evaluation
   on unseen images, and careful validation before any result is shown.

## Medical disclaimer

Educational demo only. This project does not analyse images, does not
detect disease, and must not be used for diagnosis or any medical
decision. Use sample or de-identified images only.
