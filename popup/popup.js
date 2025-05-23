document.getElementById("toggleHistory").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          const existing = document.getElementById("sarcasm-history-box");
          if (existing) {
            existing.remove();
          } else {
            const evt = new CustomEvent("toggle-history-from-popup");
            window.dispatchEvent(evt);
          }
        }
      });
    });
  });
  
  document.getElementById("detectBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          const evt = new CustomEvent("force-detect-from-popup");
          window.dispatchEvent(evt);
        }
      });
    });
  });
  