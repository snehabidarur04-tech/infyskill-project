function renderTrainers(){
  const el = document.getElementById("pageContent");
  const trainers = window.MOCK.trainers;
  const skills = [...new Set(trainers.map(t => t.primarySkill))].sort();
  const modes = [...new Set(trainers.map(t => t.mode))].sort();
  let activeSkill = "";
  let activeMode = "";

  const activeTrainers = trainers.length;
  const avgRating = (trainers.reduce((sum,t)=>sum+t.rating,0)/trainers.length).toFixed(1);
  const remoteCount = trainers.filter(t=>t.mode === 'Online').length;

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Trainers</h1>
        <p class="lede">Manage verified trainers, view performance signals and assign the right expert for each session.</p>
      </div>
      <div class="page-head-actions">
        <button class="btn btn-outline" onclick="Utils.toast('Trainer roster exported (demo).')">Export</button>
        <button class="btn btn-primary" onclick="Utils.openModal('inviteTrainerModal')">${ICONS.plus} Invite Trainer</button>
      </div>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon teal">${ICONS.users}</div><div class="stat-body"><span>Verified trainers</span><strong>${activeTrainers}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.star}</div><div class="stat-body"><span>Avg rating</span><strong>${avgRating}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.globe}</div><div class="stat-body"><span>Online-ready</span><strong>${remoteCount}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.clipboard}</div><div class="stat-body"><span>Specialties</span><strong>${skills.length}</strong></div></div>
    </div>

    <div class="filters-bar" aria-label="Trainer filter options">
      <div class="fgroup"><label for="tSkill">Skill</label><select class="select" id="tSkill"><option value="">All skills</option>${skills.map(s=>`<option value="${s}">${s}</option>`).join("")}</select></div>
      <div class="fgroup"><label for="tMode">Mode</label><select class="select" id="tMode"><option value="">All modes</option>${modes.map(m=>`<option value="${m}">${m}</option>`).join("")}</select></div>
      <div class="fgroup" style="margin-left:auto;"><label>&nbsp;</label><button class="btn btn-ghost btn-sm" id="clearTrainerFilters">Clear filters</button></div>
    </div>

    <div class="card-grid" id="trainerRoster"></div>

    <div id="trainerInviteModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="inviteTrainerTitle">
      <div class="modal-box">
        <div class="modal-head"><h3 id="inviteTrainerTitle">Invite Trainer</h3><button class="modal-close" onclick="Utils.closeModal('trainerInviteModal')" aria-label="Close">${ICONS.x}</button></div>
        <div class="modal-body">
          <div class="field"><label for="trName">Trainer name</label><input class="input" id="trName" placeholder="e.g. Nisha Patel"></div>
          <div class="field"><label for="trSkill">Primary skill</label><input class="input" id="trSkill" placeholder="e.g. Data Science"></div>
          <div class="field"><label for="trEmail">Email</label><input class="input" type="email" id="trEmail" placeholder="trainer@example.com"></div>
          <div class="field"><label for="trPhone">Phone</label><input class="input" id="trPhone" placeholder="+91 98xxxx xxxx"></div>
        </div>
        <div class="modal-foot">
          <button class="btn btn-outline" onclick="Utils.closeModal('trainerInviteModal')">Cancel</button>
          <button class="btn btn-primary" onclick="Utils.toast('Invitation sent to trainer (demo).'); Utils.closeModal('trainerInviteModal');">Send Invite</button>
        </div>
      </div>
    </div>
  `;

  function renderList(){
    const q = (window.__searchQuery || "").toLowerCase();
    const list = trainers.filter(t => {
      if (activeSkill && t.primarySkill !== activeSkill) return false;
      if (activeMode && t.mode !== activeMode) return false;
      if (q && !(t.name.toLowerCase().includes(q) || t.primarySkill.toLowerCase().includes(q) || t.skills.join(" ").toLowerCase().includes(q) || t.city.toLowerCase().includes(q))) return false;
      return true;
    });

    const grid = document.getElementById("trainerRoster");
    grid.innerHTML = list.map(t => `
      <div class="card card-hover trainer-card">
        <div class="trainer-card-top">
          <img class="avatar-sm" src="${t.photo}" alt="${t.name}" loading="lazy">
          <div class="who">
            <strong>${t.name}</strong>
            <span class="loc">${ICONS.mapPin} ${t.city}, ${t.state}</span>
          </div>
          <div class="fee"><strong>${Utils.formatINR(t.feeMin)}–${Utils.formatINR(t.feeMax)}</strong></div>
        </div>
        <div class="rec-meta"><span class="stars">★ ${t.rating}</span><span>${t.completedAssignments} assignments</span><span>${t.mode}</span></div>
        <p class="trainer-desc">${t.bio}</p>
        <div class="chip-row">${t.skills.slice(0,4).map(s=>`<span class="chip">${s}</span>`).join("")}</div>
        <div class="trainer-card-foot">
          <button class="btn btn-outline btn-sm" style="flex:1" onclick="openTrainerProfile('${t.id}')">Details</button>
          <button class="btn btn-primary btn-sm" onclick="Utils.toast('Request sent to ${t.name}.');">Request</button>
        </div>
      </div>
    `).join("");

    if (!list.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><div class="icon-wrap">${ICONS.users}</div><h4>No trainers found</h4><p>Adjust search or filters to see more trainers.</p></div>`;
    }
  }

  document.getElementById("tSkill").addEventListener("change", (e) => { activeSkill = e.target.value; renderList(); });
  document.getElementById("tMode").addEventListener("change", (e) => { activeMode = e.target.value; renderList(); });
  document.getElementById("clearTrainerFilters").addEventListener("click", () => {
    activeSkill = "";
    activeMode = "";
    document.getElementById("tSkill").value = "";
    document.getElementById("tMode").value = "";
    window.__searchQuery = "";
    renderList();
  });

  window.onGlobalSearch = (val) => { window.__searchQuery = val; renderList(); };
  document.getElementById("trainerInviteModal").addEventListener("click", (e) => { if (e.target.id === "trainerInviteModal") Utils.closeModal('trainerInviteModal'); });

  renderList();
}

function openTrainerProfile(id){
  const t = window.MOCK.trainers.find(x => x.id === id);
  if (!t) return;
  const modal = document.createElement("div");
  modal.className = "modal-overlay open";
  modal.id = "trainerProfileModal";
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-head"><h3>${t.name}</h3><button class="modal-close" onclick="document.getElementById('trainerProfileModal').remove()" aria-label="Close">${ICONS.x}</button></div>
      <div class="modal-body">
        <div class="field-row"><div class="field"><label>Primary skill</label><p>${t.primarySkill}</p></div><div class="field"><label>Mode</label><p>${t.mode}</p></div></div>
        <div class="field-row"><div class="field"><label>City</label><p>${t.city}, ${t.state}</p></div><div class="field"><label>Rating</label><p>★ ${t.rating}</p></div></div>
        <div class="field"><label>Experience</label><p>${t.experienceYears} years</p></div>
        <div class="field"><label>Completed assignments</label><p>${t.completedAssignments}</p></div>
        <div class="field"><label>Contact</label><p>${t.email} · ${t.phone}</p></div>
        <div class="chip-row">${t.skills.map(s=>`<span class="chip">${s}</span>`).join("")}</div>
        <p class="trainer-desc">${t.bio}</p>
      </div>
      <div class="modal-foot"><button class="btn btn-outline" onclick="document.getElementById('trainerProfileModal').remove()">Close</button><button class="btn btn-primary" onclick="Utils.toast('Request sent to ${t.name}.'); document.getElementById('trainerProfileModal').remove()">${ICONS.arrowRight} Request Trainer</button></div>
    </div>
  `;
  document.body.appendChild(modal);
}
