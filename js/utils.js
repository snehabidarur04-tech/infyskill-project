/* Shared utilities */
const Utils = (() => {

  const AVATAR_PALETTE = ["#1E3A72","#0E7C86","#B06B12","#5C42A6","#B23A26","#1E7D53","#142248"];

  function formatINR(amount){
    if (amount === null || amount === undefined) return "—";
    return "₹" + Number(amount).toLocaleString("en-IN");
  }

  function formatDate(iso, opts){
    if(!iso) return "—";
    const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("en-IN", opts || { day:"2-digit", month:"short", year:"numeric" });
  }

  function formatDateRange(startIso, endIso){
    if (startIso === endIso) return formatDate(startIso);
    const s = new Date(startIso), e = new Date(endIso);
    const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
    if (sameMonth){
      return `${s.getDate()}–${formatDate(endIso)}`;
    }
    return `${formatDate(startIso)} – ${formatDate(endIso)}`;
  }

  function initials(name){
    return name.split(" ").filter(Boolean).slice(0,2).map(w => w[0]).join("").toUpperCase();
  }

  function avatarColor(seed){
    let hash = 0;
    for (let i=0;i<seed.length;i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
  }

  function avatarHTML(name, size){
    size = size || 32;
    const bg = avatarColor(name);
    return `<span class="avatar-initial" style="background:${bg};width:${size}px;height:${size}px;font-size:${size*0.38}px;">${initials(name)}</span>`;
  }

  const STATUS_CLASS = {
    "In Progress":"status-inprogress",
    "Awaiting Confirmation":"status-awaiting",
    "Scheduled":"status-scheduled",
    "Delivery Completed":"status-completed",
    "Completed":"status-completed",
    "Closed":"status-completed",
    "Paid":"status-paid",
    "Approved":"status-approved",
    "Payment Due":"status-awaiting",
    "Due":"status-awaiting",
    "Overdue":"status-overdue",
    "Disputed":"status-disputed",
    "Rejected":"status-rejected",
    "Cancelled":"status-cancelled",
    "Draft":"status-draft",
    "Submitted":"status-submitted",
    "Under Review":"status-submitted",
    "Changes Requested":"status-awaiting",
    "Partially Paid":"status-awaiting",
    "Void":"status-cancelled",
    "Active":"status-completed",
    "Invited":"status-awaiting",
    "Open":"status-awaiting",
    "Flagged":"status-overdue",
    "Pending":"status-draft",
    "In Review":"status-submitted"
  };

  function statusPill(status){
    const cls = STATUS_CLASS[status] || "status-draft";
    return `<span class="status-pill ${cls}"><span class="dot" style="background:currentColor"></span>${status}</span>`;
  }

  function debounce(fn, wait){
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait || 220); };
  }

  function toast(message, opts){
    let stack = document.querySelector(".toast-stack");
    if (!stack){
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `${ICONS.checkCircle}<span>${message}</span>`;
    stack.appendChild(el);
    setTimeout(() => {
      el.style.transition = "opacity .3s ease, transform .3s ease";
      el.style.opacity = "0";
      el.style.transform = "translateY(8px)";
      setTimeout(() => el.remove(), 300);
    }, opts && opts.duration || 3200);
  }

  function openModal(id){
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add("open");
    document.body.style.overflow = "hidden";
    const focusable = m.querySelector("button, input, select, textarea, a");
    if (focusable) setTimeout(() => focusable.focus(), 60);
  }
  function closeModal(id){
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove("open");
    document.body.style.overflow = "";
  }

  function escapeHTML(str){
    const d = document.createElement("div");
    d.textContent = str == null ? "" : String(str);
    return d.innerHTML;
  }

  function qs(sel, ctx){ return (ctx||document).querySelector(sel); }
  function qsa(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }

  return { formatINR, formatDate, formatDateRange, initials, avatarColor, avatarHTML,
           statusPill, debounce, toast, openModal, closeModal, escapeHTML, qs, qsa };
})();
