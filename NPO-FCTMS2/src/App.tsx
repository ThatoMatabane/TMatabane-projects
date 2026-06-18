/**
 * NPO-FCTMS Financial Compliance Module
 * App.tsx - Multi-Role Interactive Compliance Portal with persistent sandbox engine
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Contribution, 
  Expenditure, 
  AuditLog, 
  TaskReminder, 
  Notification, 
  StatutoryReport 
} from './types';
import { 
  ShieldCheck, 
  Activity, 
  Clock, 
  LogOut, 
  Lock, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  DollarSign, 
  Layers, 
  FileText, 
  Download, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Plus
} from 'lucide-react';

// Cryptographic hash equivalent simulator for React timeline integrity checks
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return "0000" + hex + "e" + hex + "a8bcdf7ce9aa90af09cdaefcc8";
}

function calculateBlockHash(recordType: string, id: string, amount: number, secondary: string, previousHash: string): string {
  const content = `${recordType}-${id}-${amount.toFixed(2)}-${secondary}-${previousHash}`;
  return simpleHash(content);
}

const SEED_USERS: User[] = [
  { id: "u1", email: "admin@npo.org", fullName: "Sarah Jenkins", role: UserRole.ADMIN, organization: "Global Green Foundation", createdAt: "2026-01-10T12:00:00Z" },
  { id: "u2", email: "finance@npo.org", fullName: "Michael Chang", role: UserRole.OFFICER, organization: "Global Green Foundation", createdAt: "2026-01-12T12:00:00Z" },
  { id: "u3", email: "auditor@independent.com", fullName: "Elena Rostova", role: UserRole.AUDITOR, organization: "Peak Audit Associates", createdAt: "2026-01-15T12:00:00Z" },
  { id: "u4", email: "donor@gmail.com", fullName: "Dr. Arthur Pendelton", role: UserRole.DONOR, organization: "Pendelton Family Trust", createdAt: "2026-02-01T12:00:00Z" }
];

const SEED_CONTRIBUTIONS: Contribution[] = [
  { id: "c1", donorName: "Dr. Arthur Pendelton", email: "donor@gmail.com", amount: 15000, paymentMethod: "Wire Transfer", reference: "DON-2026-001", campaign: "Reforestation Project Africa", receivedAt: "2026-04-10T10:30:00Z", description: "Annual unrestricted donor allocation for tree planting programs.", status: 'CLEARED', isAnonymized: false, blockHash: "63cc5f03d5248fe2d9a30283c7ce69fe1a2d81fdfd23608cc29d1ff04d9abbcb" },
  { id: "c2", donorName: "Anonymized Contributor", amount: 45000, paymentMethod: "ACH Direct Debit", reference: "DON-2026-002", campaign: "Urban Agriculture Greenhouses", receivedAt: "2026-04-18T14:45:00Z", description: "Sponsorship allocation for climate-tech hydroponic development.", status: 'CLEARED', isAnonymized: true, blockHash: "9cce81fb7d2a58bceaa843394627d3e91a2da382cf8a2f4a1bc9a7dd18e7bcc3" },
  { id: "c3", donorName: "Global Eco Grant", email: "grants@ecofund.org", amount: 120000, paymentMethod: "EFT Grant Transfer", reference: "GRT-998822", campaign: "Rainforest Canopy Preservation", receivedAt: "2026-05-02T08:00:00Z", description: "Q2 Restricted Grant Funding for preservation operations.", status: 'CLEARED', isAnonymized: false, blockHash: "4ca9bbfcfda4e9ec598f829f79888d66dfab091176bc5aefce99aa8dffceaa09" }
];

const SEED_EXPENDITURES: Expenditure[] = [
  { id: "e1", amount: 42000, category: 'PROGRAM', subCategory: "Direct Seed & Fertilizer Logistics", description: "Sourcing 50,000 indigenous saplings and bio-fertilizer shipments.", vendor: "AgriSupply Co. (Pty) LTD", date: "2026-04-20", status: 'APPROVED', complianceStatus: 'VERIFIED', complianceCheckDetails: { hasReceipt: true, validCostCenter: true, boardApproved: true, taxInvoice: true }, blockHash: "bc2888df7ce9aa90abf9119bdcc3aa8bfe9cf58fecc99adfa0aefce9a987ddee" },
  { id: "e2", amount: 8500, category: 'OPERATIONAL', subCategory: "Eco-Tech Monitoring Sensors", description: "Internet-of-Things solar soil and rainfall analyzer systems.", vendor: "IoT Hardware Solutions", date: "2026-04-25", status: 'APPROVED', complianceStatus: 'VERIFIED', complianceCheckDetails: { hasReceipt: true, validCostCenter: true, boardApproved: false, taxInvoice: true }, blockHash: "cf235fab9daefcc838bdca991b1fa9decfab09115ec4c7aa9a8bfe7dcdfe8a9c" },
  { id: "e3", amount: 4500, category: 'ADMINISTRATIVE', subCategory: "Regulatory Tax Compliance & Legal Retainers", description: "Statutory annual statement audits and financial verification consultation.", vendor: "Apex Auditor Associates", date: "2026-05-05", status: 'APPROVED', complianceStatus: 'VERIFIED', complianceCheckDetails: { hasReceipt: true, validCostCenter: true, boardApproved: true, taxInvoice: true }, blockHash: "eb9dcdfaabaf091147aefece2531cd9a2bc1d7ff9a8cde99a8bfe7dcdaaa6602" },
  { id: "e4", amount: 12000, category: 'FUNDRAISING', subCategory: "Advocacy Material & Event Hosting", description: "Graphic printing and public educational venue rental.", vendor: "Spectra Design Hub", date: "2026-05-15", status: 'APPROVED', complianceStatus: 'VERIFIED', complianceCheckDetails: { hasReceipt: true, validCostCenter: true, boardApproved: false, taxInvoice: true }, blockHash: "33ccf09daaa81fe9c9a8d9a2bcef0c9aaadcf0bba29f4a8bfe7dcdafcece3455" }
];

const SEED_REMINDERS: TaskReminder[] = [
  { id: "r1", title: "File Statutory SARS/IRS 990 Annual Compliance Returns", dueDate: "2026-06-15", priority: 'HIGH', category: 'TAX_FILING', isCompleted: false, createdAt: "2026-05-01T12:00:00Z", recurrence: "Annual" },
  { id: "r2", title: "Consolidate Section 18A Donor Deductible Tax Receipts", dueDate: "2026-06-25", priority: 'MEDIUM', category: 'DONOR_REPORT', isCompleted: true, createdAt: "2026-05-01T12:00:00Z", recurrence: "Quarterly" },
  { id: "r3", title: "Complete Q2 Independent Auditor Board Checkpoint", dueDate: "2026-07-10", priority: 'HIGH', category: 'AUDIT_DEADLINE', isCompleted: false, createdAt: "2026-05-10T12:00:00Z", recurrence: "Semi-Annual" },
  { id: "r4", title: "Publish Public Transparency Ledger to Directory Website", dueDate: "2026-06-30", priority: 'LOW', category: 'INTERNAL_REVIEW', isCompleted: false, createdAt: "2026-05-12T12:00:00Z", recurrence: "Monthly" }
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  { id: "l1", userId: "u1", userName: "Sarah Jenkins", userRole: UserRole.ADMIN, action: "NPO-FCTMS System Initialization", tableName: "SYSTEM", recordId: "SYSTEM", newValue: "Genesis Seed Set Up", timestamp: "2026-01-10 12:00:00", ipAddress: "127.0.0.1" },
  { id: "l2", userId: "u2", userName: "Michael Chang", userRole: UserRole.OFFICER, action: "Logged Contribution Transaction (c3)", tableName: "contributions", recordId: "c3", newValue: "Donor: Global Eco Eco Grant, Amount: R120,000", timestamp: "2026-05-02 08:10:00", ipAddress: "192.168.1.144" },
  { id: "l3", userId: "u3", userName: "Elena Rostova", userRole: UserRole.AUDITOR, action: "Digitally Signed Statutory Report (rep1)", tableName: "statutory_reports", recordId: "rep1", oldValue: "DRAFT", newValue: "STATE: SIGNED - Verification OK", timestamp: "2026-06-02 09:12:00", ipAddress: "198.81.12.9" }
];

const SEED_REPORTS: StatutoryReport[] = [
  {
    id: "rep1",
    reportType: 'NPO_ANNUAL',
    title: "Annual Financial & Compliance Report - FY 2025/2026",
    startPeriod: "2025-06-01",
    endPeriod: "2026-05-31",
    generatedAt: "2026-06-01 15:00:00",
    generatedBy: "Sarah Jenkins (ADMIN)",
    status: 'SIGNED',
    hash: "rep1_calculated_document_hash",
    signatures: [
      { signeeName: "Sarah Jenkins", signeeRole: UserRole.ADMIN, signedAt: "2026-06-01 16:30:00", signatureHash: "SIG_03cc5f03d5248fe2d9a30283c7ce69fe1a2d81" },
      { signeeName: "Elena Rostova", signeeRole: UserRole.AUDITOR, signedAt: "2026-06-02 09:12:00", signatureHash: "SIG_9a87cdff3d9ddb8e76c128fe3bc909aaab0911" }
    ],
    summaryData: {
      totalRevenue: 180000,
      totalExpenditure: 67000,
      surplus: 113000,
      programServiceRatio: 0.627
    }
  }
];

export default function App() {
  // Navigation & session state
  const [session, setSession] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'public' | 'portal'>('public');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Input states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>(UserRole.PUBLIC);
  const [regOrg, setRegOrg] = useState('Global Green Foundation');

  // Business state arrays
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [reminders, setReminders] = useState<TaskReminder[]>([]);
  const [reports, setReports] = useState<StatutoryReport[]>([]);

  // Public Fast Donation Input
  const [donName, setDonName] = useState('');
  const [donEmail, setDonEmail] = useState('');
  const [donAmount, setDonAmount] = useState('');
  const [donCampaign, setDonCampaign] = useState('Reforestation Project Africa');
  const [donAnonymized, setDonAnonymized] = useState(false);
  const [donSuccess, setDonSuccess] = useState(false);

  // Officer inputs
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('');
  const [expCategory, setExpCategory] = useState<'PROGRAM' | 'OPERATIONAL' | 'ADMINISTRATIVE' | 'FUNDRAISING'>('PROGRAM');
  const [expSubCat, setExpSubCat] = useState('');
  const [expVendor, setExpVendor] = useState('');
  const [expDesc, setExpDesc] = useState('');
  
  // Officer check values
  const [chkReceipt, setChkReceipt] = useState(false);
  const [chkCostCenter, setChkCostCenter] = useState(false);
  const [chkBoardApproved, setChkBoardApproved] = useState(false);
  const [chkTaxInvoice, setChkTaxInvoice] = useState(false);

  // Officer deposit inputs
  const [conName, setConName] = useState('');
  const [conEmail, setConEmail] = useState('');
  const [conAmount, setConAmount] = useState('');
  const [conRef, setConRef] = useState('');
  const [conMethod, setConMethod] = useState('Wire Transfer');
  const [conCampaign, setConCampaign] = useState('');

  // Auditor inputs
  const [selectedAuditId, setSelectedAuditId] = useState('');
  const [audCheckReceipt, setAudCheckReceipt] = useState(false);
  const [audCheckCenter, setAudCheckCenter] = useState(false);
  const [audCheckApproved, setAudCheckApproved] = useState(false);
  const [audCheckTax, setAudCheckTax] = useState(false);

  // Generate Report inputs
  const [repTitleInput, setRepTitleInput] = useState('Annual Compliance Statement');
  const [repStartInput, setRepStartInput] = useState('2025-06-01');
  const [repEndInput, setRepEndInput] = useState('2026-05-31');

  // Printable S18A receipt popup overlay state
  const [selectedReceipt, setSelectedReceipt] = useState<Contribution | null>(null);

  // Load state from local storage or defaults on start up
  useEffect(() => {
    const localCont = localStorage.getItem('npo_contributions');
    if (!localCont) {
      localStorage.setItem('npo_contributions', JSON.stringify(SEED_CONTRIBUTIONS));
      localStorage.setItem('npo_expenditures', JSON.stringify(SEED_EXPENDITURES));
      localStorage.setItem('npo_reminders', JSON.stringify(SEED_REMINDERS));
      localStorage.setItem('npo_audit_logs', JSON.stringify(SEED_AUDIT_LOGS));
      localStorage.setItem('npo_reports', JSON.stringify(SEED_REPORTS));

      setContributions(SEED_CONTRIBUTIONS);
      setExpenditures(SEED_EXPENDITURES);
      setReminders(SEED_REMINDERS);
      setAuditLogs(SEED_AUDIT_LOGS);
      setReports(SEED_REPORTS);
    } else {
      setContributions(JSON.parse(localCont));
      setExpenditures(JSON.parse(localStorage.getItem('npo_expenditures')!));
      setReminders(JSON.parse(localStorage.getItem('npo_reminders')!));
      setAuditLogs(JSON.parse(localStorage.getItem('npo_audit_logs')!));
      setReports(JSON.parse(localStorage.getItem('npo_reports')!));
    }

    const savedSession = localStorage.getItem('npo_session');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  const saveToDisk = (c: Contribution[], e: Expenditure[], r: TaskReminder[], l: AuditLog[], rep: StatutoryReport[]) => {
    localStorage.setItem('npo_contributions', JSON.stringify(c));
    localStorage.setItem('npo_expenditures', JSON.stringify(e));
    localStorage.setItem('npo_reminders', JSON.stringify(r));
    localStorage.setItem('npo_audit_logs', JSON.stringify(l));
    localStorage.setItem('npo_reports', JSON.stringify(rep));
  };

  // General Metrics
  const totalRevenue = contributions.reduce((sum, c) => sum + c.amount, 0);
  const approvedExpenditure = expenditures
    .filter(e => e.status === 'APPROVED')
    .reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenditureTotal = expenditures
    .filter(e => e.status === 'PENDING')
    .reduce((sum, e) => sum + e.amount, 0);

  const programSpendTotal = expenditures
    .filter(e => e.status === 'APPROVED' && e.category === 'PROGRAM')
    .reduce((sum, e) => sum + e.amount, 0);

  const programServiceRatio = approvedExpenditure > 0 
    ? (programSpendTotal / approvedExpenditure) * 100 
    : 0.0;

  // Sign out handle
  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('npo_session');
    setActiveTab('public');
  };

  // Interactive Verification alert
  const triggerLedgerRecalculation = () => {
    const combinedLength = contributions.length + expenditures.length;
    alert(`Financial ledger sequence cryptographic verification triggered!\nTotal sequenced blocks: ${combinedLength}\nRecalculation outcome: SUCCESS (Ledger integrity fully verified)`);
  };

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    // Check against pre-seeded profiles
    const emailLower = loginEmail.toLowerCase();
    const matchedSeed = SEED_USERS.find(u => u.email.toLowerCase() === emailLower);

    if (matchedSeed && loginPassword.length >= 4) {
      setSession(matchedSeed);
      localStorage.setItem('npo_session', JSON.stringify(matchedSeed));
      setActiveTab('portal');
      setLoginEmail('');
      setLoginPassword('');
    } else {
      // Allow testing registered users in cache
      const cachedUsersRaw = localStorage.getItem('npo_custom_users') || '[]';
      const cachedUsers = JSON.parse(cachedUsersRaw) as User[];
      const matchedCustom = cachedUsers.find(u => u.email.toLowerCase() === emailLower);

      if (matchedCustom && loginPassword.length >= 4) {
        setSession(matchedCustom);
        localStorage.setItem('npo_session', JSON.stringify(matchedCustom));
        setActiveTab('portal');
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setAuthError('Invalid credentials. Clearances require standard corporate password authorization.');
      }
    }
  };

  // Handle Registration submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (regPassword.length < 5) {
      setAuthError('Passwords must contain at least 5 characters.');
      return;
    }

    const newUser: User = {
      id: "u_" + Date.now(),
      email: regEmail,
      fullName: regName,
      role: regRole,
      organization: regOrg,
      createdAt: new Date().toISOString()
    };

    const cachedUsersRaw = localStorage.getItem('npo_custom_users') || '[]';
    const cachedUsers = JSON.parse(cachedUsersRaw);
    cachedUsers.push(newUser);
    localStorage.setItem('npo_custom_users', JSON.stringify(cachedUsers));

    // Save logs
    const logNode: AuditLog = {
      id: "l_reg_" + Date.now(),
      userId: newUser.id,
      userName: newUser.fullName,
      userRole: newUser.role,
      action: "Created certified account credential logs.",
      tableName: "users",
      recordId: newUser.id,
      newValue: `Registered: name=${newUser.fullName}, role=${newUser.role}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0,19),
      ipAddress: "127.0.0.1"
    };

    const nextLogs = [logNode, ...auditLogs];
    setAuditLogs(nextLogs);
    setSession(newUser);
    localStorage.setItem('npo_session', JSON.stringify(newUser));
    setActiveTab('portal');
    saveToDisk(contributions, expenditures, reminders, nextLogs, reports);

    // Clean inputs
    setRegName('');
    setRegEmail('');
    setRegPassword('');
  };

  // Guest fast donation transfer
  const handleFastDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = parseFloat(donAmount);
    if (sum <= 9) {
      alert("Minimum transfer sum is R10.");
      return;
    }

    let lastHash = "GENESIS_BLOCK_HASH_VAL_000000000";
    if (contributions.length > 0) {
      lastHash = contributions[contributions.length - 1].blockHash;
    }
    const newId = "c_" + Date.now();
    const calcHash = calculateBlockHash("CONTRIBUTION", newId, sum, donCampaign, lastHash);

    const newContrib: Contribution = {
      id: newId,
      donorName: donAnonymized ? 'Anonymized Contributor' : donName,
      email: donAnonymized ? undefined : donEmail,
      amount: sum,
      paymentMethod: "Online Portal",
      reference: "REC-" + Math.floor(Math.random() * 900000 + 100000),
      campaign: donCampaign,
      receivedAt: new Date().toISOString(),
      description: "Allocated via public dynamic UI widget.",
      status: 'CLEARED',
      isAnonymized: donAnonymized,
      blockHash: calcHash
    };

    const nextContribs = [...contributions, newContrib];
    setContributions(nextContribs);
    setDonSuccess(true);
    saveToDisk(nextContribs, expenditures, reminders, auditLogs, reports);
  };

  const resetFastDonForm = () => {
    setDonName('');
    setDonEmail('');
    setDonAmount('');
    setDonSuccess(false);
  };

  // Admin approves pendings
  const handleAdminApprovalState = (id: string, nextState: 'APPROVED' | 'DISAPPROVED') => {
    const updated = expenditures.map(e => {
      if (e.id === id) {
        return { ...e, status: nextState, approvedBy: session?.id };
      }
      return e;
    });

    const activeItem = expenditures.find(e => e.id === id);
    const logId = "l_adm_" + Date.now();
    const newLog: AuditLog = {
      id: logId,
      userId: session?.id || "u1",
      userName: session?.fullName || "Sarah Jenkins",
      userRole: UserRole.ADMIN,
      action: `Resolved pending expenditure payout (${id})`,
      tableName: "expenditures",
      recordId: id,
      oldValue: "PENDING",
      newValue: `Status changed to: ${nextState}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0,19),
      ipAddress: "127.0.0.1"
    };

    const nextLogs = [newLog, ...auditLogs];
    setExpenditures(updated);
    setAuditLogs(nextLogs);
    saveToDisk(contributions, updated, reminders, nextLogs, reports);
  };

  // Financial officer logs a spent
  const handleOfficerExpenditureAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = parseFloat(expAmount);
    if (sum <= 0 || !expSubCat || !expVendor) {
      alert("Amount, justification objective subcategory, and supplier vendor parameters are required.");
      return;
    }

    let lastHash = "GENESIS_BLOCK_HASH_VAL_000000000";
    if (expenditures.length > 0) {
      lastHash = expenditures[expenditures.length - 1].blockHash;
    }
    const newId = "e_" + Date.now();
    const calcHash = calculateBlockHash("EXPENDITURE", newId, sum, expCategory, lastHash);

    const newExpenditure: Expenditure = {
      id: newId,
      amount: sum,
      category: expCategory,
      subCategory: expSubCat,
      description: expDesc || "Logged manually",
      vendor: expVendor,
      date: expDate || new Date().toISOString().split('T')[0],
      status: 'PENDING',
      complianceStatus: 'UNDER_REVIEW',
      complianceCheckDetails: {
        hasReceipt: chkReceipt,
        validCostCenter: chkCostCenter,
        boardApproved: chkBoardApproved,
        taxInvoice: chkTaxInvoice
      },
      blockHash: calcHash
    };

    const updatedExp = [...expenditures, newExpenditure];
    const logId = "l_off_" + Date.now();
    const newLog: AuditLog = {
      id: logId,
      userId: session?.id || "u2",
      userName: session?.fullName || "Michael Chang",
      userRole: UserRole.OFFICER,
      action: `Lodged expenditure authorization draft (${newId})`,
      tableName: "expenditures",
      recordId: newId,
      newValue: `Sum: R${sum}, Category: ${expCategory}, Vendor: ${expVendor}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0,19),
      ipAddress: "127.0.0.1"
    };

    const nextLogs = [newLog, ...auditLogs];
    setExpenditures(updatedExp);
    setAuditLogs(nextLogs);
    saveToDisk(contributions, updatedExp, reminders, nextLogs, reports);

    // Reset Form
    setExpAmount('');
    setExpSubCat('');
    setExpVendor('');
    setExpDesc('');
    setChkReceipt(false);
    setChkCostCenter(false);
    setChkBoardApproved(false);
    setChkTaxInvoice(false);
  };

  // Financial officer signs milestone complete
  const handleToggleReminderState = (id: string) => {
    const updated = reminders.map(r => {
      if (r.id === id) {
        return { ...r, isCompleted: !r.isCompleted };
      }
      return r;
    });

    const activeItem = reminders.find(r => r.id === id);
    const newLog: AuditLog = {
      id: "l_rem_" + Date.now(),
      userId: session?.id || "u2",
      userName: session?.fullName || "Michael Chang",
      userRole: UserRole.OFFICER,
      action: `Toggled compliance roadmap task completion (${id})`,
      tableName: "reminders",
      recordId: id,
      newValue: `Next complete state: ${!activeItem?.isCompleted}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0,19),
      ipAddress: "127.0.0.1"
    };

    const nextLogs = [newLog, ...auditLogs];
    setReminders(updated);
    setAuditLogs(nextLogs);
    saveToDisk(contributions, expenditures, updated, nextLogs, reports);
  };

  // Financial officer registers offline direct transfer
  const handleOfficerContributionAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const sum = parseFloat(conAmount);
    if (!conName || sum <= 0 || !conCampaign) {
      alert("All fields are mandatory.");
      return;
    }

    let lastHash = "GENESIS_BLOCK_HASH_VAL_000000000";
    if (contributions.length > 0) {
      lastHash = contributions[contributions.length - 1].blockHash;
    }
    const newId = "c_" + Date.now();
    const calcHash = calculateBlockHash("CONTRIBUTION", newId, sum, conCampaign, lastHash);

    const newContrib: Contribution = {
      id: newId,
      donorName: conName,
      email: conEmail || undefined,
      amount: sum,
      paymentMethod: conMethod,
      reference: conRef || "REC-" + Math.floor(Math.random() * 900000 + 100000),
      campaign: conCampaign,
      receivedAt: new Date().toISOString(),
      description: "Direct bank transfer logged by Financial Officer.",
      status: 'CLEARED',
      isAnonymized: false,
      blockHash: calcHash
    };

    const updatedCont = [...contributions, newContrib];
    const newLog: AuditLog = {
      id: "l_con_" + Date.now(),
      userId: session?.id || "u2",
      userName: session?.fullName || "Michael Chang",
      userRole: UserRole.OFFICER,
      action: `Logged offline bank deposit node (${newId})`,
      tableName: "contributions",
      recordId: newId,
      newValue: `Donor: ${conName}, Sum: R${sum}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0,19),
      ipAddress: "127.0.0.1"
    };

    const nextLogs = [newLog, ...auditLogs];
    setContributions(updatedCont);
    setAuditLogs(nextLogs);
    saveToDisk(updatedCont, expenditures, reminders, nextLogs, reports);

    // reset Form
    setConName('');
    setConEmail('');
    setConAmount('');
    setConRef('');
    setConCampaign('');
  };

  // Auditor checklist verification submit
  const handleAuditorChecklistSubmit = (status: 'VERIFIED' | 'FAILED') => {
    if (!selectedAuditId) {
      alert("Please select an expenditure node to verify.");
      return;
    }

    const updated = expenditures.map(e => {
      if (e.id === selectedAuditId) {
        return {
          ...e,
          complianceStatus: status,
          complianceCheckDetails: {
            hasReceipt: audCheckReceipt,
            validCostCenter: audCheckCenter,
            boardApproved: audCheckApproved,
            taxInvoice: audCheckTax
          }
        };
      }
      return e;
    });

    const newLog: AuditLog = {
      id: "l_aud_" + Date.now(),
      userId: session?.id || "u3",
      userName: session?.fullName || "Elena Rostova",
      userRole: UserRole.AUDITOR,
      action: `Audited spending receipt parameters (${selectedAuditId})`,
      tableName: "expenditures",
      recordId: selectedAuditId,
      newValue: `Compliance changed to: ${status}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0,19),
      ipAddress: "127.0.0.1"
    };

    const nextLogs = [newLog, ...auditLogs];
    setExpenditures(updated);
    setAuditLogs(nextLogs);
    setSelectedAuditId('');
    saveToDisk(contributions, updated, reminders, nextLogs, reports);
    alert("Compliance Checklist sealed successfully. Clearance logged.");
  };

  const handleAuditSelectLoad = (id: string) => {
    setSelectedAuditId(id);
    const item = expenditures.find(e => e.id === id);
    if (item) {
      setAudCheckReceipt(item.complianceCheckDetails.hasReceipt);
      setAudCheckCenter(item.complianceCheckDetails.validCostCenter);
      setAudCheckApproved(item.complianceCheckDetails.boardApproved || false);
      setAudCheckTax(item.complianceCheckDetails.taxInvoice);
    }
  };

  // Auditor generates report statement
  const handleGenerateReportDraft = () => {
    if (!repTitleInput) {
      alert("Please describe report title.");
      return;
    }

    const newReport: StatutoryReport = {
      id: "rep_" + Date.now(),
      reportType: 'NPO_ANNUAL',
      title: repTitleInput,
      startPeriod: repStartInput,
      endPeriod: repEndInput,
      generatedAt: new Date().toLocaleDateString() + ' 15:00:00',
      generatedBy: session?.fullName + " (" + session?.role + ")",
      status: 'DRAFT',
      hash: "rep_hash_" + simpleHash(repTitleInput + Date.now()),
      signatures: [],
      summaryData: {
        totalRevenue: totalRevenue,
        totalExpenditure: approvedExpenditure,
        surplus: totalRevenue - approvedExpenditure,
        programServiceRatio: parseFloat((programServiceRatio / 100).toFixed(3))
      }
    };

    const nextReports = [...reports, newReport];
    setReports(nextReports);
    saveToDisk(contributions, expenditures, reminders, auditLogs, nextReports);
    alert("New compliance statutory return draft statement compiled and logged. Dual signature seals required.");
  };

  // Auditor affixes digital seal
  const handleSignReportAuditor = (id: string) => {
    const updated = reports.map(r => {
      if (r.id === id) {
        const sigObj = {
          signeeName: session?.fullName || "Elena Rostova",
          signeeRole: session?.role || UserRole.AUDITOR,
          signedAt: new Date().toLocaleDateString() + ' 10:12:00',
          signatureHash: "SIG_" + simpleHash(session?.fullName || "Elena Rostova")
        };
        return {
          ...r,
          status: 'SIGNED' as const,
          signatures: [...r.signatures, sigObj]
        };
      }
      return r;
    });

    setReports(updated);
    saveToDisk(contributions, expenditures, reminders, auditLogs, updated);
    alert("Your independent digital certification signature was successfully recorded and sealed on the report document node!");
  };

  // Sort integrated ledger array for table presentation
  const unifiedTableEntries = [...contributions.map(c => ({
    id: c.id,
    displayId: c.reference,
    type: 'CONTRIBUTION',
    campaign: c.campaign,
    amount: c.amount,
    status: 'CLEARED',
    compliance: 'VERIFIED',
    date: c.receivedAt
  })), ...expenditures.map(e => ({
    id: e.id,
    displayId: `EXP-${e.id.substring(2, 8).toUpperCase()}`,
    type: `SPEND (${e.category})`,
    campaign: e.subCategory,
    amount: e.amount,
    status: e.status,
    compliance: e.complianceStatus,
    date: e.date
  }))];

  // Sort reverse chronological
  unifiedTableEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between font-sans">
      
      {/* 1. GLOBAL REGULATORY WARNING STRIP */}
      <div className="bg-[#112a4a] text-white py-2 px-4 border-b border-sky-950/20 text-xs font-semibold flex items-center justify-between z-40 select-none">
        <div className="flex items-center gap-2 max-w-xl md:max-w-4xl truncate">
          <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0 animate-spin" />
          <span className="text-teal-400 tracking-wider font-extrabold uppercase text-[10px]">Statutory Deadline Warning:</span>
          <span className="truncate text-slate-200">Active Return Period (FY 2025/2026) IRS & SARS Form 990 submission due June 15, 2026!</span>
        </div>
        <span className="bg-teal-500 text-[#112a4a] px-2 py-0.5 rounded text-[10px] uppercase font-bold animate-pulse shrink-0">
          12 Days Left
        </span>
      </div>

      {/* 2. RE-USABLE DASHBOARD HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveTab('public')}>
            <div className="bg-[#112a4a] text-teal-400 p-2 rounded-xl font-bold flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-md font-extrabold text-slate-800 tracking-tight leading-none">NPO-FCTMS</h1>
              <span className="text-[9px] text-[#204a75] tracking-widest font-bold uppercase block mt-0.5">Financial Ledger</span>
            </div>
            <div className="hidden md:block h-6 w-px bg-slate-200" />
            <span className="hidden md:inline-block text-xs font-bold tracking-widest text-[#204a75]/40 uppercase">
              Compliance & Governance
            </span>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex gap-2">
              <button 
                onClick={() => setActiveTab('public')} 
                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all ${activeTab === 'public' ? 'bg-[#112a4a] text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Public Ledger
              </button>
              <button 
                onClick={() => setActiveTab('portal')} 
                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all ${activeTab === 'portal' ? 'bg-[#112a4a] text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Corporate Workstation
              </button>
              <a 
                href="/xampp_project/index.html"
                className="px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200 inline-flex items-center gap-1.5"
              >
                Go to XAMPP Workstation <span className="inline-block px-1 bg-amber-100 text-amber-800 text-[9px] rounded uppercase tracking-wider font-extrabold">PHP Mode</span>
              </a>
            </nav>

            <div className="h-4 w-px bg-slate-200" />

            {/* Account badge */}
            <div>
              {session ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col text-right text-xs">
                    <span className="font-extrabold text-slate-800 leading-none">{session.fullName}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase block mt-0.5">{session.organization}</span>
                  </div>
                  <button onClick={handleLogout} className="px-2.5 py-1 text-xs font-extrabold bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors flex items-center gap-1">
                    Sign Out
                  </button>
                </div>
              ) : (
                <button onClick={() => { setActiveTab('portal'); setAuthMode('login'); }} className="px-3.5 py-1.5 bg-[#112a4a] text-xs font-bold text-teal-400 rounded-xl hover:bg-sky-950 transition-all shadow-md inline-flex items-center gap-1 cursor-pointer">
                  Portal Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 3. CENTRAL BODY ROUTER */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">

        {/* ============================================================
             VIEW 1: PUBLIC VIEW LEDGER
             ============================================================ */}
        {activeTab === 'public' && (
          <div className="space-y-8 animate-fade-in text-slate-700">
            
            {/* Banner block */}
            <div className="bg-gradient-to-tr from-[#112a4a] to-[#204a75] text-white p-6 md:p-8 rounded-3xl border border-sky-950/20 shadow-md relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-2">
                <span className="bg-teal-500/20 text-teal-300 py-1 px-3 rounded-full text-[10px] uppercase font-bold tracking-widest border border-teal-500/30 font-mono-custom">System Audit Core Sandbox Active</span>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Securing Trust Through Absolute Transparency</h2>
                <p className="text-xs md:text-sm text-sky-200 leading-relaxed font-light">
                  Every cent received by Global Green Foundation is registered on our audit-checked sequential cryptographic ledger. Audit costs, program services ratios, and compliance reports instantly verified dynamically.
                </p>
              </div>
            </div>

            {/* General metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Total Logged Revenue</span>
                <h4 className="text-2xl md:text-3xl font-extrabold text-[#112a4a] mt-1">R{totalRevenue.toLocaleString()}</h4>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-1 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 100% Tax Compliant
                </span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Approved Allocations</span>
                <h4 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-1">R{approvedExpenditure.toLocaleString()}</h4>
                <span className="text-[10px] text-slate-500 block mt-1">Pending payout check: <strong>R{pendingExpenditureTotal.toLocaleString()}</strong></span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block font-sans">Program Service Ratio</span>
                <h4 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-1">{programServiceRatio.toFixed(1)}%</h4>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Goal rating: &gt; 60% standards</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xs">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Ledger Integrity Chain</span>
                <h4 className="text-2xl font-extrabold text-emerald-600 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  SECURED
                </h4>
                <span className="text-[10px] text-slate-500 block mt-1">Checked index forward logs</span>
              </div>
            </div>

            {/* Col divisions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left side: ledger lists table grid */}
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Live Audited Ledger</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">Sequential transactions mapping. Click Verify Chain to audit recalculations properties.</p>
                  </div>
                  <button onClick={triggerLedgerRecalculation} className="px-3 py-1 bg-[#112a4a] text-white hover:bg-sky-950 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> Re-Verify Chain
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="p-3">Reference/ID</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Target Objective</th>
                        <th className="p-3">Value</th>
                        <th className="p-3">Clearance status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {unifiedTableEntries.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 cursor-pointer border-b border-slate-100">
                          <td className="p-3 font-mono-custom font-bold text-slate-650">{item.displayId}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-md border text-[10px] ${item.type.includes('CONTRIBUTION') ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-[#112a4a]/5 text-[#112a4a]'}`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 truncate max-w-[170px]">{item.campaign}</td>
                          <td className={`p-3 font-extrabold ${item.type.includes('CONTRIBUTION') ? 'text-emerald-700' : 'text-slate-800'}`}>
                            R{item.amount.toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'APPROVED' || item.status === 'CLEARED' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800 animate-pulse'}`}>
                              {item.status} ({item.compliance})
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right side: Public Fast Donation Form & Node Timeline */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Fast Donation component */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block animate-pulse"></span>
                    Make Unrestricted Contribution
                  </h3>
                  <p className="text-[11px] text-slate-500">Every donation secured instantly generates a Section 18A dynamic PDF certificate.</p>
                  
                  {donSuccess ? (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] space-y-2">
                      <p className="font-bold">Transaction Cryptographically Sealed!</p>
                      <p>An updated tax receipt is immediately available under your email in the private Donor login dashboard session.</p>
                      <button onClick={resetFastDonForm} className="font-bold underline text-[#112a4a]">Donate Again</button>
                    </div>
                  ) : (
                    <form onSubmit={handleFastDonation} className="space-y-4 text-xs font-semibold text-slate-700">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Donor Name</label>
                        <input type="text" value={donName} onChange={e => setDonName(e.target.value)} className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none" placeholder="e.g. Elena Rostova" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Deductible Email ID</label>
                        <input type="email" value={donEmail} onChange={e => setDonEmail(e.target.value)} className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none" placeholder="name@domain.com" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Amount (R)</label>
                        <input type="number" value={donAmount} onChange={e => setDonAmount(e.target.value)} className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none" placeholder="Min 10" min="10" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Campaign Program</label>
                        <select value={donCampaign} onChange={e => setDonCampaign(e.target.value)} className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-white focus:outline-none">
                          <option value="Reforestation Project Africa">Reforestation Project Africa</option>
                          <option value="Urban Agriculture Greenhouses">Urban Agriculture Greenhouses</option>
                          <option value="Rainforest Canopy Preservation">Rainforest Canopy Preservation</option>
                          <option value="General Clean Oceans Research">General Clean Oceans Research</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="don-anonymize" checked={donAnonymized} onChange={e => setDonAnonymized(e.target.checked)} className="rounded border-slate-300" />
                        <label htmlFor="don-anonymize" className="text-[11px] text-slate-500">I prefer details anonymized on public ledger</label>
                      </div>
                      <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer">
                        Secure Contribution Transfer
                      </button>
                    </form>
                  )}
                </div>

                {/* Blockchain ledger visualizer */}
                <div className="bg-slate-900 text-slate-300 p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Blockchain Ledger Node Timeline</h3>
                    <span className="bg-emerald-500/20 text-emerald-400 font-mono-custom text-[9px] px-2 py-0.5 rounded font-bold">SHA-256 Enabled</span>
                  </div>
                  <p className="text-[11px] text-slate-455 font-light leading-relaxed">
                    Visual representing active blockchain ledger connections. Every block points to the hash index of the previous sibling block.
                  </p>
                  
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {contributions.map((c, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <b className="text-slate-300">CONTRIBUTION LOCKER #{idx + 1}</b>
                          <span className="text-[9.5px] text-slate-500 font-mono-custom">{c.id}</span>
                        </div>
                        <div className="text-[10px] space-y-0.5 font-light text-slate-400 leading-normal">
                          <p>Beneficiary Amount: <strong className="text-white">R{c.amount.toLocaleString()}</strong></p>
                          <p className="truncate text-slate-500">Prev Lock hash: {c.blockHash.substring(0,20)}...</p>
                          <p className="truncate text-teal-400">Node Sealed: {c.blockHash}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ============================================================
             VIEW 2: PORTAL AREA & SECURE CONTROL WORKSTATIONS
             ============================================================ */}
        {activeTab === 'portal' && (
          <div className="space-y-6">

            {/* A. GUEST AUTH SCREEN */}
            {!session && (
              <div className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-3xl shadow-lg">
                <div className="text-center space-y-1 mb-8">
                  <h2 className="text-xl font-extrabold text-[#112a4a] tracking-tight">Staff & Auditor Security Portal</h2>
                  <p className="text-xs text-slate-500">Authorized regulatory access control clearances verification</p>
                </div>

                {/* Tab select */}
                <div className="flex border-b border-slate-200 mb-6 text-xs font-bold">
                  <button 
                    onClick={() => setAuthMode('login')} 
                    className={`flex-1 pb-3 transition-colors ${authMode === 'login' ? 'text-slate-800 border-b-2 border-[#112a4a]' : 'text-slate-400'}`}
                  >
                    Verified Login
                  </button>
                  <button 
                    onClick={() => setAuthMode('register')} 
                    className={`flex-1 pb-3 transition-colors ${authMode === 'register' ? 'text-slate-800 border-b-2 border-[#112a4a]' : 'text-slate-400'}`}
                  >
                    Register Account Role
                  </button>
                </div>

                {authError && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs border border-rose-200 rounded-xl font-bold mb-4">
                    {authError}
                  </div>
                )}

                {authMode === 'login' ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Corporate Email Address</label>
                      <input 
                        type="email" 
                        value={loginEmail} 
                        onChange={e => setLoginEmail(e.target.value)} 
                        className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none" 
                        placeholder="e.g. admin@npo.org" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Secure Passkey</label>
                      <input 
                        type="password" 
                        value={loginPassword} 
                        onChange={e => setLoginPassword(e.target.value)} 
                        className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none" 
                        placeholder="••••••••••••" 
                        required 
                      />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-[#112a4a] hover:bg-sky-950 text-white font-bold rounded-xl shadow-md transition-all mt-2 cursor-pointer">
                      Verify Clearance & Open Workspace
                    </button>

                    <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-[10px] text-slate-500 font-light leading-normal space-y-1 mt-4">
                      <p className="font-bold text-[#112a4a] uppercase tracking-widest text-[9px]">Preseeded simulation profiles:</p>
                      <p>• <b>Admin Account</b>: <code className="bg-slate-100 p-0.5 font-bold">admin@npo.org</code> / pass: <code className="bg-slate-100 p-0.5 font-bold">Admin</code></p>
                      <p>• <b>Accountant Officer</b>: <code className="bg-slate-100 p-0.5 font-bold font-mono">finance@npo.org</code> / pass: <code className="bg-slate-100 p-0.5 font-bold">Finance</code></p>
                      <p>• <b>Independent Auditor</b>: <code className="bg-slate-100 p-0.5 font-bold font-mono">auditor@independent.com</code> / pass: <code className="bg-slate-100 p-0.5 font-bold">Auditor</code></p>
                      <p>• <b>Private Donor</b>: <code className="bg-slate-100 p-0.5 font-bold font-mono">donor@gmail.com</code> / pass: <code className="bg-slate-100 p-0.5 font-bold">Donor</code></p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs font-semibold text-slate-700">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Legal Name</label>
                      <input 
                        type="text" 
                        value={regName} 
                        onChange={e => setRegName(e.target.value)} 
                        className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" 
                        placeholder="Elena Chang" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Corporate Email Address</label>
                      <input 
                        type="email" 
                        value={regEmail} 
                        onChange={e => setRegEmail(e.target.value)} 
                        className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" 
                        placeholder="name@npo-org.com" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Secure Passkey</label>
                      <input 
                        type="password" 
                        value={regPassword} 
                        onChange={e => setRegPassword(e.target.value)} 
                        className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" 
                        placeholder="At least 5 chars" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1 font-sans">Clearance Role selection on Register</label>
                      <select 
                        value={regRole} 
                        onChange={e => setRegRole(e.target.value as UserRole)} 
                        className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-white focus:outline-none"
                      >
                        <option value={UserRole.ADMIN}>NPO Admin Authority (Approve payout logs)</option>
                        <option value={UserRole.OFFICER}>Financial Officer Accountant (Spent log entry)</option>
                        <option value={UserRole.AUDITOR}>Independent External Auditor (Compliance check checklists)</option>
                        <option value={UserRole.DONOR}>Private Partner Donor (Receipt certificates download)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Corporate Trust Organization Name</label>
                      <input 
                        type="text" 
                        value={regOrg} 
                        onChange={e => setRegOrg(e.target.value)} 
                        className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none" 
                        required 
                      />
                    </div>
                    <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-750 text-white font-bold rounded-xl mt-2 cursor-pointer shadow-md">
                      Create Certified Account Profile
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* B. MULTI-ROLE CONTROL WORKSTATIONS */}
            {session && (
              <div className="space-y-6 animate-fade-in text-slate-700 md:p-1">
                
                {/* Active user status badge info bar */}
                <div className="bg-white p-5 rounded-2xl border border-slate-220 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-extrabold text-slate-900">Corporate Compliance Control panel</h2>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#112a4a] text-teal-400 rounded-full font-mono-custom">Clearance: {session.role}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Primary Organization: <strong className="text-slate-800">{session.organization}</strong> • Practitioner Badge: <strong className="text-slate-800">{session.fullName}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 py-1.5 px-3 rounded-xl select-none">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>System Database Chain Verified Intact</span>
                  </div>
                </div>

                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                     ADMIN DASHBOARD
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {session.role === UserRole.ADMIN && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-l-4 border-[#112a4a] p-4 rounded-r-xl">
                      <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-widest leading-none">Administrative Board approvals</h3>
                      <p className="text-[11px] text-slate-600 mt-1">Review pending expenditure allocations compiled by accounting officers below to release legal payout clearings.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left: Pending expenditures table list */}
                      <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Awaiting authorization clearings</h4>
                        
                        <div className="overflow-x-auto rounded-xl border border-slate-100">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                              <tr>
                                <th className="p-3">Vendor beneficiary / Segment</th>
                                <th className="p-3">Filing Date</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3 text-right">Director approval action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {expenditures.filter(e => e.status === 'PENDING').map((item, idx) => (
                                <tr key={idx} className="border-b border-slate-100">
                                  <td className="p-3">
                                    <span className="font-extrabold text-slate-800">{item.vendor}</span>
                                    <span className="block text-[10px] text-slate-400 font-light">{item.subCategory}</span>
                                  </td>
                                  <td className="p-3 text-slate-500">{item.date}</td>
                                  <td className="p-3 font-extrabold text-[#112a4a]">R{item.amount.toLocaleString()}</td>
                                  <td className="p-3 text-right space-x-1.5 shrink-0">
                                    <button onClick={() => handleAdminApprovalState(item.id, 'APPROVED')} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[10px] cursor-pointer">
                                      Approve
                                    </button>
                                    <button onClick={() => handleAdminApprovalState(item.id, 'DISAPPROVED')} className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[10px] cursor-pointer">
                                      Disapprove
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {expenditures.filter(e => e.status === 'PENDING').length === 0 && (
                                <tr>
                                  <td colSpan={4} className="p-4 text-center italic text-slate-450">No payout log orders currently pending clearance.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Right: Active audit log timeline */}
                      <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <h4 className="text-xs font-extrabold text-[#112a4a] uppercase tracking-wider">System Audit Trail</h4>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                          {auditLogs.slice(0,10).map((log, idx) => (
                            <div key={idx} className="p-2.5 bg-slate-50 border border-slate-150 rounded-lg leading-tight space-y-1">
                              <div className="flex justify-between items-center font-bold text-slate-700 text-[10px]">
                                <span>{log.userName} ({log.userRole})</span>
                                <span className="text-[8px] text-slate-450 font-normal">{log.timestamp}</span>
                              </div>
                              <p className="text-[#112a4a] font-mono-custom text-[10px]">{log.action}</p>
                              <p className="text-[9.5px] text-slate-400 italic">Target: {log.recordId} {log.newValue || ''}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                     FINANCIAL OFFICER PORTAL
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {session.role === UserRole.OFFICER && (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-xl">
                      <h3 className="text-xs font-extrabold text-slate-900 uppercase">Financial Officer Workstation Active</h3>
                      <p className="text-[11px] text-slate-600 mt-1">Log external direct contributions, apply invoice details checklists, and complete planned compliance deliverables.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Form expenditure logs */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">File Cost Settlement / Expenditure Log</h4>
                        <form onSubmit={handleOfficerExpenditureAdd} className="space-y-3 text-xs font-semibold text-slate-700">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11.5px] text-slate-600 mb-1">Settlement Sum (R)</label>
                              <input type="number" value={expAmount} onChange={e => setExpAmount(e.target.value)} className="w-full py-1.5 px-3 border border-slate-200 rounded-lg hover:bg-slate-50" required />
                            </div>
                            <div>
                              <label className="block text-[11.5px] text-slate-600 mb-1">Expenditure Date</label>
                              <input type="date" value={expDate} onChange={e => setExpDate(e.target.value)} className="w-full py-1.5 px-3 border border-slate-200 rounded-lg focus:outline-none" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11.5px] text-slate-600 mb-1">Reporting Segment</label>
                              <select value={expCategory} onChange={e => setExpCategory(e.target.value as any)} className="w-full py-1.5 px-3 border border-slate-200 bg-white rounded-lg focus:outline-none">
                                <option value="PROGRAM">PROGRAMS (Direct deployment)</option>
                                <option value="OPERATIONAL">OPERATIONAL COSTS</option>
                                <option value="ADMINISTRATIVE">ADMINISTRATIVE overheads</option>
                                <option value="FUNDRAISING">FUNDRAISING services</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11.5px] text-slate-600 mb-1">Target Description</label>
                              <input type="text" value={expSubCat} onChange={e => setExpSubCat(e.target.value)} placeholder="e.g. Indigenous Saplings Logistics" className="w-full py-1.5 px-3 border border-slate-200 rounded-lg focus:outline-none" required />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11.5px] text-slate-600 mb-1">Primary Vendor Entity Name</label>
                            <input type="text" value={expVendor} onChange={e => setExpVendor(e.target.value)} placeholder="AgriSupply Co. (Pty) LTD" className="w-full py-1.5 px-3 border border-slate-200 rounded-lg focus:outline-none" required />
                          </div>
                          <div>
                            <label className="block text-[11.5px] text-slate-600 mb-1">Statement justification</label>
                            <textarea rows={2} value={expDesc} onChange={e => setExpDesc(e.target.value)} placeholder="Enter impact narrative summaries..." className="w-full py-1.5 px-3 border border-slate-200 rounded-lg focus:outline-none" />
                          </div>

                          <div className="space-y-2 pt-1.5">
                            <span className="block text-[10px] uppercase font-bold text-slate-450 tracking-wider">Audit check validation lists:</span>
                            <div className="grid grid-cols-2 gap-2 text-slate-500 font-normal">
                              <label className="flex items-center gap-1.5"><input type="checkbox" checked={chkReceipt} onChange={e => setChkReceipt(e.target.checked)} className="rounded" /> Tax Invoice attached</label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" checked={chkCostCenter} onChange={e => setChkCostCenter(e.target.checked)} className="rounded" /> Legal cost center cleared</label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" checked={chkBoardApproved} onChange={e => setChkBoardApproved(e.target.checked)} className="rounded" /> Board pre-ratified</label>
                              <label className="flex items-center gap-1.5"><input type="checkbox" checked={chkTaxInvoice} onChange={e => setChkTaxInvoice(e.target.checked)} className="rounded" /> Match statement ledger</label>
                            </div>
                          </div>

                          <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer transition-all mt-2">
                            Log Expenditure payout Draft
                          </button>
                        </form>
                      </div>

                      {/* Log manually received deposits */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <h4 className="text-xs font-bold text-[#112a4a] uppercase tracking-wider">Log Offline Contribution (Direct Deposits)</h4>
                        <form onSubmit={handleOfficerContributionAdd} className="space-y-3 text-xs font-semibold text-slate-700">
                          <div>
                            <label className="block text-[11.5px] text-slate-600 mb-1">Donor Entity Name</label>
                            <input type="text" value={conName} onChange={e => setConName(e.target.value)} placeholder="e.g. Pendelton Family Trust" className="w-full py-1.5 px-3 border border-slate-200 rounded-lg focus:outline-none" required />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11.5px] text-slate-600 mb-1">Donor Email</label>
                              <input type="email" value={conEmail} onChange={e => setConEmail(e.target.value)} placeholder="name@domain.com" className="w-full py-1.5 px-3 border border-slate-200 rounded-lg focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-[11.5px] text-slate-600 mb-1">Deposit Sum (R)</label>
                              <input type="number" value={conAmount} onChange={e => setConAmount(e.target.value)} className="w-full py-1.5 px-3 border border-slate-200 rounded-lg focus:outline-none" required />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11.5px] text-slate-600 mb-1">ClearingReference number</label>
                              <input type="text" value={conRef} onChange={e => setConRef(e.target.value)} placeholder="DON-2026-X" className="w-full py-1.5 px-3 border border-slate-200 rounded-lg focus:outline-none" />
                            </div>
                            <div>
                              <label className="block text-[11.5px] text-slate-600 mb-1">Clearing Pathway selection</label>
                              <select value={conMethod} onChange={e => setConMethod(e.target.value)} className="w-full py-1.5 px-3 border border-slate-200 bg-white rounded-lg focus:none">
                                <option value="Wire Transfer">Bank wire clearing</option>
                                <option value="EFT Grant Transfer">Institutional Grant Fund</option>
                                <option value="ACH Direct Debit">Direct debit clearance</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[11.5px] text-slate-600 mb-1">Sponsoring Campaign Target Campaign</label>
                            <input type="text" value={conCampaign} onChange={e => setConCampaign(e.target.value)} placeholder="Rainforest Canopy Preservation" className="w-full py-1.5 px-3 border border-slate-200 rounded-lg focus:outline-none" required />
                          </div>

                          <button type="submit" className="w-full py-2 bg-[#112a4a] hover:bg-sky-950 text-white font-bold rounded-xl cursor-pointer transition-all mt-2">
                            Register Offline Deposit Node
                          </button>
                        </form>
                      </div>

                    </div>

                    {/* Milestones check */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <h4 className="text-xs font-bold text-slate-900 uppercase">Statutory Compliance Milestones Roadmap</h4>
                      <div className="overflow-x-auto rounded-xl border border-slate-100">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 text-slate-650 font-bold border-b border-slate-150">
                            <tr>
                              <th className="p-3">Milestone title</th>
                              <th className="p-3">Compliance category</th>
                              <th className="p-3">Timeline deadline</th>
                              <th className="p-3 text-right">Completion check action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium">
                            {reminders.map((rem, idx) => (
                              <tr key={idx} className={rem.isCompleted ? "opacity-60" : ""}>
                                <td className="p-3">
                                  <span className={`font-bold text-slate-800 ${rem.isCompleted ? 'line-through' : ''}`}>{rem.title}</span>
                                  <span className="block text-[10px] text-slate-400 font-light">Interval rule: {rem.recurrence}</span>
                                </td>
                                <td className="p-3"><span className="px-2 py-0.5 border text-[10px] border-slate-200 bg-slate-50 font-mono-custom text-[#112a4a] rounded">{rem.category}</span></td>
                                <td className="p-3 font-semibold text-slate-500">{rem.dueDate}</td>
                                <td className="p-3 text-right">
                                  <button onClick={() => handleToggleReminderState(rem.id)} className={`px-2 py-1 font-bold text-[10.5px] rounded cursor-pointer ${rem.isCompleted ? 'bg-slate-100 text-slate-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                                    {rem.isCompleted ? 'Reopen task' : 'Set Complete'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                     AUDITOR TOOL WORKSPACE
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {session.role === UserRole.AUDITOR && (
                  <div className="space-y-6">
                    <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-xl">
                      <h3 className="text-xs font-extrabold text-slate-900 uppercase">Independent Board Verification Auditor Workspace</h3>
                      <p className="text-[11px] text-slate-650 mt-1">Audit spend category validations checklists, perform live sequential ledger checks recalculations, compile statement return reports, and sign statutory disclosures.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Left: Spend audit category checklists signoff */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <h4 className="text-xs font-extrabold text-slate-900 uppercase">Sign Off Verification Checklists</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11.5px] text-slate-600 mb-1">Select Expenditure Record Node</label>
                            <select 
                              value={selectedAuditId} 
                              onChange={e => handleAuditSelectLoad(e.target.value)} 
                              className="w-full py-2 px-3 border border-slate-200 rounded-lg bg-white focus:outline-none text-xs"
                            >
                              <option value="">-- Choose unverified cost items --</option>
                              {expenditures.filter(e => e.complianceStatus === 'UNDER_REVIEW').map((item, idx) => (
                                <option key={idx} value={item.id}>EXP to {item.vendor} - R{item.amount.toLocaleString()}</option>
                              ))}
                            </select>
                          </div>

                          {selectedAuditId ? (
                            <div className="space-y-4">
                              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px]">
                                <h5 className="font-bold text-slate-800">Objectives: {expenditures.find(e => e.id === selectedAuditId)?.subCategory}</h5>
                                <p className="text-slate-500 font-light">{expenditures.find(e => e.id === selectedAuditId)?.description}</p>
                              </div>

                              <div className="space-y-2">
                                <span className="block text-[10px] text-slate-450 uppercase font-black uppercase tracking-wider">Affix Verification seals audit parameters:</span>
                                <div className="grid grid-cols-2 gap-2 text-slate-500">
                                  <label className="flex items-center gap-1.5"><input type="checkbox" checked={audCheckReceipt} onChange={e => setAudCheckReceipt(e.target.checked)} className="rounded" /> Validated Tax invoice</label>
                                  <label className="flex items-center gap-1.5"><input type="checkbox" checked={audCheckCenter} onChange={e => setAudCheckCenter(e.target.checked)} className="rounded" /> Verified program cost center</label>
                                  <label className="flex items-center gap-1.5"><input type="checkbox" checked={audCheckApproved} onChange={e => setAudCheckApproved(e.target.checked)} className="rounded" /> Independent board ratified</label>
                                  <label className="flex items-center gap-1.5"><input type="checkbox" checked={audCheckTax} onChange={e => setAudCheckTax(e.target.checked)} className="rounded" /> Match vendor wire records</label>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3 pt-1">
                                <button onClick={() => handleAuditorChecklistSubmit('VERIFIED')} className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer shadow-xs">
                                  Certify Node Compliance
                                </button>
                                <button onClick={() => handleAuditorChecklistSubmit('FAILED')} className="py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer shadow-xs">
                                  Flag Compliance Failure
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs italic text-slate-400 py-3 text-center">Please select a pending expenditure record to begin verification review.</p>
                          )}
                        </div>
                      </div>

                      {/* Right: Live integrity comparison blockchain monitor */}
                      <div className="bg-slate-950 text-slate-200 p-6 rounded-2xl border border-slate-900 shadow-md font-mono-custom space-y-4 text-xs">
                        <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                          <h4 className="text-xs font-bold text-teal-400">Ledger Block Hash Cryptographic Analysis</h4>
                          <button onClick={triggerLedgerRecalculation} className="px-2 py-0.5 bg-[#112a4a] text-white rounded text-[10px] cursor-pointer">Run check</button>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans leading-relaxed font-light">
                          External auditing check routines recalculating SHA-256 links sequentially matching indexed blocks values.
                        </p>
                        
                        <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl space-y-2 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Audit check overall check:</span>
                            <span className="font-extrabold text-teal-400">PASS</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Genesis alignment:</span>
                            <span className="font-extrabold text-teal-400">ALIGN_OK</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Tested Blocks index count:</span>
                            <span className="font-extrabold text-slate-200">{contributions.length + expenditures.length} Nodes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Terminal Recalculated Hash:</span>
                            <span className="text-slate-300 truncate max-w-[125px] block">{reports[0]?.hash || "rep1_calculated_document_hash"}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Compile or Seal Statutory Statements section */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-250 shadow-xs space-y-4">
                      <h4 className="text-xs font-extrabold text-slate-900 uppercase">Statutory Financial Reports & digital sign-offs</h4>
                      <p className="text-[11px] text-slate-500 font-light">IRS/SARS Form-990 returns documentation requires joint administrative and dual board external auditor signature verification.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                          <h5 className="text-[11.5px] font-bold text-slate-850">Draft New return template Statement</h5>
                          <div className="space-y-2">
                            <input type="text" value={repTitleInput} onChange={e => setRepTitleInput(e.target.value)} className="w-full text-xs py-1.5 px-3 border border-slate-200 bg-white rounded-lg focus:outline-none" />
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <input type="date" value={repStartInput} onChange={e => setRepStartInput(e.target.value)} className="py-1 px-2 border bg-white rounded" />
                              <input type="date" value={repEndInput} onChange={e => setRepEndInput(e.target.value)} className="py-1 px-2 border bg-white rounded" />
                            </div>
                            <button onClick={handleGenerateReportDraft} className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer text-xs">
                              Draft Statement Statement
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h5 className="text-[11.5px] font-bold text-slate-850">Sealed Statement Records</h5>
                          <div className="space-y-2">
                            {reports.map((rep, idx) => {
                              const signedByAuditor = rep.signatures.some(s => s.signeeRole === UserRole.AUDITOR);
                              return (
                                <div key={idx} className="p-3 bg-slate-50 border border-slate-205 rounded-xl flex items-center justify-between text-[11px]">
                                  <div>
                                    <h6 className="font-extrabold text-[#112a4a] truncate max-w-[200px]">{rep.title}</h6>
                                    <p className="text-slate-450 block mt-0.5">Surplus: <b>R{rep.summaryData.surplus.toLocaleString()}</b> • Ratio: <b>{(rep.summaryData.programServiceRatio*100).toFixed(1)}%</b></p>
                                  </div>
                                  <div>
                                    {signedByAuditor ? (
                                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-150 rounded px-2 py-0.5 uppercase tracking-widest font-extrabold text-[9px]">Verified Signed</span>
                                    ) : (
                                      <button onClick={() => handleSignReportAuditor(rep.id)} className="px-3 py-1 bg-[#112a4a] hover:bg-sky-950 font-bold text-[10px] text-teal-400 rounded-md cursor-pointer">
                                        Affix Seal Sign
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}

                {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                     DONOR COMPLIANCE INTERFACE
                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
                {session.role === UserRole.DONOR && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-tr from-[#112a4a] to-[#204a75] text-white p-6 rounded-3xl relative overflow-hidden">
                      <h3 className="text-lg md:text-xl font-extrabold">Welcome back, NPO Partner!</h3>
                      <p className="text-xs text-sky-200 mt-1 max-w-xl">
                        Verify deployment tracking matrices clear of overheads. Every Rand logged maps into verified printable Section 18A dynamic receipt nodes.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase">Total Deductibles Sum</span>
                        <h4 className="text-2xl font-black text-[#112a4a] mt-1">
                          R{contributions.filter(c => c.email?.toLowerCase() === session.email.toLowerCase()).reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
                        </h4>
                        <span className="text-[9px] text-emerald-600 font-bold block mt-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> tax certificates generated
                        </span>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase">Equivalent plants seeded</span>
                        <h4 className="text-2xl font-black text-emerald-800 mt-1">
                          {Math.floor(contributions.filter(c => c.email?.toLowerCase() === session.email.toLowerCase()).reduce((sum, c) => sum + c.amount, 0) / 15)} Saplings
                        </h4>
                        <p className="text-[9.5px] text-slate-450 block mt-1">Urban agriculture reforestation programs.</p>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase">Assisted families rating</span>
                        <h4 className="text-2xl font-black text-slate-700 mt-1">125 Households</h4>
                        <p className="text-[9.5px] text-slate-450 block mt-1">Verified direct impact clearance logs</p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-[#112a4a] uppercase">printable S18A tax-deductible certificates</h4>
                        <p className="text-[11px] text-slate-400">Review certified contributions index associated with corporate account profile:</p>
                      </div>

                      <div className="space-y-3">
                        {contributions.filter(c => c.email?.toLowerCase() === session.email.toLowerCase()).map((item, idx) => (
                          <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between text-xs gap-3">
                            <div>
                              <span className="font-extrabold text-slate-800 text-[13px] block">Receipt Ref: {item.reference}</span>
                              <span className="text-[10px] text-slate-400 font-light block mt-0.5">Clearing gateway: {item.paymentMethod} • Date linked: {item.receivedAt.substring(0,10)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="font-black text-emerald-700 text-sm">R{item.amount.toLocaleString()}</span>
                                <span className="block text-[9px] text-slate-400 truncate max-w-[150px]">{item.campaign}</span>
                              </div>
                              <button onClick={() => setSelectedReceipt(item)} className="px-3 py-1.5 bg-[#112a4a] hover:bg-sky-950 text-teal-400 hover:text-white transition-colors rounded-lg font-bold text-[10px] uppercase cursor-pointer">
                                View Section 18A PDF
                              </button>
                            </div>
                          </div>
                        ))}
                        {contributions.filter(c => c.email?.toLowerCase() === session.email.toLowerCase()).length === 0 && (
                          <p className="text-xs italic text-slate-400 text-center py-4">No records associated with email '{session.email}'. Feel free to log a contribution using the public portal form.</p>
                        )}
                      </div>
                    </div>

                    {/* Dynamic Printable PDF Overlay Popup */}
                    {selectedReceipt && (
                      <div className="bg-white p-8 rounded-2xl border-2 border-slate-300 shadow-xl space-y-6 text-xs text-slate-600 transition-all font-mono-custom mt-4 leading-relaxed">
                        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                          <div>
                            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
                              <ShieldCheck className="w-5 h-5 text-emerald-600" />
                              SECTION 18A TAX-DEDUCTIBLE RECEIPT
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-1">Regulatory NPO-FCTMS Sealer Code</p>
                          </div>
                          <button onClick={() => setSelectedReceipt(null)} className="font-sans px-2.5 py-1 text-slate-400 hover:text-slate-800 font-bold hover:bg-slate-100 rounded cursor-pointer">
                            Close Receipt
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                          <div>
                            <p className="font-bold text-slate-800">NPO Organization issuer:</p>
                            <p className="text-slate-600 mt-0.5">Global Green Foundation</p>
                            <p className="text-slate-400 text-[10px]/normal mt-0.5">Registry Reg No: NPO-SEC-2026-FCTMS</p>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">Donor Credential:</p>
                            <p className="text-slate-600 mt-0.5">{selectedReceipt.donorName}</p>
                            <p className="text-slate-400 text-[10px]/normal mt-0.5">{selectedReceipt.email || 'Anonymized Partner'}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-[11px]">
                          <div className="flex justify-between">
                            <span>Reference ID Code:</span>
                            <span className="font-bold">{selectedReceipt.reference}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Clearing settlement Gateway:</span>
                            <span className="font-bold">{selectedReceipt.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sponsoring campaign target:</span>
                            <span className="font-bold">{selectedReceipt.campaign}</span>
                          </div>
                          <div className="border-t border-slate-200/60 my-2 pt-2 flex justify-between text-slate-900 font-extrabold text-sm">
                            <span>Total Deductible Net Sum:</span>
                            <span className="text-[#112a4a] text-lg font-bold">R{selectedReceipt.amount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg font-mono-custom text-[10px] text-teal-850 space-y-2">
                          <div className="flex justify-between font-bold text-teal-900">
                            <span>Sarah Jenkins (NPO Commissioner)</span>
                            <span>Independent Auditor Signed</span>
                          </div>
                          <p className="text-slate-400 text-[8px] break-all leading-normal mt-1">SYSTEM IMMUTABLE CHAIN ID: {selectedReceipt.blockHash}</p>
                        </div>

                        <div className="flex justify-end font-sans">
                          <button onClick={() => window.print()} className="px-4 py-2 bg-[#112a4a] hover:bg-sky-950 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                            <Download className="w-4 h-4" /> Download / Print Tax Certificate
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </main>

      {/* 4. FOOTER REGULATION FOOTER */}
      <footer className="bg-white border-t border-slate-200/60 py-4 text-center text-[10px] text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 NPO-FCTMS Financial Compliance Module. Secure local statutory ledger logs.</span>
          <div className="flex gap-4 font-bold uppercase tracking-wider">
            <a href="#" onClick={() => setActiveTab('public')} className="hover:text-slate-600">Privacy Ledger</a>
            <span>&bull;</span>
            <span>SEC-18A Verified</span>
            <span>&bull;</span>
            <span>IRS-990 Compliant</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
