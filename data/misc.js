/* Mock data: Notifications, Team, Reports, Support tickets, Subscription */
window.MOCK = window.MOCK || {};

window.MOCK.notifications = [
  { id:"N1", type:"invoice", title:"Invoice approved", body:"Invoice #INV-2026-0670 for Arjun Reddy — ₹18,000", time:"4 Aug, 10:15 AM", read:false },
  { id:"N2", type:"assignment", title:"Trainer assigned", body:"Sneha Rao assigned to Python Full Stack program", time:"3 Aug, 3:20 PM", read:false },
  { id:"N3", type:"payment", title:"Payment completed", body:"₹42,000 paid to Rahul Verma", time:"1 Aug, 11:05 AM", read:false },
  { id:"N4", type:"exception", title:"Invoice disputed", body:"Manoj Kumar raised a dispute on INV-2026-0669", time:"31 Jul, 5:40 PM", read:true },
  { id:"N5", type:"document", title:"Document expiring", body:"Vikram Singh's ID verification expires in 12 days", time:"30 Jul, 9:00 AM", read:true },
  { id:"N6", type:"assignment", title:"Session reminder", body:"Prompt Engineering session with Rahul Verma starts in 24 hours", time:"19 Aug, 9:00 AM", read:true }
];

window.MOCK.team = [
  { id:"TM-01", name:"Sneha", role:"Owner", email:"priya.sharma@infyskillvendor.in", phone:"+91 98450 90011", avatar:"https://i.pravatar.cc/150?img=5", status:"Active", lastActive:"Just now" },
  { id:"TM-02", name:"Ravi Kumar", role:"Coordinator", email:"ravi.kumar@infyskillvendor.in", phone:"+91 90080 22114", avatar:"https://i.pravatar.cc/150?img=68", status:"Active", lastActive:"2 hours ago" },
  { id:"TM-03", name:"Anjali Desai", role:"Finance", email:"anjali.desai@infyskillvendor.in", phone:"+91 99010 55223", avatar:"https://i.pravatar.cc/150?img=45", status:"Active", lastActive:"Yesterday" },
  { id:"TM-04", name:"Suresh Babu", role:"Approver", email:"suresh.babu@infyskillvendor.in", phone:"+91 90360 77451", avatar:"https://i.pravatar.cc/150?img=14", status:"Active", lastActive:"3 days ago" },
  { id:"TM-05", name:"Fathima Rahman", role:"Viewer", email:"fathima.r@infyskillvendor.in", phone:"+91 98865 33221", avatar:"https://i.pravatar.cc/150?img=26", status:"Invited", lastActive:"Pending" }
];

window.MOCK.reports = {
  monthlySpend:[
    {label:"Mar", value:96000},{label:"Apr", value:118000},{label:"May", value:104000},
    {label:"Jun", value:132000},{label:"Jul", value:221000},{label:"Aug*", value:124500}
  ],
  assignmentsByStatus:[
    {label:"Completed", value:38, color:"var(--green-600)"},
    {label:"In progress", value:6, color:"var(--blue-600)"},
    {label:"Scheduled", value:9, color:"var(--violet-600)"},
    {label:"At risk", value:2, color:"var(--red-600)"}
  ],
  topColleges:[
    {name:"SV Engineering College", assignments:9, paid:243000},
    {name:"ABC Engineering College", assignments:6, paid:186000},
    {name:"Vantage Corporate Learning", assignments:7, paid:161000},
    {name:"S.E.A. College of Engineering & Technology", assignments:5, paid:112000},
    {name:"TechNova Institute", assignments:4, paid:96000}
  ],
  agingBuckets:[
    {label:"0–7 days", value:38500},
    {label:"8–15 days", value:18000},
    {label:"16–30 days", value:9000},
    {label:"30+ days", value:0}
  ]
};

window.MOCK.tickets = [
  { id:"TCK-701", subject:"Payment not reflecting for INV-2026-0662", linkedTo:"Invoice #INV-2026-0662", priority:"high", status:"Open", updated:"2 hours ago" },
  { id:"TCK-698", subject:"Need help adding a second finance approver", linkedTo:"Team settings", priority:"medium", status:"In Progress", updated:"Yesterday" },
  { id:"TCK-690", subject:"Trainer document expiry reminder not received", linkedTo:"Notifications", priority:"low", status:"Resolved", updated:"3 days ago" },
  { id:"TCK-685", subject:"GST field missing on invoice for SV Engineering College", linkedTo:"College #CL-202", priority:"medium", status:"Resolved", updated:"6 days ago" }
];

window.MOCK.subscription = {
  currentPlan:"Vendor Operations",
  price:"₹1,999/month",
  renewalDate:"18 Aug 2026",
  activeAssignments:23,
  assignmentLimit:50,
  teamSeatsUsed:5,
  teamSeatsLimit:10,
  billingHistory:[
    {id:"BILL-441", date:"18 Jul 2026", desc:"Vendor Operations — Monthly", amount:1999, status:"Paid"},
    {id:"BILL-402", date:"18 Jun 2026", desc:"Vendor Operations — Monthly", amount:1999, status:"Paid"},
    {id:"BILL-368", date:"18 May 2026", desc:"Vendor Operations — Monthly", amount:1999, status:"Paid"},
    {id:"BILL-329", date:"18 Apr 2026", desc:"Pay-as-you-use — 4 assignments", amount:1196, status:"Paid"}
  ]
};
