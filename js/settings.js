function renderSettings(){
  const el = document.getElementById("pageContent");
  const teamCount = window.MOCK.team?.length || 0;
  const activeAssignments = window.MOCK.subscription?.activeAssignments || 0;
  const notificationMode = "Daily summary";

  el.innerHTML = `
    <div class="page-head">
      <div>
        <h1>Settings</h1>
        <p class="lede">Configure your organization, permissions, notifications and platform preferences.</p>
      </div>
      <button class="btn btn-primary" onclick="Utils.toast('Settings saved.');">Save changes</button>
    </div>

    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-icon blue">${ICONS.team}</div><div class="stat-body"><span>Team members</span><strong>${teamCount}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon teal">${ICONS.clipboard}</div><div class="stat-body"><span>Active assignments</span><strong>${activeAssignments}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon amber">${ICONS.mail}</div><div class="stat-body"><span>Alerts mode</span><strong>${notificationMode}</strong></div></div>
      <div class="card stat-card"><div class="stat-icon green">${ICONS.shield}</div><div class="stat-body"><span>Security level</span><strong>Standard</strong></div></div>
    </div>

    <div class="dash-grid">
      <div class="card card-pad">
        <h3 style="margin-bottom:14px;">Organization</h3>
        <div class="field-row">
          <div class="field"><label>Organization name</label><input class="input" value="InfySkill Operations"></div>
          <div class="field"><label>Primary domain</label><input class="input" value="infyskillvendor.in"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Contact email</label><input class="input" value="priya.sharma@infyskillvendor.in"></div>
          <div class="field"><label>Time zone</label><select class="select"><option>GMT+5:30 India Standard Time</option></select></div>
        </div>
      </div>
      <div class="card card-pad">
        <h3 style="margin-bottom:14px;">Permissions & notifications</h3>
        <div class="field-row">
          <div class="field"><label>Email alerts</label><select class="select"><option>Daily summary</option><option>Immediate</option><option>Off</option></select></div>
          <div class="field"><label>In-app alerts</label><select class="select"><option>Enabled</option><option>Disabled</option></select></div>
        </div>
        <h3 style="margin:24px 0 14px;">Security</h3>
        <div class="field-row">
          <div class="field"><label>Two-factor authentication</label><select class="select"><option>Enabled</option><option>Disabled</option></select></div>
          <div class="field"><label>Session timeout</label><select class="select"><option>30 minutes</option><option>1 hour</option><option>4 hours</option></select></div>
        </div>
        <div class="field"><label>API access</label><p class="text-muted" style="font-size:13px;">Use the integration dashboard to generate API keys and configure third-party access.</p></div>
      </div>
    </div>

    <div class="card card-pad" style="margin-top:18px;">
      <h3 style="margin-bottom:14px;">Support & feedback</h3>
      <div class="field-row"><div class="field"><label>Need help?</label><button class="btn btn-outline" onclick="Utils.toast('Opening support page.');window.location.href='support.html';">Open support center</button></div><div class="field"><label>Give feedback</label><button class="btn btn-outline" onclick="Utils.toast('Feedback form is coming soon.');">Submit feedback</button></div></div>
    </div>
  `;

  window.onGlobalSearch = () => {};
}
