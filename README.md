

---

# Argilla Labeling Assistant (Sarcasm Detection)

**A Chrome Extension that helps automate sarcasm labeling on the Argilla platform.**
This tool detects whether a given text is sarcastic, selects the appropriate checkbox, and submits the result — no manual clicking needed.

---

## Features

* 🔍 Automatically detects whether a text is **sarcastic** or **not sarcastic**.
* ✅ Selects the corresponding checkbox based on the result (`name="1"` for sarcastic, `name="0"` for not sarcastic).
* 📤 Automatically clicks the submit button after selecting a label.
* 📢 Displays detection status in a small notification at the top-right corner of the page.
* 🕓 Saves a history of the last 50 detection results.
* ⏸ Includes a pause/resume button for toggling detection on and off.
* 📂 Toggle button to show/hide detection history directly on the page.

---

## How to Install (Manually in Chrome)

1. **Download or clone** this repository to your local machine.

2. Open Chrome and go to `chrome://extensions/`.

3. Enable **Developer mode** (top right corner).

4. Click **Load unpacked** and select the folder containing the extension files.

5. Visit an Argilla page, for example:

   ```
   https://adealvii-argilla.hf.space/?workspaces=argilla
   ```

6. The extension will automatically activate and begin detecting text in elements like:

   ```css
   .content-area.--body1 .--ltr
   ```

---

