const FRONTEND_TEACH_URL = "http://localhost:5173/teach";

function openTeachingPage(url, riskLevel) {
  const teachUrl =
    `${FRONTEND_TEACH_URL}?url=${encodeURIComponent(url)}&risk=${encodeURIComponent(riskLevel || "")}`;
  window.open(teachUrl, "_blank", "noopener,noreferrer");
}

function showFullPageWarning(teachingPlan, url) {
  if (document.getElementById("student-phish-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "student-phish-overlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(8, 12, 24, 0.78)";
  overlay.style.backdropFilter = "blur(3px)";
  overlay.style.zIndex = "999997";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";

  const box = document.createElement("div");
  box.style.background = "linear-gradient(160deg, #791b1f 0%, #b73c3c 100%)";
  box.style.color = "#fff";
  box.style.padding = "20px";
  box.style.borderRadius = "14px";
  box.style.width = "min(92vw, 470px)";
  box.style.fontFamily = "Segoe UI, Tahoma, sans-serif";
  box.style.boxShadow = "0 24px 40px rgba(0, 0, 0, 0.45)";

  box.innerHTML = `
    <h2 style="margin:0 0 8px 0;font-size:22px;">High-Risk Page Detected</h2>
    <p style="margin:0 0 10px 0;line-height:1.45;">${teachingPlan.main_message || "This page may be unsafe."}</p>
    <p style="margin:0 0 16px 0;line-height:1.45;opacity:.9;">${teachingPlan.explanation || "Potential phishing indicators found."}</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <button id="student-phish-learn-overlay" style="border:none;background:#fff;color:#8e2323;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:600;">Learn why</button>
      <button id="student-phish-close-warning" style="border:none;background:rgba(255,255,255,0.18);color:#fff;padding:8px 12px;border-radius:8px;cursor:pointer;">Dismiss</button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  document.getElementById("student-phish-close-warning")?.addEventListener("click", () => {
    overlay.remove();
  });

  document.getElementById("student-phish-learn-overlay")?.addEventListener("click", () => {
    openTeachingPage(url, teachingPlan.risk_level);
  });
}

function showBanner(teachingPlan, url) {
  if (document.getElementById("student-phish-banner")) return;

  const banner = document.createElement("div");
  banner.id = "student-phish-banner";
  banner.style.position = "fixed";
  banner.style.top = "0";
  banner.style.left = "0";
  banner.style.right = "0";
  banner.style.padding = "10px 12px";
  banner.style.fontFamily = "Segoe UI, Tahoma, sans-serif";
  banner.style.fontSize = "14px";
  banner.style.zIndex = "999998";
  banner.style.display = "flex";
  banner.style.justifyContent = "space-between";
  banner.style.alignItems = "center";
  banner.style.gap = "10px";

  const color =
    teachingPlan.risk_level === "high"
      ? "#c4323a"
      : teachingPlan.risk_level === "medium"
      ? "#d9821d"
      : "#1f9155";

  banner.style.background = color;
  banner.style.color = "#fff";

  banner.innerHTML = `
    <span style="flex:1;line-height:1.35;">Student PhishGuard: ${teachingPlan.main_message || "Page scanned."}</span>
    <button id="student-phish-learn" style="padding:6px 10px;border:none;border-radius:6px;cursor:pointer;font-weight:600;">Learn more</button>
  `;

  document.body.appendChild(banner);

  banner.querySelector("#student-phish-learn")?.addEventListener("click", () => {
    openTeachingPage(url, teachingPlan.risk_level);
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (!msg || msg.type !== "PHISH_CHECK_RESULT") return;

  const { teachingPlan, url } = msg;
  if (!teachingPlan) return;

  if (teachingPlan.risk_level === "high") {
    showFullPageWarning(teachingPlan, url);
  }

  if (teachingPlan.risk_level === "high" || teachingPlan.risk_level === "medium") {
    showBanner(teachingPlan, url);
  }
});
