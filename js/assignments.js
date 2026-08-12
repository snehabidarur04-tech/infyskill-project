const ASSIGNMENT_TIMELINE = ["Draft","Sent","Accepted","Scheduled","In Progress","Delivery Completed","Invoice Submitted","Invoice Approved","Payment Due","Paid","Closed"];

function renderAssignments(){
  const el = document.getElementById("pageContent");
  const assignments = window.MOCK.assignments;

  const tabs = ["All","In Progress","Awaiting Confirmation","Scheduled","Closed","Disputed","Cancelled"];
  let activeTab = "All";

  const statusCounts = assignments.reduce((agg, item) => {
    agg[item.status] = (agg[item.status] || 0) + 1;
    return agg;
  }, {});
  const totalActive = assignments.filter(a => a.status !== "Closed" && a.status !== "Cancelled").length;
  const topUrgent = assignments.filter(a => ["Awaiting Confirmation","Payment Due","Disputed"].includes(a.status)).slice(0, 4);

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Assignments</h1>
        <p class="lede">${assignments.length} assignments across colleges and clients. Manage delivery, approvals and invoices from one place.</p>
      </div>
      <div class="page-head-actions">
        <button class="btn btn-outline" onclick="Utils.toast('Template picker coming soon.')">${ICONS.layers} Use template</button>
        <button class="btn btn-primary" onclick="Utils.openModal('newAssignmentModal')">${ICONS.plus} New assignment</button>
      </div>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.clipboard}</div><div class="stat-body"><span>Active assignments</span><strong>${totalActive}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon teal">${ICONS.calendar}</div><div class="stat-body"><span>In progress</span><strong>${statusCounts['In Progress'] || 0}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.alert}</div><div class="stat-body"><span>Awaiting review</span><strong>${statusCounts['Awaiting Confirmation'] || 0}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.checkCircle}</div><div class="stat-body"><span>Closed assignments</span><strong>${statusCounts['Closed'] || 0}</strong></div></div>
    </div>

    <div class="dash-grid">
      <div>
        <div class="card">
          <div class="section-head"><h3>All assignments</h3><span class="see-all">${assignments.length} total</span></div>
          <div class="tab-row" id="assignTabs">
            ${tabs.map(t => `<button class="tab-btn ${t==='All'?'active':''}" data-tab="${t}">${t}</button>`).join("")}
          </div>
          <div class="assignment-list" id="assignList"></div>
          <div class="pagination"><span id="assignCount"></span></div>
        </div>
      </div>
      <div class="card card-pad">
        <div class="section-head"><h3>Workflow summary</h3></div>
        <div class="stat-grid" style="grid-template-columns:1fr;gap:12px;">
          <div class="stat-box"><strong>${statusCounts['Scheduled'] || 0}</strong><span>Scheduled</span></div>
          <div class="stat-box"><strong>${statusCounts['Payment Due'] || 0}</strong><span>Payment due</span></div>
          <div class="stat-box"><strong>${statusCounts['Disputed'] || 0}</strong><span>Disputed</span></div>
        </div>
        <div style="margin-top:22px;">
          <h4 style="font-size:14px;margin-bottom:12px;">Urgent review</h4>
          ${topUrgent.length ? topUrgent.map(item => `
            <div class="detail-card" style="padding:14px;margin-bottom:12px;">
              <div class="flex-between"><strong>${item.program}</strong><span>${Utils.statusPill(item.status)}</span></div>
              <p class="text-muted" style="margin-top:6px;font-size:13px;">${item.trainerName} · ${item.college}</p>
              <p class="text-muted" style="font-size:12px;margin-top:8px;">${Utils.formatDateRange(item.startDate,item.endDate)}</p>
            </div>
          `).join("") : `<div class="empty-state" style="padding:24px 10px;">No urgent items. All clear for now.</div>`}
        </div>
      </div>
    </div>

    <div id="assignDetailModal" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal-box" id="assignDetailBox"></div>
    </div>

    <div id="newAssignmentModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="newAssignTitle">
      <div class="modal-box" style="max-width:640px;">
        <div class="modal-head"><h3 id="newAssignTitle">Create Assignment</h3><button class="modal-close" onclick="Utils.closeModal('newAssignmentModal')" aria-label="Close">${ICONS.x}</button></div>
        <div class="modal-body">
          <div class="field-row">
            <div class="field"><label for="naTrainer">Trainer</label>
              <select class="select" id="naTrainer">${window.MOCK.trainers.map(t=>`<option value="${t.id}">${t.name} — ${t.primarySkill}</option>`).join("")}</select>
            </div>
            <div class="field"><label for="naCollege">College/Client</label>
              <select class="select" id="naCollege">${window.MOCK.colleges.map(c=>`<option value="${c.id}">${c.name}</option>`).join("")}</select>
            </div>
          </div>
          <div class="field"><label for="naProgram">Topic / program</label><input class="input" id="naProgram" placeholder="e.g. Advanced React Workshop"></div>
          <div class="field-row">
            <div class="field"><label for="naStart">Start date</label><input class="input" type="date" id="naStart" value="2026-08-25"></div>
            <div class="field"><label for="naEnd">End date</label><input class="input" type="date" id="naEnd" value="2026-08-27"></div>
          </div>
          <div class="field-row">
            <div class="field"><label for="naMode">Delivery mode</label><select class="select" id="naMode"><option>Offline</option><option>Online</option><option>Hybrid</option></select></div>
            <div class="field"><label for="naFee">Agreed trainer fee (₹)</label><input class="input" type="number" id="naFee" placeholder="e.g. 45000"></div>
          </div>
          <div class="field"><label for="naAllowance">Allowances cap (₹, optional)</label><input class="input" type="number" id="naAllowance" placeholder="e.g. 5000"></div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" onclick="Utils.closeModal('newAssignmentModal')">Save as Draft</button>
          <button class="btn btn-primary" onclick="submitNewAssignment()">${ICONS.arrowRight} Send to Trainer</button>
        </div>
      </div>
    </div>

    <div id="editAssignmentModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="editAssignTitle">
      <div class="modal-box" style="max-width:640px;">
        <div class="modal-head"><h3 id="editAssignTitle">Edit Assignment</h3><button class="modal-close" onclick="Utils.closeModal('editAssignmentModal')" aria-label="Close">${ICONS.x}</button></div>
        <div class="modal-body">
          <input type="hidden" id="editAssignmentId">
          <div class="field-row">
            <div class="field"><label for="editTrainer">Trainer</label>
              <select class="select" id="editTrainer">${window.MOCK.trainers.map(t=>`<option value="${t.id}">${t.name} — ${t.primarySkill}</option>`).join("")}</select>
            </div>
            <div class="field"><label for="editCollege">College/Client</label>
              <select class="select" id="editCollege">${window.MOCK.colleges.map(c=>`<option value="${c.id}">${c.name}</option>`).join("")}</select>
            </div>
          </div>
          <div class="field"><label for="editProgram">Topic / program</label><input class="input" id="editProgram" placeholder="e.g. Advanced React Workshop"></div>
          <div class="field-row">
            <div class="field"><label for="editStart">Start date</label><input class="input" type="date" id="editStart"></div>
            <div class="field"><label for="editEnd">End date</label><input class="input" type="date" id="editEnd"></div>
          </div>
          <div class="field-row">
            <div class="field"><label for="editMode">Delivery mode</label><select class="select" id="editMode"><option>Offline</option><option>Online</option><option>Hybrid</option></select></div>
            <div class="field"><label for="editFee">Agreed trainer fee (₹)</label><input class="input" type="number" id="editFee" placeholder="e.g. 45000"></div>
          </div>
          <div class="field-row">
            <div class="field"><label for="editAllowance">Allowances cap (₹, optional)</label><input class="input" type="number" id="editAllowance" placeholder="e.g. 5000"></div>
            <div class="field"><label for="editStatus">Status</label><select class="select" id="editStatus">${ASSIGNMENT_TIMELINE.concat(['Draft','Awaiting Confirmation','Disputed','Cancelled']).filter((v,i,a)=>a.indexOf(v)===i).map(s=>`<option value="${s}">${s}</option>`).join("")}</select></div>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" onclick="Utils.closeModal('editAssignmentModal')">Cancel</button>
          <button class="btn btn-primary" onclick="saveAssignmentUpdate()">${ICONS.save} Save changes</button>
        </div>
      </div>
    </div>
  `;

  function paint(){
    const q = (window.__searchQuery || "").toLowerCase();
    let list = assignments.filter(a => {
      if (activeTab !== "All" && a.status !== activeTab) return false;
      if (q && !(a.trainerName.toLowerCase().includes(q) || a.program.toLowerCase().includes(q) || a.college.toLowerCase().includes(q))) return false;
      return true;
    });
    document.getElementById("assignCount").textContent = `Showing ${list.length} of ${assignments.length} assignments`;
    const listContainer = document.getElementById("assignList");
    listContainer.innerHTML = list.length ? list.map(a => `
      <div class="assignment-card">
        <div class="assignment-card-top">
          <div>
            <div class="text-muted">${a.id}</div>
            <h3>${a.program}</h3>
            <div class="person-cell" style="margin-top:10px;">
              ${Utils.avatarHTML(a.trainerName,32)}
              <div class="who"><strong>${a.trainerName}</strong><span>${a.college}</span></div>
            </div>
          </div>
          <div class="assignment-card-meta">
            <span>${Utils.formatDateRange(a.startDate,a.endDate)}</span>
            <span>${a.mode}</span>
            <span>${Utils.formatINR(a.fee)}</span>
          </div>
        </div>
        <div class="assignment-card-bottom">
          <div>${Utils.statusPill(a.status)}</div>
          <div class="assignment-card-actions">
            <button class="btn btn-outline btn-sm" onclick="openAssignmentDetail('${a.id}')">View</button>
            <button class="btn btn-primary btn-sm" onclick="openAssignmentEditor('${a.id}')">Edit</button>
          </div>
        </div>
      </div>
    `).join("") : `
      <div class="empty-state" style="padding:32px; text-align:center;">
        <div class="icon-wrap">${ICONS.clipboard}</div>
        <h4>No assignments here</h4>
        <p>Try a different tab or clear your search.</p>
      </div>
    `;
  }

  document.getElementById("assignTabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    Utils.qsa(".tab-btn", document.getElementById("assignTabs")).forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.tab;
    paint();
  });

  window.onGlobalSearch = (val) => { window.__searchQuery = val; paint(); };

  [document.getElementById("assignDetailModal"), document.getElementById("newAssignmentModal")].forEach(m => {
    m.addEventListener("click", (e) => { if (e.target === m) m.classList.remove("open"); });
  });

  paint();
}

function openAssignmentDetail(id){
  const a = window.MOCK.assignments.find(x => x.id === id);
  const currentIdx = Math.max(0, ASSIGNMENT_TIMELINE.indexOf(
    { "In Progress":"In Progress","Awaiting Confirmation":"Sent","Scheduled":"Scheduled","Payment Due":"Payment Due","Paid":"Paid","Closed":"Closed","Draft":"Draft","Disputed":"Invoice Submitted","Cancelled":"Sent" }[a.status] || "Draft"
  ));

  document.getElementById("assignDetailBox").innerHTML = `
    <div class="modal-head">
      <h3>${a.program}</h3>
      <button class="modal-close" onclick="Utils.closeModal('assignDetailModal')" aria-label="Close">${ICONS.x}</button>
    </div>
    <div class="modal-body">
      <div class="eyebrow-row" style="margin-bottom:14px;">${Utils.statusPill(a.status)}<span class="text-muted" style="font-size:12px;">${a.id}</span></div>
      <div class="grid-2">
        <div class="field"><label>Trainer</label><div class="person-cell">${Utils.avatarHTML(a.trainerName,28)}<div class="who"><strong>${a.trainerName}</strong></div></div></div>
        <div class="field"><label>College/Client</label><p style="font-size:13.5px;">${a.college}</p></div>
        <div class="field"><label>Dates</label><p style="font-size:13.5px;">${Utils.formatDateRange(a.startDate,a.endDate)}</p></div>
        <div class="field"><label>Mode</label><p style="font-size:13.5px;">${a.mode}</p></div>
        <div class="field"><label>Agreed fee</label><p style="font-size:13.5px;">${Utils.formatINR(a.fee)}</p></div>
        <div class="field"><label>Allowance cap</label><p style="font-size:13.5px;">${Utils.formatINR(a.allowance)}</p></div>
        <div class="field"><label>Students</label><p style="font-size:13.5px;">${a.students}</p></div>
        <div class="field"><label>Owner</label><p style="font-size:13.5px;">${a.owner}</p></div>
      </div>
      <div class="field"><label>Status timeline</label></div>
      <div class="progress-track" style="margin-bottom:8px;"><div class="progress-fill" style="width:${((currentIdx+1)/ASSIGNMENT_TIMELINE.length*100).toFixed(0)}%"></div></div>
      <p class="text-muted" style="font-size:11.5px;">${ASSIGNMENT_TIMELINE[currentIdx]} · step ${currentIdx+1} of ${ASSIGNMENT_TIMELINE.length}</p>
    </div>
    <div class="modal-foot">
      <button class="btn btn-outline" onclick="openAssignmentEditor('${a.id}')">${ICONS.edit} Edit assignment</button>
      <button class="btn btn-outline" onclick="Utils.toast('Assignment terms sent for revision.')">${ICONS.edit} Request Revision</button>
      <a class="btn btn-primary" href="invoices.html">${ICONS.invoice} View Invoice</a>
    </div>
  `;
  Utils.openModal("assignDetailModal");
}

function openAssignmentEditor(id){
  const a = window.MOCK.assignments.find(x => x.id === id);
  if (!a) return;
  document.getElementById("editAssignmentId").value = a.id;
  document.getElementById("editTrainer").value = a.trainerId;
  document.getElementById("editCollege").value = a.collegeId;
  document.getElementById("editProgram").value = a.program;
  document.getElementById("editStart").value = a.startDate;
  document.getElementById("editEnd").value = a.endDate;
  document.getElementById("editMode").value = a.mode;
  document.getElementById("editFee").value = a.fee;
  document.getElementById("editAllowance").value = a.allowance;
  document.getElementById("editStatus").value = a.status;
  Utils.openModal("editAssignmentModal");
}

function saveAssignmentUpdate(){
  const id = document.getElementById("editAssignmentId").value;
  const a = window.MOCK.assignments.find(x => x.id === id);
  if (!a) return;
  const trainerSelect = document.getElementById("editTrainer");
  a.trainerId = trainerSelect.value;
  a.trainerName = trainerSelect.options[trainerSelect.selectedIndex].text.split(" — ")[0];
  const collegeSelect = document.getElementById("editCollege");
  a.collegeId = collegeSelect.value;
  a.college = collegeSelect.options[collegeSelect.selectedIndex].text;
  a.program = document.getElementById("editProgram").value || a.program;
  a.startDate = document.getElementById("editStart").value || a.startDate;
  a.endDate = document.getElementById("editEnd").value || a.endDate;
  a.mode = document.getElementById("editMode").value;
  a.fee = Number(document.getElementById("editFee").value) || a.fee;
  a.allowance = Number(document.getElementById("editAllowance").value) || 0;
  a.status = document.getElementById("editStatus").value;
  Utils.closeModal("editAssignmentModal");
  Utils.toast(`Assignment ${a.id} updated.`);
  paint();
}

function submitNewAssignment(){
  const trainerSel = document.getElementById("naTrainer");
  const trainerId = trainerSel.value;
  const trainerName = trainerSel.options[trainerSel.selectedIndex].text.split(" — ")[0];
  const collegeSel = document.getElementById("naCollege");
  const collegeId = collegeSel.value;
  const college = collegeSel.options[collegeSel.selectedIndex].text;
  const program = document.getElementById("naProgram").value || "Untitled Program";
  const startDate = document.getElementById("naStart").value;
  const endDate = document.getElementById("naEnd").value;
  const mode = document.getElementById("naMode").value;
  const fee = Number(document.getElementById("naFee").value) || 0;
  const allowance = Number(document.getElementById("naAllowance").value) || 0;
  const newId = `AS-${Math.floor(3000 + Math.random() * 9000)}`;
  window.MOCK.assignments.unshift({
    id: newId,
    trainerId,
    trainerName,
    collegeId,
    college,
    program,
    startDate,
    endDate,
    mode,
    status: "Awaiting Confirmation",
    fee,
    allowance,
    students: 0,
    owner: "Sneha"
  });
  Utils.closeModal("newAssignmentModal");
  Utils.toast(`Assignment "${program}" created and sent to ${trainerName}.`);
  paint();
}
