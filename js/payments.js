function renderPayments(){
  const el = document.getElementById("pageContent");
  const payments = window.MOCK.payments;
  const tabs = ["All","Paid","Partially Paid","Due","Overdue"];
  let activeTab = "All";

  const totalPaid = payments.filter(p=>p.status==="Paid").reduce((s,p)=>s+p.amount,0);
  const totalDue = payments.filter(p=>p.status==="Due").length;
  const totalOverdue = payments.filter(p=>p.status==="Overdue").length;
  const totalPartial = payments.filter(p=>p.status==="Partially Paid").reduce((s,p)=>s+p.amount,0);
  const nextPayment = payments.filter(p => p.status !== "Paid").sort((a,b) => new Date(a.date) - new Date(b.date))[0];

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Payments</h1>
        <p class="lede">Track payment status, record proof and reconcile invoices with what has actually been paid.</p>
      </div>
      <div class="page-head-actions">
        <button class="btn btn-outline" onclick="Utils.toast('Payments exported as CSV (demo).')">${ICONS.download} Export</button>
        <button class="btn btn-primary" onclick="openRecordPaymentModal()">${ICONS.plus} Record Payment</button>
      </div>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon green">${ICONS.wallet}</div><div class="stat-body"><span>Paid this period</span><strong>${Utils.formatINR(totalPaid)}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.clock}</div><div class="stat-body"><span>Partially paid</span><strong>${Utils.formatINR(totalPartial)}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.invoice}</div><div class="stat-body"><span>Due this month</span><strong>${totalDue}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber" style="background:var(--red-050);color:var(--red-600);">${ICONS.alert}</div><div class="stat-body"><span>Overdue</span><strong>${totalOverdue}</strong></div></div>
    </div>

    <div class="dash-grid">
      <div>
        <div class="card">
          <div class="section-head"><h3>Payment ledger</h3><span class="see-all">${payments.length} records</span></div>
          <div class="tab-row" id="payTabs">${tabs.map(t=>`<button class="tab-btn ${t==='All'?'active':''}" data-tab="${t}">${t}</button>`).join("")}</div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Payment</th><th>Invoice</th><th>Trainer</th><th>College/Client</th><th>Method</th><th>Reference</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody id="payBody"></tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card card-pad">
        <div class="section-head"><h3>Payment runway</h3></div>
        <div class="detail-card">
          <strong style="font-size:18px;">${nextPayment ? nextPayment.invoiceId : 'All caught up'}</strong>
          <p class="text-muted" style="margin-top:8px;">${nextPayment ? `${nextPayment.trainer} · ${Utils.formatDate(nextPayment.date)} · ${Utils.statusPill(nextPayment.status)}` : 'No upcoming settlement actions.'}</p>
        </div>
        <div class="detail-card" style="margin-top:14px;">
          <h4 style="font-size:13px;color:var(--ink-500);margin-bottom:10px;">What to do next</h4>
          <ul style="padding-left:18px;color:var(--ink-700);font-size:13px;line-height:1.7;">
            <li>Upload payment proof for due invoices.</li>
            <li>Resolve overdue transactions with finance.</li>
            <li>Confirm partial payments and update balances.</li>
          </ul>
        </div>
      </div>
    </div>

    <div id="payModal" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal-box" id="payModalBox"></div>
    </div>
  `;

  function paint(){
    const q = (window.__searchQuery||"").toLowerCase();
    const list = payments.filter(p => {
      if (activeTab!=="All" && p.status!==activeTab) return false;
      if (q && !(p.id.toLowerCase().includes(q) || p.trainer.toLowerCase().includes(q) || p.college.toLowerCase().includes(q) || p.invoiceId.toLowerCase().includes(q))) return false;
      return true;
    });
    document.getElementById("payBody").innerHTML = list.length ? list.map(p => `
      <tr>
        <td class="text-muted">${p.id}</td>
        <td>${p.invoiceId}</td>
        <td><div class="person-cell">${Utils.avatarHTML(p.trainer,30)}<div class="who"><strong>${p.trainer}</strong></div></div></td>
        <td>${p.college}</td>
        <td>${p.method}</td>
        <td class="text-muted">${p.reference}</td>
        <td>${Utils.formatDate(p.date)}</td>
        <td>${Utils.formatINR(p.amount)}</td>
        <td>${Utils.statusPill(p.status)}</td>
      </tr>
    `).join("") : `<tr><td colspan="9"><div class="empty-state"><div class="icon-wrap">${ICONS.wallet}</div><h4>No payments here</h4><p>Try another tab or clear your search.</p></div></td></tr>`;
  }

  document.getElementById("payTabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn"); if (!btn) return;
    Utils.qsa(".tab-btn", document.getElementById("payTabs")).forEach(b=>b.classList.remove("active"));
    btn.classList.add("active"); activeTab = btn.dataset.tab; paint();
  });
  window.onGlobalSearch = (val) => { window.__searchQuery = val; paint(); };
  document.getElementById("payModal").addEventListener("click", (e) => { if (e.target.id==="payModal") Utils.closeModal("payModal"); });

  paint();
}

function openRecordPaymentModal(){
  const dueList = window.MOCK.payments.filter(p => p.status==="Due" || p.status==="Overdue" || p.status==="Partially Paid");
  document.getElementById("payModalBox").innerHTML = `
    <div class="modal-head"><h3>Record a Payment</h3><button class="modal-close" onclick="Utils.closeModal('payModal')" aria-label="Close">${ICONS.x}</button></div>
    <div class="modal-body">
      <div class="field">
        <label for="rp-invoice">Invoice</label>
        <select id="rp-invoice" class="input">
          ${dueList.map(p=>`<option value="${p.id}">${p.invoiceId} — ${p.trainer} · ${Utils.formatINR( (window.MOCK.invoices.find(i=>i.id===p.invoiceId)||{}).total || 0)}</option>`).join("")}
        </select>
      </div>
      <div class="field-row">
        <div class="field"><label for="rp-amount">Amount paid</label><input class="input" type="number" id="rp-amount" placeholder="e.g. 42000"></div>
        <div class="field"><label for="rp-method">Method</label>
          <select id="rp-method" class="input">
            <option>UPI</option><option>NEFT</option><option>RTGS</option><option>Cheque</option><option>Cash</option>
          </select>
        </div>
      </div>
      <div class="field-row">
        <div class="field"><label for="rp-ref">Reference / UTR</label><input class="input" type="text" id="rp-ref" placeholder="e.g. UTR2608060012"></div>
        <div class="field"><label for="rp-date">Payment date</label><input class="input" type="date" id="rp-date"></div>
      </div>
      <div class="dropzone" onclick="Utils.toast('Receipt attached (demo).')">
        ${ICONS.upload}
        <strong>Upload payment proof</strong>
        <span>PDF or image, up to 10MB</span>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-outline" onclick="Utils.closeModal('payModal')">Cancel</button>
      <button class="btn btn-primary" onclick="Utils.toast('Payment recorded and invoice updated.'); Utils.closeModal('payModal');">${ICONS.checkCircle} Save Payment</button>
    </div>
  `;
  Utils.openModal("payModal");
}
