const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";
const HUGGINGFACE_API_KEY = "hf_xxxxxxxxx"; //GANTI PAKE APIKEY SENDIRI 

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "predict_sarcasm") {
    const { text } = request;

    console.log("🟡 Received sarcasm detection request with text:", text);

    fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`, // Using variable instead of hardcoded
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          candidate_labels: ["sarkastik", "tidak sarkastik"]
        }
      })
    })
      .then(res => {
        console.log("🟡 Response status:", res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("🟢 Response data:", data);

        const { labels, scores } = data;
        const label = labels[0] === "sarkastik" ? 1 : 0;

        console.log("🟢 Prediction:", labels[0], "Score:", scores[0]);
        sendResponse({ label });
      })
      .catch(err => {
        console.error("❌ Failed to call Hugging Face API:", err);
        alert("Failed to detect sarcasm: " + err.message);
        sendResponse({ error: err.toString() });
      });

    return true; // Keep the message channel open for async sendResponse
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.includes("argilla.hf.space/dataset")) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"]
    });
  }
});
