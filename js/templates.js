function renderTemplates(){
  const el = document.getElementById("pageContent");
  const templates = [
    { title:"Assignment brief", desc:"Base template for new training requirements and delivery scope.", tag:"Most used" },
    { title:"Invoice approval request", desc:"Email style summary to send to finance for invoice review.", tag:"Finance" },
    { title:"Trainer onboarding", desc:"Standard onboarding checklist for newly invited trainers.", tag:"Operations" },
    { title:"Client engagement plan", desc:"Proposal and agenda template for college/client outreach." }
  ];

  const usedMost = templates.find(t => t.tag === "Most used");

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Templates</h1>
        <p class="lede">Centralize reusable briefs, invoices, onboarding forms and client outreach templates.</p>
      </div>
      <button class="btn btn-primary" onclick="Utils.toast('New template flow opened (demo).')">${ICONS.plus} Create Template</button>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon teal">${ICONS.layers}</div><div class="stat-body"><span>Total templates</span><strong>${templates.length}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.checkCircle}</div><div class="stat-body"><span>Most used</span><strong>${usedMost ? usedMost.title : '—'}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.team}</div><div class="stat-body"><span>Categories</span><strong>${new Set(templates.map(t => t.tag || 'General')).size}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.document}</div><div class="stat-body"><span>Last updated</span><strong>2 days ago</strong></div></div>
    </div>

    <div class="dash-grid">
      <div>
        <div class="plan-grid">
          ${templates.map(t => `
            <div class="card plan-card">
              ${t.tag ? `<span class="plan-tag">${t.tag}</span>` : ""}
              <h4>${t.title}</h4>
              <p class="text-muted" style="font-size:13px;line-height:1.6;">${t.desc}</p>
              <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">
                <button class="btn btn-outline btn-sm" onclick="Utils.toast('Previewing ${t.title} (demo).')">Preview</button>
                <button class="btn btn-primary btn-sm" onclick="Utils.toast('Using ${t.title} template (demo).')">Use</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="card card-pad">
        <div class="section-head"><h3>Template library</h3></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Template</th><th>Category</th><th>Last updated</th><th></th></tr></thead>
            <tbody>
              ${templates.map(t => `
                <tr>
                  <td>${t.title}</td>
                  <td>${t.tag || "General"}</td>
                  <td>${Math.floor(Math.random() * 6) + 2} days ago</td>
                  <td><button class="btn btn-outline btn-sm" onclick="Utils.toast('Editing ${t.title} (demo).')">Edit</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
