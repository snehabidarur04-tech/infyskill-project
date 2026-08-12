function renderColleges(){
  const el = document.getElementById("pageContent");
  const colleges = window.MOCK.colleges;
  const totalPaid = colleges.reduce((sum, c) => sum + c.totalPaid, 0);
  const topPartners = [...colleges].sort((a,b) => b.totalPaid - a.totalPaid).slice(0, 3);

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Colleges & Clients</h1>
        <p class="lede">${colleges.length} organizations in your account. Reuse contacts and history for repeat assignments.</p>
      </div>
      <button class="btn btn-primary" onclick="Utils.openModal('addCollegeModal')">${ICONS.plus} Add College/Client</button>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.building}</div><div class="stat-body"><span>Organizations</span><strong>${colleges.length}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.wallet}</div><div class="stat-body"><span>Total paid</span><strong>${Utils.formatINR(totalPaid)}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon teal">${ICONS.clipboard}</div><div class="stat-body"><span>Average rating</span><strong>${(colleges.reduce((sum,c)=>sum+c.rating,0)/colleges.length).toFixed(1)}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.team}</div><div class="stat-body"><span>Recent contacts</span><strong>${colleges.slice(0,1)[0].contact}</strong></div></div>
    </div>

    <div class="dash-grid">
      <div>
        <div class="card">
          <div class="section-head"><h3>All colleges & clients</h3><span class="see-all">Built for repeat bookings</span></div>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>Organization</th><th>Type</th><th>Location</th><th>Primary contact</th><th>Assignments</th><th>Total paid</th><th>Rating</th><th></th></tr></thead>
              <tbody>
                ${colleges.map(c => `
                  <tr>
                    <td>
                      <div class="person-cell">
                        ${Utils.avatarHTML(c.name, 34)}
                        <div class="who"><strong>${c.name}</strong><span>${c.campus}</span></div>
                      </div>
                    </td>
                    <td>${c.type}</td>
                    <td>${c.city}, ${c.state}</td>
                    <td>
                      <div class="who"><strong style="font-weight:600;font-size:12.5px;">${c.contact}</strong><span style="display:block;font-size:11.5px;color:var(--ink-500);">${c.contactRole}</span></div>
                    </td>
                    <td>${c.assignments}</td>
                    <td>${Utils.formatINR(c.totalPaid)}</td>
                    <td><span class="stars" style="color:#E8A93A;font-weight:800;">★ ${c.rating}</span></td>
                    <td><button class="btn btn-outline btn-sm" onclick="openCollegeModal('${c.id}')">View</button></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card card-pad">
        <div class="section-head"><h3>Top relationships</h3></div>
        ${topPartners.map(c => `
          <div class="detail-card" style="margin-bottom:12px;">
            <div class="flex-between"><strong>${c.name}</strong><span class="text-muted">${c.type}</span></div>
            <p class="text-muted" style="margin:8px 0 0;">${c.city}, ${c.state}</p>
            <div class="flex-between" style="margin-top:12px;gap:10px;font-size:13px;">
              <span>${c.assignments} assignments</span>
              <strong>${Utils.formatINR(c.totalPaid)}</strong>
            </div>
          </div>
        `).join("")}
        <div class="detail-card" style="padding:18px;">
          <h4 style="font-size:13px;color:var(--ink-500);margin-bottom:10px;">Next steps</h4>
          <ul style="padding-left:18px;color:var(--ink-700);font-size:13px;line-height:1.7;">
            <li>Review the latest client feedback and adjust upcoming slots.</li>
            <li>Update primary contact details for repeat bookings.</li>
            <li>Confirm GST and payment terms for high-volume partners.</li>
          </ul>
        </div>
      </div>
    </div>

    <div id="collegeModal" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal-box" id="collegeModalBox"></div>
    </div>

    <div id="addCollegeModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="addCollegeTitle">
      <div class="modal-box">
        <div class="modal-head"><h3 id="addCollegeTitle">Add College/Client</h3><button class="modal-close" onclick="Utils.closeModal('addCollegeModal')" aria-label="Close">${ICONS.x}</button></div>
        <div class="modal-body">
          <div class="field"><label for="ncName">Organization name</label><input class="input" id="ncName" placeholder="e.g. Vidya Institute of Technology"></div>
          <div class="field-row">
            <div class="field"><label for="ncType">Type</label><select class="select" id="ncType"><option>Engineering College</option><option>Training Institute</option><option>B-School</option><option>Company</option></select></div>
            <div class="field"><label for="ncCity">City</label><input class="input" id="ncCity" placeholder="e.g. Mysuru"></div>
          </div>
          <div class="field"><label for="ncContact">Primary contact</label><input class="input" id="ncContact" placeholder="Name · role"></div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" onclick="Utils.closeModal('addCollegeModal')">Cancel</button>
          <button class="btn btn-primary" onclick="Utils.closeModal('addCollegeModal'); Utils.toast('College/client saved.');">${ICONS.checkCircle} Save</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("collegeModal").addEventListener("click", (e) => { if (e.target.id === "collegeModal") Utils.closeModal("collegeModal"); });
  document.getElementById("addCollegeModal").addEventListener("click", (e) => { if (e.target.id === "addCollegeModal") Utils.closeModal("addCollegeModal"); });

  window.onGlobalSearch = (val) => {
    const q = val.toLowerCase();
    Utils.qsa("tbody tr").forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  };
}

function openCollegeModal(id){
  const c = window.MOCK.colleges.find(x => x.id === id);
  const asg = window.MOCK.assignments.filter(a => a.collegeId === id);
  document.getElementById("collegeModalBox").innerHTML = `
    <div class="modal-head">
      <h3>${c.name}</h3>
      <button class="modal-close" onclick="Utils.closeModal('collegeModal')" aria-label="Close">${ICONS.x}</button>
    </div>
    <div class="modal-body">
      <div class="grid-2" style="margin-bottom:4px;">
        <div class="field"><label>Campus / branch</label><p style="font-size:13.5px;">${c.campus}</p></div>
        <div class="field"><label>Type</label><p style="font-size:13.5px;">${c.type}</p></div>
        <div class="field"><label>Primary contact</label><p style="font-size:13.5px;">${c.contact} · ${c.contactRole}<br><span class="text-muted">${c.contactPhone} · ${c.contactEmail}</span></p></div>
        <div class="field"><label>Finance contact</label><p style="font-size:13.5px;">${c.financeContact}</p></div>
        <div class="field"><label>GST</label><p style="font-size:13.5px;">${c.gst}</p></div>
        <div class="field"><label>Total paid</label><p style="font-size:13.5px;">${Utils.formatINR(c.totalPaid)}</p></div>
      </div>
      <div class="section-head"><h3 style="font-size:13.5px;">Assignment history</h3></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Program</th><th>Trainer</th><th>Dates</th><th>Status</th></tr></thead>
          <tbody>${asg.length ? asg.map(a => `<tr><td>${a.program}</td><td>${a.trainerName}</td><td>${Utils.formatDateRange(a.startDate,a.endDate)}</td><td>${Utils.statusPill(a.status)}</td></tr>`).join("") : `<tr><td colspan="4" class="text-muted">No assignments yet.</td></tr>`}</tbody>
        </table>
      </div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-outline" onclick="Utils.toast('Editing coming soon.')">${ICONS.edit} Edit details</button>
      <a class="btn btn-primary" href="assignments.html">${ICONS.plus} New Assignment</a>
    </div>
  `;
  Utils.openModal("collegeModal");
}
