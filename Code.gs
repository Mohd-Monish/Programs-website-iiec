// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║           IIEC MARKETING INTERNSHIP — GOOGLE APPS SCRIPT BACKEND            ║
// ║              Receives form submissions → Google Sheets + Drive               ║
// ╚══════════════════════════════════════════════════════════════════════════════╝
//
// ┌─────────────────────────────────────────────────────────────────────────────┐
// │                        HOW TO SET UP & DEPLOY                               │
// ├─────────────────────────────────────────────────────────────────────────────┤
// │                                                                              │
// │  STEP 1 — Open Google Sheets                                                 │
// │    • Go to drive.google.com and open (or create) a new Google Sheet.        │
// │    • Give it a name e.g. "IIEC Internship Applications 2026".               │
// │                                                                              │
// │  STEP 2 — Create the Resume Folder in Google Drive                           │
// │    • Go to drive.google.com → New → Folder.                                 │
// │    • Name it: "IIEC Resumes"  (or anything you prefer).                     │
// │    • Open that folder. Look at the URL — it will look like:                 │
// │        https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUv       │
// │    • Copy the long ID at the end:  1AbCdEfGhIjKlMnOpQrStUv                 │
// │    • Paste it below where it says: RESUME_FOLDER_ID = "..."                 │
// │                                                                              │
// │  STEP 3 — Open Apps Script Editor                                            │
// │    • Inside your Google Sheet, click the top menu:                           │
// │        Extensions  →  Apps Script                                            │
// │    • A new tab opens with the script editor.                                 │
// │    • DELETE all existing code in the editor.                                 │
// │    • PASTE this entire file into the editor.                                 │
// │    • Fill in RESUME_FOLDER_ID (see Step 2).                                  │
// │    • Click the 💾 Save icon (or Ctrl + S / Cmd + S).                        │
// │                                                                              │
// │  STEP 4 — Deploy as a Web App                                                │
// │    • Click the blue "Deploy" button (top-right) → "New Deployment".         │
// │    • Click the gear icon ⚙ next to "Select type" → choose "Web App".        │
// │    • Fill in the fields:                                                     │
// │        Description      →  IIEC Form Backend v1                             │
// │        Execute as       →  Me  (your Google account)                        │
// │        Who has access   →  Anyone                                            │
// │    • Click "Deploy".                                                         │
// │    • A popup asks you to "Authorize access" — click it and allow all        │
// │      permissions (this lets the script write to Sheets and Drive).           │
// │                                                                              │
// │  STEP 5 — Copy the Web App URL                                               │
// │    • After deploying, a box shows your Web App URL, something like:          │
// │        https://script.google.com/macros/s/AKfy.../exec                      │
// │    • Copy that full URL.                                                     │
// │                                                                              │
// │  STEP 6 — Paste URL into index.html                                          │
// │    • Open your index.html file.                                              │
// │    • Find this line near the top of the <script> section:                   │
// │        const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL_HERE";                 │
// │    • Replace the placeholder with your actual URL from Step 5.              │
// │                                                                              │
// │  STEP 7 — Test It                                                            │
// │    • Open your website, fill in the form, and submit.                       │
// │    • Check your Google Sheet — a new row should appear instantly.           │
// │    • Check the "IIEC Resumes" folder — the resume should be there,          │
// │      renamed as:  FullName_EnrollmentNo_Resume.pdf                          │
// │                                                                              │
// │  ⚠  IMPORTANT — Re-deploy after any code changes:                           │
// │    • Each time you edit this script, click Deploy → Manage Deployments.     │
// │    • Click the pencil ✏ icon → set Version to "New version" → Update.       │
// │    • The URL stays the same — no need to update index.html again.           │
// │                                                                              │
// └─────────────────────────────────────────────────────────────────────────────┘

// ══════════════════════════════════════════════════════
//  setupBackend — Auto-setup function (run once manually)
// ══════════════════════════════════════════════════════

/**
 * AUTO-SETUP FUNCTION — Run this once to configure the backend:
 *
 * 1. Open this script in Apps Script editor
 * 2. Click "setupBackend" in the functions dropdown, then ▶ Run
 * 3. Grant permissions when prompted
 * 4. Follow the prompts to create/select your resume folder
 * 5. The folder ID will be automatically saved to the script
 *
 * No need to manually edit RESUME_FOLDER_ID after running this!
 */
function setupBackend() {
  Logger.log("🔧 Starting IIEC Backend Setup...");

  var userChoice = UI_prompt("Resume Folder Setup",
    "Choose an option:\n\n" +
    "[1] Create a new 'IIEC Resumes' folder\n" +
    "[2] Use an existing folder (paste ID)"
  );

  if (!userChoice) {
    Logger.log("Setup cancelled.");
    return;
  }

  var folderId = "";

  if (userChoice === "1") {
    // Create new folder
    Logger.log("📁 Creating new folder...");
    try {
      var newFolder = DriveApp.createFolder("IIEC Resumes");
      folderId = newFolder.getId();
      Logger.log("✓ Created folder: IIEC Resumes");
      Logger.log("✓ Folder ID: " + folderId);
    } catch (err) {
      Logger.log("✗ Error creating folder: " + err);
      return;
    }
  } else if (userChoice === "2") {
    // Use existing folder
    folderId = UI_prompt("Existing Folder",
      "Paste your Google Drive folder ID:\n\n" +
      "You can find it in the folder URL:\n" +
      "https://drive.google.com/drive/folders/FOLDER_ID_HERE"
    );

    if (!folderId) {
      Logger.log("Setup cancelled — no folder ID provided.");
      return;
    }

    // Verify folder exists
    try {
      var folder = DriveApp.getFolderById(folderId);
      Logger.log("✓ Verified existing folder: " + folder.getName());
    } catch (err) {
      Logger.log("✗ Folder not found. Check your ID and permissions.");
      return;
    }
  } else {
    Logger.log("Invalid choice.");
    return;
  }

  // Save the folder ID to script properties
  PropertiesService.getScriptProperties().setProperty("RESUME_FOLDER_ID", folderId);
  RESUME_FOLDER_ID = folderId;

  Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  Logger.log("✓ SETUP COMPLETE!");
  Logger.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  Logger.log("Folder ID saved: " + folderId);
  Logger.log("");
  Logger.log("Next steps:");
  Logger.log("1. Deploy this script as a Web App (if not already done)");
  Logger.log("2. Copy the Web App URL");
  Logger.log("3. Open your website and call: setupFormBackend()");
  Logger.log("4. Paste the Web App URL");
  Logger.log("5. Test the form!");
}

// ──────────────────────────────────────────────────────────
// UI Helper — Simpler interface for prompts
function UI_prompt(title, message) {
  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt(message, ui.ButtonSet.OK_CANCEL);
  if (result.getSelectedButton() == ui.Button.OK) {
    return result.getResponseText();
  }
  return null;
}

// ══════════════════════════════════════════════════════
//  Load resume folder ID from storage on script start
// ══════════════════════════════════════════════════════

var RESUME_FOLDER_ID = PropertiesService.getScriptProperties().getProperty("RESUME_FOLDER_ID")
                       || "YOUR_DRIVE_FOLDER_ID_HERE";
var SHEET_NAME = "Applications";




// ══════════════════════════════════════════════════════
//  doPost — Main entry point (called when form submits)
// ══════════════════════════════════════════════════════

/**
 * Handles POST requests from the HTML form.
 * Receives applicant data + optional base64-encoded resume file,
 * saves a row to Google Sheets, uploads the resume to Drive,
 * and returns a JSON response.
 */
function doPost(e) {
  try {
    // ── 1. Parse incoming JSON payload ──────────────────────────────────────
    var payload = JSON.parse(e.postData.contents);

    var name       = sanitize(payload.name);
    var phone      = sanitize(payload.phone);
    var email      = sanitize(payload.email);
    var enrollment = sanitize(payload.enrollment);
    var dept       = sanitize(payload.dept);
    var course     = sanitize(payload.course);
    var year       = sanitize(payload.year);
    var wa         = sanitize(payload.wa);
    var why        = sanitize(payload.why);
    var referral   = sanitize(payload.referral);
    var timestamp  = new Date();

    // Resume file fields (optional — base64 encoded on the client side)
    var resumeBase64  = payload.resumeBase64  || null;
    var resumeFileName = payload.resumeFileName || null;
    var resumeMime    = payload.resumeMime    || "application/octet-stream";

    // ── 2. Upload resume to Google Drive (if provided) ───────────────────────
    var resumeUrl = "";
    if (resumeBase64 && resumeFileName) {
      resumeUrl = saveResumeToDrive(
        resumeBase64,
        resumeFileName,
        resumeMime,
        name,
        enrollment
      );
    }

    // ── 3. Write data row to Google Sheets ───────────────────────────────────
    var sheet = getOrCreateSheet();
    sheet.appendRow([
      timestamp,          // A: Timestamp
      name,               // B: Full Name
      phone,              // C: Mobile Number
      email,              // D: Email Address
      enrollment,         // E: Enrollment No
      dept,               // F: Department
      course,             // G: Course
      year,               // H: Current Year
      wa,                 // I: WhatsApp Number
      why,                // J: Why Join?
      referral,           // K: Referral Code
      resumeUrl           // L: Resume Drive Link
    ]);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, 12);

    // ── 4. Return success ────────────────────────────────────────────────────
    return buildResponse({ success: true, message: "Application received successfully!" });

  } catch (err) {
    // Log error to Apps Script execution log for debugging
    Logger.log("doPost ERROR: " + err.toString());
    return buildResponse({ success: false, message: "Server error: " + err.message });
  }
}


// ══════════════════════════════════════════════════════
//  saveResumeToDrive — Decodes & stores the resume file
// ══════════════════════════════════════════════════════

/**
 * Decodes a base64-encoded file, uploads it to the configured Drive folder,
 * and renames it as:  FirstName_LastName_EnrollmentNo_Resume.ext
 *
 * @param {string} base64Data   - Base64-encoded file content
 * @param {string} originalName - Original filename from the browser (e.g. "my_cv.pdf")
 * @param {string} mimeType     - MIME type (e.g. "application/pdf")
 * @param {string} applicantName - Applicant's full name
 * @param {string} enrollment   - Applicant's enrollment number
 * @returns {string} Public shareable URL of the uploaded file
 */
function saveResumeToDrive(base64Data, originalName, mimeType, applicantName, enrollment) {
  try {
    // Get (or verify) the target folder
    var folder = DriveApp.getFolderById(RESUME_FOLDER_ID);

    // Decode base64 → byte array → Blob
    var decodedBytes = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decodedBytes, mimeType);

    // Build a clean, human-readable filename
    //   e.g.  "Aditya Sharma" + "EN2023456" → "Aditya_Sharma_EN2023456_Resume.pdf"
    var ext       = originalName.split(".").pop().toLowerCase();
    var safeName  = applicantName
                      .replace(/[^a-zA-Z0-9 ]/g, "")   // remove special chars
                      .trim()
                      .replace(/\s+/g, "_");             // spaces → underscores
    var safeEnroll = enrollment.replace(/[^a-zA-Z0-9]/g, "");
    var newFileName = safeName + "_" + safeEnroll + "_Resume." + ext;

    // Set blob name and create file in Drive
    blob.setName(newFileName);
    var driveFile = folder.createFile(blob);

    // Make the file viewable by anyone with the link
    driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    Logger.log("Resume uploaded: " + newFileName + " → " + driveFile.getUrl());
    return driveFile.getUrl();

  } catch (err) {
    Logger.log("saveResumeToDrive ERROR: " + err.toString());
    return "Upload failed — " + err.message;
  }
}


// ══════════════════════════════════════════════════════
//  getOrCreateSheet — Returns the responses sheet tab
// ══════════════════════════════════════════════════════

/**
 * Returns the "Applications" sheet, creating it with styled headers
 * if it doesn't already exist.
 */
function getOrCreateSheet() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    // Create a fresh sheet with formatted headers
    sheet = ss.insertSheet(SHEET_NAME);

    var headers = [
      "Timestamp",
      "Full Name",
      "Mobile Number",
      "Email Address",
      "Enrollment No",
      "Department",
      "Course",
      "Current Year",
      "WhatsApp Number",
      "Why Join Internship?",
      "Referral Code",
      "Resume (Drive Link)"
    ];

    sheet.appendRow(headers);

    // Style the header row — navy background, white bold text
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0b1f5b");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(11);
    headerRange.setHorizontalAlignment("center");

    // Freeze header so it stays visible while scrolling
    sheet.setFrozenRows(1);

    // Set a comfortable row height for the header
    sheet.setRowHeight(1, 36);

    Logger.log("Created new sheet: " + SHEET_NAME);
  }

  return sheet;
}


// ══════════════════════════════════════════════════════
//  doGet — Health check (test if script is live)
// ══════════════════════════════════════════════════════

/**
 * Responds to GET requests so you can quickly verify the script is deployed.
 * Visit your Web App URL in a browser — you should see: {"status":"running"}
 */
function doGet(e) {
  return buildResponse({
    status : "running",
    service: "IIEC Internship Form Backend",
    version: "1.0"
  });
}


// ══════════════════════════════════════════════════════
//  Helpers
// ══════════════════════════════════════════════════════

/** Strips leading/trailing whitespace from a value; returns "" if null/undefined */
function sanitize(value) {
  return (value || "").toString().trim();
}

/** Returns a CORS-friendly JSON text output */
function buildResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
