// Load settings from chrome.storage
document.addEventListener("DOMContentLoaded", async () => {
  const {autoDetect = true, maxHistory = 50} = await chrome.storage.sync.get([
    "autoDetect",
    "maxHistory",
  ]);
  document.getElementById("autoDetect").checked = autoDetect;
  document.getElementById("maxHistory").value = maxHistory;
});

// Save settings when changed
document.getElementById("autoDetect").addEventListener("change", (e) => {
  chrome.storage.sync.set({autoDetect: e.target.checked});
});

document.getElementById("maxHistory").addEventListener("input", (e) => {
  chrome.storage.sync.set({maxHistory: parseInt(e.target.value, 10)});
});

// Clear history from localStorage
document.getElementById("clearHistory").addEventListener("click", () => {
  localStorage.removeItem("sarcasmHistory");
  alert("Detection history cleared.");
});

// Test input detection
document.getElementById("testBtn").addEventListener("click", () => {
  const text = document.getElementById("testInput").value.trim();
  if (!text) return;

  chrome.runtime.sendMessage({type: "predict_sarcasm", text}, (response) => {
    if (response?.label !== undefined) {
      const result = response.label === 1 ? "Sarcastic" : "Not Sarcastic";
      document.getElementById("testResult").textContent = `Result: ${result}`;
    } else {
      document.getElementById("testResult").textContent =
        "Error: Could not detect sarcasm.";
    }
  });
});
