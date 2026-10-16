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
