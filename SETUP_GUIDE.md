# 🚀 IIEC Form Backend — Complete Setup Guide

## Overview
Your form now integrates with Google Sheets + Google Drive to:
- ✅ Store all responses in a Google Sheet
- ✅ Upload resumes to Google Drive with automatic naming
- ✅ Auto-create formatted headers
- ✅ One-click frontend setup

---

## Phase 1: Google Apps Script Setup (Backend)

### Step 1️⃣ — Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet: **"IIEC Internship Applications 2026"**
3. Keep the default sheet name as **"Applications"** (important!)
4. Copy the Sheet ID from URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

### Step 2️⃣ — Deploy Google Apps Script
1. In your Google Sheet: **Extensions → Apps Script**
2. Delete any existing code
3. **Paste the entire `Code.gs` file** into the editor
4. Click **💾 Save**
5. Click **Deploy → New Deployment**
6. Configuration:
   - **Type:** Web app
   - **Execute as:** Your Google Account
   - **Who has access:** Anyone
7. Click **Deploy** and **Authorize** when prompted
8. **Copy the Web App URL** (you'll need this later)

### Step 3️⃣ — Run Auto-Setup (Folder Creation)
1. Back in Apps Script editor, click the function dropdown at top-left
2. Select **`setupBackend`** 
3. Click ▶️ **Run**
4. Choose option:
   - **[1]** Create new "IIEC Resumes" folder → Auto-saved
   - **[2]** Use existing folder → Paste folder ID
5. Click **View execution log** to confirm: **✓ SETUP COMPLETE!**

---

## Phase 2: Frontend Setup (Website)

### Step 4️⃣ — Configure index.html
1. Open `index.html` in a text editor
2. Find this line (around line 2566):
   ```javascript
   const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL_HERE";
   ```
3. **Option A (Manual):** Replace with your Web App URL from Step 2
4. **Option B (Auto):** Open your website, press **F12** (Dev Console), and run:
   ```javascript
   setupFormBackend()
   ```
   Then paste your Web App URL when prompted. It auto-saves to browser storage!

### Step 5️⃣ — Test the Form
1. Load your website in a browser
2. Fill out and submit the form
3. ✅ Check your Google Sheet — new row appears instantly
4. ✅ Check "IIEC Resumes" folder — resume uploaded as `FirstName_EnrollmentNo_Resume.pdf`

---

## What Gets Stored?

### Google Sheets Columns:
| Column | Field |
|--------|-------|
| A | Timestamp |
| B | Full Name |
| C | Mobile Number |
| D | Email Address |
| E | Enrollment No |
| F | Department |
| G | Course |
| H | Current Year |
| I | WhatsApp Number |
| J | Why Join Internship? |
| K | Referral Code |
| L | Resume (Drive Link) |

### Resume Drive Link
Resumes are automatically:
- Converted from base64 to binary
- Renamed: `Aditya_Sharma_EN2023456_Resume.pdf`
- Uploaded to "IIEC Resumes" folder
- Link stored in column L (clickable)

---

## 🔧 Troubleshooting

### Form shows "Setup Required"
**Solution:** 
- Open browser console: **F12**
- Run: `setupFormBackend()`
- Paste your Apps Script URL
- Refresh page

### Data not appearing in sheet?
**Check:**
- ✓ Sheet tab is named exactly **"Applications"**
- ✓ Sheet ID in Code.gs matches your actual sheet
- ✓ Apps Script is deployed as Web App (not just saved)
- ✓ APPS_SCRIPT_URL is correct in index.html

### Resume not uploading?
**Check:**
- ✓ Resume file is under 5MB
- ✓ Folder ID is correct (from setupBackend)
- ✓ Folder exists in Google Drive
- ✓ File format is PDF, DOC, or DOCX

### Apps Script deployment errors?
**Solution:**
- Go back to Code.gs
- Click **Deploy → Manage Deployments**
- Click pencil ✏️ icon
- Set Version to **"New version"**
- Click **Update**
- Copy the same URL (doesn't change)

---

## 📱 Browser Storage

Your Apps Script URL is saved in **localStorage**, so:
- ✓ Persists across browser sessions
- ✓ Call `setupFormBackend()` anytime to reconfigure
- ✓ Check: `localStorage.getItem("APPS_SCRIPT_URL")`
- ✓ Clear: `localStorage.clear()` (resets setup)

---

## 🔐 Security Notes

✅ **Good practices:**
- Sheet is read-only to public (only backend writes)
- Resume folder shares links only (no direct access)
- Form validates all inputs before sending
- Base64 encoding prevents file corruption

⚠️ **Important:**
- Never share your Web App URL in public repo
- Use `.env` or keep in separate config if deploying
- Consider adding CAPTCHA for production

---

## 🎯 File Structure

```
/Programs
├── index.html              ← Frontend form (UPDATED)
├── Code.gs                 ← Backend script (UPDATED)
├── SETUP_GUIDE.md          ← This file
└── assets/
    ├── iiec.webp
    └── csmu.webp
```

---

## 📞 Need Help?

1. **Forms not submitting?** Check browser console (F12) for errors
2. **Can't find folder ID?** In Google Drive, right-click folder → Share → copy URL
3. **Sheet headers missing?** Auto-created on first submission
4. **Want to change folder?** Run `setupBackend()` again

---

## ✅ Checklist Before Going Live

- [ ] Google Sheet created & named "Applications"
- [ ] Code.gs deployed as Web App
- [ ] setupBackend() ran successfully
- [ ] APPS_SCRIPT_URL configured in index.html
- [ ] Form test submission succeeded
- [ ] Data appeared in Google Sheet
- [ ] Resume uploaded to Drive folder with correct naming
- [ ] Resume link appears in column L

**Ready to go! 🚀**
