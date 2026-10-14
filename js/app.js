/* ============================================================
   MedScope — shared JavaScript
   Vanilla JS, no libraries. One file for all pages.

   What it does, per page:
   - Every workspace page: builds the left sidebar nav.
   - login.html / signup.html: demo form validation (no security).
   - upload.html: PNG/JPEG check, preview, temporary tab storage.
   - analysis.html: brightness / contrast / grayscale display filters.
   - results.html: sample report text + .txt download.

   NOTE ON AUTH (demo only):
   These sign-in screens are for demonstration. There is no real
   checking of passwords here, and passwords are never stored.
   Only a display name is kept in sessionStorage for the open tab.
   Real authentication must be implemented securely on a backend
   (for example Python + Flask/FastAPI) later.
   ============================================================ */

"use strict";

/* ---- Small shared settings ---- */

var MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB limit (matches upload page text)
var ALLOWED_TYPES = ["image/png", "image/jpeg"];
var IMAGE_KEY = "medscope_image";   // temporary image kept in this tab only
var USER_KEY = "medscope_user";     // demo display name only, never a password
var FILTERS_KEY = "medscope_filters";
var REPORT_KEY = "medscope_report_viewed"; // "1" once the sample report was opened

/* ---- Tiny DOM helper: get element by id, or null ---- */

function byId(id) {
  return document.getElementById(id);
}

/* ---- Sidebar navigation (workspace pages only) ---- */

// Pages that share the sidebar. body[data-page] tells us which is active.
// "dashboard" is index.html.
var NAV_LINKS = [
  { page: "dashboard", label: "Overview", href: "index.html" },
  { page: "upload", label: "Upload", href: "upload.html" },
  { page: "analysis", label: "Analysis", href: "analysis.html" },
  { page: "results", label: "Results", href: "results.html" },
  { page: "about", label: "About", href: "about.html" }
];

function readUser() {
  try {
    var raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Sidebar checkmarks: Upload done when an image is stored, Analysis done
// when the display was adjusted, Results done when the report was opened.
function progressTickFor(page) {
  if (page === "upload") {
    var image = readImage();
    return !!(image && image.dataUrl);
  }
  if (page === "analysis") {
    return filtersChanged(readFilters());
  }
  if (page === "results") {
    try {
      return sessionStorage.getItem(REPORT_KEY) === "1";
    } catch (e) {
      return false;
    }
  }
  return false;
}

function buildSidebar() {
  var mount = byId("nav-root");
  if (!mount) return; // auth pages have no sidebar — nothing to do

  var current = document.body.getAttribute("data-page");
  var user = readUser();

  var aside = document.createElement("aside");
  aside.className = "sidebar";
  aside.setAttribute("aria-label", "Main navigation");

  // Top bar: brand on the left, menu button on the right (mobile only).
  var topbar = document.createElement("div");
  topbar.className = "sidebar-topbar";

  var brand = document.createElement("div");
  brand.className = "sidebar-brand";
  brand.innerHTML = "<strong>MedScope</strong><span>Student project demo</span>";

  var toggle = document.createElement("button");
  toggle.className = "menu-toggle";
  toggle.type = "button";
  toggle.textContent = "Menu";
  toggle.setAttribute("aria-expanded", "false");
  toggle.addEventListener("click", function () {
    var open = aside.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  topbar.appendChild(brand);
  topbar.appendChild(toggle);
  aside.appendChild(topbar);

  // Nav links.
  var nav = document.createElement("nav");
  nav.className = "sidebar-nav";
  NAV_LINKS.forEach(function (link) {
    var a = document.createElement("a");
    a.href = link.href;
    a.textContent = link.label;
    if (link.page === current) {
      a.className = "active";
      a.setAttribute("aria-current", "page");
    }
    if (progressTickFor(link.page)) {
      var tick = document.createElement("span");
      tick.className = "tick";
      tick.textContent = "✓";
      tick.title = "Done";
      a.appendChild(tick);
    }
    nav.appendChild(a);
  });
  aside.appendChild(nav);

  // Footer: who is "signed in" (demo) + sign out button.
  var footer = document.createElement("div");
  footer.className = "sidebar-footer";
  if (user && (user.name || user.email)) {
    var line = document.createElement("p");
    line.className = "user-line";
    line.textContent = "Demo user: " + (user.name || user.email);
    footer.appendChild(line);

    var out = document.createElement("button");
    out.type = "button";
    out.className = "btn btn-secondary btn-block";
    out.textContent = "Sign out";
    out.addEventListener("click", function () {
      sessionStorage.removeItem(USER_KEY);
      window.location.href = "login.html";
    });
    footer.appendChild(out);
  } else {
    var hint = document.createElement("p");
    hint.className = "user-line";
    hint.textContent = "Browsing as guest (demo).";
    footer.appendChild(hint);

    var signIn = document.createElement("a");
    signIn.href = "login.html";
    signIn.className = "btn btn-secondary btn-block";
    signIn.textContent = "Sign in";
    footer.appendChild(signIn);
  }
  aside.appendChild(footer);

  mount.appendChild(aside);
}

/* ---- Tab icon (stops /favicon.ico 404s when served) ---- */

function ensureFavicon() {
  if (document.querySelector('link[rel="icon"]')) return;
  var icon = document.createElement("link");
  icon.rel = "icon";
  icon.href = "data:image/svg+xml," +
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>" +
    "<rect width='32' height='32' rx='7' fill='%232f6b4f'/>" +
    "<text x='16' y='22' font-family='Arial' font-size='17' font-weight='bold' " +
    "fill='white' text-anchor='middle'>M</text></svg>";
  document.head.appendChild(icon);
}

/* ---- Dashboard: continue where you left off ---- */

function initDashboard() {
  var box = byId("continue-box");
  if (!box) return; // not on the dashboard
  var image = readImage();
  if (!image || !image.dataUrl) return; // fresh start — nothing to continue

  var viewed = false;
  try {
    viewed = sessionStorage.getItem(REPORT_KEY) === "1";
  } catch (e) {
    // storage unavailable — fall through to the analysis link
  }

  var note = document.createElement("div");
  note.className = "notice";
  var line = document.createElement("p");
  var link = document.createElement("a");
  if (viewed) {
    line.textContent = "Welcome back — your sample report is ready: ";
    link.href = "results.html";
    link.textContent = "Review your report";
  } else {
    line.textContent = "Welcome back — your image is still in this tab: ";
    link.href = "analysis.html";
    link.textContent = "Continue to analysis";
  }
  line.appendChild(link);
  note.appendChild(line);
  box.appendChild(note);
}

/* ---- Demo auth forms ---- */

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function setError(id, message) {
  var el = byId(id);
  if (el) el.textContent = message || "";
}

// Sign-in: checks format only, stores display info only, then continues.
function initSignIn() {
  var form = byId("signin-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var email = byId("email").value.trim();
    var password = byId("password").value;

    var ok = true;
    if (!isValidEmail(email)) {
      setError("email-error", "Enter a valid email address.");
      ok = false;
    } else {
      setError("email-error", "");
    }
    if (!password) {
      setError("password-error", "Enter your password.");
      ok = false;
    } else {
      setError("password-error", "");
    }
    if (!ok) return;

    // Demo only: never store or check the password.
    var name = email.split("@")[0];
    sessionStorage.setItem(USER_KEY, JSON.stringify({ name: name, email: email }));
    window.location.href = "index.html";
  });
}

// Sign-up: validates name/email/password, keeps name only, then continues.
function initSignUp() {
  var form = byId("signup-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = byId("name").value.trim();
    var email = byId("email").value.trim();
    var password = byId("password").value;

    var ok = true;
    if (name.length < 2) {
      setError("name-error", "Enter your name (at least 2 characters).");
      ok = false;
    } else {
      setError("name-error", "");
    }
    if (!isValidEmail(email)) {
      setError("email-error", "Enter a valid email address.");
      ok = false;
    } else {
      setError("email-error", "");
    }
    if (password.length < 8) {
      setError("password-error", "Password must be at least 8 characters.");
      ok = false;
    } else {
      setError("password-error", "");
    }
    if (!ok) return;

    // Demo only: the password is discarded, never stored anywhere.
    sessionStorage.setItem(USER_KEY, JSON.stringify({ name: name, email: email }));
    window.location.href = "index.html";
  });
}

/* ---- Temporary image storage (this browser tab only) ---- */

// The image is kept in sessionStorage as a small data URL so the
// upload, analysis and results pages can share it without a server.
// It disappears when the tab closes and only suits small demo images.
function readImage() {
  try {
    var raw = sessionStorage.getItem(IMAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveImage(info) {
  try {
    sessionStorage.setItem(IMAGE_KEY, JSON.stringify(info));
    return true;
  } catch (e) {
    return false; // e.g. image too large for storage
  }
}

function clearImage() {
  sessionStorage.removeItem(IMAGE_KEY);
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

/* ---- Upload page ---- */

function showUploadMessage(text, isError) {
  var box = byId("upload-message");
  if (!box) return;
  if (!text) {
    box.hidden = true;
    box.textContent = "";
    box.classList.remove("notice-error");
    return;
  }
  box.hidden = false;
  box.textContent = text;
  box.classList.toggle("notice-error", !!isError);
}

function showPreview(info) {
  var panel = byId("preview-panel");
  var img = byId("preview-image");
  if (!panel || !img) return;
  img.src = info.dataUrl;
  byId("file-name").textContent = info.name;
  byId("file-type").textContent = info.type;
  byId("file-size").textContent = formatBytes(info.size);
  panel.hidden = false;
  fillDimensions(info);
}

// Reads real pixel dimensions with an Image object, shows them on the
// upload or results page, and saves them for the other pages to reuse.
function fillDimensions(info) {
  var el = byId("file-dimensions");
  if (!el) el = byId("result-dimensions");
  if (!el) return;
  if (info.width && info.height) {
    var mp = (info.width * info.height / 1000000).toFixed(1);
    el.textContent = info.width + " × " + info.height + " px (" + mp + " MP)";
    return;
  }
  el.textContent = "Measuring…";
  var probe = new Image();
  probe.onload = function () {
    info.width = probe.naturalWidth;
    info.height = probe.naturalHeight;
    saveImage(info); // keep dimensions for the other pages
    var mp2 = (info.width * info.height / 1000000).toFixed(1);
    el.textContent = info.width + " × " + info.height + " px (" + mp2 + " MP)";
  };
  probe.onerror = function () {
    el.textContent = "Unknown";
  };
  probe.src = info.dataUrl;
}

function hidePreview() {
  var panel = byId("preview-panel");
  var img = byId("preview-image");
  if (panel) panel.hidden = true;
  if (img) img.removeAttribute("src");
}

function handleFile(file) {
  if (!file) {
    showUploadMessage("No file selected. Please choose a PNG or JPEG image.", true);
    return;
  }
  if (ALLOWED_TYPES.indexOf(file.type) === -1) {
    showUploadMessage("That file type is not supported. Please choose a PNG or JPEG image.", true);
    return;
  }
  if (file.size > MAX_FILE_SIZE) {
    showUploadMessage("That image is larger than 2 MB. Please choose a smaller file.", true);
    return;
  }

  var reader = new FileReader();
  reader.onload = function () {
    var info = { name: file.name, type: file.type, size: file.size, dataUrl: reader.result };
    if (!saveImage(info)) {
      showUploadMessage("The image was read but is too large to keep in this tab. Try a smaller file.", true);
      return;
    }
    // A new image resets any old display adjustments.
    sessionStorage.removeItem(FILTERS_KEY);
    showUploadMessage("", false);
    showPreview(info);
  };
  reader.onerror = function () {
    showUploadMessage("The file could not be read. Please try again.", true);
  };
  reader.readAsDataURL(file);
}

function initUpload() {
  var input = byId("file-input");
  if (!input) return; // not on the upload page

  var dropArea = byId("drop-area");
  var chooseButton = byId("choose-button");

  if (chooseButton) {
    chooseButton.addEventListener("click", function () {
      input.click();
    });
  }

  var replaceButton = byId("replace-button");
  if (replaceButton) {
    replaceButton.addEventListener("click", function () {
      input.click();
    });
  }

  var removeButton = byId("remove-button");
  if (removeButton) {
    removeButton.addEventListener("click", function () {
      clearImage();
      sessionStorage.removeItem(FILTERS_KEY);
      input.value = "";
      hidePreview();
      showUploadMessage("Image removed. Choose another image when ready.", false);
    });
  }

  input.addEventListener("change", function () {
    handleFile(input.files && input.files[0]);
    input.value = ""; // allow picking the same file again
  });

  // Drag and drop support (same validation as file picker).
  if (dropArea) {
    dropArea.addEventListener("dragover", function (event) {
      event.preventDefault();
      dropArea.classList.add("drag-over");
    });
    dropArea.addEventListener("dragleave", function () {
      dropArea.classList.remove("drag-over");
    });
    dropArea.addEventListener("drop", function (event) {
      event.preventDefault();
      dropArea.classList.remove("drag-over");
      var files = event.dataTransfer && event.dataTransfer.files;
      handleFile(files && files[0]);
    });
  }

  // If an image was already chosen earlier in this tab, show it again.
  var existing = readImage();
  if (existing && existing.dataUrl) {
    showPreview(existing);
  }
}

/* ---- Analysis page (display filters only, no diagnosis) ---- */

function defaultFilters() {
  return { brightness: 100, contrast: 100, grayscale: false, zoom: 100, rotation: 0 };
}

// Read a number setting safely, keeping it inside an allowed range so a
// damaged stored value can never break the sliders.
function asNumber(value, fallback, min, max) {
  var n = Number(value);
  if (isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function readFilters() {
  try {
    var raw = sessionStorage.getItem(FILTERS_KEY);
    if (!raw) return defaultFilters();
    var parsed = JSON.parse(raw);
    return {
      brightness: asNumber(parsed.brightness, 100, 50, 150),
      contrast: asNumber(parsed.contrast, 100, 50, 150),
      grayscale: !!parsed.grayscale,
      zoom: asNumber(parsed.zoom, 100, 50, 200),
      rotation: asNumber(parsed.rotation, 0, 0, 359)
    };
  } catch (e) {
    return defaultFilters();
  }
}

function applyFilters(img, filters) {
  var gray = filters.grayscale ? "100%" : "0%";
  img.style.filter =
    "brightness(" + filters.brightness + "%) " +
    "contrast(" + filters.contrast + "%) " +
    "grayscale(" + gray + ")";
}

// Zoom and rotation are display transforms, like the filters above:
// they change viewing only, never the stored file.
function applyTransform(img, filters) {
  img.style.transform =
    "scale(" + filters.zoom / 100 + ") rotate(" + filters.rotation + "deg)";
}

function initAnalysis() {
  var img = byId("analysis-image");
  if (!img) return; // not on the analysis page

  var info = readImage();
  var emptyBox = byId("analysis-empty");
  var content = byId("analysis-content");

  if (!info || !info.dataUrl) {
    // No image yet: point the user back to upload.
    if (emptyBox) emptyBox.hidden = false;
    if (content) content.hidden = true;
    return;
  }
  if (emptyBox) emptyBox.hidden = true;
  if (content) content.hidden = false;
  img.src = info.dataUrl;

  var brightness = byId("brightness-slider");
  var brightnessValue = byId("brightness-value");
  var contrast = byId("contrast-slider");
  var contrastValue = byId("contrast-value");
  var grayscale = byId("grayscale-checkbox");
  var resetButton = byId("reset-button");

  var filters = readFilters();
  var zoom = byId("zoom-slider");
  var zoomValue = byId("zoom-value");
  var rotateLabel = byId("rotate-label");
  var rotateLeft = byId("rotate-left-button");
  var rotateRight = byId("rotate-right-button");
  var compareButton = byId("compare-button");

  function refresh(save) {
    brightness.value = filters.brightness;
    contrast.value = filters.contrast;
    grayscale.checked = filters.grayscale;
    brightnessValue.textContent = filters.brightness + "%";
    contrastValue.textContent = filters.contrast + "%";
    if (zoom) zoom.value = filters.zoom;
    if (zoomValue) zoomValue.textContent = filters.zoom + "%";
    if (rotateLabel) rotateLabel.textContent = "Rotate (" + filters.rotation + "°)";
    applyFilters(img, filters);
    applyTransform(img, filters);
    if (save) {
      sessionStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
    }
  }

  brightness.addEventListener("input", function () {
    filters.brightness = Number(brightness.value);
    refresh(true);
  });
  contrast.addEventListener("input", function () {
    filters.contrast = Number(contrast.value);
    refresh(true);
  });
  grayscale.addEventListener("change", function () {
    filters.grayscale = grayscale.checked;
    refresh(true);
  });
  if (zoom) {
    zoom.addEventListener("input", function () {
      filters.zoom = Number(zoom.value);
      refresh(true);
    });
  }
  if (rotateLeft) {
    rotateLeft.addEventListener("click", function () {
      filters.rotation = (filters.rotation + 270) % 360;
      refresh(true);
    });
  }
  if (rotateRight) {
    rotateRight.addEventListener("click", function () {
      filters.rotation = (filters.rotation + 90) % 360;
      refresh(true);
    });
  }
  if (resetButton) {
    resetButton.addEventListener("click", function () {
      filters = defaultFilters();
      refresh(true);
    });
  }

  // Hold-to-compare: while the button is held down, show the untouched
  // original; release to go back to the adjusted view.
  function showOriginal() {
    img.style.filter = "none";
    img.style.transform = "none";
  }
  function showAdjusted() {
    applyFilters(img, filters);
    applyTransform(img, filters);
  }
  if (compareButton) {
    compareButton.addEventListener("pointerdown", showOriginal);
    ["pointerup", "pointerleave", "pointercancel", "blur"].forEach(function (evt) {
      compareButton.addEventListener(evt, showAdjusted);
    });
    // Keyboard: holding Space or Enter shows the original too.
    compareButton.addEventListener("keydown", function (event) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        showOriginal();
      }
    });
    compareButton.addEventListener("keyup", showAdjusted);
  }

  refresh(false);
  drawHistogram(info.dataUrl);
}

/* ---- Brightness histogram (real pixel counts, not a diagnosis) ---- */

// Draws a simple 32-bin grayscale histogram of the ORIGINAL image on
// #histogram-canvas. It only counts dark vs. light pixels so students can
// talk about exposure — it says nothing about disease.
function drawHistogram(dataUrl) {
  var canvas = byId("histogram-canvas");
  if (!canvas || !canvas.getContext) return;
  var picture = new Image();
  picture.onload = function () {
    try {
      var sampleWidth = 120;
      var sampleHeight = Math.max(1, Math.round((picture.naturalHeight / picture.naturalWidth) * sampleWidth));
      var sampler = document.createElement("canvas");
      sampler.width = sampleWidth;
      sampler.height = sampleHeight;
      var sampleCtx = sampler.getContext("2d");
      sampleCtx.drawImage(picture, 0, 0, sampleWidth, sampleHeight);
      var pixels = sampleCtx.getImageData(0, 0, sampleWidth, sampleHeight).data;

      var BIN_COUNT = 32;
      var bins = [];
      var i, b;
      for (i = 0; i < BIN_COUNT; i++) bins.push(0);
      for (i = 0; i < pixels.length; i += 4) {
        var gray = Math.round(0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]);
        b = Math.min(BIN_COUNT - 1, Math.floor((gray / 256) * BIN_COUNT));
        bins[b]++;
      }

      var ctx = canvas.getContext("2d");
      var W = canvas.width;
      var H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      var max = 1;
      for (i = 0; i < BIN_COUNT; i++) max = Math.max(max, bins[i]);
      var barWidth = W / BIN_COUNT;
      ctx.fillStyle = "#2f6b4f";
      for (i = 0; i < BIN_COUNT; i++) {
        var barHeight = Math.round((bins[i] / max) * (H - 22));
        ctx.fillRect(Math.floor(i * barWidth) + 1, H - 16 - barHeight, Math.ceil(barWidth) - 2, barHeight);
      }
      // Axis labels: dark on the left, bright on the right.
      ctx.fillStyle = "#5d6570";
      ctx.font = "10px sans-serif";
      ctx.fillText("dark", 2, H - 3);
      ctx.fillText("bright", W - 34, H - 3);
    } catch (e) {
      // Canvas blocked (rare) — the page works fine without the chart.
    }
  };
  picture.src = dataUrl;
}

/* ---- Results page (sample report, no predictions) ---- */

function filtersChanged(filters) {
  return filters.brightness !== 100 || filters.contrast !== 100 || filters.grayscale ||
    filters.zoom !== 100 || filters.rotation !== 0;
}

function describeAdjustments(filters) {
  var parts = [
    "Brightness " + filters.brightness + "%",
    "Contrast " + filters.contrast + "%",
    "Grayscale " + (filters.grayscale ? "on" : "off"),
    "Zoom " + filters.zoom + "%",
    "Rotation " + filters.rotation + "°"
  ];
  return parts.join(", ") + " (screen display only)";
}

function initResults() {
  var emptyBox = byId("results-empty");
  var content = byId("results-content");
  if (!emptyBox || !content) return; // not on the results page

  var info = readImage();
  if (!info || !info.dataUrl) {
    emptyBox.hidden = false;
    content.hidden = true;
    return;
  }
  emptyBox.hidden = true;
  content.hidden = false;

  byId("result-filename").textContent = info.name || "Unknown file";
  byId("result-type").textContent = info.type || "Unknown type";
  byId("result-size").textContent = formatBytes(info.size || 0);
  fillDimensions(info); // shows saved dimensions, measures if missing

  // Remember that the report was opened, so the sidebar can tick it off.
  try {
    sessionStorage.setItem(REPORT_KEY, "1");
  } catch (e) {
    // storage unavailable — the page still works
  }

  var filters = readFilters();
  byId("result-review-status").textContent = filtersChanged(filters)
    ? "Display adjusted"
    : "Viewed with default display";
  byId("result-adjustments").textContent = describeAdjustments(filters);

  var downloadButton = byId("download-report-button");
  if (downloadButton) {
    downloadButton.addEventListener("click", function () {
      var lines = [
        "MEDSCOPE — DEMO REPORT (SAMPLE ONLY)",
        "====================================",
        "",
        "File name: " + (info.name || "Unknown"),
        "Type: " + (info.type || "Unknown"),
        "Size: " + formatBytes(info.size || 0),
        "Dimensions: " + (info.width && info.height ? info.width + " x " + info.height + " px" : "Unknown"),
        "",
        "Workflow status:",
        "- Upload: Complete",
        "- Visual review: " + byId("result-review-status").textContent,
        "- Classification: Not connected",
        "",
        "Processing details:",
        "- Display adjustments: " + describeAdjustments(filters),
        "- Server-side processing: None",
        "- AI model: None",
        "",
        "Classification: Not available yet",
        "No model is connected, so this report contains no Normal or",
        "Pneumonia result and no probability.",
        "",
        "Future integration notes:",
        "- A Python backend will receive the image and prepare it.",
        "- A pretrained image-classification model may be adapted",
        "  for Normal vs. Pneumonia.",
        "- Real use needs a labeled dataset, model evaluation and",
        "  careful validation.",
        "",
        "Disclaimer: educational demo only. Not for diagnosis or",
        "any medical decision."
      ];
      var blob = new Blob([lines.join("\n")], { type: "text/plain" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = "medscope-demo-report.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    });
  }

  var printButton = byId("print-report-button");
  if (printButton) {
    printButton.addEventListener("click", function () {
      window.print();
    });
  }
}

/* ---- Start everything after the page loads ---- */

document.addEventListener("DOMContentLoaded", function () {
  ensureFavicon();
  buildSidebar();
  initDashboard();
  initSignIn();
  initSignUp();
  initUpload();
  initAnalysis();
  initResults();
});
