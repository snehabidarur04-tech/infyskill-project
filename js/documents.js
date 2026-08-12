function renderDocuments(){
  const el = document.getElementById("pageContent");
  const docs = [
    {name:"Trainer contract - Arjun Reddy", type:"Contract", status:"Verified", date:"4 Aug 2026"},
    {name:"Invoice approval form - INV-2026-0670", type:"Invoice", status:"Pending", date:"2 Aug 2026"},
    {name:"Trainer ID verification - Kavya Nair", type:"Verification", status:"Expiring soon", date:"30 Jul 2026"},
    {name:"Client agreement - SV Engineering College", type:"Agreement", status:"Signed", date:"28 Jul 2026"}
  ];

  const verified = docs.filter(d => d.status === "Verified" || d.status === "Signed").length;
  const pending = docs.filter(d => d.status === "Pending").length;
  const expiring = docs.filter(d => d.status === "Expiring soon").length;

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Documents</h1>
        <p class="lede">Centralize session contracts, invoices, verification records and delivery artifacts.</p>
      </div>
      <button class="btn btn-primary" onclick="Utils.toast('Document upload placeholder (demo).')">${ICONS.plus} Upload document</button>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.file}</div><div class="stat-body"><span>Total documents</span><strong>${docs.length}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.checkCircle}</div><div class="stat-body"><span>Verified or signed</span><strong>${verified}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.alert}</div><div class="stat-body"><span>Pending review</span><strong>${pending}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon teal">${ICONS.clock}</div><div class="stat-body"><span>Expiring soon</span><strong>${expiring}</strong></div></div>
    </div>

    <div class="dash-grid">
      <div class="card card-pad">
        <div class="section-head"><h3>Document library</h3><a class="see-all" href="documents.html">Refresh list ${ICONS.arrowRight}</a></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Document</th><th>Type</th><th>Status</th><th>Date</th><th></th></tr></thead>
            <tbody>
              ${docs.map(d => `
                <tr>
                  <td>${d.name}</td>
                  <td>${d.type}</td>
                  <td>${d.status === "Verified" ? '<span class="status-pill status-completed">Verified</span>' : d.status === "Signed" ? '<span class="status-pill status-approved">Signed</span>' : '<span class="status-pill status-awaiting">'+d.status+'</span>'}</td>
                  <td>${d.date}</td>
                  <td><button class="btn btn-outline btn-sm" onclick="Utils.toast('Previewing document (demo).')">Preview</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card card-pad">
        <div class="section-head"><h3>Document workflow</h3></div>
        <div class="field-row" style="gap:14px;margin-bottom:16px;">
          <div class="field"><label>Last uploaded</label><p>2 Aug 2026</p></div>
          <div class="field"><label>Ready for approval</label><p>${pending} documents</p></div>
        </div>
        <div class="text-muted" style="font-size:13px;line-height:1.7;">Use this space to keep visible records for contract sign-offs, training agreements, and invoice authorization. Any changes are captured immediately.</div>
      </div>
    </div>
  `;

  window.onGlobalSearch = (val) => {
    const q = val.toLowerCase();
    Array.from(document.querySelectorAll("table.data-table tbody tr")).forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  };
}
