const attacks = [
  {
    id: "phishing",
    title: "Phishing & social engineering",
    short: "Deception targeting people",
    category: "People",
    filter: "people",
    icon: "✉",
    risk: "Human-centered",
    description: "Phishing is a deceptive message designed to persuade someone to reveal information, open an unsafe attachment, or visit a fraudulent site. Social engineering is the broader use of deception to influence people.",
    signs: ["Unexpected urgency or pressure", "A sender or web address that does not look right", "Requests for passwords, payment, or confidential data"],
    defenses: ["Verify requests through a known, separate contact channel", "Use multi-factor authentication (MFA)", "Report suspicious messages; do not reply or open unexpected attachments"]
  },
  {
    id: "credential",
    title: "Credential attacks",
    short: "Misuse of account sign-ins",
    category: "Accounts",
    filter: "accounts",
    icon: "▣",
    risk: "Account access",
    description: "Credential attacks involve attempts to gain access using stolen, guessed, or reused sign-in details. Reusing passwords makes it easier for one exposed account to put other accounts at risk.",
    signs: ["Sign-in alerts you do not recognize", "Repeated login failures or unusual locations", "Unexpected password-reset or MFA prompts"],
    defenses: ["Use a unique password for every account and store it in a password manager", "Enable MFA, preferably a phishing-resistant option when available", "Review account alerts and change exposed passwords through the official site"]
  },
  {
    id: "malware",
    title: "Malware & ransomware",
    short: "Harmful software and data disruption",
    category: "Systems",
    filter: "systems",
    icon: "⬡",
    risk: "Device or data impact",
    description: "Malware is software intended to cause harm or act without permission. Ransomware is a type of malware that can make data unavailable and demand payment. It can disrupt people and organizations, so prevention and recovery matter.",
    signs: ["Unexpected security alerts or unfamiliar programs", "Files suddenly unavailable or changed", "Unusual device behavior—treat this as a signal to investigate, not proof by itself"],
    defenses: ["Install updates and use reputable endpoint protection", "Keep separate, tested backups and restrict who can change them", "If suspected, follow your incident plan and contact your IT or security team"]
  },
  {
    id: "service-disruption",
    title: "Denial of service",
    short: "Disrupting access to a service",
    category: "Systems",
    filter: "systems",
    icon: "⌁",
    risk: "Availability",
    description: "A denial-of-service incident overwhelms or disrupts a service so legitimate users have difficulty reaching it. The defensive goal is to keep essential services available and respond quickly to abnormal demand.",
    signs: ["A site or service becomes unusually slow or unavailable", "A sudden spike in traffic or error rates", "Monitoring alerts show service capacity being exceeded"],
    defenses: ["Use provider-level traffic filtering and denial-of-service protections", "Set up monitoring, rate controls, and a response contact plan", "Keep users informed and follow the service provider's incident guidance"]
  },
  {
    id: "interception",
    title: "On-path interception",
    short: "Interfering with data in transit",
    category: "Networks",
    filter: "networks",
    icon: "⇄",
    risk: "Data confidentiality",
    description: "On-path interception occurs when someone positions themselves between communicating parties to observe or potentially alter information. Secure connections and careful network choices help protect data while it travels.",
    signs: ["Unexpected certificate or browser security warnings", "Sensitive sign-in activity on untrusted public networks", "A connection behaving differently than expected—verify rather than bypass warnings"],
    defenses: ["Use HTTPS and never click through certificate warnings for sensitive services", "Avoid sensitive activity on untrusted networks; use an organization-approved VPN when required", "Keep devices and browsers updated"]
  }
];

const list = document.querySelector("#attack-list");
const detail = document.querySelector("#attack-detail");
const search = document.querySelector("#search");
const noResults = document.querySelector("#no-results");
const tabs = [...document.querySelectorAll(".topic-tab")];
let activeFilter = "all";
let selectedId = attacks[0].id;

const quizQuestions = [
  {
    prompt: "An unexpected email asks you to confirm your password immediately. What should you do?",
    choices: [
      "Reply with your password",
      "Use a trusted channel to check whether the request is real",
      "Forward it to everyone"
    ],
    answerIndex: 1,
    explanation: "Verify unusual requests through a contact method you already trust."
  },
  {
    prompt: "Why should you use a unique password for each account?",
    choices: [
      "One exposed password is less likely to unlock your other accounts",
      "Unique passwords are always easier to remember",
      "It means multi-factor authentication is unnecessary"
    ],
    answerIndex: 0,
    explanation: "Unique passwords reduce the risk of attackers reusing exposed credentials."
  },
  {
    prompt: "What is a cryptographic hash useful for?",
    choices: [
      "Recovering the original file contents",
      "Checking whether file contents have changed",
      "Encrypting a file so nobody can read it"
    ],
    answerIndex: 1,
    explanation: "Hashes can be compared to detect changes; they are not encryption."
  },
  {
    prompt: "A log shows one failed sign-in. What is a sensible first step?",
    choices: [
      "Assume the system is compromised",
      "Check surrounding events and whether the activity is unusual",
      "Delete the logs"
    ],
    answerIndex: 1,
    explanation: "Context helps distinguish routine mistakes from a pattern that needs attention."
  }
];

const quizProgress = document.querySelector("#quiz-progress");
const quizContent = document.querySelector("#quiz-content");
const quizQuestion = document.querySelector("#quiz-question");
const quizOptions = document.querySelector("#quiz-options");
const quizFeedback = document.querySelector("#quiz-feedback");
const quizSubmit = document.querySelector("#quiz-submit");
const quizNext = document.querySelector("#quiz-next");
const quizResult = document.querySelector("#quiz-result");
const quizResultTitle = document.querySelector("#quiz-result-title");
const quizResultCopy = document.querySelector("#quiz-result-copy");
const quizRestart = document.querySelector("#quiz-restart");
let currentQuestion = 0;
let selectedAnswer = null;
let quizScore = 0;
let questionAnswered = false;

function renderDetail(attack) {
  detail.innerHTML = `
    <div class="detail-topline">
      <span class="detail-category">${attack.category} / threat overview</span>
      <span class="risk-label">${attack.risk}</span>
    </div>
    <h3 id="detail-title">${attack.title}</h3>
    <p class="detail-description">${attack.description}</p>
    <div class="detail-grid">
      <section class="detail-block" aria-labelledby="signs-title">
        <h4 id="signs-title">What to watch for</h4>
        <ul>${attack.signs.map((sign) => `<li>${sign}</li>`).join("")}</ul>
      </section>
      <section class="detail-block" aria-labelledby="defenses-title">
        <h4 id="defenses-title">How to reduce risk</h4>
        <ul>${attack.defenses.map((defense) => `<li>${defense}</li>`).join("")}</ul>
      </section>
    </div>`;
}

function renderList() {
  const term = search.value.trim().toLowerCase();
  const visible = attacks.filter((attack) => {
    const matchesFilter = activeFilter === "all" || attack.filter === activeFilter;
    const searchable = [attack.title, attack.short, attack.category, attack.description, ...attack.signs, ...attack.defenses].join(" ").toLowerCase();
    return matchesFilter && searchable.includes(term);
  });

  if (!visible.some((attack) => attack.id === selectedId) && visible.length > 0) {
    selectedId = visible[0].id;
    renderDetail(visible[0]);
  }

  list.innerHTML = visible.map((attack) => `
    <button class="attack-card${attack.id === selectedId ? " is-selected" : ""}" type="button" data-id="${attack.id}" aria-pressed="${attack.id === selectedId}">
      <span class="attack-icon" aria-hidden="true">${attack.icon}</span>
      <span><strong>${attack.title}</strong><small>${attack.short}</small></span>
      <span class="attack-arrow" aria-hidden="true">›</span>
    </button>`).join("");

  list.querySelectorAll(".attack-card").forEach((button) => {
    button.addEventListener("click", () => {
      selectedId = button.dataset.id;
      renderList();
      renderDetail(attacks.find((attack) => attack.id === selectedId));
      list.querySelector(`[data-id="${selectedId}"]`).focus();
    });
  });

  noResults.hidden = visible.length > 0;
  list.hidden = visible.length === 0;
  detail.hidden = visible.length === 0;
}

function renderQuizQuestion() {
  const question = quizQuestions[currentQuestion];
  selectedAnswer = null;
  questionAnswered = false;
  quizProgress.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
  quizQuestion.textContent = question.prompt;
  quizOptions.innerHTML = question.choices.map((choice, index) => `
    <button class="quiz-option" type="button" data-index="${index}" aria-pressed="false">
      <span class="quiz-option-marker" aria-hidden="true">${String.fromCharCode(65 + index)}</span>
      <span>${choice}</span>
    </button>`).join("");
  quizOptions.querySelectorAll(".quiz-option").forEach((button) => {
    button.addEventListener("click", () => {
      if (questionAnswered) return;
      selectedAnswer = Number(button.dataset.index);
      quizOptions.querySelectorAll(".quiz-option").forEach((option) => {
        const selected = option === button;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      });
      quizSubmit.disabled = false;
    });
  });
  quizFeedback.textContent = "";
  quizSubmit.hidden = false;
  quizSubmit.disabled = true;
  quizNext.hidden = true;
  quizNext.textContent = currentQuestion === quizQuestions.length - 1 ? "See your score" : "Next question →";
}

function showQuizResult() {
  quizProgress.textContent = "QUIZ COMPLETE";
  quizContent.hidden = true;
  quizResult.hidden = false;
  quizResultTitle.textContent = `You scored ${quizScore} out of ${quizQuestions.length}`;
  quizResultCopy.textContent = quizScore === quizQuestions.length
    ? "Excellent work. Keep applying these habits in your day-to-day security decisions."
    : "Review the explanations and keep practicing these safer security habits.";
}

quizSubmit.addEventListener("click", () => {
  if (selectedAnswer === null || questionAnswered) return;
  const question = quizQuestions[currentQuestion];
  const correct = selectedAnswer === question.answerIndex;
  questionAnswered = true;
  if (correct) quizScore += 1;
  quizOptions.querySelectorAll(".quiz-option").forEach((button) => {
    const index = Number(button.dataset.index);
    button.disabled = true;
    if (index === question.answerIndex) button.classList.add("is-correct");
    else if (index === selectedAnswer) button.classList.add("is-incorrect");
  });
  quizFeedback.textContent = `${correct ? "Correct!" : "Not quite."} ${question.explanation}`;
  quizSubmit.hidden = true;
  quizNext.hidden = false;
  quizNext.focus();
});

quizNext.addEventListener("click", () => {
  currentQuestion += 1;
  if (currentQuestion === quizQuestions.length) {
    showQuizResult();
    quizRestart.focus();
    return;
  }
  renderQuizQuestion();
  quizQuestion.focus();
});

quizRestart.addEventListener("click", () => {
  currentQuestion = 0;
  quizScore = 0;
  quizResult.hidden = true;
  quizContent.hidden = false;
  renderQuizQuestion();
  quizQuestion.focus();
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeFilter = tab.dataset.filter;
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderList();
  });
});

search.addEventListener("input", renderList);
renderList();
renderDetail(attacks[0]);
renderQuizQuestion();
