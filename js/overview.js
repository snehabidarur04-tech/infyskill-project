function renderOverview(){
  const el = document.getElementById("pageContent");
  const trainers = window.MOCK.trainers;
  const assignments = window.MOCK.assignments;
  const payments = window.MOCK.payments || [];
  const invoices = window.MOCK.invoices || [];
  const notifications = window.MOCK.notifications || [];

  const activeTrainers = trainers.length;
  const verifiedTrainers = trainers.filter(t => t.verified.identity && t.verified.skill && t.verified.demo);
  const averageRating = (trainers.reduce((sum, t) => sum + t.rating, 0) / trainers.length).toFixed(1);
  const featuredTrainers = [...trainers]
    .sort((a,b) => b.rating - a.rating || b.completedAssignments - a.completedAssignments)
    .slice(0,3);
  const requirementSpeed = "< 10 min";
  const approvalSpeed = "< 5 min";
  const traceability = "100%";
  const today = new Date();
  today.setHours(0,0,0,0);
  const isoToday = today.toISOString().slice(0,10);
  const actionDetails = {
    "Awaiting Confirmation": { label:"Confirm trainer and client", tone:"warn" },
    "In Progress": { label:"Check delivery evidence", tone:"blue" },
    "Scheduled": { label:"Check session readiness", tone:"teal" },
    "Draft": { label:"Finalise and send assignment", tone:"amber" },
    "Payment Due": { label:"Approve payment", tone:"warn" }
  };
  const ownerActions = assignments
    .filter(a => actionDetails[a.status])
    .sort((a,b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0,4);
  const activeAssignments = assignments.filter(a => !["Closed", "Cancelled", "Paid"].includes(a.status));
  const paymentReview = payments.filter(p => ["Due", "Overdue", "Partially Paid"].includes(p.status));
  const priorityAssignments = activeAssignments
    .filter(a => ["Awaiting Confirmation", "In Progress", "Draft"].includes(a.status))
    .sort((a,b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0,3);
  let upcomingSessions = assignments
    .filter(a => a.startDate >= isoToday && !["Cancelled", "Closed", "Paid"].includes(a.status))
    .sort((a,b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0,4);
  // Keep the overview useful when this demo is opened after its sample dates.
  if (!upcomingSessions.length) {
    upcomingSessions = assignments
      .filter(a => !["Cancelled", "Closed", "Paid"].includes(a.status))
      .sort((a,b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0,4);
  }

  el.innerHTML = `
    <section class="hero-panel">
      <h1>Find the right trainer. Manage every programme with confidence.</h1>
      <p class="hero-copy">Trainers Connect is not a paid phone directory. It is the operating layer between colleges, institutes and companies and India's individual trainers — assignments, calendars, documents, invoices, approvals and payment visibility with a full audit history.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="find-trainers.html">Browse verified trainers</a>
        <a class="btn btn-secondary" href="requirements.html">Open vendor console</a>
      </div>
      <div class="hero-metrics">
        <div>
          <strong>${requirementSpeed}</strong>
          <span>Requirement to assignment</span>
        </div>
        <div>
          <strong>${approvalSpeed}</strong>
          <span>Accept and invoice</span>
        </div>
        <div>
          <strong>${traceability}</strong>
          <span>Traceable status changes</span>
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <div>
          <h2>Assignment and payment follow-ups</h2>
          <p>Review the items that need an owner decision before delivery or settlement is delayed.</p>
        </div>
      </div>
      <div class="grid-3">
        <div class="card card-pad">
          <div class="section-head"><h3>Priority assignments</h3><a class="see-all" href="assignments.html">Manage assignments ${ICONS.arrowRight}</a></div>
          ${priorityAssignments.map(a => `
            <div class="queue-item overview-detail-row">
              <div class="queue-icon ${actionDetails[a.status].tone}">${ICONS.clipboard}</div>
              <div class="queue-body">
                <strong>${a.program}</strong>
                <p>${a.trainerName} · ${a.college}</p>
                <p class="overview-detail-date">${Utils.formatDateRange(a.startDate, a.endDate)} · ${a.mode}</p>
              </div>
              <div class="overview-detail-status">${Utils.statusPill(a.status)}<a href="assignments.html">Open</a></div>
            </div>
          `).join("") || `<div class="empty-state" style="padding:24px 0;">No priority assignments need review.</div>`}
        </div>
        <div class="card card-pad">
          <div class="section-head"><h3>Payment follow-ups</h3><a class="see-all" href="payments.html">Manage payments ${ICONS.arrowRight}</a></div>
          ${paymentReview.slice(0,3).map(p => {
            const invoice = invoices.find(i => i.id === p.invoiceId);
            const amount = p.amount || (invoice ? invoice.total : 0);
            return `
              <div class="queue-item overview-detail-row">
                <div class="queue-icon ${p.status === "Overdue" ? "warn" : "amber"}">${ICONS.wallet}</div>
                <div class="queue-body">
                  <strong>${p.invoiceId} · ${Utils.formatINR(amount)}</strong>
                  <p>${p.trainer} · ${p.college}</p>
                  <p class="overview-detail-date">Due ${Utils.formatDate(p.date)}</p>
                </div>
                <div class="overview-detail-status">${Utils.statusPill(p.status)}<a href="payments.html">Open</a></div>
              </div>
            `;
          }).join("") || `<div class="empty-state" style="padding:24px 0;">No payment follow-ups are pending.</div>`}
        </div>
        <div class="card card-pad">
          <div class="section-head"><h3>${ICONS.calendar} Calendar</h3><a class="see-all" href="calendar.html">Full view ${ICONS.arrowRight}</a></div>
          <div class="mini-cal-head">
            <strong id="calLabel"></strong>
            <div class="cal-nav">
              <button id="calPrev" aria-label="Previous month">‹</button>
              <button id="calNext" aria-label="Next month">›</button>
            </div>
          </div>
          <div class="mini-cal-grid" id="miniCal"></div>
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="card card-pad">
        <div class="section-head"><h3>${ICONS.bell} Recent activity</h3><a class="see-all" href="notifications.html">All activity ${ICONS.arrowRight}</a></div>
        <div class="activity-list">
          ${notifications.slice(0,3).map(n => `<div class="activity-item"><span class="activity-dot ${n.read ? "" : "unread"}"></span><div><strong>${n.title}</strong><p>${n.body}</p><time>${n.time}</time></div></div>`).join("") || `<p class="text-muted">No recent activity.</p>`}
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <div>
          <h2>Owner schedule at a glance</h2>
          <p>See the next programmes and the decisions needed to keep delivery, approvals and payments moving.</p>
        </div>
        <a class="btn btn-secondary btn-sm" href="calendar.html">${ICONS.calendar} Open full calendar</a>
      </div>
      <div class="dash-grid">
        <div class="card card-pad">
          <div class="section-head">
            <h3>Next scheduled programmes</h3>
            <a class="see-all" href="assignments.html">All assignments ${ICONS.arrowRight}</a>
          </div>
          ${upcomingSessions.map(a => `
            <div class="queue-item" style="padding-left:0;padding-right:0;">
              <div class="queue-icon teal">${ICONS.calendar}</div>
              <div class="queue-body">
                <strong>${a.program}</strong>
                <p>${Utils.formatDateRange(a.startDate, a.endDate)} · ${a.trainerName} · ${a.college}</p>
              </div>
              <div>${Utils.statusPill(a.status)}</div>
            </div>
          `).join("") || `<div class="empty-state" style="padding:24px 0;">No programmes are scheduled.</div>`}
        </div>
        <div class="card card-pad">
          <div class="section-head"><h3>Owner action list</h3></div>
          ${ownerActions.map(a => `
            <div class="queue-item" style="padding-left:0;padding-right:0;">
              <div class="queue-icon ${actionDetails[a.status].tone}">${ICONS.alert}</div>
              <div class="queue-body">
                <strong>${actionDetails[a.status].label}</strong>
                <p>${a.program} · ${Utils.formatDateRange(a.startDate, a.endDate)}</p>
              </div>
            </div>
          `).join("") || `<div class="empty-state" style="padding:24px 0;">No owner actions are pending.</div>`}
          <a class="view-cal-link" href="requirements.html">Review requirements and approvals ${ICONS.arrowRight}</a>
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <h2>One lifecycle, four moves</h2>
        <p>Requirements stay separate from assignments, so incomplete leads never pollute finance or calendar data.</p>
      </div>
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-index">01</div>
          <h3>Discover</h3>
          <p>Search verified profiles by state, city, skill, mode, language and fee.</p>
        </div>
        <div class="feature-card">
          <div class="feature-index">02</div>
          <h3>Assign</h3>
          <p>Convert an agreed scope into a formal assignment with dates, hours and fees.</p>
        </div>
        <div class="feature-card">
          <div class="feature-index">03</div>
          <h3>Deliver</h3>
          <p>Calendar, attendance and evidence captured from mobile at the venue.</p>
        </div>
        <div class="feature-card">
          <div class="feature-index">04</div>
          <h3>Settle</h3>
          <p>Invoice, bill approval, partial payments and a permanent audit trail.</p>
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <div>
          <h2>Trainer network</h2>
          <p>${verifiedTrainers.length} trainers have completed identity, skill and demo verification. Choose from proven expertise across delivery modes and locations.</p>
        </div>
        <a class="btn btn-secondary btn-sm" href="trainers.html">View all trainers ${ICONS.arrowRight}</a>
      </div>
      <div class="stat-grid trainer-summary-grid">
        <div class="card stat-card"><div class="stat-icon teal">${ICONS.shield}</div><div class="stat-body"><span>Verified trainers</span><strong>${verifiedTrainers.length}</strong></div></div>
        <div class="card stat-card"><div class="stat-icon amber">${ICONS.star}</div><div class="stat-body"><span>Average rating</span><strong>${averageRating} / 5</strong></div></div>
        <div class="card stat-card"><div class="stat-icon blue">${ICONS.briefcase}</div><div class="stat-body"><span>Completed assignments</span><strong>${trainers.reduce((sum, t) => sum + t.completedAssignments, 0)}</strong></div></div>
      </div>
      <div class="trainer-overview-grid">
        ${featuredTrainers.map(t => `
          <article class="trainer-overview-card">
            <img class="trainer-overview-avatar" src="${t.photo}" alt="${t.name}">
            <div class="trainer-overview-copy">
              <div class="flex-between gap-8"><h3>${t.name}</h3><span class="stars">★ ${t.rating}</span></div>
              <p>${t.primarySkill} · ${t.experienceYears} years experience</p>
              <div class="trainer-overview-meta"><span>${t.city}</span><span>${t.mode}</span><span>${t.completedAssignments} assignments</span></div>
              <small>${t.availability}</small>
            </div>
          </article>
        `).join("")}
      </div>
    </section>

    <section class="section-block section-dark">
      <div class="dark-panel">
        <h2>Verified trainers for confident assignments</h2>
        <p>Each trainer profile records identity, skill and experience checks separately, so you can select the right expert for every programme with confidence.</p>
      </div>
    </section>
  `;

  initMiniCalendar(assignments);
}

function initMiniCalendar(assignments){
  const today = new Date();
  const state = { year: today.getFullYear(), month: today.getMonth() };
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  function eventDaysFor(year, month){
    const set = new Set();
    assignments.forEach(a => {
      const d = new Date(a.startDate);
      if (d.getFullYear() === year && d.getMonth() === month) set.add(d.getDate());
    });
    return set;
  }

  function render(){
    const { year, month } = state;
    document.getElementById("calLabel").textContent = `${monthNames[month]} ${year}`;
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7; // Monday-first grid
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const events = eventDaysFor(year, month);

    let cells = "";
    ["MO","TU","WE","TH","FR","SA","SU"].forEach(d => cells += `<div class="dow">${d}</div>`);

    for (let i=0;i<startOffset;i++){
      cells += `<div class="day muted">${daysInPrevMonth - startOffset + i + 1}</div>`;
    }
    for (let d=1; d<=daysInMonth; d++){
      const isToday = today.getFullYear()===year && today.getMonth()===month && today.getDate()===d;
      const hasEvent = events.has(d);
      cells += `<div class="day ${isToday?'today':''} ${hasEvent && !isToday?'has-event':''}">${d}</div>`;
    }
    const totalCells = startOffset + daysInMonth;
    const trailing = (7 - (totalCells % 7)) % 7;
    for (let d=1; d<=trailing; d++){
      cells += `<div class="day muted">${d}</div>`;
    }
    document.getElementById("miniCal").innerHTML = cells;
  }

  document.getElementById("calPrev").addEventListener("click", () => {
    state.month--; if (state.month<0){ state.month=11; state.year--; } render();
  });
  document.getElementById("calNext").addEventListener("click", () => {
    state.month++; if (state.month>11){ state.month=0; state.year++; } render();
  });
  render();
}
