
---

# Sarcasm Detection Chrome Extension for Argilla

**A simple Chrome Extension to detect sarcasm in text on the Argilla website, automatically select the corresponding checkbox, and submit the detection result.**

---

## Features

* Automatically detects sarcasm in text on the Argilla page.
* Displays detection status (Sarcastic / Not Sarcastic) as a small notification at the top-right corner.
* Saves and shows detection history of up to 50 entries in a separate popup.
* Automatically selects the checkbox matching the detection result and clicks the submit button.
* Button to pause/resume the detection process.
* Button to show/hide detection history.

---

## How to Use (Install Locally in Chrome)

1. Clone or download this repository to your local machine.

2. Open Chrome and go to `chrome://extensions/`.

3. Enable **Developer mode** at the top right.

4. Click **Load unpacked**, then navigate to the folder containing the extension files.

5. Once installed, open the Argilla website, for example:

   ```
   https://example-argilla.hf.space/?workspaces=argilla
   ```

6. The extension will start running automatically and detect text appearing in the element `.content-area.--body1 .--ltr`.

7. Use the "⏸ Pause Detection" button to temporarily stop detection, and the "🕓 Show History" button to view the detection history.

---

## Folder Structure

```
/sarcasm-detection-extension
│
├── manifest.json
├── content.js    (main detection and DOM manipulation code)
└── README.md
```

---

## manifest.json (Example)

```json
{
  "manifest_version": 3,
  "name": "Argilla Sarcasm Detection",
  "version": "1.0",
  "description": "Detects sarcasm on Argilla website and automatically selects options.",
  "permissions": ["storage", "activeTab", "scripting"],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "https://example-argilla.hf.space/*"
      ],
      "js": ["content.js"]
    }
  ],
 "matches": [
        "https://*.argilla.hf.space/*",
        "https://adealvii-argilla.hf.space/*"
    ],
    "host_permissions": [
        "https://*.argilla.hf.space/*",
        "https://adealvii-argilla.hf.space/*"
    ],
  "action": {
    "default_title": "Sarcasm Detection"
  }
}
```

---

## Technical Notes

* The extension uses `chrome.runtime.sendMessage` to request sarcasm predictions from a background script or a pre-existing ML backend server.
* Detection runs by monitoring the DOM with a `MutationObserver`.
* Text is retrieved from the selector `.content-area.--body1 .--ltr` according to the current Argilla web structure.
* Detection result labels are `1` (sarcastic) or `0` (not sarcastic).
* Checkboxes with `name="1"` or `name="0"` are selected according to the label.
* Detection history is stored in browser `localStorage`.
* Additional UI includes pause and show/hide history buttons fixed on the page.

---

## Development

If you want to customize or extend the extension:

* Update the text selector if Argilla’s DOM structure changes.
* Adjust message sending and response handling with the background script.
* Add validation and error handling as needed.

---

If you need help with setup or customization, feel free to ask!

---
