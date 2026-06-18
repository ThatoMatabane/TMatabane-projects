import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "db.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Secure hashing utility
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "NPO_SALT_2026_FCTMS").digest("hex");
}

// Generate cryptographic SHA-256 chain block hashes for financial records
function calculateBlockHash(recordType: string, id: string, amount: number, secondary: string, previousHash: string): string {
  const content = `${recordType}-${id}-${amount}-${secondary}-${previousHash}`;
  return crypto.createHash("sha256").update(content).digest("hex");
}

// Initial Seeding Database Schema
function initializeDatabase() {
  if (fs.existsSync(DB_PATH)) {
    try {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      JSON.parse(data);
      return;
    } catch (e) {
      console.error("Database JSON is corrupted, recreating...", e);
    }
  }

  // Pre-seed mock database for a fully operational experience from the first run!
  const defaultUsers = [
    {
      id: "u1",
      email: "admin@npo.org",
      passwordHash: hashPassword("Admin1234!"),
      fullName: "Sarah Jenkins",
      role: "ADMIN",
      organization: "Global Green Foundation",
      createdAt: new Date("2026-01-10").toISOString()
    },
    {
      id: "u2",
      email: "finance@npo.org",
      passwordHash: hashPassword("Finance123!"),
      fullName: "Michael Chang",
      role: "OFFICER",
      organization: "Global Green Foundation",
      createdAt: new Date("2026-01-12").toISOString()
    },
    {
      id: "u3",
      email: "auditor@independent.com",
      passwordHash: hashPassword("Auditor123!"),
      fullName: "Elena Rostova",
      role: "AUDITOR",
      organization: "Peak Audit Associates",
      createdAt: new Date("2026-01-15").toISOString()
    },
    {
      id: "u4",
      email: "donor@gmail.com",
      passwordHash: hashPassword("Donor123!"),
      fullName: "Dr. Arthur Pendelton",
      role: "DONOR",
      organization: "Pendelton Family Trust",
      createdAt: new Date("2026-02-01").toISOString()
    }
  ];

  // Seed Contributions with Blockchain chaining tags
  let prevHash = "GENESIS_BLOCK_HASH_VAL_000000000";
  const contributions = [
    {
      id: "c1",
      donorId: "u4",
      donorName: "Dr. Arthur Pendelton",
      email: "donor@gmail.com",
      amount: 15000,
      paymentMethod: "Wire Transfer",
      reference: "DON-2026-001",
      campaign: "Reforestation Project Africa",
      receivedAt: new Date("2026-04-10T10:30:00Z").toISOString(),
      description: "Annual unrestricted donor allocation for tree planting programs.",
      status: "CLEARED" as const,
      isAnonymized: false,
      blockHash: ""
    },
    {
      id: "c2",
      donorName: "Anonymized Corporate Sponsor",
      email: undefined,
      amount: 45000,
      paymentMethod: "ACH Direct Debit",
      reference: "DON-2026-002",
      campaign: "Urban Agriculture Greenhouses",
      receivedAt: new Date("2026-04-18T14:45:00Z").toISOString(),
      description: "Sponsorship allocation for climate-tech hydroponic development.",
      status: "CLEARED" as const,
      isAnonymized: true,
      blockHash: ""
    },
    {
      id: "c3",
      donorName: "Global Eco Grant",
      email: "grants@ecofund.org",
      amount: 120000,
      paymentMethod: "EFT Grant Transfer",
      reference: "GRT-998822",
      campaign: "Rainforest Canopy Preservation",
      receivedAt: new Date("2026-05-02T08:00:00Z").toISOString(),
      description: "Q2 Restricted Grant Funding for preservation operations.",
      status: "CLEARED" as const,
      isAnonymized: false,
      blockHash: ""
    }
  ];

  for (const c of contributions) {
    c.blockHash = calculateBlockHash("CONTRIBUTION", c.id, c.amount, c.campaign, prevHash);
    prevHash = c.blockHash;
  }

  // Seed Expenditures with Blockchain chaining tags
  const expenditures = [
    {
      id: "e1",
      amount: 42000,
      category: "PROGRAM" as const,
      subCategory: "Direct Seed & Fertilizer Logistics",
      description: "Sourcing 50,000 indigenous saplings and bio-fertilizer shipments.",
      approvedBy: "u1",
      vendor: "AgriSupply Co. (Pty) LTD",
      date: new Date("2026-04-20").toISOString().split('T')[0],
      status: "APPROVED" as const,
      complianceStatus: "VERIFIED" as const,
      complianceCheckDetails: {
        hasReceipt: true,
        validCostCenter: true,
        boardApproved: true,
        taxInvoice: true
      },
      blockHash: ""
    },
    {
      id: "e2",
      amount: 8500,
      category: "OPERATIONAL" as const,
      subCategory: "Eco-Tech Monitoring Sensors",
      description: "Internet-of-Things solar soil and rainfall analyzer systems.",
      approvedBy: "u1",
      vendor: "IoT Hardware Solutions",
      date: new Date("2026-04-25").toISOString().split('T')[0],
      status: "APPROVED" as const,
      complianceStatus: "VERIFIED" as const,
      complianceCheckDetails: {
        hasReceipt: true,
        validCostCenter: true,
        boardApproved: false,
        taxInvoice: true
      },
      blockHash: ""
    },
    {
      id: "e3",
      amount: 4500,
      category: "ADMINISTRATIVE" as const,
      subCategory: "Regulatory Tax Compliance & Legal Retainers",
      description: "Statutory annual statement audits and financial verification consultation.",
      approvedBy: "u1",
      vendor: "Apex Auditor Associates",
      date: new Date("2026-05-05").toISOString().split('T')[0],
      status: "APPROVED" as const,
      complianceStatus: "VERIFIED" as const,
      complianceCheckDetails: {
        hasReceipt: true,
        validCostCenter: true,
        boardApproved: true,
        taxInvoice: true
      },
      blockHash: ""
    },
    {
      id: "e4",
      amount: 12000,
      category: "FUNDRAISING" as const,
      subCategory: "Advocacy Material & Event Hosting",
      description: "Graphic printing and public educational venue rental.",
      approvedBy: "u1",
      vendor: "Spectra Design Hub",
      date: new Date("2026-05-15").toISOString().split('T')[0],
      status: "APPROVED" as const,
      complianceStatus: "VERIFIED" as const,
      complianceCheckDetails: {
        hasReceipt: true,
        validCostCenter: true,
        boardApproved: false,
        taxInvoice: true
      },
      blockHash: ""
    }
  ];

  for (const e of expenditures) {
    e.blockHash = calculateBlockHash("EXPENDITURE", e.id, e.amount, e.category, prevHash);
    prevHash = e.blockHash;
  }

  // Pre-seed statutory task reminders
  const reminders = [
    {
      id: "r1",
      title: "File Statutory SARS/IRS 990 Annual Compliance Returns",
      dueDate: "2026-06-15",
      priority: "HIGH" as const,
      category: "TAX_FILING" as const,
      isCompleted: false,
      recurrence: "Annual",
      createdAt: new Date("2026-05-01").toISOString()
    },
    {
      id: "r2",
      title: "Consolidate Section 18A Donor Deductible Tax Receipts",
      dueDate: "2026-06-25",
      priority: "MEDIUM" as const,
      category: "DONOR_REPORT" as const,
      isCompleted: true,
      recurrence: "Quarterly",
      createdAt: new Date("2026-05-01").toISOString()
    },
    {
      id: "r3",
      title: "Complete Q2 Independent Auditor Board Checkpoint",
      dueDate: "2026-07-10",
      priority: "HIGH" as const,
      category: "AUDIT_DEADLINE" as const,
      isCompleted: false,
      recurrence: "Semi-Annual",
      createdAt: new Date("2026-05-10").toISOString()
    },
    {
      id: "r4",
      title: "Publish Public Transparency Ledger to Directory Website",
      dueDate: "2026-06-30",
      priority: "LOW" as const,
      category: "INTERNAL_REVIEW" as const,
      isCompleted: false,
      recurrence: "Monthly",
      createdAt: new Date("2026-05-12").toISOString()
    }
  ];

  // Pre-seed Notifications
  const notifications = [
    {
      id: "n1",
      title: "System Blockchain Integrity Check Successful",
      message: "The statutory financial chain verification was automatically run. 7 financial ledger nodes were checked, with 0 anomalies found.",
      isRead: false,
      createdAt: new Date("2026-06-02T12:00:00Z").toISOString(),
      type: "COMPLIANCE" as const
    },
    {
      id: "n2",
      title: "New Restricted Contribution Received: $120,000",
      message: "An EFT grant was received from Global Eco Grant allocated for Rainforest Preservations.",
      isRead: false,
      createdAt: new Date("2026-05-02T08:05:00Z").toISOString(),
      type: "SYSTEM" as const
    },
    {
      id: "n3",
      title: "Statutory Deadline Looming",
      message: "The statutory annual regulatory filing (IRS/SARS Form 990 equivalent) deadline is due on June 15, 2026. Please prepare signed accounts.",
      isRead: false,
      createdAt: new Date("2026-06-03T08:00:00Z").toISOString(),
      type: "ALERT" as const
    }
  ];

  // Preseed Reports
  const reports = [
    {
      id: "rep1",
      reportType: "NPO_ANNUAL" as const,
      title: "Annual Financial & Compliance Report - FY 2025/2026",
      startPeriod: "2025-06-01",
      endPeriod: "2026-05-31",
      generatedAt: new Date("2026-06-01T15:00:00Z").toISOString(),
      generatedBy: "Sarah Jenkins (NPO Admin)",
      status: "SIGNED" as const,
      hash: crypto.createHash("sha256").update("NPO_REPORT_HASH_SAMPLE_001").digest("hex"),
      signatures: [
        {
          signeeName: "Sarah Jenkins",
          signeeRole: "ADMIN" as const,
          signedAt: new Date("2026-06-01T16:30:00Z").toISOString(),
          signatureHash: "SIG_03cc5f03d5248fe2d9a30283c7ce69fe1a2d81"
        },
        {
          signeeName: "Elena Rostova",
          signeeRole: "AUDITOR" as const,
          signedAt: new Date("2026-06-02T09:12:00Z").toISOString(),
          signatureHash: "SIG_9a87cdff3d9ddb8e76c128fe3bc909aaab0911"
        }
      ],
      summaryData: {
        totalRevenue: 180000,
        totalExpenditure: 67000,
        surplus: 113000,
        programServiceRatio: 0.627
      }
    }
  ];

  // Audit Logs
  const auditLogs = [
    {
      id: "l1",
      userId: "u1",
      userName: "Sarah Jenkins",
      userRole: "ADMIN" as const,
      action: "NPO-FCTMS System Initialization",
      tableName: "SYSTEM",
      recordId: "SYSTEM",
      oldValue: undefined,
      newValue: "Genesis Seed Set Up",
      timestamp: new Date("2026-01-10T12:00:00Z").toISOString(),
      ipAddress: "127.0.0.1"
    },
    {
      id: "l2",
      userId: "u2",
      userName: "Michael Chang",
      userRole: "OFFICER" as const,
      action: "Logged Contribution Transaction (c3)",
      tableName: "contributions",
      recordId: "c3",
      oldValue: undefined,
      newValue: "Donor: Global Eco Eco Grant, Amount: $120,000",
      timestamp: new Date("2026-05-02T08:10:00Z").toISOString(),
      ipAddress: "192.168.1.144"
    },
    {
      id: "l3",
      userId: "u3",
      userName: "Elena Rostova",
      userRole: "AUDITOR" as const,
      action: "Digitally Signed Statutory Report (rep1)",
      tableName: "statutory_reports",
      recordId: "rep1",
      oldValue: "DRAFT",
      newValue: "STATE: SIGNED - Verification OK",
      timestamp: new Date("2026-06-02T09:12:00Z").toISOString(),
      ipAddress: "198.81.12.9"
    }
  ];

  const db = {
    users: defaultUsers,
    contributions,
    expenditures,
    reminders,
    notifications,
    reports,
    auditLogs
  };

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Ensure database initialization
initializeDatabase();

// Load DB Helper
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to read database, reloading defaults...", e);
    return {
      users: [],
      contributions: [],
      expenditures: [],
      reminders: [],
      notifications: [],
      reports: [],
      auditLogs: []
    };
  }
}

// Sync DB Helper
function writeDB(db: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Log actions dynamically
function appendAuditLog(userId: string, userName: string, role: string, action: string, table: string, recordId: string, oldValue?: string, newValue?: string, ipAddress = "127.0.0.1") {
  const db = readDB();
  const newLog = {
    id: "l_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    userId,
    userName,
    userRole: role,
    action,
    tableName: table,
    recordId,
    oldValue,
    newValue,
    timestamp: new Date().toISOString(),
    ipAddress
  };
  db.auditLogs.unshift(newLog);
  writeDB(db);
}

// Helper to push standard notifications
function emitNotification(title: string, message: string, type: "ALERT" | "REMINDER" | "COMPLIANCE" | "SYSTEM") {
  const db = readDB();
  const notice = {
    id: "n_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    title,
    message,
    isRead: false,
    createdAt: new Date().toISOString(),
    type
  };
  db.notifications.unshift(notice);
  writeDB(db);
}

// --------------------------------------------------------
// API ENDPOINTS
// --------------------------------------------------------

// Auth - Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const db = readDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  // Session login
  res.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    organization: user.organization
  });
});

// Auth - Register with role-selection!
app.post("/api/auth/register", (req, res) => {
  const { fullName, email, password, role, organization } = req.body;
  if (!fullName || !email || !password || !role || !organization) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const db = readDB();
  const exists = db.users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "User with this email already registered." });
  }

  const newUser = {
    id: "u_" + Date.now(),
    email,
    passwordHash: hashPassword(password),
    fullName,
    role,
    organization,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  // Auto audit log register events!
  appendAuditLog(
    newUser.id,
    newUser.fullName,
    newUser.role,
    "Registered of user profile in role selector",
    "users",
    newUser.id,
    undefined,
    `Registered: ${fullName}, Role: ${role}, Org: ${organization}`
  );

  emitNotification(
    "New User Registrations Secured",
    `${fullName} has registered as a verified ${role} for ${organization}.`,
    "SYSTEM"
  );

  res.json({
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
    role: newUser.role,
    organization: newUser.organization
  });
});

// GET Contributions
app.get("/api/contributions", (req, res) => {
  const db = readDB();
  res.json(db.contributions);
});

// POST Contribution
app.post("/api/contributions", (req, res) => {
  const { donorName, amount, paymentMethod, reference, campaign, description, isAnonymized, operatorId, operatorName, operatorRole } = req.body;
  
  if (!donorName || !amount || !paymentMethod || !reference || !campaign) {
    return res.status(400).json({ error: "Required donation fields are missing." });
  }

  const db = readDB();
  
  // Blockchain generation: get last hash
  let lastHash = "GENESIS_BLOCK_HASH_VAL_000000000";
  const allRecords = [...db.contributions, ...db.expenditures].sort((a: any, b: any) => {
    const timeA = a.receivedAt || a.date;
    const timeB = b.receivedAt || b.date;
    return new Date(timeA).getTime() - new Date(timeB).getTime();
  });
  if (allRecords.length > 0) {
    lastHash = allRecords[allRecords.length - 1].blockHash;
  }

  const newId = "c_" + Date.now();
  const hashVal = calculateBlockHash("CONTRIBUTION", newId, Number(amount), campaign, lastHash);

  const newContribution = {
    id: newId,
    donorName: isAnonymized ? "Anonymized Contributor" : donorName,
    email: isAnonymized ? undefined : req.body.email,
    amount: Number(amount),
    paymentMethod,
    reference,
    campaign,
    receivedAt: new Date().toISOString(),
    description,
    status: "CLEARED" as const,
    isAnonymized: !!isAnonymized,
    blockHash: hashVal
  };

  db.contributions.push(newContribution);
  writeDB(db);

  // Dynamic Audit Entry
  appendAuditLog(
    operatorId || "ANON",
    operatorName || "Public Web Form",
    operatorRole || "PUBLIC",
    `Added Donor Contribution Transaction ${newContribution.id}`,
    "contributions",
    newContribution.id,
    undefined,
    `Donor: ${newContribution.donorName}, Amount: $${newContribution.amount}, BlockHash: ${hashVal.substring(0, 10)}...`
  );

  // Check alerting for high donation value threshold
  if (Number(amount) >= 10000) {
    emitNotification(
      "High Value Deposit Transparency Notice",
      `A critical donor contribution has cleared: $${amount} received from ${newContribution.donorName} towards campaign '${campaign}'.`,
      "COMPLIANCE"
    );
  } else {
    emitNotification(
      "Donor Clear Alert",
      `Contribution of $${amount} cleared from ${newContribution.donorName}.`,
      "SYSTEM"
    );
  }

  res.json(newContribution);
});

// GET Expenditures
app.get("/api/expenditures", (req, res) => {
  const db = readDB();
  res.json(db.expenditures);
});

// POST Expenditures (by Officers)
app.post("/api/expenditures", (req, res) => {
  const { amount, category, subCategory, description, vendor, date, operatorId, operatorName, operatorRole, complianceCheckDetails } = req.body;
  if (!amount || !category || !subCategory || !vendor || !date) {
    return res.status(400).json({ error: "Missing required expenditure parameters." });
  }

  const db = readDB();

  // Blockchain hashing relative to last transaction node
  let lastHash = "GENESIS_BLOCK_HASH_VAL_000000000";
  const allRecords = [...db.contributions, ...db.expenditures].sort((a: any, b: any) => {
    const timeA = a.receivedAt || a.date;
    const timeB = b.receivedAt || b.date;
    return new Date(timeA).getTime() - new Date(timeB).getTime();
  });
  if (allRecords.length > 0) {
    lastHash = allRecords[allRecords.length - 1].blockHash;
  }

  const newId = "e_" + Date.now();
  const hashVal = calculateBlockHash("EXPENDITURE", newId, Number(amount), category, lastHash);

  const newExpenditure = {
    id: newId,
    amount: Number(amount),
    category,
    subCategory,
    description,
    approvedBy: undefined,
    vendor,
    date,
    status: "PENDING" as const,
    complianceStatus: "UNDER_REVIEW" as const,
    complianceCheckDetails: {
      hasReceipt: !!complianceCheckDetails?.hasReceipt,
      validCostCenter: !!complianceCheckDetails?.validCostCenter,
      boardApproved: !!complianceCheckDetails?.boardApproved,
      taxInvoice: !!complianceCheckDetails?.taxInvoice
    },
    blockHash: hashVal
  };

  db.expenditures.push(newExpenditure);
  writeDB(db);

  appendAuditLog(
    operatorId,
    operatorName,
    operatorRole,
    `Logged pending expenditure entry ${newExpenditure.id}`,
    "expenditures",
    newExpenditure.id,
    undefined,
    `Logged expense: $${amount} under category ${category}. Awaiting Admin approvals.`
  );

  emitNotification(
    "Pending Expense Approval Request",
    `A financial payment request has been logged: $${amount} to ${vendor} by ${operatorName}. Approval required.`,
    "COMPLIANCE"
  );

  res.json(newExpenditure);
});

// PUT Approve/Reject Expenditure (Admins)
app.put("/api/expenditures/:id/approve", (req, res) => {
  const { id } = req.params;
  const { approvedState, adminId, adminName } = req.body; // APPROVED or DISAPPROVED

  if (!approvedState || !adminId) {
    return res.status(400).json({ error: "State approval and ID are required." });
  }

  const db = readDB();
  const expIdx = db.expenditures.findIndex((e: any) => e.id === id);
  if (expIdx === -1) {
    return res.status(404).json({ error: "Expenditure not found." });
  }

  const oldVal = db.expenditures[expIdx].status;
  db.expenditures[expIdx].status = approvedState;
  db.expenditures[expIdx].approvedBy = adminId;
  
  writeDB(db);

  appendAuditLog(
    adminId,
    adminName,
    "ADMIN",
    `Cabinet audit changed expenditure state ${id}`,
    "expenditures",
    id,
    `STATUS: ${oldVal}`,
    `STATUS: ${approvedState}`
  );

  emitNotification(
    "Expenditure Request Resolved",
    `Expenditure ID: ${id} ($${db.expenditures[expIdx].amount}) was officially ${approvedState} by NPO Administrator.`,
    "SYSTEM"
  );

  res.json(db.expenditures[expIdx]);
});

// PUT Auditor Review of Expenditure Compliance Checklists (Auditors)
app.put("/api/expenditures/:id/compliance", (req, res) => {
  const { id } = req.params;
  const { complianceStatus, complianceCheckDetails, auditorId, auditorName } = req.body;

  if (!complianceStatus || !auditorId) {
    return res.status(400).json({ error: "Compliance review details are missing." });
  }

  const db = readDB();
  const expIdx = db.expenditures.findIndex((e: any) => e.id === id);
  if (expIdx === -1) {
    return res.status(404).json({ error: "Expenditure node not found." });
  }

  const oldStatus = db.expenditures[expIdx].complianceStatus;
  db.expenditures[expIdx].complianceStatus = complianceStatus;
  
  if (complianceCheckDetails) {
    db.expenditures[expIdx].complianceCheckDetails = {
      hasReceipt: !!complianceCheckDetails.hasReceipt,
      validCostCenter: !!complianceCheckDetails.validCostCenter,
      boardApproved: !!complianceCheckDetails.boardApproved,
      taxInvoice: !!complianceCheckDetails.taxInvoice
    };
  }

  writeDB(db);

  appendAuditLog(
    auditorId,
    auditorName,
    "AUDITOR",
    `Audited compliance record for expenditure ${id}`,
    "expenditures",
    id,
    `Compliance: ${oldStatus}`,
    `Compliance: ${complianceStatus}`
  );

  if (complianceStatus === "FAILED") {
    emitNotification(
      "Auditor Compliance Check FAILURE",
      `Critical compliance checklist failed on Expenditure node ${id} for $${db.expenditures[expIdx].amount}. Receipt validation failure!`,
      "ALERT"
    );
  } else {
    emitNotification(
      "Compliance Ledger Updated",
      `Auditor completed audit checkpoint verification on Transaction ${id}. Result: ${complianceStatus}.`,
      "COMPLIANCE"
    );
  }

  res.json(db.expenditures[expIdx]);
});

// GET Audit Logs
app.get("/api/audit-logs", (req, res) => {
  const db = readDB();
  res.json(db.auditLogs);
});

// GET Task Reminders
app.get("/api/reminders", (req, res) => {
  const db = readDB();
  res.json(db.reminders);
});

// POST Create Custom Deadline Reminder
app.post("/api/reminders", (req, res) => {
  const { title, dueDate, priority, category, operatorId, operatorName, operatorRole } = req.body;
  if (!title || !dueDate || !priority || !category) {
    return res.status(400).json({ error: "Missing required reminder fields." });
  }

  const db = readDB();
  const newRem = {
    id: "r_" + Date.now(),
    title,
    dueDate,
    priority,
    category,
    isCompleted: false,
    recurrence: req.body.recurrence || "Once-off",
    createdAt: new Date().toISOString()
  };

  db.reminders.push(newRem);
  writeDB(db);

  appendAuditLog(
    operatorId,
    operatorName,
    operatorRole,
    `Created dynamic financial roadmap deadline reminder ${newRem.id}`,
    "reminders",
    newRem.id,
    undefined,
    `Title: ${title}, Due Date: ${dueDate}, Category: ${category}`
  );

  emitNotification(
    "New Compliance Objective Set",
    `Critical Deadline registered: ${title} due by ${dueDate}. Tasks mapped.`,
    "REMINDER"
  );

  res.json(newRem);
});

// PUT Toggle Task Completion Status
app.put("/api/reminders/:id/toggle", (req, res) => {
  const { id } = req.params;
  const { operatorId, operatorName, operatorRole } = req.body;

  const db = readDB();
  const remIdx = db.reminders.findIndex((r: any) => r.id === id);
  if (remIdx === -1) {
    return res.status(404).json({ error: "Compliance reminder task not found." });
  }

  const oldCompleted = db.reminders[remIdx].isCompleted;
  db.reminders[remIdx].isCompleted = !oldCompleted;
  writeDB(db);

  appendAuditLog(
    operatorId,
    operatorName,
    operatorRole,
    `Toggled roadmap task completion state ${id}`,
    "reminders",
    id,
    `Completed: ${oldCompleted}`,
    `Completed: ${!oldCompleted}`
  );

  const stateStr = !oldCompleted ? "COMPLETED" : "RE-OPENED";
  emitNotification(
    "Roadmap Deadline Checkpoint Cleared",
    `Financial compliance return objective '${db.reminders[remIdx].title}' has been marked ${stateStr}.`,
    "REMINDER"
  );

  res.json(db.reminders[remIdx]);
});

// GET Alerts/Notifications
app.get("/api/notifications", (req, res) => {
  const db = readDB();
  res.json(db.notifications);
});

// POST Mark Alerts/Notifications as Read
app.post("/api/notifications/mark-all-read", (req, res) => {
  const db = readDB();
  db.notifications.forEach((n: any) => {
    n.isRead = true;
  });
  writeDB(db);
  res.json({ success: true, count: db.notifications.length });
});

// GET Report Listing
app.get("/api/reports", (req, res) => {
  const db = readDB();
  res.json(db.reports);
});

// POST Generate Report Draft
app.post("/api/reports/generate", (req, res) => {
  const { reportType, title, startPeriod, endPeriod, operatorId, operatorName, operatorRole } = req.body;
  if (!reportType || !title || !startPeriod || !endPeriod) {
    return res.status(400).json({ error: "Missing metadata for report generation." });
  }

  const db = readDB();

  // Calculate live summary financial metrics for matching periods
  let income = 0;
  for (const c of db.contributions) {
    const timestamp = new Date(c.receivedAt).getTime();
    if (timestamp >= new Date(startPeriod).getTime() && timestamp <= new Date(endPeriod).getTime()) {
      income += c.amount;
    }
  }

  let spending = 0;
  let programSpend = 0;
  for (const e of db.expenditures) {
    const timestamp = new Date(e.date).getTime();
    if (timestamp >= new Date(startPeriod).getTime() && timestamp <= new Date(endPeriod).getTime() && e.status === "APPROVED") {
      spending += e.amount;
      if (e.category === "PROGRAM") {
        programSpend += e.amount;
      }
    }
  }

  const programRatio = spending > 0 ? (programSpend / spending) : 0.0;

  const newRep = {
    id: "rep_" + Date.now(),
    reportType,
    title,
    startPeriod,
    endPeriod,
    generatedAt: new Date().toISOString(),
    generatedBy: `${operatorName} (${operatorRole})`,
    status: "DRAFT" as const,
    hash: crypto.createHash("sha256").update(`${reportType}-${title}-${income}-${spending}-${Date.now()}`).digest("hex"),
    signatures: [],
    summaryData: {
      totalRevenue: income,
      totalExpenditure: spending,
      surplus: income - spending,
      programServiceRatio: parseFloat(programRatio.toFixed(3))
    }
  };

  db.reports.push(newRep);
  writeDB(db);

  appendAuditLog(
    operatorId,
    operatorName,
    operatorRole,
    `Compiled statutory report draft compiled: ${newRep.id}`,
    "statutory_reports",
    newRep.id,
    undefined,
    `Title: ${title}, Total Rev: $${income}, Total Spend: $${spending}`
  );

  emitNotification(
    "New Statutory Statement Form Created",
    `A new ${reportType} regulatory ledger statement draft has been built. Board signatures authorized.`,
    "COMPLIANCE"
  );

  res.json(newRep);
});

// POST Sign Dynamic Document
app.post("/api/reports/:id/sign", (req, res) => {
  const { id } = req.params;
  const { signeeName, signeeRole, signeeId } = req.body;

  if (!signeeName || !signeeRole) {
    return res.status(400).json({ error: "Signature identity metadata missing." });
  }

  const db = readDB();
  const repIdx = db.reports.findIndex((r: any) => r.id === id);
  if (repIdx === -1) {
    return res.status(404).json({ error: "Statutory draft not found." });
  }

  const doc = db.reports[repIdx];
  
  // Prevent double signatures of the same identity
  const exists = doc.signatures.some((s: any) => s.signeeName === signeeName && s.signeeRole === signeeRole);
  if (exists) {
    return res.status(400).json({ error: "This document is already certified from your credential set." });
  }

  const signatureHash = crypto.createHash("sha256").update(`${doc.id}-${signeeName}-${signeeRole}-${Date.now()}`).digest("hex").substring(0, 42);

  const signatureNode = {
    signeeName,
    signeeRole,
    signedAt: new Date().toISOString(),
    signatureHash: "SIG_" + signatureHash
  };

  doc.signatures.push(signatureNode);

  // Transition to SIGNED/SUBMITTED status when Admin and Auditor signatures have both sealed the envelope
  const rolesSigned = doc.signatures.map((s: any) => s.signeeRole);
  const isAdminSigned = rolesSigned.includes("ADMIN");
  const isAuditorSigned = rolesSigned.includes("AUDITOR");

  if (isAdminSigned && isAuditorSigned) {
    doc.status = "SIGNED";
  }

  writeDB(db);

  appendAuditLog(
    signeeId || "ANON",
    signeeName,
    signeeRole,
    `Applied cryptographical signature seal to Document ${id}`,
    "statutory_reports",
    id,
    undefined,
    `Signed by ${signeeName} in role ${signeeRole}. Signature: ${signatureNode.signatureHash}`
  );

  emitNotification(
    "Cryptographic Record Certified",
    `Regulatory Document verified: ${doc.title} signed by ${signeeName} (${signeeRole}).`,
    "COMPLIANCE"
  );

  res.json(doc);
});

// GET CRYPTOGRAPHIC INTEGRITY VERIFIABILITY
app.get("/api/ledger/verify", (req, res) => {
  const db = readDB();

  // Combine elements ordered sequentially
  const transactions: { id: string; type: "CONTRIBUTION" | "EXPENDITURE"; amount: number; referenceOrCategory: string; storedHash: string }[] = [];
  
  db.contributions.forEach((c: any) => {
    transactions.push({
      id: c.id,
      type: "CONTRIBUTION",
      amount: c.amount,
      referenceOrCategory: c.campaign,
      storedHash: c.blockHash
    });
  });

  db.expenditures.forEach((e: any) => {
    transactions.push({
      id: e.id,
      type: "EXPENDITURE",
      amount: e.amount,
      referenceOrCategory: e.category,
      storedHash: e.blockHash
    });
  });

  // Re-sort according to record ID or creation criteria to match order
  transactions.sort((a, b) => {
    return a.id.localeCompare(b.id);
  });

  let currentCalculatedHash = "GENESIS_BLOCK_HASH_VAL_000000000";
  let isValid = true;
  let compromisedCount = 0;
  const recalculatedBlocks = [];

  for (const t of transactions) {
    const recalculated = calculateBlockHash(
      t.type,
      t.id,
      t.amount,
      t.referenceOrCategory,
      currentCalculatedHash
    );

    const isMatch = (recalculated === t.storedHash);
    if (!isMatch) {
      isValid = false;
      compromisedCount++;
    }

    recalculatedBlocks.push({
      id: t.id,
      type: t.type,
      calculatedHash: recalculated,
      storedHash: t.storedHash,
      isCompromised: !isMatch
    });

    currentCalculatedHash = t.storedHash; // Keep tracing based on chain sequence rule
  }

  res.json({
    isValid,
    compromisedCount,
    totalBlocks: transactions.length,
    expectedHash: currentCalculatedHash,
    actualHash: isValid ? currentCalculatedHash : "MISMATCH_DETECTED_FRACTURED_INTEGRITY",
    recalculatedBlocks
  });
});

// XAMPP Project Static File Serving
app.use("/xampp_project/uploads", express.static(path.join(process.cwd(), "xampp_project/uploads")));
app.use("/xampp_project", express.static(path.join(process.cwd(), "xampp_project")));

// Mock Session Variable for XAMPP User Role State
let xamppSession: any = null;

// Mock auth.php for role-based authentication in XAMPP workstation
app.all("/xampp_project/auth.php", (req, res) => {
  const action = req.query.action || "";

  if (action === "login") {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password parameters are required." });
    }
    const db = readDB();
    const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    // Validate passwords against hashed representations
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid corporate email or password credential." });
    }

    xamppSession = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      name: user.fullName,
      role: user.role,
      org: user.organization,
      organization: user.organization
    };

    appendAuditLog(
      user.id,
      user.fullName,
      user.role,
      "User session established via auth credential",
      "users",
      user.id,
      undefined,
      `Session Active: Role = ${user.role}`
    );

    return res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      organization: user.organization
    });
  }

  if (action === "register") {
    const { fullName, email, password, role, organization } = req.body;
    if (!fullName || !email || !password || !organization) {
      return res.status(400).json({ error: "All mandatory registration fields are required." });
    }
    const db = readDB();
    const exists = db.users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ error: "An active secure account with this email address already exists." });
    }

    const newUser = {
      id: "u_" + Date.now(),
      email,
      passwordHash: hashPassword(password),
      fullName,
      role: role || "PUBLIC",
      organization,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    xamppSession = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      name: newUser.fullName,
      role: newUser.role,
      org: newUser.organization,
      organization: newUser.organization
    };

    appendAuditLog(
      newUser.id,
      newUser.fullName,
      newUser.role,
      "Registered new profile in system",
      "users",
      newUser.id,
      undefined,
      `Registered user: Name=${fullName}, Role=${newUser.role}, Org=${organization}`
    );

    return res.json({
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      organization: newUser.organization
    });
  }

  if (action === "logout") {
    xamppSession = null;
    return res.json({ success: true, message: "Corporate session ended safely." });
  }

  return res.status(400).json({ error: "Invalid action" });
});

// Mock api.php REST actions for state operations in XAMPP workstation
app.all("/xampp_project/api.php", (req, res) => {
  const action = req.query.action || "";

  if (action === "get_ledger") {
    const db = readDB();
    return res.json({
      contributions: db.contributions,
      expenditures: db.expenditures,
      reminders: db.reminders,
      auditLogs: db.auditLogs,
      reports: db.reports,
      session: xamppSession || { id: "ANON_CLIENT", name: "Public Guest", role: "PUBLIC", org: "General Public" },
      customLogo: null
    });
  }

  if (action === "add_contribution") {
    const { donorName, email, amount, paymentMethod, reference, campaign, description, isAnonymized } = req.body;
    if (!amount || !campaign) {
      return res.status(400).json({ error: "Contribution amount and target campaign program are required." });
    }
    const db = readDB();

    // Calculate sequential chain block hashes to protect ledger integrity
    let lastHash = "GENESIS_BLOCK_HASH_VAL_000000000";
    const allRecords = [...db.contributions, ...db.expenditures].sort((a: any, b: any) => {
      const timeA = a.receivedAt || a.date;
      const timeB = b.receivedAt || b.date;
      return new Date(timeA).getTime() - new Date(timeB).getTime();
    });
    if (allRecords.length > 0) {
      const lastRec = allRecords[allRecords.length - 1];
      lastHash = lastRec.blockHash || lastRec.block_hash || "GENESIS_BLOCK_HASH_VAL_000000000";
    }

    const newId = "c_" + Date.now();
    const hashVal = crypto.createHash("sha256").update(`CONTRIBUTION-${newId}-${Number(amount).toFixed(2)}-${campaign}-${lastHash}`).digest("hex");

    const sessUser = xamppSession || { id: "ANON_CLIENT", fullName: "Public Guest", role: "PUBLIC" };

    const newContrib = {
      id: newId,
      donor_name: isAnonymized ? 'Anonymized Contributor' : (donorName || 'Anonymized Contributor'),
      donorName: isAnonymized ? 'Anonymized Contributor' : (donorName || 'Anonymized Contributor'),
      email: isAnonymized ? null : email,
      amount: Number(amount),
      payment_method: paymentMethod || 'Online Portal',
      paymentMethod: paymentMethod || 'Online Portal',
      reference: reference || ('REC-' + Math.floor(Math.random() * 900000 + 100000)),
      campaign,
      description: description || 'Contribution allocation',
      is_anonymized: isAnonymized ? 1 : 0,
      isAnonymized: !!isAnonymized,
      block_hash: hashVal,
      blockHash: hashVal,
      received_at: new Date().toISOString(),
      receivedAt: new Date().toISOString(),
      proofFile: "uploads/proof_example.png",
      proof_file: "uploads/proof_example.png"
    };

    db.contributions.push(newContrib);
    writeDB(db);

    appendAuditLog(
      sessUser.id,
      sessUser.fullName || sessUser.name,
      sessUser.role,
      `Added Donor Contribution Transaction ${newId}`,
      "contributions",
      newId,
      undefined,
      `Donor: ${newContrib.donorName}, Amount: R${amount}, BlockHash: ${hashVal.substring(0, 10)}...`
    );

    if (Number(amount) >= 10000) {
      emitNotification(
        "High Value Deposit Transparency Notice",
        `A critical donor contribution has cleared: R${amount} received from ${newContrib.donorName} towards campaign '${campaign}'.`,
        "COMPLIANCE"
      );
    } else {
      emitNotification(
        "Donor Clear Alert",
        `Contribution of R${amount} cleared from ${newContrib.donorName}.`,
        "SYSTEM"
      );
    }

    return res.json(newContrib);
  }

  if (action === "add_expenditure") {
    const { amount, category, subCategory, sub_category, description, vendor, date, hasReceipt, validCostCenter, boardApproved, taxInvoice } = req.body;
    if (!amount || !category || !vendor || !date) {
      return res.status(400).json({ error: "Missing required expenditure parameters." });
    }
    const db = readDB();

    let lastHash = "GENESIS_BLOCK_HASH_VAL_000000000";
    const allRecords = [...db.contributions, ...db.expenditures].sort((a: any, b: any) => {
      const timeA = a.receivedAt || a.date;
      const timeB = b.receivedAt || b.date;
      return new Date(timeA).getTime() - new Date(timeB).getTime();
    });
    if (allRecords.length > 0) {
      const lastRec = allRecords[allRecords.length - 1];
      lastHash = lastRec.blockHash || lastRec.block_hash || "GENESIS_BLOCK_HASH_VAL_000000000";
    }

    const newId = "e_" + Date.now();
    const hashVal = crypto.createHash("sha256").update(`EXPENDITURE-${newId}-${Number(amount).toFixed(2)}-${category}-${lastHash}`).digest("hex");

    const sessUser = xamppSession || { id: "u2", fullName: "Michael Chang", role: "OFFICER" };

    const newExp = {
      id: newId,
      amount: Number(amount),
      category,
      subCategory: subCategory || sub_category || 'General Logged Spend',
      sub_category: subCategory || sub_category || 'General Logged Spend',
      description,
      approvedBy: null,
      approved_by: null,
      vendor,
      date,
      status: "PENDING",
      complianceStatus: "UNDER_REVIEW",
      compliance_status: "UNDER_REVIEW",
      hasReceipt: hasReceipt !== undefined ? !!hasReceipt : false,
      has_receipt: hasReceipt !== undefined ? (hasReceipt ? 1 : 0) : 0,
      validCostCenter: validCostCenter !== undefined ? !!validCostCenter : false,
      valid_cost_center: validCostCenter !== undefined ? (validCostCenter ? 1 : 0) : 0,
      boardApproved: boardApproved !== undefined ? !!boardApproved : false,
      board_approved: boardApproved !== undefined ? (boardApproved ? 1 : 0) : 0,
      taxInvoice: taxInvoice !== undefined ? !!taxInvoice : false,
      tax_invoice: taxInvoice !== undefined ? (taxInvoice ? 1 : 0) : 0,
      blockHash: hashVal,
      block_hash: hashVal,
      proofFile: "uploads/sample_invoice_receipt.pdf",
      proof_file: "uploads/sample_invoice_receipt.pdf"
    };

    db.expenditures.push(newExp);
    writeDB(db);

    appendAuditLog(
      sessUser.id,
      sessUser.fullName || sessUser.name,
      sessUser.role,
      `Logged pending expenditure entry ${newId}`,
      "expenditures",
      newId,
      undefined,
      `Logged expense: R${amount} under category ${category}. Awaiting Admin approvals.`
    );

    emitNotification(
      "Pending Expense Approval Request",
      `A financial payment request has been logged: R${amount} to ${vendor} by ${sessUser.fullName || sessUser.name}. Approval required.`,
      "COMPLIANCE"
    );

    return res.json(newExp);
  }

  if (action === "approve_expenditure") {
    const { expId, state: approvedState } = req.body;
    if (!expId || !approvedState) {
      return res.status(400).json({ error: "Expenditure ID and clearance choice are required." });
    }
    const db = readDB();
    const idx = db.expenditures.findIndex((e: any) => e.id === expId);
    if (idx === -1) {
      return res.status(404).json({ error: "Expenditure not found." });
    }

    const sessUser = xamppSession || { id: "u1", fullName: "Sarah Jenkins", role: "ADMIN" };

    const oldVal = db.expenditures[idx].status;
    db.expenditures[idx].status = approvedState;
    db.expenditures[idx].approvedBy = sessUser.id;
    db.expenditures[idx].approved_by = sessUser.id;

    writeDB(db);

    appendAuditLog(
      sessUser.id,
      sessUser.fullName || sessUser.name,
      sessUser.role,
      `Cabinet audit changed expenditure state ${expId}`,
      "expenditures",
      expId,
      `STATUS: ${oldVal}`,
      `STATUS: ${approvedState}`
    );

    emitNotification(
      "Expenditure Request Resolved",
      `Expenditure ID: ${expId} (R${db.expenditures[idx].amount}) was officially ${approvedState} by NPO Administrator.`,
      "SYSTEM"
    );

    return res.json({ success: true });
  }

  if (action === "update_compliance") {
    const { expId, status: compStatus, hasReceipt, validCostCenter, boardApproved, taxInvoice } = req.body;
    if (!expId || !compStatus) {
      return res.status(400).json({ error: "Missing required compliance update fields." });
    }
    const db = readDB();
    const idx = db.expenditures.findIndex((e: any) => e.id === expId);
    if (idx === -1) {
      return res.status(404).json({ error: "Expenditure record not found." });
    }

    const sessUser = xamppSession || { id: "u3", fullName: "Elena Rostova", role: "AUDITOR" };

    const oldStatus = db.expenditures[idx].complianceStatus;
    db.expenditures[idx].complianceStatus = compStatus;
    db.expenditures[idx].compliance_status = compStatus;

    db.expenditures[idx].hasReceipt = !!hasReceipt;
    db.expenditures[idx].has_receipt = hasReceipt ? 1 : 0;
    db.expenditures[idx].validCostCenter = !!validCostCenter;
    db.expenditures[idx].valid_cost_center = validCostCenter ? 1 : 0;
    db.expenditures[idx].boardApproved = !!boardApproved;
    db.expenditures[idx].board_approved = boardApproved ? 1 : 0;
    db.expenditures[idx].taxInvoice = !!taxInvoice;
    db.expenditures[idx].tax_invoice = taxInvoice ? 1 : 0;

    writeDB(db);

    appendAuditLog(
      sessUser.id,
      sessUser.fullName || sessUser.name,
      sessUser.role,
      `Audited compliance record for expenditure ${expId}`,
      "expenditures",
      expId,
      `Compliance: ${oldStatus}`,
      `Compliance: ${compStatus}`
    );

    if (compStatus === "FAILED") {
      emitNotification(
        "Auditor Compliance Check FAILURE",
        `Critical compliance checklist failed on Expenditure node ${expId} for R${db.expenditures[idx].amount}. Receipt validation failure!`,
        "ALERT"
      );
    } else {
      emitNotification(
        "Compliance Ledger Verified",
        `Auditor completed audit checkpoint verification on Transaction ${expId}. Result: ${compStatus}.`,
        "COMPLIANCE"
      );
    }

    return res.json({ success: true });
  }

  if (action === "toggle_reminder") {
    const { reminderId } = req.body;
    if (!reminderId) {
      return res.status(400).json({ error: "Reminder ID required." });
    }
    const db = readDB();
    const idx = db.reminders.findIndex((r: any) => r.id === reminderId);
    if (idx === -1) {
      return res.status(404).json({ error: "Reminder not found." });
    }

    const sessUser = xamppSession || { id: "u2", fullName: "Michael Chang", role: "OFFICER" };

    const wasCompleted = db.reminders[idx].isCompleted;
    db.reminders[idx].isCompleted = !wasCompleted;
    db.reminders[idx].is_completed = !wasCompleted ? 1 : 0;

    writeDB(db);

    appendAuditLog(
      sessUser.id,
      sessUser.fullName || sessUser.name,
      sessUser.role,
      `Toggled roadmap task completion state ${reminderId}`,
      "reminders",
      reminderId,
      `Completed: ${wasCompleted}`,
      `Completed: ${!wasCompleted}`
    );

    const stateStr = !wasCompleted ? "COMPLETED" : "RE-OPENED";
    emitNotification(
      "Roadmap Deadline Checkpoint Cleared",
      `Financial compliance return objective '${db.reminders[idx].title}' has been marked ${stateStr}.`,
      "REMINDER"
    );

    return res.json({ success: true, is_completed: !wasCompleted ? 1 : 0 });
  }

  if (action === "verify_ledger_chain") {
    const db = readDB();

    const transactions: any[] = [];
    db.contributions.forEach((c: any) => {
      transactions.push({
        id: c.id,
        type: "CONTRIBUTION",
        amount: c.amount,
        secondary: c.campaign,
        storedHash: c.blockHash || c.block_hash
      });
    });
    db.expenditures.forEach((e: any) => {
      transactions.push({
        id: e.id,
        type: "EXPENDITURE",
        amount: e.amount,
        secondary: e.category,
        storedHash: e.blockHash || e.block_hash
      });
    });

    transactions.sort((a, b) => a.id.localeCompare(b.id));

    let currentCalculatedHash = "GENESIS_BLOCK_HASH_VAL_000000000";
    let isValid = true;
    let compromisedCount = 0;
    const blocks: any[] = [];

    for (const t of transactions) {
      const recalculated = crypto.createHash("sha256").update(`${t.type}-${t.id}-${Number(t.amount).toFixed(2)}-${t.secondary}-${currentCalculatedHash}`).digest("hex");
      const match = recalculated === t.storedHash;
      if (!match) {
        isValid = false;
        compromisedCount++;
      }
      blocks.push({
        id: t.id,
        type: t.type,
        storedHash: t.storedHash,
        calculatedHash: recalculated,
        isCompromised: !match
      });
      currentCalculatedHash = t.storedHash;
    }

    return res.json({
      isValid,
      compromisedCount,
      totalBlocks: transactions.length,
      expectedHash: currentCalculatedHash,
      actualHash: isValid ? currentCalculatedHash : "MISMATCH_DETECTED_FRACTURED_INTEGRITY",
      recalculatedBlocks: blocks
    });
  }

  if (action === "add_report") {
    const { id, title, start_period, end_period, hash, total_revenue, total_expenditure, surplus, program_service_ratio, signatures } = req.body;
    const db = readDB();

    const sessUser = xamppSession || { id: "u1", fullName: "Sarah Jenkins", role: "ADMIN" };

    const reportVal = {
      id: id || ("rep_" + Date.now()),
      reportType: "NPO_ANNUAL",
      report_type: "NPO_ANNUAL",
      title: title || "New Compiled Return",
      startPeriod: start_period || "2025-06-01",
      start_period: start_period || "2025-06-01",
      endPeriod: end_period || "2026-05-31",
      end_period: end_period || "2026-05-31",
      generatedAt: new Date().toISOString(),
      generated_at: new Date().toISOString(),
      generatedBy: sessUser.fullName,
      generated_by: sessUser.fullName,
      status: "DRAFT",
      hash: hash || crypto.createHash("sha256").update((title || "") + Date.now()).digest("hex"),
      signatures: signatures ? signatures.map((s: any) => ({
        signeeName: s.signee_name || s.signeeName || sessUser.fullName,
        signee_name: s.signee_name || s.signeeName || sessUser.fullName,
        signeeRole: s.signee_role || s.signeeRole || sessUser.role,
        signee_role: s.signee_role || s.signeeRole || sessUser.role,
        signedAt: new Date().toISOString(),
        signed_at: new Date().toISOString(),
        signatureHash: s.signature_hash || s.signatureHash || ("SIG_" + crypto.createHash("sha256").update(sessUser.fullName).digest("hex"))
      })) : [],
      total_revenue: Number(total_revenue || 0),
      totalRevenue: Number(total_revenue || 0),
      total_expenditure: Number(total_expenditure || 0),
      totalExpenditure: Number(total_expenditure || 0),
      surplus: Number(surplus || 0),
      program_service_ratio: Number(program_service_ratio || 0.0),
      programServiceRatio: Number(program_service_ratio || 0.0)
    };

    db.reports.push(reportVal);
    writeDB(db);

    appendAuditLog(
      sessUser.id,
      sessUser.fullName || sessUser.name,
      sessUser.role,
      `Compiled statutory report draft: ${reportVal.id}`,
      "statutory_reports",
      reportVal.id,
      undefined,
      `Title: ${title}, Total Rev: R${total_revenue}, Total Spend: R${total_expenditure}`
    );

    emitNotification(
      "New Statutory Statement Form Created",
      `A new NPO_ANNUAL regulatory ledger statement draft has been built. Board signatures authorized.`,
      "COMPLIANCE"
    );

    return res.json(reportVal);
  }

  if (action === "sign_report") {
    const { reportId, signeeName, signeeRole, signatureHash } = req.body;
    if (!reportId) {
      return res.status(400).json({ error: "Missing report key." });
    }
    const db = readDB();
    const idx = db.reports.findIndex((r: any) => r.id === reportId);
    if (idx === -1) {
      return res.status(404).json({ error: "Report draft not found." });
    }

    const sessUser = xamppSession || { id: "u3", fullName: signeeName || "Elena Rostova", role: signeeRole || "AUDITOR" };
    const sName = signeeName || sessUser.fullName || sessUser.name;
    const sRole = signeeRole || sessUser.role;

    const exists = db.reports[idx].signatures.some((s: any) => (s.signeeName || s.signee_name) === sName && (s.signeeRole || s.signee_role) === sRole);
    if (exists) {
      return res.status(400).json({ error: "This document is already certified from your credential set." });
    }

    const sigHash = signatureHash || ("SIG_" + crypto.createHash("sha256").update(`${reportId}-${sName}-${Date.now()}`).digest("hex").substring(0, 32));

    const sigObj = {
      signeeName: sName,
      signee_name: sName,
      signeeRole: sRole,
      signee_role: sRole,
      signedAt: new Date().toISOString(),
      signed_at: new Date().toISOString(),
      signatureHash: sigHash,
      signature_hash: sigHash
    };

    db.reports[idx].signatures.push(sigObj);

    const rolesSigned = db.reports[idx].signatures.map((s: any) => s.signeeRole || s.signee_role);
    if (rolesSigned.includes("ADMIN") && rolesSigned.includes("AUDITOR")) {
      db.reports[idx].status = "SIGNED";
    }

    writeDB(db);

    appendAuditLog(
      sessUser.id,
      sName,
      sRole,
      `Applied cryptographical signature seal to Document ${reportId}`,
      "statutory_reports",
      reportId,
      undefined,
      `Signed by ${sName} in role ${sRole}. Signature: ${sigHash}`
    );

    emitNotification(
      "Cryptographic Record Certified",
      `Regulatory Document verified: ${db.reports[idx].title} signed by ${sName} (${sRole}).`,
      "COMPLIANCE"
    );

    return res.json(db.reports[idx]);
  }

  if (action === "upload_logo") {
    const sessUser = xamppSession || { id: "u1", fullName: "Sarah Jenkins", role: "ADMIN" };
    appendAuditLog(
      sessUser.id,
      sessUser.fullName || sessUser.name,
      sessUser.role,
      `Re-branded ecosystem user-interface styling customized`,
      "system_theme",
      "branding_elements"
    );
    emitNotification(
      "Ecosystem Corporate Logo Realigned",
      `Corporate brand interface graphics reassembled with verified compliance vector branding seals.`,
      "SYSTEM"
    );
    return res.json({ success: true });
  }

  return res.status(400).json({ error: "Invalid action" });
});

// Vite server hosting middleware for Development environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
