/* Renders the app shell: sidebar + topbar. Injected into every page. */

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { key: "overview", label: "Overview", href: "index.html", icon: "overview" },
      { key: "find", label: "Find Trainers", href: "find-trainers.html", icon: "users" },
      { key: "shortlist", label: "Shortlisted", href: "shortlisted.html", icon: "star" },
      { key: "requirements", label: "Requirements", href: "requirements.html", icon: "clipboard" }
    ]
  },
  {
    label: "Operations",
    items: [
      { key: "trainers", label: "Trainers", href: "trainers.html", icon: "users" },
      { key: "colleges", label: "Colleges & Clients", href: "colleges.html", icon: "building" },
      { key: "assignments", label: "Assignments", href: "assignments.html", icon: "clipboard" },
      { key: "calendar", label: "Calendar", href: "calendar.html", icon: "calendar" },
      { key: "documents", label: "Documents", href: "documents.html", icon: "file" }
    ]
  },
  {
    label: "Finance",
    items: [
      { key: "invoices", label: "Invoices", href: "invoices.html", icon: "invoice" },
      { key: "bills", label: "Expenses", href: "bills-expenses.html", icon: "receipt" },
      { key: "payments", label: "Payments", href: "payments.html", icon: "wallet" }
    ]
  },
  {
    label: "Insights",
    items: [
      { key: "reports", label: "Reports", href: "reports.html", icon: "chart" },
      { key: "analytics", label: "Analytics", href: "analytics.html", icon: "trending" }
    ]
  },
  {
    label: "Team & Account",
    items: [
      { key: "team", label: "Team", href: "team.html", icon: "team" },
      { key: "templates", label: "Templates", href: "templates.html", icon: "layers" },
      { key: "subscription", label: "Subscription", href: "subscription.html", icon: "creditCard" },
      { key: "settings", label: "Settings", href: "settings.html", icon: "shield" },
      { key: "support", label: "Support", href: "support.html", icon: "support" }
    ]
  }
];

const BRAND_MARK = '<img class="brand-mark-img" src="assets/infyskill-mark.png" alt="">';

function renderShell(activeKey){
  const root = document.getElementById("app-shell-root");
  if (!root) return;

  const navHTML = NAV_GROUPS.map(group => `
    <div class="nav-group">
      <div class="nav-group-label">${group.label}</div>
      ${group.items.map(item => `
        <a class="nav-item ${item.key===activeKey ? 'active':''}" href="${item.href}" ${item.key===activeKey ? 'aria-current="page"' : ''}>
          <span class="nav-icon">${ICONS[item.icon]}</span>
          <span>${item.label}</span>
        </a>
      `).join("")}
    </div>
  `).join("");

  const notifs = (window.MOCK && window.MOCK.notifications) || [];
  const unread = notifs.filter(n => !n.read).length;
  const notifTypeColor = { invoice: "var(--blue-600)", assignment: "var(--teal-600)", payment: "var(--green-600)", exception: "var(--red-600)", document: "var(--amber-600)" };

  const notifHTML = notifs.slice(0, 6).map(n => `
    <button class="dropdown-item" type="button">
      <span class="dot" style="background:${notifTypeColor[n.type]||'var(--ink-400)'}"></span>
      <div>
        <p><strong>${n.title}</strong></p>
        <p>${n.body}</p>
        <time>${n.time}</time>
      </div>
    </button>
  `).join("");

  root.innerHTML = `
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <aside class="sidebar" id="sidebar" aria-label="Primary navigation">
      <div class="sidebar-brand">
        <div class="logo-mark">${BRAND_MARK}</div>
        <div class="brand-text">
          <strong>InfySkill</strong>
          <span>Trainers Connect</span>
        </div>
      </div>
      <div class="sidebar-scroll">${navHTML}</div>
      <div class="sidebar-footer">
        <div class="workspace-panel">
          <span class="workspace-label">Active workspace</span>
          <div class="workspace-pill">Sneha · Operations</div>
        </div>
        <div class="profile-panel">
          <div class="profile-brief">
            <img class="avatar" src="https://i.pravatar.cc/150?img=5" alt="Sneha">
            <div>
              <strong>Sneha</strong>
              <span>Owner · InfySkill Operations</span>
            </div>
          </div>
          <div class="profile-actions">
            <a href="settings.html">Settings</a>
            <button type="button" onclick="Utils.toast('Signed out (demo).')">Logout</button>
          </div>
        </div>
      </div>
    </aside>

    <div class="main-col">
      <header class="topbar">
        <div class="topbar-left">
          <div class="topbar-brand">
            <div class="brand-copy">
              <strong>InfySkill</strong>
              <span>TRAINERS CONNECT</span>
            </div>
          </div>
        </div>
        <label class="search-field" for="globalSearch">
          ${ICONS.search}
          <input id="globalSearch" type="search" placeholder="Search trainers, colleges, assignments..." aria-label="Search trainers, colleges, and assignments">
        </label>
        <div class="topbar-right">
          <div class="topbar-anchor">
            <button class="icon-btn" id="notifBtn" aria-haspopup="true" aria-expanded="false" aria-label="Notifications, ${unread} unread">
              ${ICONS.bell}
              ${unread ? `<span class="notif-dot">${unread}</span>` : ""}
            </button>
            <div class="dropdown-panel" id="notifPanel" role="menu">
              <div class="dropdown-header"><h4>Notifications</h4><a href="notifications.html">View all</a></div>
              <div class="dropdown-list">${notifHTML || '<p class="dropdown-empty">You are all caught up.</p>'}</div>
            </div>
          </div>
          <a class="btn btn-secondary" href="subscription.html">Subscription</a>
          <a class="btn btn-primary header-action" href="assignments.html">Post a requirement</a>
          <div class="auth-buttons">
            <button type="button" class="btn btn-primary" id="loginDrawerBtn">Log In</button>
          </div>
        </div>
      </header>
      <main class="page" id="pageContent" tabindex="-1"></main>
    <div class="login-overlay" id="loginOverlay"></div>
    <div class="login-drawer" id="loginDrawer" role="dialog" aria-modal="true" aria-labelledby="loginDrawerTitle">
      <div class="login-drawer-header">
        <h3 id="loginDrawerTitle">Welcome back</h3>
        <button type="button" class="icon-btn" id="closeLoginDrawer" aria-label="Close login panel">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="login-drawer-body">
        <p class="login-drawer-subtitle">Access your trainer dashboard</p>
        <form class="login-form" id="loginDrawerForm">
          <div class="form-group">
            <label for="drawerEmail">Email or Username</label>
            <input type="text" id="drawerEmail" name="email" placeholder="Enter your email or username" required autocomplete="username" />
          </div>
          <div class="form-group">
            <label for="drawerPassword">Password</label>
            <input type="password" id="drawerPassword" name="password" placeholder="Enter your password" required autocomplete="current-password" />
          </div>
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" name="remember" id="drawerRemember">
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-password" id="drawerForgotPassword">Forgot password?</a>
          </div>
          <button type="submit" class="btn btn-primary btn-large">Log In</button>
        </form>
        <div class="login-drawer-footer">
          <p>Don't have an account? <a href="#" class="create-account" id="drawerCreateAccount">Create one</a></p>
        </div>
      </div>
    </div>
  `;

  setupLoginDrawer();
  const overlay = document.getElementById("sidebarOverlay");
  const toggle = document.getElementById("menuToggle");
  if (toggle && sidebar && overlay){
    toggle.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("open");
      overlay.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("open");
      toggle.setAttribute("aria-expanded","false");
    });
  }

  setupDropdown("notifBtn","notifPanel");
  setupDropdown("profileBtn","profilePanel");
  setupDropdown("workspaceBtn","workspacePanel");

  const helpBtn = document.getElementById("helpBtn");
  if (helpBtn){
    helpBtn.addEventListener("click", () => {
      Utils.toast('Open help center from the support page.');
    });
  }

  document.querySelectorAll(".dropdown-panel").forEach(panel => {
    panel.addEventListener("click", event => event.stopPropagation());
  });

  const searchInput = document.getElementById("globalSearch");
  if (searchInput){
    searchInput.addEventListener("input", Utils.debounce((e) => {
      if (typeof window.onGlobalSearch === "function"){
        window.onGlobalSearch(e.target.value);
      }
    }, 220));
  }
}

function setupDropdown(btnId, panelId){
  const btn = document.getElementById(btnId);
  const panel = document.getElementById(panelId);
  if (!btn || !panel) return;

  function close(){
    panel.classList.remove("open");
    btn.setAttribute("aria-expanded","false");
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const willOpen = !panel.classList.contains("open");
    document.querySelectorAll(".dropdown-panel.open").forEach(p => p.classList.remove("open"));
    if (willOpen) panel.classList.add("open");
    btn.setAttribute("aria-expanded", String(willOpen));
  });

  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) close();
  });

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}

function setupLoginDrawer(){
  const drawer = document.getElementById("loginDrawer");
  const overlay = document.getElementById("loginOverlay");
  const openBtn = document.getElementById("loginDrawerBtn");
  const closeBtn = document.getElementById("closeLoginDrawer");
  const form = document.getElementById("loginDrawerForm");
  if (!drawer || !overlay || !openBtn) return;

  function openDrawer(){
    drawer.classList.add("open");
    overlay.classList.add("open");
    document.body.classList.add("drawer-open");
    const firstInput = drawer.querySelector("input");
    if (firstInput) setTimeout(() => firstInput.focus(), 50);
  }

  function closeDrawer(){
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.classList.remove("drawer-open");
  }

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openDrawer();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
  });

  if (form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("drawerEmail").value;
      const password = document.getElementById("drawerPassword").value;
      if (email && password){
        Utils.toast("Login successful! (demo)");
        closeDrawer();
      }
    });
  }

  const forgot = document.getElementById("drawerForgotPassword");
  if (forgot){
    forgot.addEventListener("click", (e) => {
      e.preventDefault();
      Utils.toast("Password recovery not yet implemented.");
    });
  }

  const create = document.getElementById("drawerCreateAccount");
  if (create){
    create.addEventListener("click", (e) => {
      e.preventDefault();
      Utils.toast("Sign up not yet implemented.");
    });
  }
}

window.addEventListener("hashchange", () => {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.remove("open");
});
