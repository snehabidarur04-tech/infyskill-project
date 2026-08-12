function renderTeam(){
  const el = document.getElementById("pageContent");
  const team = window.MOCK.team;
  const roleClass = { Owner:"role-owner", Coordinator:"role-coordinator", Finance:"role-finance", Approver:"role-approver", Viewer:"role-viewer" };
  const rolePerms = {
    Owner:"Subscription, organization profile, team, all assignments and finance",
    Coordinator:"Colleges/clients, trainers, requirements, assignments, schedules and documents",
    Finance:"Invoices, expense bills, payment approval, receipts and reports",
    Approver:"Approve trainer, assignment budget, invoice or exceptional expense",
    Viewer:"Read-only dashboards and reports"
  };

  const seatsUsed = team.length;
  const activeCount = team.filter(t=>t.status === "Active").length;
  const pendingInvites = team.filter(t=>t.status === "Invited").length;

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Team</h1>
        <p class="lede">Invite coordinators, finance and approvers, and control exactly what each teammate can do.</p>
      </div>
      <button class="btn btn-primary" onclick="openInviteModal()">${ICONS.plus} Invite Teammate</button>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.team}</div><div class="stat-body"><span>Team members</span><strong>${team.length}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.checkCircle}</div><div class="stat-body"><span>Active</span><strong>${activeCount}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.mail}</div><div class="stat-body"><span>Pending invites</span><strong>${pendingInvites}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber" style="background:var(--violet-050);color:var(--violet-600);">${ICONS.shield}</div><div class="stat-body"><span>Seats used</span><strong>${seatsUsed} / ${window.MOCK.subscription.teamSeatsLimit}</strong></div></div>
    </div>

    <div class="dash-grid">
      <div>
        <div class="card">
          <div class="section-head"><h3>Team roster</h3></div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Member</th><th>Role</th><th>Contact</th><th>Status</th><th>Last active</th><th></th></tr></thead>
              <tbody>
                ${team.map(t => `
                  <tr>
                    <td><div class="person-cell"><img class="avatar" src="${t.avatar}" alt="" style="width:32px;height:32px;border-radius:50%;"><div class="who"><strong>${t.name}</strong></div></div></td>
                    <td><span class="role-tag ${roleClass[t.role]}">${t.role}</span></td>
                    <td><div style="font-size:12.5px;"><div>${t.email}</div><div class="text-muted">${t.phone}</div></div></td>
                    <td>${Utils.statusPill(t.status)}</td>
                    <td class="text-muted">${t.lastActive}</td>
                    <td><button class="btn btn-outline btn-sm" onclick="Utils.toast('Opening permissions for ${t.name} (demo).')">Manage</button></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card card-pad">
        <div class="section-head"><h3>Role guide</h3></div>
        <div class="grid-2">
          ${Object.entries(rolePerms).map(([role,desc]) => `
            <div style="display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--ink-050);">
              <span class="role-tag ${roleClass[role]}" style="flex-shrink:0;">${role}</span>
              <p class="text-muted" style="font-size:12.5px;">${desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <div id="teamModal" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal-box" id="teamModalBox"></div>
    </div>
  `;

  document.getElementById("teamModal").addEventListener("click", (e) => { if (e.target.id==="teamModal") Utils.closeModal("teamModal"); });
}

function openInviteModal(){
  document.getElementById("teamModalBox").innerHTML = `
    <div class="modal-head"><h3>Invite Teammate</h3><button class="modal-close" onclick="Utils.closeModal('teamModal')" aria-label="Close">${ICONS.x}</button></div>
    <div class="modal-body">
      <div class="field"><label for="tm-name">Full name</label><input class="input" type="text" id="tm-name" placeholder="e.g. Rohit Malhotra"></div>
      <div class="field"><label for="tm-email">Work email</label><input class="input" type="email" id="tm-email" placeholder="name@yourcompany.in"></div>
      <div class="field"><label for="tm-role">Role</label>
        <select id="tm-role" class="input">
          <option>Coordinator</option><option>Finance</option><option>Approver</option><option>Viewer</option>
        </select>
      </div>
      <p class="text-muted" style="font-size:11.5px;">They'll receive an email invite with role-based access — no vendor finance data is shared until they accept.</p>
    </div>
    <div class="modal-foot">
      <button class="btn btn-outline" onclick="Utils.closeModal('teamModal')">Cancel</button>
      <button class="btn btn-primary" onclick="Utils.toast('Invite sent.'); Utils.closeModal('teamModal');">${ICONS.mail} Send Invite</button>
    </div>
  `;
  Utils.openModal("teamModal");
}
