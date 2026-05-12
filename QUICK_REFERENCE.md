# Quick Reference: Setup Functions

## Frontend Setup Function

### `setupFormBackend()`
**Location:** index.html (auto-defined in script)  
**Purpose:** Configure the Apps Script URL in browser

**Usage:**
```javascript
// Option 1: Call in browser console
setupFormBackend()

// Option 2: Create a setup button in HTML
<button onclick="setupFormBackend()">Configure Backend</button>
```

**What it does:**
1. Shows a prompt for Apps Script Web App URL
2. Validates the URL
3. Saves to `localStorage` for persistence
4. Reloads page on success

**Example:**
```
Prompt: "Enter your Google Apps Script Web App URL:"
Input: https://script.google.com/macros/s/AKfy...../exec
Result: ✓ Setup complete! Saved to browser storage.
```

---

## Backend Setup Function

### `setupBackend()`
**Location:** Code.gs (run in Apps Script editor)  
**Purpose:** Auto-configure Google Drive resume folder

**How to run:**
1. Open Code.gs in Apps Script editor
2. Top-left dropdown: Select `setupBackend`
3. Click ▶️ **Run** button
4. Grant permissions when prompted

**Menu Options:**
```
Choose an option:
[1] Create a new 'IIEC Resumes' folder
[2] Use an existing folder (paste ID)
```

**Option 1 - Create New:**
- Creates "IIEC Resumes" folder in your Drive
- Automatically extracts and saves folder ID
- No manual ID copying needed

**Option 2 - Use Existing:**
- Prompts for existing folder ID
- Verifies folder exists and is accessible
- Saves ID to script properties

**Execution Log Example:**
```
🔧 Starting IIEC Backend Setup...
📁 Creating new folder...
✓ Created folder: IIEC Resumes
✓ Folder ID: 1AbCdEfGhIjKlMnOpQrStUv
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ SETUP COMPLETE!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Folder ID saved: 1AbCdEfGhIjKlMnOpQrStUv
```

---

## Setup Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│           INITIAL SETUP (One-Time)                       │
└─────────────────────────────────────────────────────────┘
           
    Backend (Google Apps Script)
    ┌───────────────────────────┐
    │  1. Create Google Sheet    │ → "Applications" tab
    │  2. Deploy Code.gs as Web  │ → Get Web App URL
    │  3. Run setupBackend()     │ → Configure folder
    └───────────────────────────┘
                ↓
         Copy Web App URL
                ↓
    Frontend (index.html)
    ┌───────────────────────────┐
    │  Call setupFormBackend()   │
    │  Paste Web App URL        │
    │  ✓ Saved to localStorage  │
    └───────────────────────────┘
                ↓
        Form is Ready to Use!

┌─────────────────────────────────────────────────────────┐
│           ON FORM SUBMISSION                             │
└─────────────────────────────────────────────────────────┘

    User fills form → Click Submit
                ↓
    Form validation (JavaScript)
                ↓
    Resume → Base64 encode (fileToBase64)
                ↓
    POST to APPS_SCRIPT_URL (Code.gs)
                ↓
    doPost() function receives data
                ↓
    Two parallel operations:
    ├─→ saveResumeToDrive() → Upload to "IIEC Resumes"
    └─→ getOrCreateSheet() → Append row to sheet
                ↓
    Return success response
                ↓
    Form clears, shows ✓ Success message
```

---

## localStorage Management

### View stored URL
```javascript
// In browser console
localStorage.getItem("APPS_SCRIPT_URL")
```

### Clear storage (resets setup)
```javascript
localStorage.clear()
// Or just clear this key:
localStorage.removeItem("APPS_SCRIPT_URL")
```

### Manually set URL (if needed)
```javascript
localStorage.setItem("APPS_SCRIPT_URL", "https://script.google.com/macros/s/...exec")
```

---

## Common Commands

### Test Backend Health
```javascript
// Visit this URL in browser to check if deployed:
https://script.google.com/macros/s/YOUR_ID/exec

// Should return:
{
  "status": "running",
  "service": "IIEC Internship Form Backend",
  "version": "1.0"
}
```

### Check Folder ID Format
```
Valid: 1AbCdEfGhIjKlMnOpQrStUv (25-32 chars, alphanumeric+dash)
From URL: https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrStUv
                                           ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
```

### Verify Deployment
```
In Apps Script:
- Deploy → Manage Deployments
- Should show 1 active Web App deployment
- Status: "Last version deployed"
```

---

## Error Messages & Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| "Setup Required" | URL not configured | Run `setupFormBackend()` |
| "Folder not found" | Invalid Folder ID | Run `setupBackend()` again |
| "Permission denied" | Not sheet owner | Use account that owns sheet |
| "Base64 decode error" | Corrupted file | Try different file format |
| Form won't submit | localStorage issue | Clear cache, reload |

---

## Next: Auto-Setup in Production

**Future enhancement:**
Add a setup button to the form that calls setupFormBackend() automatically:

```html
<div style="background: #fff3cd; padding: 16px; margin-bottom: 20px; border-radius: 8px;">
  <strong>⚙️ First time?</strong>
  <p>Configure your backend: <button onclick="setupFormBackend()" class="btn">Setup Now</button></p>
</div>
```

This makes it user-friendly — no console commands needed!
