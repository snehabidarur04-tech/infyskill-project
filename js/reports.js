function renderReports(){
  const el = document.getElementById("pageContent");
  const r = window.MOCK.reports;
  const maxSpend = Math.max(...r.monthlySpend.map(m=>m.value));
  const totalAssignments = r.assignmentsByStatus.reduce((s,x)=>s+x.value,0);
  const totalAging = r.agingBuckets.reduce((s,x)=>s+x.value,0);
  const ytdSpend = r.monthlySpend.reduce((s,m)=>s+m.value,0);

  // Build a simple conic-gradient donut from assignmentsByStatus
  let acc = 0;
  const gradientStops = r.assignmentsByStatus.map(s => {
    const start = (acc/totalAssignments)*360;
    acc += s.value;
    const end = (acc/totalAssignments)*360;
    return `${s.color} ${start}deg ${end}deg`;
  }).join(", ");

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Reports</h1>
        <p class="lede">Operational and finance visibility across trainers, colleges and spend — exportable for your own records.</p>
      </div>
      <div class="page-head-actions">
        <button class="btn btn-outline" onclick="Utils.toast('Report exported as PDF (demo).')">${ICONS.download} Export PDF</button>
        <button class="btn btn-outline" onclick="Utils.toast('Report exported as CSV (demo).')">${ICONS.file} Export CSV</button>
      </div>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon green">${ICONS.wallet}</div><div class="stat-body"><span>Spend, last 6 months</span><strong>${Utils.formatINR(ytdSpend)}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.clipboard}</div><div class="stat-body"><span>Total assignments</span><strong>${totalAssignments}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.building}</div><div class="stat-body"><span>Active colleges/clients</span><strong>${r.topColleges.length}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber" style="background:var(--red-050);color:var(--red-600);">${ICONS.clock}</div><div class="stat-body"><span>Outstanding (all ageing)</span><strong>${Utils.formatINR(totalAging)}</strong></div></div>
    </div>

    <div class="dash-grid">
      <div class="card" style="padding:20px;">
        <h3 style="font-size:14px;margin-bottom:2px;">Monthly spend on trainers</h3>
        <p class="text-muted" style="font-size:12px;margin-bottom:8px;">Trainer fees, allowances and platform charges combined</p>
        <div class="bar-chart">
          ${r.monthlySpend.map(m => `
            <div class="bar-col">
              <div class="bar" style="height:${(m.value/maxSpend*100).toFixed(0)}%;"><span class="bar-val">${Utils.formatINR(m.value)}</span></div>
              <span>${m.label}</span>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="card" style="padding:20px;">
        <h3 style="font-size:14px;margin-bottom:14px;">Assignments by status</h3>
        <div style="display:flex;align-items:center;gap:22px;">
          <div style="width:120px;height:120px;border-radius:50%;background:conic-gradient(${gradientStops});flex-shrink:0;position:relative;">
            <div style="position:absolute;inset:16px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-direction:column;">
              <strong style="font-size:20px;">${totalAssignments}</strong>
              <span style="font-size:10px;color:var(--ink-500);">total</span>
            </div>
          </div>
          <div style="flex:1;">
            ${r.assignmentsByStatus.map(s => `
              <div class="legend-row"><span class="sw" style="background:${s.color};"></span><span style="flex:1;">${s.label}</span><strong>${s.value}</strong></div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>

    <div class="dash-grid" style="margin-top:22px;">
      <div class="card">
        <div style="padding:18px 20px 4px;"><h3 style="font-size:14px;">Top colleges/clients by spend</h3></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>College/Client</th><th>Assignments</th><th>Paid to date</th></tr></thead>
            <tbody>
              ${r.topColleges.map(c => `<tr><td>${c.name}</td><td>${c.assignments}</td><td>${Utils.formatINR(c.paid)}</td></tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card" style="padding:20px;">
        <h3 style="font-size:14px;margin-bottom:14px;">Payment ageing</h3>
        ${r.agingBuckets.map(a => `
          <div style="margin-bottom:14px;">
            <div class="flex-between" style="margin-bottom:6px;font-size:12.5px;"><span>${a.label}</span><strong>${Utils.formatINR(a.value)}</strong></div>
            <div class="progress-track"><div class="progress-fill" style="width:${totalAging? (a.value/totalAging*100).toFixed(0):0}%;${a.label==='30+ days'?'background:linear-gradient(90deg,var(--red-600),var(--red-600));':''}"></div></div>
          </div>
        `).join("")}
        <p class="text-muted" style="font-size:11.5px;margin-top:6px;">No invoices are more than 30 days overdue this period.</p>
      </div>
    </div>
  `;
}
