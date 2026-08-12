const Shortlist = (() => {
  const KEY = "infyskill_shortlist_v1";
  function get(){ try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e){ return []; } }
  function has(id){ return get().includes(id); }
  function toggle(id){
    let list = get();
    if (list.includes(id)) list = list.filter(x => x !== id);
    else list.push(id);
    localStorage.setItem(KEY, JSON.stringify(list));
    return list.includes(id);
  }
  return { get, has, toggle };
})();

function renderFindTrainers(){
  const el = document.getElementById("pageContent");
  const trainers = window.MOCK.trainers;
  const skills = [...new Set(trainers.map(t => t.primarySkill))].sort();
  const states = [...new Set(trainers.map(t => t.state))].sort();

  el.innerHTML = `
    <section class="page-head hero-panel">
      <div>
        <h1>Find a trainer</h1>
        <p class="hero-copy">Results are ranked on relevance, verification and availability — never on who paid more.</p>
      </div>
    </section>

    <section class="filter-card">
      <div class="filters-grid">
        <div class="field">
          <label for="fSearch">Keyword</label>
          <input class="input" id="fSearch" type="text" placeholder="Skill, name or city">
        </div>
        <div class="field">
          <label for="fState">State</label>
          <select class="select" id="fState"><option value="">Any state</option>${states.map(s=>`<option value="${s}">${s}</option>`).join("")}</select>
        </div>
        <div class="field">
          <label for="fSkill">Skill</label>
          <select class="select" id="fSkill"><option value="">Any skill</option>${skills.map(s=>`<option value="${s}">${s}</option>`).join("")}</select>
        </div>
        <div class="field">
          <label>Delivery mode</label>
          <div class="filters-row">
            <label class="checkbox-field"><input type="radio" name="mode" value="" checked> Any</label>
            <label class="checkbox-field"><input type="radio" name="mode" value="Online"> Online</label>
            <label class="checkbox-field"><input type="radio" name="mode" value="Offline"> Offline</label>
          </div>
        </div>
      </div>
      <div class="filters-row">
        <div class="field" style="flex:1;">
          <label>Max fee / day</label>
          <div class="slider-group"><span>₹3,000</span><span>₹20,000</span></div>
          <div class="range-track"></div>
        </div>
        <label class="checkbox-field"><input type="checkbox" id="fAvailableOnly"> Available only</label>
      </div>
      <div class="filters-row" style="justify-content:flex-end;">
        <button class="btn btn-secondary" id="clearFilters">Clear filters</button>
      </div>
    </section>

    <div class="section-head">
      <h2 id="resultCount">${trainers.length} verified trainers match your filters</h2>
    </div>

    <div id="trainerResults"></div>
  `;

  let allTrainers = trainers;

  function applyFilters(){
    const q = document.getElementById("fSearch").value.trim().toLowerCase();
    const state = document.getElementById("fState").value;
    const skill = document.getElementById("fSkill").value;
    const mode = Array.from(document.querySelectorAll('input[name="mode"]')).find(i => i.checked).value;
    const availableOnly = document.getElementById("fAvailableOnly").checked;

    const filtered = allTrainers.filter(t => {
      if (state && t.state !== state) return false;
      if (skill && t.primarySkill !== skill) return false;
      if (mode && t.mode !== mode) return false;
      if (availableOnly && t.availability !== "Available this week") return false;
      if (q && !(`${t.name} ${t.primarySkill} ${t.city} ${t.state} ${t.skills.join(' ')}`.toLowerCase().includes(q))) return false;
      return true;
    });

    document.getElementById("resultCount").textContent = `${filtered.length} verified trainers match your filters`;
    renderCards(filtered);
  }

  function renderCards(list){
    const results = document.getElementById("trainerResults");
    if (!list.length){
      results.innerHTML = `<div class="empty-state" style="padding:40px 24px; background:transparent; box-shadow:none;"><div class="icon-wrap">${ICONS.search}</div><h4>No trainers match your filters</h4><p>Try adjusting your filters or clear them to view more profiles.</p><button class="btn btn-outline btn-sm" id="resetFilters">Clear filters</button></div>`;
      document.getElementById("resetFilters").addEventListener("click", () => document.getElementById("clearFilters").click());
      return;
    }

    results.innerHTML = list.map(t => `
      <div class="trainer-card">
        <div class="trainer-card-top">
          <div class="trainer-avatar">${t.initials || t.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
          <div class="trainer-card-content">
            <h3>${t.name} <span class="text-muted" style="font-size:13px;font-weight:600;">${t.availability === 'Available this week' ? 'Available this week' : 'Booked'}</span></h3>
            <p>${t.primarySkill} coach for engineering colleges</p>
            <div class="trainer-card-meta"><span>${t.city}, ${t.state}</span><span>${t.mode}</span><span>${t.experienceYears} yrs · ★ ${t.rating}</span></div>
            <div class="trainer-card-meta">${t.skills.slice(0,4).map(skill => `<span>${skill}</span>`).join('')}</div>
          </div>
        </div>
        <div class="trainer-card-right">
          <div class="trainer-card-price">₹${t.feeMin.toLocaleString()}</div>
          <div class="trainer-card-cta">
            <button class="btn ${Shortlist.has(t.id) ? 'btn-primary' : 'btn-outline'} btn-sm" onclick="toggleShortlistBtn('${t.id}');" aria-pressed="${Shortlist.has(t.id)}">
              ${ICONS.star} ${Shortlist.has(t.id) ? 'Shortlisted' : 'Shortlist'}
            </button>
            <a class="btn btn-primary btn-sm" href="assignments.html">Send requirement</a>
          </div>
        </div>
      </div>
    `).join('');
  }

  document.getElementById("fSearch").addEventListener("input", applyFilters);
  document.getElementById("fState").addEventListener("change", applyFilters);
  document.getElementById("fSkill").addEventListener("change", applyFilters);
  document.querySelectorAll('input[name="mode"]').forEach(input => input.addEventListener("change", applyFilters));
  document.getElementById("fAvailableOnly").addEventListener("change", applyFilters);
  document.getElementById("clearFilters").addEventListener("click", () => {
    document.getElementById("fSearch").value = "";
    document.getElementById("fState").value = "";
    document.getElementById("fSkill").value = "";
    document.querySelector('input[name="mode"][value=""]').checked = true;
    document.getElementById("fAvailableOnly").checked = false;
    applyFilters();
  });

  applyFilters();
}

function toggleShortlistBtn(id){
  const nowActive = Shortlist.toggle(id);
  const btn = document.getElementById(`shortlist-${id}`);
  if (btn){
    btn.classList.toggle("btn-primary", nowActive);
    btn.classList.toggle("btn-outline", !nowActive);
    btn.setAttribute("aria-pressed", String(nowActive));
  }
  Utils.toast(nowActive ? "Added to shortlist." : "Removed from shortlist.");
}

function openTrainerModal(id){
  const t = window.MOCK.trainers.find(x => x.id === id);
  if (!t) return;
  const badges = [
    t.verified.identity && ["Identity Verified","green"],
    t.verified.skill && ["Skill Verified","teal"],
    t.verified.demo && ["Teaching Demo Approved","blue"],
    t.verified.experienced && ["Experienced","violet"],
    t.verified.topRated && ["Top Rated","amber"],
  ].filter(Boolean);

  document.getElementById("trainerModalBox").innerHTML = `
    <div class="modal-head">
      <h3 id="trainerModalTitle">Trainer profile</h3>
      <button class="modal-close" onclick="Utils.closeModal('trainerModal')" aria-label="Close">${ICONS.x}</button>
    </div>
    <div class="modal-body">
      <div style="display:flex;gap:16px;align-items:flex-start;margin-bottom:16px;">
        <img src="${t.photo}" alt="" style="width:72px;height:72px;border-radius:16px;object-fit:cover;">
        <div>
          <h3 style="font-size:18px;">${t.name}</h3>
          <p class="text-muted" style="margin-top:2px;">${t.primarySkill} · ${t.city}, ${t.state}</p>
          <div class="rec-meta" style="margin-top:8px;"><span class="stars">★ ${t.rating}</span><span>${t.completedAssignments} assignments</span><span>${t.experienceYears} yrs experience</span></div>
        </div>
      </div>
      <div class="chip-row" style="margin-bottom:14px;">${badges.map(([label,tone])=>`<span class="badge ${tone==='green'?'':'badge-'+tone}">${ICONS.checkCircle}${label}</span>`).join("")}</div>
      <p style="font-size:13px;color:var(--ink-700);line-height:1.6;margin-bottom:16px;">${t.bio}</p>
      <div class="grid-2" style="margin-bottom:6px;">
        <div class="field"><label>Skills</label><div class="chip-row">${t.skills.map(s=>`<span class="chip">${s}</span>`).join("")}</div></div>
        <div class="field"><label>Languages</label><div class="chip-row">${t.languages.map(s=>`<span class="chip">${s}</span>`).join("")}</div></div>
      </div>
      <div class="grid-2">
        <div class="field"><label>Indicative fee</label><p style="font-size:13.5px;">${Utils.formatINR(t.feeMin)} – ${Utils.formatINR(t.feeMax)} / ${t.feeUnit}</p></div>
        <div class="field"><label>Availability</label><p style="font-size:13.5px;">${t.availability}</p></div>
      </div>
      <div class="field"><label>Delivery mode</label><p style="font-size:13.5px;">${t.mode}</p></div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-outline" onclick="toggleShortlistBtn('${t.id}');">${ICONS.star} ${Shortlist.has(t.id)?'Shortlisted':'Shortlist'}</button>
      <button class="btn btn-primary" onclick="Utils.closeModal('trainerModal'); Utils.toast('Request sent to ${t.name.split(' ')[0]}. They will confirm consent to share contact details.');">${ICONS.arrowRight} Request Trainer</button>
    </div>
  `;
  Utils.openModal("trainerModal");
}
