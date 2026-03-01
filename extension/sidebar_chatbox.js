let currentPlan = null;

// Receive teaching plan from parent
window.addEventListener("message", (event) => {
  const { data } = event;
  console.log("sidebar_chatbox got message", data); // debug
  if (!data || data.type !== "TEACHING_PLAN") return;
  currentPlan = data.teachingPlan;
  renderPlan();
});

function renderPlan() {
  if (!currentPlan) return;

  document.getElementById("main-message").textContent =
    currentPlan.main_message || "";
  document.getElementById("explanation").textContent =
    currentPlan.explanation || "";

  const tipsUl = document.getElementById("tips");
  tipsUl.innerHTML = "";
  (currentPlan.tips || []).forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    tipsUl.appendChild(li);
  });

  const q = currentPlan.quiz || {
    question: "",
    options: [],
    correct_index: 0,
    feedback: ""
  };

  document.getElementById("quiz-question").textContent = q.question || "";

  const optsDiv = document.getElementById("quiz-options");
  optsDiv.innerHTML = "";
  (q.options || []).forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      const fb = document.getElementById("quiz-feedback");
      if (idx === q.correct_index) {
        fb.textContent = q.feedback || "Correct!";
        fb.style.color = "#27ae60";
      } else {
        fb.textContent = "Not quite. Think what keeps you safest.";
        fb.style.color = "#e74c3c";
      }
    });
    optsDiv.appendChild(btn);
  });
}

// Close button
document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      parent.postMessage({ type: "CLOSE_CHATBOX" }, "*");
    });
  }
});
