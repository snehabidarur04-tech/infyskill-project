function renderInvoices(){
  const el = document.getElementById("pageContent");
  const invoices = window.MOCK.invoices;
  const tabs = ["All","Submitted","Under Review","Changes Requested","Approved","Payment Due","Paid","Disputed"];
  let activeTab = "All";

  const totalPending = invoices.filter(i => ["Submitted","Under Review"].includes(i.status)).reduce((s,i)=>s+i.total,0);
  const totalApproved = invoices.filter(i => i.status==="Approved").reduce((s,i)=>s+i.total,0);
  const totalPaid = invoices.filter(i => i.status==="Paid").reduce((s,i)=>s+i.total,0);
  const totalDisputed = invoices.filter(i => i.status==="Disputed").reduce((s,i)=>s+i.total,0);
  const oldestOpen = invoices.filter(i => i.status !== "Paid").sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Invoices</h1>
        <p class="lede">Review, approve and track invoices generated from accepted assignments.</p>
      </div>
      <button class="btn btn-outline" onclick="Utils.toast('Invoices exported as CSV (demo).')">${ICONS.download} Export</button>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.invoice}</div><div class="stat-body"><span>Pending review</span><strong>${Utils.formatINR(totalPending)}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.checkCircle}</div><div class="stat-body"><span>Approved, unpaid</span><strong>${Utils.formatINR(totalApproved)}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.wallet}</div><div class="stat-body"><span>Paid this period</span><strong>${Utils.formatINR(totalPaid)}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber" style="background:var(--red-050);color:var(--red-600);">${ICONS.alert}</div><div class="stat-body"><span>Disputed</span><strong>${Utils.formatINR(totalDisputed)}</strong></div></div>
    </div>

    <div class="dash-grid">
      <div>
        <div class="card">
          <div class="section-head"><h3>Invoice register</h3><span class="see-all">${invoices.length} invoices</span></div>
          <div class="tab-row" id="invTabs">${tabs.map(t=>`<button class="tab-btn ${t==='All'?'active':''}" data-tab="${t}">${t}</button>`).join("")}</div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Invoice</th><th>Trainer</th><th>College/Client</th><th>Raised</th><th>Due</th><th>Amount</th><th>Status</th><th></th></tr></thead>
              <tbody id="invBody"></tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card card-pad">
        <div class="section-head"><h3>Invoice health</h3></div>
        <div class="detail-card">
          <strong style="font-size:18px;">${oldestOpen ? oldestOpen.id : 'No open invoices'}</strong>
          <p class="text-muted" style="margin-top:8px;">${oldestOpen ? `${oldestOpen.trainer} · due ${Utils.formatDate(oldestOpen.dueDate)}` : 'All invoices are settled.'}</p>
        </div>
        <div class="detail-card" style="margin-top:14px;">
          <h4 style="font-size:13px;color:var(--ink-500);margin-bottom:10px;">Action items</h4>
          <ul style="padding-left:18px;color:var(--ink-700);font-size:13px;line-height:1.7;">
            <li>Approve invoices under review.</li>
            <li>Follow up on overdue payments.</li>
            <li>Resolve disputed items before finance close.</li>
          </ul>
        </div>
      </div>
    </div>

    <div id="invModal" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal-box" id="invModalBox"></div>
    </div>
  `;

  function paint(){
    const q = (window.__searchQuery||"").toLowerCase();
    const list = invoices.filter(i => {
      if (activeTab!=="All" && i.status!==activeTab) return false;
      if (q && !(i.id.toLowerCase().includes(q) || i.trainer.toLowerCase().includes(q) || i.college.toLowerCase().includes(q))) return false;
      return true;
    });
    document.getElementById("invBody").innerHTML = list.length ? list.map(i => `
      <tr>
        <td class="text-muted">${i.id}</td>
        <td><div class="person-cell">${Utils.avatarHTML(i.trainer,30)}<div class="who"><strong>${i.trainer}</strong></div></div></td>
        <td>${i.college}</td>
        <td>${Utils.formatDate(i.raisedOn)}</td>
        <td>${Utils.formatDate(i.dueDate)}</td>
        <td>${Utils.formatINR(i.total)}</td>
        <td>${Utils.statusPill(i.status)}</td>
        <td><button class="btn btn-outline btn-sm" onclick="openInvoiceModal('${i.id}')">Review</button></td>
      </tr>
    `).join("") : `<tr><td colspan="8"><div class="empty-state"><div class="icon-wrap">${ICONS.invoice}</div><h4>No invoices here</h4><p>Try another tab or clear your search.</p></div></td></tr>`;
  }

  document.getElementById("invTabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn"); if (!btn) return;
    Utils.qsa(".tab-btn", document.getElementById("invTabs")).forEach(b=>b.classList.remove("active"));
    btn.classList.add("active"); activeTab = btn.dataset.tab; paint();
  });
  window.onGlobalSearch = (val) => { window.__searchQuery = val; paint(); };
  document.getElementById("invModal").addEventListener("click", (e) => { if (e.target.id==="invModal") Utils.closeModal("invModal"); });

  paint();
}

function openInvoiceModal(id){
  const i = window.MOCK.invoices.find(x => x.id === id);
  const bills = window.MOCK.expenseBills.filter(b => b.invoiceId === id);
  document.getElementById("invModalBox").innerHTML = `
    <div class="modal-head"><h3>${i.id}</h3><button class="modal-close" onclick="Utils.closeModal('invModal')" aria-label="Close">${ICONS.x}</button></div>
    <div class="modal-body">
      <div class="eyebrow-row" style="margin-bottom:14px;">${Utils.statusPill(i.status)}</div>
      <div class="grid-2">
        <div class="field"><label>Trainer</label><p style="font-size:13.5px;">${i.trainer}</p></div>
        <div class="field"><label>College/Client</label><p style="font-size:13.5px;">${i.college}</p></div>
        <div class="field"><label>Raised on</label><p style="font-size:13.5px;">${Utils.formatDate(i.raisedOn)}</p></div>
        <div class="field"><label>Due date</label><p style="font-size:13.5px;">${Utils.formatDate(i.dueDate)}</p></div>
      </div>
      <div class="field"><label>Trainer fee</label><p style="font-size:13.5px;">${Utils.formatINR(i.amount)}</p></div>
      ${bills.length ? `
      <div class="field"><label>Attached expense bills</label></div>
      <div class="table-wrap" style="margin-bottom:8px;">
        <table class="data-table">
          <thead><tr><th>Category</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>${bills.map(b=>`<tr><td>${b.category}</td><td>${b.description}</td><td>${Utils.formatINR(b.amount)}</td><td>${Utils.statusPill(b.status)}</td></tr>`).join("")}</tbody>
        </table>
      </div>` : ""}
      <div class="flex-between" style="border-top:1px solid var(--ink-100);padding-top:12px;">
        <strong style="font-size:13.5px;">Total</strong>
        <strong style="font-size:16px;">${Utils.formatINR(i.total)}</strong>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-outline" onclick="Utils.toast('Sent back for changes.'); Utils.closeModal('invModal');">${ICONS.edit} Request Changes</button>
      <button class="btn btn-primary" onclick="Utils.toast('Invoice ${i.id} approved.'); Utils.closeModal('invModal');">${ICONS.checkCircle} Approve</button>
    </div>
  `;
  Utils.openModal("invModal");
}
