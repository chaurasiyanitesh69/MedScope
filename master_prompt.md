# Build a Simple, Premium Medical Image Analysis Frontend

Act as a senior frontend developer and a patient mentor for a beginner Python student.

Help me build a frontend MVP for my first mini project: **Medical Image Analysis Software**.

I know Python basics but am a beginner in web development. I need code that is simple, readable, well-commented, and easy to explain to my college project guide.

## 1. Main objective

Create a clean, professional medical image analysis web interface using only:

- HTML5
- CSS3
- Vanilla JavaScript

Do not use React, Next.js, TypeScript, Tailwind, Bootstrap, Node.js, or other frameworks. Do not add a build process.

Later, I will integrate Python for image processing and a pretrained AI model for binary chest X-ray classification: Normal vs. Pneumonia.

For now, build only the frontend. Do not implement real AI classification.

## 2. Visual design

The application should look simple, premium, calm, and professional, like a well-designed healthcare software product.

Avoid the typical AI-generated or "vibecoded" appearance.

Design guidelines:
- Use a restrained color palette: off-white backgrounds, dark charcoal text, muted green accents, and subtle gray borders.
- Use a clean system font or a simple sans-serif font.
- Use consistent spacing, typography, and alignment.
- Prefer whitespace, subtle borders, and small shadows over excessive decoration.
- Avoid neon colors, glowing effects, oversized gradients, floating blobs, excessive rounded cards, and unnecessary animations.
- Keep icons simple. Use lightweight text or CSS icons instead of installing large icon libraries.
- Create a professional left sidebar for desktop navigation and a usable navigation layout on mobile.
- Make the interface responsive for desktop, tablet, and mobile screens.
- Include hover states, keyboard focus indicators, and accessible labels.

The application should resemble practical medical software, not a flashy landing page.

## 3. Required pages

Create these pages as separate HTML files:

1. `login.html` — Sign-in page.
2. `signup.html` — Demo account creation page.
3. `index.html` — Overview dashboard.
4. `upload.html` — Medical image upload and preview.
5. `analysis.html` — Image preview and basic visual adjustments.
6. `results.html` — Sample report page.
7. `about.html` — Project description and limitations.

Use one shared stylesheet at `css/styles.css` and one shared JavaScript file at `js/app.js`.

Keep the navigation consistent across the workspace pages.

## 4. Authentication screens

Include basic sign-in and sign-up screens so I can demonstrate an application workflow.

However, clearly explain that these are frontend-only demo screens. Do not claim to provide secure authentication.

- Use simple form validation.
- Use email and password fields for sign-in.
- Use name, email, and password fields for sign-up.
- Do not store passwords in localStorage or sessionStorage.
- If you store a demo profile, store only non-sensitive display information.
- Include a sign-out button.
- Add a clear code comment explaining that real authentication must be implemented securely on a backend later.
- Do not build a fake security system or claim that users have real protected accounts.

The demo should work when opened locally in a browser.

## 5. Dashboard

Include:
- A concise project introduction.
- Navigation to all workspace pages.
- A prominent upload button.
- Three simple workflow steps: Upload, Analyze, Review.
- A small project status section showing what works now and what is planned.
- A clear notice that AI classification is not connected yet.

Do not clutter the dashboard with unnecessary charts, statistics, or fake patient data.

## 6. Upload page

Implement:
- PNG and JPEG file selection.
- A clean upload area.
- Image preview after selection.
- Filename and file size display.
- A remove or replace image option.
- Basic validation for file type and size.
- Friendly error messages.

Use vanilla JavaScript and the browser File API. If the image must be shared between pages, use a simple, clearly documented temporary approach suitable for a small demo image.

Do not upload images to an external server.

Add a privacy notice asking users to use sample or de-identified images.

## 7. Image analysis page

Display the selected image and provide a few beginner-friendly visual controls:
- Brightness.
- Contrast.
- Grayscale preview.
- Reset adjustments.

Use simple JavaScript and CSS filters for this initial demonstration.

Clearly state that these browser display effects are not medical image enhancement algorithms and do not detect disease.

Do not fabricate AI predictions or disease probabilities.

## 8. Results page

Create a professional sample report layout containing:
- Image filename.
- Workflow status.
- Processing details.
- A classification section that says "Not available yet".
- Future integration notes.
- An educational disclaimer.

Include a simple button to download a demo report as a text file using JavaScript.

Do not present a fake Normal or Pneumonia prediction.

## 9. About page

Explain:
- Project objective.
- Technologies used.
- Current features.
- Current limitations.
- Future integration with Python.
- Possible future integration of a suitable pretrained image-classification model.

Mention that real classification will require an appropriate labeled dataset, model evaluation, and careful validation.

## 10. Code quality

This is a beginner project, so prioritize clarity over cleverness.

- Use meaningful filenames and variable names.
- Add comments explaining important JavaScript functions.
- Keep functions small and understandable.
- Avoid unnecessary abstractions, complex state management, and advanced patterns.
- Reuse the shared CSS stylesheet.
- Avoid duplicating large sections of code.
- Keep dependencies at zero.
- Ensure all navigation links work.
- Handle empty file selection and invalid uploads gracefully.
- Ensure that no buttons are merely decorative if they appear interactive.

## 11. Required project structure

Use this structure:

```text
medical-image-analysis-frontend/
├── index.html
├── login.html
├── signup.html
├── upload.html
├── analysis.html
├── results.html
├── about.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── README.md
```

You may make a small adjustment if it clearly improves simplicity.

## 12. README.md

Write a beginner-friendly README that includes:
- Project overview.
- Features.
- Folder structure.
- How to open and run the project.
- How to use the upload and analysis pages.
- Explanation of the authentication demo.
- Explanation of the JavaScript file.
- Current limitations.
- Future Python integration plan.
- Medical disclaimer.

The project must run without installing packages.

## 13. Final requirements

Before finishing:
1. Check that all pages and links work.
2. Check the forms and upload flow.
3. Check that the interface works on smaller screens.
4. Check that the JavaScript contains no missing element references.
5. Ensure there are no fake diagnostic results.
6. Explain the purpose of every file in simple language.
7. Provide the complete code for every file.
8. Package all project files into a ZIP archive that I can download.

Keep the scope small. Do not add features just to make the project appear more advanced.

Start by presenting the proposed folder structure and a brief design plan. Then build the files and verify the project.