function renderShortlisted(){
  const el = document.getElementById("pageContent");

  function paint(){
    const ids = Shortlist.get();
    const trainers = window.MOCK.trainers.filter(t => ids.includes(t.id));
    const count = trainers.length;
    const topSkillSet = new Set(trainers.flatMap(t => t.skills)).size;

    el.innerHTML = `
      <div class="page-head">
        <div>
          <h1>Shortlisted</h1>
          <p class="lede">Trainers you've saved for upcoming requirements. Shortlisting is free and doesn't notify the trainer.</p>
        </div>
        <a class="btn btn-outline" href="find-trainers.html">${ICONS.search} Find more trainers</a>
      </div>

      <div class="stat-grid">
        <div class="card stat-card"><div class="stat-icon blue">${ICONS.star}</div><div class="stat-body"><span>Shortlisted</span><strong>${count}</strong></div></div>
        <div class="card stat-card"><div class="stat-icon green">${ICONS.checkCircle}</div><div class="stat-body"><span>Verified</span><strong>${trainers.filter(t=>t.verified.identity).length}</strong></div></div>
        <div class="card stat-card"><div class="stat-icon teal">${ICONS.mapPin}</div><div class="stat-body"><span>Locations</span><strong>${new Set(trainers.map(t=>t.state)).size}</strong></div></div>
        <div class="card stat-card"><div class="stat-icon amber">${ICONS.layers}</div><div class="stat-body"><span>Skills</span><strong>${topSkillSet}</strong></div></div>
      </div>

      ${trainers.length ? `<div class="card-grid" id="shortGrid"></div>` : `
        <div class="card">
          <div class="empty-state">
            <div class="icon-wrap">${ICONS.star}</div>
            <h4>No trainers shortlisted yet</h4>
            <p>Browse verified trainers and tap the star on any profile to save it here for later.</p>
            <a class="btn btn-primary btn-sm" href="find-trainers.html">${ICONS.search} Find Trainers</a>
          </div>
        </div>
      `}

      <div id="trainerModal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="trainerModalTitle">
        <div class="modal-box" id="trainerModalBox"></div>
      </div>
    `;

    if (trainers.length){
      document.getElementById("shortGrid").innerHTML = trainers.map(t => `
        <div class="card card-hover trainer-card">
          <div class="trainer-card-top">
            <img class="avatar-sm" style="width:46px;height:46px" src="${t.photo}" alt="" loading="lazy">
            <div class="who">
              <strong>${t.name} ${t.verified.identity ? ICONS.checkCircle : ""}</strong>
              <span class="loc">${ICONS.mapPin} ${t.city}, ${t.state}</span>
            </div>
            <div class="fee"><strong>${Utils.formatINR(t.feeMin)}–${Utils.formatINR(t.feeMax)}</strong></div>
          </div>
          <div class="rec-meta"><span class="stars">★ ${t.rating}</span><span>${t.completedAssignments} assignments</span><span>${t.mode}</span></div>
          <p class="trainer-desc">${t.bio}</p>
          <div class="chip-row">${t.skills.slice(0,4).map(s=>`<span class="chip">${s}</span>`).join("")}</div>
          <div class="trainer-card-foot">
            <button class="btn btn-outline btn-sm" style="flex:1" onclick="openTrainerModal('${t.id}')">View Profile</button>
            <button class="btn btn-primary btn-sm" id="shortlist-${t.id}" onclick="toggleShortlistBtn('${t.id}'); renderShortlisted();" aria-pressed="true" aria-label="Remove from shortlist">${ICONS.star}</button>
          </div>
        </div>
      `).join("");

      document.getElementById("trainerModal").addEventListener("click", (e) => { if (e.target.id === "trainerModal") Utils.closeModal("trainerModal"); });
    }
  }

  paint();
}
