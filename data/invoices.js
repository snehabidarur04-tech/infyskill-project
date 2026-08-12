/* Mock data: Invoices */
window.MOCK = window.MOCK || {};

window.MOCK.invoices = [
  { id:"INV-2026-0670", assignmentId:"AS-3001", trainer:"Arjun Reddy", college:"ABC Engineering College", raisedOn:"2026-08-04", dueDate:"2026-08-18", amount:18000, tax:0, total:18000, status:"Approved" },
  { id:"INV-2026-0671", assignmentId:"AS-3004", trainer:"Kavya Nair", college:"S.E.A. College of Engineering & Technology", raisedOn:"2026-08-01", dueDate:"2026-08-10", amount:52000, tax:0, total:52000, status:"Payment Due" },
  { id:"INV-2026-0662", assignmentId:"AS-3005", trainer:"Vikram Singh", college:"SV Engineering College", raisedOn:"2026-07-26", dueDate:"2026-08-02", amount:74000, tax:0, total:74000, status:"Paid" },
  { id:"INV-2026-0665", assignmentId:"AS-3012", trainer:"Farhan Sheikh", college:"S.E.A. College of Engineering & Technology", raisedOn:"2026-07-19", dueDate:"2026-07-28", amount:40000, tax:0, total:40000, status:"Paid" },
  { id:"INV-2026-0673", assignmentId:"AS-3002", trainer:"Sneha Rao", college:"SV Engineering College", raisedOn:"2026-08-05", dueDate:"2026-08-22", amount:57000, tax:0, total:57000, status:"Draft" },
  { id:"INV-2026-0668", assignmentId:"AS-3009", trainer:"Neha Kulkarni", college:"ABC Engineering College", raisedOn:"2026-07-16", dueDate:"2026-07-24", amount:44000, tax:0, total:44000, status:"Paid" },
  { id:"INV-2026-0669", assignmentId:"AS-3011", trainer:"Manoj Kumar", college:"TechNova Institute", raisedOn:"2026-07-10", dueDate:"2026-07-20", amount:62000, tax:0, total:62000, status:"Disputed" },
  { id:"INV-2026-0674", assignmentId:"AS-3013", trainer:"Rohan Bhatt", college:"Coorg Institute of Technology", raisedOn:"2026-08-06", dueDate:"2026-08-14", amount:16000, tax:0, total:16000, status:"Under Review" },
  { id:"INV-2026-0666", assignmentId:"AS-3007", trainer:"Priya Deshmukh", college:"Global Business School", raisedOn:"2026-08-02", dueDate:"2026-08-19", amount:30000, tax:0, total:30000, status:"Changes Requested" },
  { id:"INV-2026-0672", assignmentId:"AS-3008", trainer:"Lakshmi Narayanan", college:"Vantage Corporate Learning", raisedOn:"2026-08-04", dueDate:"2026-08-21", amount:25000, tax:0, total:25000, status:"Submitted" }
];

window.MOCK.expenseBills = [
  { id:"EXP-9101", invoiceId:"INV-2026-0670", trainer:"Arjun Reddy", category:"Travel", description:"Bengaluru local cab — venue to campus", amount:1200, date:"2026-08-08", status:"Approved", receipt:"cab_receipt_0808.pdf" },
  { id:"EXP-9102", invoiceId:"INV-2026-0670", trainer:"Arjun Reddy", category:"Food", description:"Team lunch (3 days)", amount:2400, date:"2026-08-09", status:"Approved", receipt:"food_receipt_0809.pdf" },
  { id:"EXP-9103", invoiceId:"INV-2026-0671", trainer:"Kavya Nair", category:"Accommodation", description:"2 nights — hotel near campus", amount:6200, date:"2026-07-29", status:"Approved", receipt:"hotel_invoice_0729.pdf" },
  { id:"EXP-9104", invoiceId:"INV-2026-0669", trainer:"Manoj Kumar", category:"Travel", description:"Flight Delhi–Hyderabad return", amount:9800, date:"2026-07-05", status:"Flagged", receipt:"flight_ticket_0705.pdf" },
  { id:"EXP-9105", invoiceId:"INV-2026-0674", trainer:"Rohan Bhatt", category:"Materials", description:"Printed problem sets and stationery", amount:850, date:"2026-08-08", status:"Pending", receipt:"materials_bill_0808.pdf" },
  { id:"EXP-9106", invoiceId:"INV-2026-0666", trainer:"Priya Deshmukh", category:"Internet", description:"Backup hotspot data pack", amount:499, date:"2026-08-14", status:"Pending", receipt:"data_pack_0814.pdf" }
];
