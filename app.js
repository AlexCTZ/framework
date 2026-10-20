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

const mitreExercises = [
  {
    scenario: "A user reports an unexpected attachment. There is not yet evidence it was malicious or opened.",
    prompt: "What is the most careful way to record this?",
    choices: [
      "Confirm T1566.001 and declare an intrusion",
      "Record possible T1566.001 only if evidence supports it; investigate the message and endpoint",
      "Attribute it to a known threat group from the email alone"
    ],
    answerIndex: 1,
    explanation: "T1566.001 is a candidate when evidence supports spearphishing with an attachment. A report alone does not prove the attachment was malicious, executed, or part of an intrusion.",
    url: "https://attack.mitre.org/techniques/T1566/001/",
    linkText: "Review T1566.001"
  },
  {
    scenario: "An account owner denies a successful sign-in from a device they do not recognize.",
    prompt: "Which technique is the closest candidate mapping?",
    choices: [
      "T1078 — Valid Accounts",
      "T1486 — Data Encrypted for Impact",
      "T1566.001 — Spearphishing Attachment"
    ],
    answerIndex: 0,
    explanation: "T1078 covers adversary use of valid accounts. Check identity-provider and device context, and treat the mapping as a hypothesis until the event is investigated.",
    url: "https://attack.mitre.org/techniques/T1078/",
    linkText: "Review T1078"
  },
  {
    scenario: "A response team confirms that files on several managed devices became encrypted and unavailable.",
    prompt: "What is the best ATT&CK-informed next step?",
    choices: [
      "Use T1486 as a candidate impact mapping, preserve evidence, and follow the incident response plan",
      "Treat T1486 as proof of a specific threat actor",
      "Assume the same events always happen in this order"
    ],
    answerIndex: 0,
    explanation: "T1486 describes Data Encrypted for Impact. A technique helps describe observed behavior; it does not identify an actor or prove a universal sequence. Coordinate containment and recovery through the organization's response plan.",
    url: "https://attack.mitre.org/techniques/T1486/",
    linkText: "Review T1486"
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
const exerciseContainer = document.querySelector("#mitre-exercises");
let currentQuestion = 0;
let selectedAnswer = null;
let quizScore = 0;
let questionAnswered = false;

function renderMitreExercises() {
  exerciseContainer.innerHTML = mitreExercises.map((exercise, exerciseIndex) => `
    <article class="exercise-card" data-exercise="${exerciseIndex}">
      <p class="exercise-number">EXERCISE 0${exerciseIndex + 1}</p>
      <p class="exercise-scenario">${exercise.scenario}</p>
      <h4 class="exercise-prompt" id="exercise-prompt-${exerciseIndex}">${exercise.prompt}</h4>
      <div class="quiz-options exercise-options" role="group" aria-labelledby="exercise-prompt-${exerciseIndex}">
        ${exercise.choices.map((choice, choiceIndex) => `
          <button class="quiz-option exercise-option" type="button" data-choice="${choiceIndex}" aria-pressed="false">
            <span class="quiz-option-marker" aria-hidden="true">${String.fromCharCode(65 + choiceIndex)}</span>
            <span>${choice}</span>
          </button>`).join("")}
      </div>
      <p class="exercise-feedback" aria-live="polite" hidden></p>
      <a class="exercise-reference" href="${exercise.url}" target="_blank" rel="noopener noreferrer" hidden>${exercise.linkText} <span aria-hidden="true">↗</span></a>
      <div class="exercise-actions"><button class="quiz-button exercise-check" type="button" disabled>Check answer</button></div>
    </article>`).join("");

  exerciseContainer.querySelectorAll(".exercise-card").forEach((card) => {
    const exercise = mitreExercises[Number(card.dataset.exercise)];
    const options = [...card.querySelectorAll(".exercise-option")];
    const checkButton = card.querySelector(".exercise-check");
    let selectedChoice = null;

    options.forEach((button) => {
      button.addEventListener("click", () => {
        if (card.dataset.answered === "true") return;
        selectedChoice = Number(button.dataset.choice);
        options.forEach((option) => {
          const selected = option === button;
          option.classList.toggle("is-selected", selected);
          option.setAttribute("aria-pressed", String(selected));
        });
        checkButton.disabled = false;
      });
    });

    checkButton.addEventListener("click", () => {
      if (selectedChoice === null || card.dataset.answered === "true") return;
      card.dataset.answered = "true";
      options.forEach((option) => {
        const choiceIndex = Number(option.dataset.choice);
        option.disabled = true;
        if (choiceIndex === exercise.answerIndex) option.classList.add("is-correct");
        else if (choiceIndex === selectedChoice) option.classList.add("is-incorrect");
      });
      const feedback = card.querySelector(".exercise-feedback");
      feedback.textContent = `${selectedChoice === exercise.answerIndex ? "Correct!" : "Review this one."} ${exercise.explanation}`;
      feedback.hidden = false;
      card.querySelector(".exercise-reference").hidden = false;
      checkButton.hidden = true;
    });
  });
}

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
renderMitreExercises();
