function renderBills(){
  const el = document.getElementById("pageContent");
  const bills = window.MOCK.expenseBills;
  const tabs = ["All","Pending","Approved","Flagged"];
  let activeTab = "All";

  const totalPending = bills.filter(b=>b.status==="Pending").reduce((s,b)=>s+b.amount,0);
  const totalApproved = bills.filter(b=>b.status==="Approved").reduce((s,b)=>s+b.amount,0);
  const totalFlagged = bills.filter(b=>b.status==="Flagged").length;
  const byCategory = {};
  bills.forEach(b => { byCategory[b.category] = (byCategory[b.category]||0) + b.amount; });
  const maxCat = Math.max(1, ...Object.values(byCategory));

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Bills &amp; Expenses</h1>
        <p class="lede">Review trainer-submitted expense bills — travel, accommodation, food and materials — against assignment allowances.</p>
      </div>
      <button class="btn btn-outline" onclick="Utils.toast('Expense report exported (demo).')">${ICONS.download} Export</button>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.receipt}</div><div class="stat-body"><span>Pending review</span><strong>${Utils.formatINR(totalPending)}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.checkCircle}</div><div class="stat-body"><span>Approved</span><strong>${Utils.formatINR(totalApproved)}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber" style="background:var(--red-050);color:var(--red-600);">${ICONS.alert}</div><div class="stat-body"><span>Flagged bills</span><strong>${totalFlagged}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.file}</div><div class="stat-body"><span>Total bills logged</span><strong>${bills.length}</strong></div></div>
    </div>

    <div class="dash-grid">
      <div>
        <div class="tab-row" id="billTabs">${tabs.map(t=>`<button class="tab-btn ${t==='All'?'active':''}" data-tab="${t}">${t}</button>`).join("")}</div>
        <div class="card">
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Bill</th><th>Trainer</th><th>Invoice</th><th>Category</th><th>Description</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr></thead>
              <tbody id="billBody"></tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card" style="padding:20px;">
        <h3 style="font-size:14px;margin-bottom:14px;">Spend by category</h3>
        ${Object.entries(byCategory).map(([cat,amt]) => `
          <div style="margin-bottom:12px;">
            <div class="flex-between" style="margin-bottom:6px;font-size:12.5px;"><span>${cat}</span><strong>${Utils.formatINR(amt)}</strong></div>
            <div class="progress-track"><div class="progress-fill" style="width:${(amt/maxCat*100).toFixed(0)}%;"></div></div>
          </div>
        `).join("")}
      </div>
    </div>

    <div id="billModal" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal-box" id="billModalBox"></div>
    </div>
  `;

  function paint(){
    const q = (window.__searchQuery||"").toLowerCase();
    const list = bills.filter(b => {
      if (activeTab!=="All" && b.status!==activeTab) return false;
      if (q && !(b.trainer.toLowerCase().includes(q) || b.category.toLowerCase().includes(q) || b.description.toLowerCase().includes(q))) return false;
      return true;
    });
    document.getElementById("billBody").innerHTML = list.length ? list.map(b => `
      <tr>
        <td class="text-muted">${b.id}</td>
        <td><div class="person-cell">${Utils.avatarHTML(b.trainer,30)}<div class="who"><strong>${b.trainer}</strong></div></div></td>
        <td>${b.invoiceId}</td>
        <td>${b.category}</td>
        <td class="text-muted">${b.description}</td>
        <td>${Utils.formatDate(b.date)}</td>
        <td>${Utils.formatINR(b.amount)}</td>
        <td>${Utils.statusPill(b.status)}</td>
        <td><button class="btn btn-outline btn-sm" onclick="openBillModal('${b.id}')">Review</button></td>
      </tr>
    `).join("") : `<tr><td colspan="9"><div class="empty-state"><div class="icon-wrap">${ICONS.receipt}</div><h4>No bills here</h4><p>Try another tab or clear your search.</p></div></td></tr>`;
  }

  document.getElementById("billTabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn"); if (!btn) return;
    Utils.qsa(".tab-btn", document.getElementById("billTabs")).forEach(b=>b.classList.remove("active"));
    btn.classList.add("active"); activeTab = btn.dataset.tab; paint();
  });
  window.onGlobalSearch = (val) => { window.__searchQuery = val; paint(); };
  document.getElementById("billModal").addEventListener("click", (e) => { if (e.target.id==="billModal") Utils.closeModal("billModal"); });

  paint();
}

function openBillModal(id){
  const b = window.MOCK.expenseBills.find(x => x.id === id);
  document.getElementById("billModalBox").innerHTML = `
    <div class="modal-head"><h3>${b.id}</h3><button class="modal-close" onclick="Utils.closeModal('billModal')" aria-label="Close">${ICONS.x}</button></div>
    <div class="modal-body">
      <div class="eyebrow-row" style="margin-bottom:14px;">${Utils.statusPill(b.status)}</div>
      <div class="grid-2">
        <div class="field"><label>Trainer</label><p style="font-size:13.5px;">${b.trainer}</p></div>
        <div class="field"><label>Linked invoice</label><p style="font-size:13.5px;">${b.invoiceId}</p></div>
        <div class="field"><label>Category</label><p style="font-size:13.5px;">${b.category}</p></div>
        <div class="field"><label>Date</label><p style="font-size:13.5px;">${Utils.formatDate(b.date)}</p></div>
      </div>
      <div class="field"><label>Description</label><p style="font-size:13.5px;">${b.description}</p></div>
      <div class="field"><label>Receipt</label>
        <div class="dropzone" style="cursor:default;" onclick="return false;">
          ${ICONS.file}
          <strong>${b.receipt}</strong>
          <span>OCR-extracted amount and date confirmed by trainer</span>
        </div>
      </div>
      <div class="flex-between" style="border-top:1px solid var(--ink-100);padding-top:12px;">
        <strong style="font-size:13.5px;">Amount claimed</strong>
        <strong style="font-size:16px;">${Utils.formatINR(b.amount)}</strong>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-outline" onclick="Utils.toast('Sent back to ${b.trainer} for correction.'); Utils.closeModal('billModal');">${ICONS.edit} Request Changes</button>
      <button class="btn btn-primary" onclick="Utils.toast('Bill ${b.id} approved.'); Utils.closeModal('billModal');">${ICONS.checkCircle} Approve</button>
    </div>
  `;
  Utils.openModal("billModal");
}
