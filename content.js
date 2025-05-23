let lastProcessedText = "";
let resultDiv = null;
let detectionPaused = false;

function detectSarcasm(text) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "predict_sarcasm", text }, (response) => {
      console.log("📬 Prediction Response:", response);
      if (response?.error) {
        reject(response.error);
      } else {
        resolve(response.label);
      }
    });
  });
}

function createOrUpdateResultDiv(label) {
  const isSarcastic = label === 1;
  const statusText = isSarcastic ? "Sarcastic" : "Not Sarcastic";
  const backgroundColor = isSarcastic ? "#e74c3c" : "#2ecc71";

  if (!resultDiv) {
    resultDiv = document.createElement("div");
    Object.assign(resultDiv.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "12px 16px",
      color: "white",
      fontWeight: "bold",
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      zIndex: "9999",
      transition: "all 0.3s ease",
    });
    document.body.appendChild(resultDiv);
  }

  resultDiv.textContent = `Detected: ${statusText}`;
  resultDiv.style.backgroundColor = backgroundColor;
}

function saveHistory(text, label) {
  const history = JSON.parse(localStorage.getItem("sarcasmHistory") || "[]");
  history.unshift({ text, label, timestamp: Date.now() });
  if (history.length > 50) history.pop();
  localStorage.setItem("sarcasmHistory", JSON.stringify(history));
}

function toggleHistory() {
  const existing = document.getElementById("sarcasm-history-box");
  if (existing) {
    existing.remove();
    return;
  }

  const history = JSON.parse(localStorage.getItem("sarcasmHistory") || "[]");
  const div = document.createElement("div");
  div.id = "sarcasm-history-box";
  Object.assign(div.style, {
    position: "fixed",
    bottom: "60px",
    right: "20px",
    background: "#1e1e1e",
    color: "#fff",
    padding: "12px",
    borderRadius: "10px",
    maxHeight: "300px",
    overflowY: "auto",
    zIndex: "99999",
    fontSize: "13px",
    width: "320px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
  });

  div.innerHTML = "<b>🕓 Detection History</b><hr style='opacity:0.2;'>";

  if (!history.length) {
    div.innerHTML += "<div style='color:#ccc'>No history yet.</div>";
  } else {
    history.slice(0, 10).forEach((item) => {
      const timeStr = new Date(item.timestamp).toLocaleTimeString();
      const tag =
        item.label === 1
          ? "<span style='color:#f87171;font-weight:bold;'>Sarcastic</span>"
          : "<span style='color:#4ade80;font-weight:bold;'>Not Sarcastic</span>";
      div.innerHTML += `
        <div style="margin-bottom: 10px border: 1px solid #333; padding: 8px;">
          ${tag} <small style="color:#aaa;">[${timeStr}]</small><br>
          <span style="color:#ccc">"${item.text}"</span>
        </div>`;
    });
  }

  document.body.appendChild(div);
}

function getTextAndDetect() {
  if (detectionPaused) return;

  const el = document.querySelector(".content-area.--body1 .--ltr");
  if (!el) return;

  const text = el.textContent.trim();
  if (!text || text === lastProcessedText) return;

  lastProcessedText = text;
  console.log("📝 New text found:", text);

  detectSarcasm(text)
    .then((label) => {
      const labelText = label === 1 ? "Sarcastic" : "Not Sarcastic";
      console.log(`🤖 Detected as: ${labelText}`);

      createOrUpdateResultDiv(label);
      saveHistory(text, label);

      const targetName = label === 1 ? "1" : "0";
      const input = [...document.querySelectorAll("input[type='checkbox']")].find(
        (el) => el.name.trim() === targetName
      );

      if (input && !input.checked) {
        input.focus();
        setTimeout(() => {
          input.click();
          console.log(`✅ Checkbox for "${labelText}" selected.`);

          setTimeout(() => {
            const submitBtn = document.querySelector("button.button--submit:not([disabled])");
            if (submitBtn) {
              submitBtn.click();
              console.log("🚀 Submitted successfully.");
            } else {
              console.log("⏳ Submit button is not enabled yet.");
            }
          }, 300);
        }, 100);
      } else {
        console.log(`⚠️ Checkbox for "${labelText}" not found or already selected.`);
      }
    })
    .catch((err) => {
      console.error("❌ Sarcasm detection failed:", err);
    });
}

function createPauseButton() {
  const pauseBtn = document.createElement("button");
  pauseBtn.textContent = "⏸ Pause Detection";

  Object.assign(pauseBtn.style, {
    position: "fixed",
    bottom: "20px",
    left: "45%",
    transform: "translateX(-110%)",
    padding: "10px 14px",
    borderRadius: "8px",
    background: "#555",
    color: "#fff",
    zIndex: "10000",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  });

  pauseBtn.onclick = () => {
    detectionPaused = !detectionPaused;
    pauseBtn.textContent = detectionPaused ? "▶️ Start Detection" : "⏸ Pause Detection";
    console.log(`🛑 Detection ${detectionPaused ? "paused" : "started"}`);
  };

  document.body.appendChild(pauseBtn);
}

// Buat tombol show/hide history deteksi
function createHistoryButton() {
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "🕓 Show History";

  Object.assign(toggleBtn.style, {
    position: "fixed",
    bottom: "20px",
    left: "55%",
    transform: "translateX(10%)",
    padding: "10px 14px",
    borderRadius: "8px",
    background: "#333",
    color: "#fff",
    zIndex: "10000",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  });

  toggleBtn.onclick = toggleHistory;
  document.body.appendChild(toggleBtn);
}

const observer = new MutationObserver(() => {
  getTextAndDetect();
});
observer.observe(document.body, { childList: true, subtree: true });

createPauseButton();
createHistoryButton();
