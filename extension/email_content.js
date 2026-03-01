// Runs only on https://mail.google.com/*

function getCurrentEmailData() {
  // Gmail DOM is complex; this is a simple heuristic for the currently opened email.
  const senderSpan = document.querySelector("span.gD");        // sender name
  const senderEmail = senderSpan ? senderSpan.getAttribute("email") || "" : "";
  const displayName = senderSpan ? senderSpan.textContent || "" : "";

  const subjectElem = document.querySelector("h2.hP");         // subject
  const subject = subjectElem ? subjectElem.textContent || "" : "";

  const bodyElem = document.querySelector("div.a3s.aiL");      // main body container
  const bodyText = bodyElem ? bodyElem.innerText || "" : "";

  return {
    sender: senderEmail,
    display_name: displayName,
    subject,
    body_text: bodyText
  };
}

function showEmailBanner(teachingPlan) {
  if (document.getElementById("student-phish-email-banner")) return;

  const banner = document.createElement("div");
  banner.id = "student-phish-email-banner";
  banner.style.position = "fixed";
  banner.style.top = "0";
  banner.style.left = "0";
  banner.style.right = "0";
  banner.style.padding = "8px 12px";
  banner.style.fontFamily = "system-ui, sans-serif";
  banner.style.fontSize = "13px";
  banner.style.zIndex = "999998";
  banner.style.display = "flex";
  banner.style.justifyContent = "space-between";
  banner.style.alignItems = "center";

  const color =
    teachingPlan.risk_level === "high"
      ? "#ff4d4f"
      : teachingPlan.risk_level === "medium"
      ? "#faad14"
      : "#52c41a";

  banner.style.background = color;
  banner.style.color = "#fff";

  banner.innerHTML = `
    <span>Student PhishGuard (email): ${teachingPlan.main_message}</span>
    <button id="student-phish-email-learn" style="margin-left:10px;padding:4px 8px;border:none;border-radius:4px;cursor:pointer;">Learn more</button>
  `;

  document.body.appendChild(banner);

  banner.querySelector("#student-phish-email-learn").addEventListener("click", () => {
    const teachUrl = "http://localhost:5173/teach" + "?context=email";
    window.open(teachUrl, "_blank");
  });
}

// Ask backend when an email view is detected
function analyzeCurrentEmail() {
  const email = getCurrentEmailData();
  if (!email.subject && !email.body_text) {
    return; // nothing to analyze
  }

  chrome.runtime.sendMessage({
    type: "EMAIL_ANALYZE_REQUEST",
    email
  });
}

// Listen for result from background
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "EMAIL_ANALYZE_RESULT") {
    const { teachingPlan } = msg;
    if (!teachingPlan) return;
    if (teachingPlan.risk_level === "high" || teachingPlan.risk_level === "medium") {
      showEmailBanner(teachingPlan);
    }
  }
});

// Simple trigger: when the page finishes loading and when URL hash changes (navigating emails)
window.addEventListener("load", () => {
  setTimeout(analyzeCurrentEmail, 3000); // wait a bit for Gmail to render
});

window.addEventListener("hashchange", () => {
  setTimeout(analyzeCurrentEmail, 2000);
});
