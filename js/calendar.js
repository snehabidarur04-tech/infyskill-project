function renderCalendarPage(){
  const el = document.getElementById("pageContent");
  const assignments = window.MOCK.assignments;
  const modeColor = { Offline:"var(--blue-050)", Online:"var(--teal-050)", Hybrid:"var(--violet-050)" };
  const modeText = { Offline:"var(--blue-600)", Online:"var(--teal-600)", Hybrid:"var(--violet-600)" };

  const today = new Date();
  const state = { year:2026, month:7, selected:`2026-08-${String(today.getDate()).padStart(2,"0")}` };
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const upcomingSessions = assignments
    .filter(a => new Date(a.startDate) >= today)
    .sort((a,b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5);

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Calendar</h1>
        <p class="lede">All sessions across trainers and colleges in one place.</p>
      </div>
      <div class="page-head-actions">
        <button class="btn btn-outline" onclick="Utils.toast('Exported to ICS (demo).')">${ICONS.download} Export</button>
        <a class="btn btn-primary" href="assignments.html">${ICONS.plus} New Assignment</a>
      </div>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.calendar}</div><div class="stat-body"><span>Total sessions</span><strong>${assignments.length}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon teal">${ICONS.users}</div><div class="stat-body"><span>Active trainers</span><strong>${new Set(assignments.map(a => a.trainerName)).size}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.building}</div><div class="stat-body"><span>Colleges scheduled</span><strong>${new Set(assignments.map(a => a.college)).size}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.clock}</div><div class="stat-body"><span>Upcoming this week</span><strong>${assignments.filter(a => new Date(a.startDate) <= new Date(today.getTime() + 7*24*60*60*1000) && new Date(a.startDate) >= today).length}</strong></div></div>
    </div>

    <div class="dash-grid">
      <div>
        <div class="card card-pad">
          <div class="mini-cal-head" style="margin-bottom:16px;">
            <strong id="fcLabel" style="font-size:16px;"></strong>
            <div class="cal-nav">
              <button id="fcPrev" aria-label="Previous month">‹</button>
              <button id="fcToday" style="width:auto;padding:0 10px;font-size:11.5px;font-weight:700;">Today</button>
              <button id="fcNext" aria-label="Next month">›</button>
            </div>
          </div>
          <div class="full-cal-grid" id="fcGrid"></div>
        </div>
      </div>
      <div class="card card-pad">
        <div class="section-head"><h3>Upcoming sessions</h3></div>
        ${upcomingSessions.length ? upcomingSessions.map(e => `
          <div class="detail-card" style="margin-bottom:14px;">
            <div class="flex-between"><strong>${e.program}</strong><span>${Utils.formatDateRange(e.startDate,e.endDate)}</span></div>
            <p class="text-muted" style="margin:8px 0 0;">${e.trainerName} · ${e.college}</p>
            <div class="eyebrow-row" style="margin-top:10px;"><span class="badge badge-teal">${e.mode}</span>${Utils.statusPill(e.status)}</div>
          </div>
        `).join("") : `<div class="empty-state" style="padding:20px;">No upcoming sessions scheduled.</div>`}
        <div class="detail-card" style="padding:18px;">
          <h4 style="font-size:13px;color:var(--ink-500);margin-bottom:10px;">Calendar guidance</h4>
          <ul style="padding-left:18px;color:var(--ink-700);font-size:13px;line-height:1.7;">
            <li>Confirm trainers for sessions starting this week.</li>
            <li>Check logistics for hybrid and offline classroom sessions.</li>
            <li>Export to calendar to share with your finance team.</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  function eventsFor(year, month, day){
    const target = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    return assignments.filter(a => target >= a.startDate && target <= a.endDate);
  }
  function eventsOnDate(iso){
    return assignments.filter(a => iso >= a.startDate && iso <= a.endDate);
  }

  function renderGrid(){
    const { year, month } = state;
    document.getElementById("fcLabel").textContent = `${monthNames[month]} ${year}`;
    const first = new Date(year, month, 1);
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    let html = "";
    ["MON","TUE","WED","THU","FRI","SAT","SUN"].forEach(d => html += `<div class="fc-dow">${d}</div>`);

    for (let i=0;i<startOffset;i++){
      html += `<div class="fc-day muted"><span class="num">${daysInPrevMonth-startOffset+i+1}</span></div>`;
    }
    for (let d=1; d<=daysInMonth; d++){
      const iso = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const isToday = today.getFullYear()===year && today.getMonth()===month && today.getDate()===d;
      const isSelected = state.selected === iso;
      const evs = eventsFor(year, month, d);
      html += `<div class="fc-day ${isToday?'today':''} ${isSelected?'selected':''}" data-iso="${iso}">
        <span class="num">${d}</span>
        ${evs.slice(0,2).map(e => `<span class="fc-chip" style="background:${modeColor[e.mode]};color:${modeText[e.mode]}">${e.trainerName.split(" ")[0]} · ${e.program.split(" ").slice(0,2).join(" ")}</span>`).join("")}
        ${evs.length>2 ? `<span class="fc-chip" style="background:var(--ink-100);color:var(--ink-600)">+${evs.length-2} more</span>` : ""}
      </div>`;
    }
    const totalCells = startOffset + daysInMonth;
    const trailing = (7 - (totalCells % 7)) % 7;
    for (let d=1; d<=trailing; d++) html += `<div class="fc-day muted"><span class="num">${d}</span></div>`;

    document.getElementById("fcGrid").innerHTML = html;
    Utils.qsa(".fc-day[data-iso]").forEach(cell => {
      cell.addEventListener("click", () => { state.selected = cell.dataset.iso; renderGrid(); renderDayPanel(); });
    });
  }

  function renderDayPanel(){
    const evs = eventsOnDate(state.selected);
    const d = new Date(state.selected + "T00:00:00");
    document.getElementById("daySessionsCard").innerHTML = `
      <div class="section-head"><h3>${d.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</h3></div>
      ${evs.length ? evs.map(e => `
        <div class="queue-item" style="padding-left:0;padding-right:0;">
          <div class="queue-icon ${e.mode==='Online'?'teal':e.mode==='Hybrid'?'blue':'amber'}">${ICONS.calendar}</div>
          <div class="queue-body">
            <strong>${e.program}</strong>
            <p>${e.trainerName} · ${e.college}</p>
            <p class="text-muted" style="margin-top:2px;">${e.mode} · ${Utils.statusPill(e.status)}</p>
          </div>
        </div>
      `).join("") : `
        <div class="empty-state" style="padding:30px 10px;">
          <div class="icon-wrap">${ICONS.calendar}</div>
          <h4>No sessions</h4>
          <p>Nothing scheduled on this day.</p>
        </div>
      `}
    `;
  }

  document.getElementById("fcPrev").addEventListener("click", () => { state.month--; if(state.month<0){state.month=11;state.year--;} renderGrid(); });
  document.getElementById("fcNext").addEventListener("click", () => { state.month++; if(state.month>11){state.month=0;state.year++;} renderGrid(); });
  document.getElementById("fcToday").addEventListener("click", () => { state.year=2026; state.month=7; state.selected=`2026-08-${String(today.getDate()).padStart(2,"0")}`; renderGrid(); renderDayPanel(); });

  renderGrid();
  renderDayPanel();
}
