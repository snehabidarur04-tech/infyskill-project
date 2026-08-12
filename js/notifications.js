function renderNotifications(){
  const el = document.getElementById("pageContent");
  const notifications = window.MOCK.notifications;
  const unread = notifications.filter(n => !n.read).length;
  const total = notifications.length;
  const lastHour = notifications.filter(n => n.time.includes('mins') || n.time.includes('hour')).length;

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Notifications</h1>
        <p class="lede">Review recent alerts, approvals and action items for your vendor operations.</p>
      </div>
      <button class="btn btn-outline" onclick="Utils.toast('Notifications refreshed.');">Refresh</button>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.bell}</div><div class="stat-body"><span>Total alerts</span><strong>${total}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.checkCircle}</div><div class="stat-body"><span>Unread</span><strong>${unread}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon teal">${ICONS.alert}</div><div class="stat-body"><span>Recent</span><strong>${lastHour}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.layers}</div><div class="stat-body"><span>Types</span><strong>${new Set(notifications.map(n => n.type)).size}</strong></div></div>
    </div>

    <div class="card">
      <div class="section-head"><h3>Notifications</h3></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Notification</th><th>Details</th><th>Status</th><th>Received</th></tr></thead>
          <tbody>
            ${notifications.map(n => `
              <tr>
                <td>${n.title}</td>
                <td>${n.body}</td>
                <td>${n.read ? '<span class="status-pill status-completed">Read</span>' : '<span class="status-pill status-awaiting">Unread</span>'}</td>
                <td>${n.time}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
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
