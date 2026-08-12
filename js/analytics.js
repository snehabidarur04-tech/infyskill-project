function renderAnalytics(){
  const el = document.getElementById("pageContent");
  const reports = window.MOCK.reports;
  const payments = window.MOCK.payments;
  const invoices = window.MOCK.invoices;

  const totalSpend = reports.monthlySpend.reduce((sum, item) => sum + item.value, 0);
  const completedAssignments = reports.assignmentsByStatus.find(item => item.label === "Completed")?.value || 0;
  const outstandingDue = payments.filter(p => p.status === "Due").length + payments.filter(p => p.status === "Overdue").length;
  const avgTrainerRating = (window.MOCK.trainers.reduce((sum, t) => sum + t.rating, 0) / window.MOCK.trainers.length).toFixed(1);
  const activeTrainers = window.MOCK.trainers.length;
  const disputes = invoices.filter(i => i.status === "Disputed").length;

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Analytics</h1>
        <p class="lede">Decision-ready analytics for your trainer operations, invoicing, and delivery performance.</p>
      </div>
      <button class="btn btn-outline" onclick="Utils.toast('Analytics dashboard refreshed.');">Refresh</button>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon teal">${ICONS.chart}</div><div class="stat-body"><span>Spend tracked</span><strong>${Utils.formatINR(totalSpend)}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.users}</div><div class="stat-body"><span>Active trainers</span><strong>${activeTrainers}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.checkCircle}</div><div class="stat-body"><span>Completed assignments</span><strong>${completedAssignments}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.alert}</div><div class="stat-body"><span>Outstanding issues</span><strong>${outstandingDue + disputes}</strong></div></div>
    </div>

    <div class="dash-grid">
      <div class="card card-pad">
        <div class="section-head"><h3>Monthly spend</h3></div>
        <div class="bar-chart">${reports.monthlySpend.map(item => `
          <div class="bar-col"><div class="bar" style="height:${Math.max(24, (item.value / Math.max(...reports.monthlySpend.map(i => i.value)) * 100)).toFixed(0)}%;"></div><span>${item.label}</span></div>
        `).join("")}</div>
      </div>
      <div class="card card-pad">
        <div class="section-head"><h3>Payment and invoice health</h3></div>
        <div class="grid-2" style="gap:14px;">
          <div class="card" style="padding:16px;"><strong>${payments.filter(p => p.status === "Paid").length}</strong><p class="text-muted">Payments completed</p></div>
          <div class="card" style="padding:16px;"><strong>${disputes}</strong><p class="text-muted">Disputed invoices</p></div>
          <div class="card" style="padding:16px;"><strong>${payments.filter(p => p.status === "Overdue").length}</strong><p class="text-muted">Overdue payments</p></div>
          <div class="card" style="padding:16px;"><strong>${reports.topColleges.length}</strong><p class="text-muted">Active college partners</p></div>
        </div>
      </div>
    </div>

    <div class="card card-pad" style="margin-top:18px;">
      <div class="section-head"><h3>Assignments by status</h3></div>
      <div>${reports.assignmentsByStatus.map(item => `
        <div class="flex-between" style="margin-bottom:10px;"><span>${item.label}</span><strong>${item.value}</strong></div>
        <div class="progress-track" style="margin-bottom:12px;"><div class="progress-fill" style="width:${(item.value / reports.assignmentsByStatus.reduce((sum,i)=>sum+i.value,0) * 100).toFixed(0)}%;background:${item.color};"></div></div>
      `).join("")}</div>
    </div>
  `;
}
