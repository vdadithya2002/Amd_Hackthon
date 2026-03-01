const BACKEND_BASE_CANDIDATES = ["http://127.0.0.1:8000", "http://localhost:8000"];
let activeBackendBase = BACKEND_BASE_CANDIDATES[0];

const SUPPORTED_PROTOCOLS = ["http:", "https:"];

function canInjectOnUrl(rawUrl) {
  try {
    const u = new URL(rawUrl);
    const backendOrigins = BACKEND_BASE_CANDIDATES.map((base) => new URL(base).origin);
    return SUPPORTED_PROTOCOLS.includes(u.protocol) && !backendOrigins.includes(u.origin);
  } catch {
    return false;
  }
}

async function fetchBackend(path, options) {
  let lastError = null;
  for (const base of BACKEND_BASE_CANDIDATES) {
    const endpoint = `${base}${path}`;
    try {
      const res = await fetch(endpoint, options);
      activeBackendBase = base;
      return res;
    } catch (err) {
      lastError = err;
      console.warn(`Backend candidate failed: ${base}`, err);
    }
  }
  throw lastError || new Error("No backend candidates reachable");
}

async function sendToContentScript(tabId, payload, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      await chrome.tabs.sendMessage(tabId, payload);
      return true;
    } catch (error) {
      const msg = String(error?.message || "");
      const noReceiver = msg.includes("Receiving end does not exist");
      if (!noReceiver || attempt === retries - 1) {
        console.debug("Unable to send message to content script:", msg);
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  return false;
}

chrome.webNavigation.onCompleted.addListener(async (details) => {
  const { tabId, url, frameId } = details;
  if (frameId !== 0) return;
  if (!canInjectOnUrl(url)) return;

  try {
    const res = await fetchBackend(`/analyze-url?url=${encodeURIComponent(url)}`);
    if (!res.ok) {
      console.error("Backend not OK", res.status, "active base:", activeBackendBase);
      return;
    }
    const data = await res.json();

    await sendToContentScript(tabId, {
      type: "PHISH_CHECK_RESULT",
      url,
      urlResult: data.url_result,
      teachingPlan: data.teaching_plan
    });
  } catch (e) {
    console.error("Error calling backend:", e, "candidates:", BACKEND_BASE_CANDIDATES);
  }
});


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "EMAIL_ANALYZE_REQUEST") {
    const email = msg.email;

    fetchBackend("/analyze-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(email)
    })
      .then(res => res.json())
      .then(data => {
        if (!sender?.tab?.id) return;
        chrome.tabs.sendMessage(sender.tab.id, {
          type: "EMAIL_ANALYZE_RESULT",
          teachingPlan: data.teaching_plan,
          emailResult: data.email_result
        });
      })
      .catch(err => console.error("Error calling /analyze-email", err));
  }
});
