function renderSubscription(){
  const el = document.getElementById("pageContent");
  const s = window.MOCK.subscription;
  const assignPct = Math.round((s.activeAssignments/s.assignmentLimit)*100);
  const seatPct = Math.round((s.teamSeatsUsed/s.teamSeatsLimit)*100);

  const plans = [
    { name:"Vendor Free", price:"₹0", period:"", tag:null, features:["Register & verify account","Browse verified profiles","Shortlist trainers","One draft requirement"] },
    { name:"Vendor Pay-as-you-use", price:"₹299", period:"per activated assignment", tag:null, features:["Direct contact & assignment workflow","Schedule, documents, invoice tracking","No charge if trainer rejects","Credited toward subscription upgrade"] },
    { name:"Vendor Operations", price:"₹1,999", period:"/month", tag:"Current plan", current:true, features:["Up to 50 active assignments","Multiple team members","College/client management","Approvals, reports & templates"] },
  ];

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Subscription</h1>
        <p class="lede">Manage your plan, usage limits and billing history. Changes apply from your next renewal date.</p>
      </div>
      <button class="btn btn-outline" onclick="Utils.toast('Cancellation flow opened (demo).')">Cancel Plan</button>
    </div>

    <div class="card" style="padding:22px;margin-bottom:22px;">
      <div class="flex-between" style="flex-wrap:wrap;gap:16px;">
        <div>
          <span class="text-muted" style="font-size:12px;">Current plan</span>
          <h2 style="font-size:20px;margin-top:2px;">${s.currentPlan}</h2>
          <p class="text-muted" style="font-size:12.5px;margin-top:4px;">${s.price} · renews ${s.renewalDate}</p>
        </div>
        <button class="btn btn-primary" onclick="Utils.toast('Redirecting to plan upgrade (demo).')">${ICONS.layers} Change Plan</button>
      </div>
      <div class="grid-2" style="margin-top:20px;">
        <div>
          <div class="flex-between" style="margin-bottom:6px;font-size:12.5px;"><span>Active assignments</span><strong>${s.activeAssignments} / ${s.assignmentLimit}</strong></div>
          <div class="progress-track"><div class="progress-fill" style="width:${assignPct}%;"></div></div>
        </div>
        <div>
          <div class="flex-between" style="margin-bottom:6px;font-size:12.5px;"><span>Team seats used</span><strong>${s.teamSeatsUsed} / ${s.teamSeatsLimit}</strong></div>
          <div class="progress-track"><div class="progress-fill" style="width:${seatPct}%;"></div></div>
        </div>
      </div>
    </div>

    <h3 style="font-size:14px;margin-bottom:14px;">Available plans</h3>
    <div class="plan-grid">
      ${plans.map(p => `
        <div class="card plan-card ${p.current?'current':''}">
          ${p.tag ? `<span class="plan-tag">${p.tag}</span>` : ""}
          <h4>${p.name}</h4>
          <div class="plan-price">${p.price} <span>${p.period}</span></div>
          <ul class="plan-list">
            ${p.features.map(f => `<li>${ICONS.checkCircle}<span>${f}</span></li>`).join("")}
          </ul>
          <button class="btn ${p.current?'btn-outline':'btn-primary'}" style="width:100%;" onclick="Utils.toast('${p.current?'This is your current plan.':'Switched to '+p.name+' (demo).'}')">${p.current?'Current Plan':'Select Plan'}</button>
        </div>
      `).join("")}
    </div>

    <div class="card" style="margin-top:22px;">
      <div style="padding:18px 20px 4px;"><h3 style="font-size:14px;">Billing history</h3></div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Bill</th><th>Date</th><th>Description</th><th>Amount</th><th>Status</th><th></th></tr></thead>
          <tbody>
            ${s.billingHistory.map(b => `
              <tr>
                <td class="text-muted">${b.id}</td>
                <td>${b.date}</td>
                <td>${b.desc}</td>
                <td>${Utils.formatINR(b.amount)}</td>
                <td>${Utils.statusPill(b.status)}</td>
                <td><button class="btn btn-outline btn-sm" onclick="Utils.toast('Downloading receipt ${b.id} (demo).')">${ICONS.download} Receipt</button></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
