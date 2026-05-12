# 🚀 Auto-Setup System — Quick Start (5 Minutes)

## What's New?
✨ **Fully Automated Setup** — Users see a setup modal on first visit. No manual configuration needed!

```
User visits website
    ↓
Setup modal appears (ONE TIME)
    ↓
User pastes Apps Script URL
    ↓
Setup saved to browser (persists forever)
    ↓
User fills form & submits
    ↓
✅ Response appears in Google Sheet!
```

---

## Backend Setup (Google Apps Script)

### Step 1: Deploy Code.gs
1. Open your Google Sheet
2. **Extensions → Apps Script**
3. Paste the code from `Code.gs`
4. Click **Deploy → New Deployment**
5. Type: **Web App** | Execute as: **Your Account** | Access: **Anyone**
6. Click **Deploy** → **Authorize** when prompted
7. **Copy the deployment URL** (looks like: `https://script.google.com/macros/s/...`)

### Step 2: Run setupBackend() [OPTIONAL - Already Auto-Created!]
The sheet tabs are auto-created on first submission. But if you want to pre-create the "Resumes" folder:

1. In Apps Script: Select `setupBackend` from dropdown
2. Click ▶️ **Run**
3. Choose to create or use existing folder
4. Done! Folder ID saved automatically.

---

## Frontend Setup (Website)

### That's it! 🎉
Just upload `index.html` to your server. When users visit:

1. **First-time visitors** see a setup modal
2. They paste the Apps Script URL (from Step 1)
3. Saved to their browser
4. They fill the form and submit
5. Done!

### For Admins/Developers Only:

If you want to reset the setup:
```javascript
// Clear setup (in browser console)
localStorage.removeItem("IIEC_APPS_SCRIPT_URL");
location.reload();
```

---

## Form Flow

```
┌────────────────────────────────────────────────────┐
│  User visits website for first time               │
└────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────┐
│  ⚙️ Setup Modal Appears                            │
│  "One-Time Setup Required"                         │
│  [Paste Apps Script URL]                           │
│  [Save Configuration] [Skip for Now]              │
└────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────┐
│  ✓ URL saved to browser storage                    │
│  Modal closes automatically                        │
│  Setup shown only ONCE per browser                 │
└────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────┐
│  User scrolls down and fills form:                 │
│  ✓ Name, Phone, Email, Enrollment, Dept, Course  │
│  ✓ Year, WhatsApp, Why Join, Resume, Referral    │
│  [Submit Application]                             │
└────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────┐
│  Form submitted to Google Apps Script             │
│  ✓ Data saved to "Applications" sheet             │
│  ✓ Resume uploaded to Google Drive                │
│  ✓ Success message shown                          │
└────────────────────────────────────────────────────┘
```

---

## Storage & Persistence

### Where is the URL stored?
- **localStorage** (browser's local storage)
- **Key:** `IIEC_APPS_SCRIPT_URL`
- **Persists:** Across browser sessions, clearing cache will reset it

### Check stored URL:
```javascript
// In browser console (F12)
localStorage.getItem("IIEC_APPS_SCRIPT_URL")
```

### Clear setup (if needed):
```javascript
localStorage.removeItem("IIEC_APPS_SCRIPT_URL");
// Or clear all:
localStorage.clear();
```

---

## What Happens on Form Submit?

1. **Form validation** → Required fields checked
2. **Resume encoding** → If uploaded, converted to Base64
3. **Data collection** → All form fields gathered
4. **Backend check** → Verifies Apps Script URL configured
5. **POST request** → Sends to Google Apps Script
6. **Backend processing**:
   - ✓ Data appended to "Applications" sheet
   - ✓ Resume uploaded to "IIEC Resumes" folder
   - ✓ Resume link stored in column L
7. **Success response** → Form clears, shows ✓ Success message

---

## Troubleshooting

### Setup modal doesn't appear?
- **Reason:** URL already saved to localStorage
- **Fix:** Open Console (F12) and run: `localStorage.clear()` then reload

### Setup modal won't close after entering URL?
- **Reason:** Invalid URL format
- **Fix:** Make sure you copied the complete URL (ends with `/exec`)

### Form won't submit even after setup?
- **Reason:** Backend not responding
- **Check:**
  ```javascript
  // In console, test backend:
  fetch(localStorage.getItem("IIEC_APPS_SCRIPT_URL"))
    .then(r => console.log("✓ Backend OK"))
    .catch(e => console.log("✗ Error:", e))
  ```

### Can't remember if I already set up?
```javascript
// Check in browser console:
localStorage.getItem("IIEC_APPS_SCRIPT_URL")
// Returns: URL or null
```

---

## For Different Browsers

Each browser has its own localStorage:

| Browser | Setup Needed? |
|---------|---------------|
| Chrome  | Yes (first visit) |
| Firefox | Yes (first visit) |
| Safari  | Yes (first visit) |
| Edge    | Yes (first visit) |

Users can use the form on any browser (will prompt for setup on each).

---

## Deployment Checklist

- [ ] Code.gs deployed as Web App
- [ ] Deployment URL copied
- [ ] index.html uploaded to server
- [ ] Visited website on a NEW browser (triggers setup)
- [ ] Pasted Apps Script URL in setup modal
- [ ] Form submitted successfully
- [ ] Data appeared in Google Sheet
- [ ] Resume appeared in Google Drive folder

**Ready to launch! 🚀**

---

## User Instructions (Share This)

### First Visit
"When you open the form, you'll see a setup prompt. Paste your App Script URL and click Save. This happens only once!"

### Filling the Form
"Fill all required fields (marked with *), optionally upload a resume, then click Submit. Your response goes directly to our Google Sheet."

### On Desktop
"Best experience on desktop or tablet."

### On Mobile
"Form works on mobile too! QR code section hidden for better mobile experience."

---

## Developer Notes

### Key Functions

**Auto-Setup Triggered:**
- `showSetupModal()` — Shows setup dialog
- `saveSetupConfiguration()` — Saves URL to localStorage
- Triggered on page load if no URL stored

**Form Submission:**
- `fileToBase64()` — Encodes resume file
- Checks for configured URL before submitting
- Shows setup modal if URL missing on submit

### Storage Keys
- `IIEC_APPS_SCRIPT_URL` — Stores the Apps Script URL
- `IIEC_SETUP_SHOWN` — Tracks if setup shown in this session

### Browser Storage
- **localStorage** — Persists data across browser close
- **sessionStorage** — Tracks setup shown status

---

## Next Steps

1. ✅ Deploy backend (Code.gs)
2. ✅ Get deployment URL
3. ✅ Upload index.html
4. ✅ Test on fresh browser
5. ✅ Share website with users!

**No additional setup needed from users!** 🎉
