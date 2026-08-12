function renderRequirements(){
  const el = document.getElementById("pageContent");
  const requests = window.MOCK.assignments;
  const tabs = ["All","Draft","Sent","Awaiting Confirmation","Scheduled","Payment Due","Closed"];
  let activeTab = "All";
  const statusTotals = requests.reduce((acc, item) => { acc[item.status] = (acc[item.status] || 0) + 1; return acc; }, {});

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Requirements</h1>
        <p class="lede">Track requirement requests, approval status and upcoming sessions before they become assignments.</p>
      </div>
      <div class="page-head-actions">
        <button class="btn btn-outline" onclick="Utils.toast('Exported requirement summary (demo).')">Export</button>
        <button class="btn btn-primary" onclick="Utils.openModal('newRequirementModal')">${ICONS.plus} New Requirement</button>
      </div>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.clipboard}</div><div class="stat-body"><span>Total requests</span><strong>${requests.length}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon teal">${ICONS.layers}</div><div class="stat-body"><span>Awaiting confirmation</span><strong>${statusTotals['Awaiting Confirmation'] || 0}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.calendar}</div><div class="stat-body"><span>Scheduled</span><strong>${statusTotals['Scheduled'] || 0}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.checkCircle}</div><div class="stat-body"><span>Closed</span><strong>${statusTotals['Closed'] || 0}</strong></div></div>
    </div>

    <div class="dash-grid">
      <div>
        <div class="card">
          <div class="section-head"><h3>Requirement pipeline</h3><span class="see-all">${requests.length} total</span></div>
          <div class="tab-row" id="reqTabs">
            ${tabs.map(t => `<button class="tab-btn ${t==='All'?'active':''}" data-tab="${t}">${t}</button>`).join("")}
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Requirement</th><th>Trainer</th><th>Program</th><th>College/Client</th><th>Dates</th><th>Mode</th><th>Status</th><th></th></tr></thead>
              <tbody id="reqBody"></tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card card-pad">
        <div class="section-head"><h3>Next actions</h3></div>
        <div class="detail-card" style="margin-bottom:14px;">
          <strong>${statusTotals['Awaiting Confirmation'] || 0} requirements need confirmation</strong>
          <p class="text-muted" style="margin-top:8px;">Follow up with trainers and client approvers so assignments stay on schedule.</p>
        </div>
        <div class="detail-card" style="margin-bottom:14px;">
          <strong>${statusTotals['Draft'] || 0} drafts are waiting to be sent</strong>
          <p class="text-muted" style="margin-top:8px;">Complete draft details and share them with the trainer to start the process.</p>
        </div>
        <div class="detail-card" style="padding:18px;">
          <h4 style="font-size:13px;color:var(--ink-500);margin-bottom:10px;">Planning checklist</h4>
          <ul style="padding-left:18px;color:var(--ink-700);font-size:13px;line-height:1.7;">
            <li>Confirm scope and dates before sending a requirement.</li>
            <li>Align with partner colleges on learner count and venue.</li>
            <li>Choose verified trainers for faster acceptance.</li>
          </ul>
        </div>
      </div>
    </div>

    <div id="newRequirementModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="newReqTitle">
      <div class="modal-box">
        <div class="modal-head"><h3 id="newReqTitle">New Requirement</h3><button class="modal-close" onclick="Utils.closeModal('newRequirementModal')" aria-label="Close">${ICONS.x}</button></div>
        <div class="modal-body">
          <div class="field"><label for="rqProgram">Program / Topic</label><input class="input" id="rqProgram" placeholder="e.g. AI for Business Leaders"></div>
          <div class="field-row"><div class="field"><label for="rqCollege">College / Client</label><select class="select" id="rqCollege">${window.MOCK.colleges.map(c => `<option value="${c.id}">${c.name}</option>`).join("")}</select></div><div class="field"><label for="rqMode">Delivery mode</label><select class="select" id="rqMode"><option>Online</option><option>Offline</option><option>Hybrid</option></select></div></div>
          <div class="field-row"><div class="field"><label for="rqStart">Start date</label><input class="input" type="date" id="rqStart" value="2026-09-01"></div><div class="field"><label for="rqEnd">End date</label><input class="input" type="date" id="rqEnd" value="2026-09-03"></div></div>
          <div class="field"><label for="rqNotes">Brief notes</label><textarea class="textarea" id="rqNotes" rows="4" placeholder="Capture the requirement details for the team."></textarea></div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" onclick="Utils.closeModal('newRequirementModal')">Cancel</button>
          <button class="btn btn-primary" onclick="submitNewRequirement()">${ICONS.arrowRight} Save Requirement</button>
        </div>
      </div>
    </div>
  `;

  function paint(){
    const q = (window.__searchQuery || "").toLowerCase();
    const list = requests.filter(r => {
      if (activeTab !== "All" && r.status !== activeTab) return false;
      if (q && !(r.trainerName.toLowerCase().includes(q) || r.program.toLowerCase().includes(q) || r.college.toLowerCase().includes(q))) return false;
      return true;
    });

    document.getElementById("reqBody").innerHTML = list.length ? list.map(r => `
      <tr>
        <td>${r.id}</td>
        <td><div class="person-cell">${Utils.avatarHTML(r.trainerName,28)}<div class="who"><strong>${r.trainerName}</strong></div></div></td>
        <td>${r.program}</td>
        <td>${r.college}</td>
        <td>${Utils.formatDateRange(r.startDate, r.endDate)}</td>
        <td>${r.mode}</td>
        <td>${Utils.statusPill(r.status)}</td>
        <td><button class="btn btn-outline btn-sm" onclick="Utils.toast('Opening requirement details (demo).')">Review</button></td>
      </tr>
    `).join("") : `<tr><td colspan="8"><div class="empty-state"><div class="icon-wrap">${ICONS.clipboard}</div><h4>No requirements match</h4><p>Try another status or clear the global search.</p></div></td></tr>`;
  }

  document.getElementById("reqTabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    Utils.qsa(".tab-btn", document.getElementById("reqTabs")).forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.tab;
    paint();
  });

  window.onGlobalSearch = (val) => { window.__searchQuery = val; paint(); };
  document.getElementById("newRequirementModal").addEventListener("click", (e) => { if (e.target.id === "newRequirementModal") Utils.closeModal('newRequirementModal'); });

  paint();
}

function submitNewRequirement(){
  const program = document.getElementById("rqProgram").value || "New training requirement";
  Utils.closeModal('newRequirementModal');
  Utils.toast(`Requirement saved: ${program}`);
}
