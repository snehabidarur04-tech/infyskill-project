function renderSupport(){
  const el = document.getElementById("pageContent");
  const tickets = window.MOCK.tickets;
  const priorityClass = { high:"priority-high", medium:"priority-medium", low:"priority-low" };

  const helpTopics = [
    { icon:"invoice", title:"Invoices & payments", desc:"Approving invoices, recording payments and reconciling ageing." },
    { icon:"users", title:"Trainers & verification", desc:"Search, shortlist, requirements and verification badges." },
    { icon:"team", title:"Team & roles", desc:"Inviting teammates and setting permission levels." },
    { icon:"layers", title:"Billing & subscription", desc:"Plans, limits, credits and cancellation rules." },
  ];
  const openTickets = tickets.filter(t => t.status !== "Resolved").length;

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Support</h1>
        <p class="lede">Get help on any assignment, invoice or payment — every ticket is linked to the record it's about.</p>
      </div>
      <button class="btn btn-primary" onclick="openTicketModal()">${ICONS.plus} Raise a Ticket</button>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.support}</div><div class="stat-body"><span>Active tickets</span><strong>${openTickets}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.alert}</div><div class="stat-body"><span>High priority</span><strong>${tickets.filter(t=>t.priority==='high').length}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.checkCircle}</div><div class="stat-body"><span>Resolved</span><strong>${tickets.filter(t=>t.status==='Resolved').length}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon teal">${ICONS.users}</div><div class="stat-body"><span>Related workflows</span><strong>${new Set(tickets.map(t=>t.linkedTo)).size}</strong></div></div>
    </div>

    <div class="dash-grid">
      <div>
        <div class="card-grid" style="margin-bottom:22px;">
          ${helpTopics.map(h => `
            <div class="card" style="padding:18px;cursor:pointer;" onclick="Utils.toast('Opening help articles on ${h.title} (demo).')">
              <div class="stat-icon blue" style="margin-bottom:10px;">${ICONS[h.icon]}</div>
              <h4 style="font-size:14px;margin-bottom:4px;">${h.title}</h4>
              <p class="text-muted" style="font-size:12px;">${h.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="card card-pad">
        <div class="section-head"><h3>Your tickets</h3></div>
        <div>
          ${tickets.map(t => `
            <div class="ticket-card">
              <span class="ticket-priority ${priorityClass[t.priority]}" title="${t.priority} priority"></span>
              <div style="flex:1;">
                <p style="font-size:13px;font-weight:700;">${t.subject}</p>
                <p class="text-muted" style="font-size:12px;">${t.id} · linked to ${t.linkedTo} · updated ${t.updated}</p>
              </div>
              ${Utils.statusPill(t.status)}
            </div>
          `).join("")}
        </div>
      </div>
    </div>

    <div id="ticketModal" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal-box" id="ticketModalBox"></div>
    </div>
  `;

  document.getElementById("ticketModal").addEventListener("click", (e) => { if (e.target.id==="ticketModal") Utils.closeModal("ticketModal"); });
}

function openTicketModal(){
  document.getElementById("ticketModalBox").innerHTML = `
    <div class="modal-head"><h3>Raise a Support Ticket</h3><button class="modal-close" onclick="Utils.closeModal('ticketModal')" aria-label="Close">${ICONS.x}</button></div>
    <div class="modal-body">
      <div class="field"><label for="tk-subject">What's the issue?</label><input class="input" type="text" id="tk-subject" placeholder="e.g. Payment not reflecting on invoice"></div>
      <div class="field-row">
        <div class="field"><label for="tk-link">Link to a record (optional)</label>
          <select id="tk-link" class="input">
            <option>None</option>
            ${window.MOCK.invoices.map(i=>`<option>Invoice #${i.id}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label for="tk-priority">Priority</label>
          <select id="tk-priority" class="input"><option>Low</option><option selected>Medium</option><option>High</option></select>
        </div>
      </div>
      <div class="field"><label for="tk-desc">Details</label><textarea class="textarea" id="tk-desc" rows="4" placeholder="Describe what happened…"></textarea></div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-outline" onclick="Utils.closeModal('ticketModal')">Cancel</button>
      <button class="btn btn-primary" onclick="Utils.toast('Ticket raised. Our team will respond shortly.'); Utils.closeModal('ticketModal');">${ICONS.checkCircle} Submit Ticket</button>
    </div>
  `;
  Utils.openModal("ticketModal");
}
