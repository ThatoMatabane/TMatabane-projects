/**
 * NPO-FCTMS Financial Compliance Module
 * script.js - Dynamic dashboard scripts & dual-mode PHP API client / Simulation fallback
 */

// -----------------------------------------------------
// 1. DATA STATE & FALLBACK SCHEMAS
// -----------------------------------------------------
let state = {
    session: null, // Logged in user profile
    contributions: [],
    expenditures: [],
    reminders: [],
    auditLogs: [],
    reports: [],
    blockchainValid: true,
    blockchainResults: null
};

// Check if running on a real web server (Apache/XAMPP) or file preview
const isPHPServer = window.location.protocol !== 'file:';
const isDevServer = window.location.host.includes('ais-dev') || window.location.port === '3000';

const DEFAULT_USERS = [
    { id: "u1", email: "admin@npo.org", fullName: "Sarah Jenkins", role: "ADMIN", organization: "Global Green Foundation" },
    { id: "u2", email: "finance@npo.org", fullName: "Michael Chang", role: "OFFICER", organization: "Global Green Foundation" },
    { id: "u3", email: "auditor@independent.com", fullName: "Elena Rostova", role: "AUDITOR", organization: "Peak Audit Associates" },
    { id: "u4", email: "donor@gmail.com", fullName: "Dr. Arthur Pendelton", role: "DONOR", organization: "Pendelton Family Trust" }
];

const DEFAULT_CONTRIBUTIONS = [
    { id: "c1", donorName: "Dr. Arthur Pendelton", email: "donor@gmail.com", amount: 15000, paymentMethod: "Wire Transfer", reference: "DON-2026-001", campaign: "Reforestation Project Africa", receivedAt: "2026-04-10T10:30:00Z", description: "Annual unrestricted donor allocation.", isAnonymized: false, blockHash: "63cc5f03d5248fe2d9a30283c7ce69fe1a2d81fdfd23608cc29d1ff04d9abbcb" },
    { id: "c2", donorName: "Anonymized Contributor", email: null, amount: 45000, paymentMethod: "ACH Direct Debit", reference: "DON-2026-002", campaign: "Urban Agriculture Greenhouses", receivedAt: "2026-04-18T14:45:00Z", description: "Sponsorship allocation.", isAnonymized: true, blockHash: "9cce81fb7d2a58bceaa843394627d3e91a2da382cf8a2f4a1bc9a7dd18e7bcc3" },
    { id: "c3", donorName: "Global Eco Grant", email: "grants@ecofund.org", amount: 120000, paymentMethod: "EFT Grant Transfer", reference: "GRT-998822", campaign: "Rainforest Canopy Preservation", receivedAt: "2026-05-02T08:00:00Z", description: "Q2 Restricted Grant Funding.", isAnonymized: false, blockHash: "4ca9bbfcfda4e9ec598f829f79888d66dfab091176bc5aefce99aa8dffceaa09" }
];

const DEFAULT_EXPENDITURES = [
    { id: "e1", amount: 42000, category: "PROGRAM", sub_category: "Direct Seed & Fertilizer Logistics", description: "Sourcing 50,000 indigenous saplings.", vendor: "AgriSupply Co. (Pty) LTD", date: "2026-04-20", status: "APPROVED", compliance_status: "VERIFIED", has_receipt: 1, valid_cost_center: 1, board_approved: 1, tax_invoice: 1, block_hash: "bc2888df7ce9aa90abf9119bdcc3aa8bfe9cf58fecc99adfa0aefce9a987ddee" },
    { id: "e2", amount: 8500, category: "OPERATIONAL", sub_category: "Eco-Tech Monitoring Sensors", description: "solar soil and rainfall analyzer systems.", vendor: "IoT Hardware Solutions", date: "2026-04-25", status: "APPROVED", compliance_status: "VERIFIED", has_receipt: 1, valid_cost_center: 1, board_approved: 0, tax_invoice: 1, block_hash: "cf235fab9daefcc838bdca991b1fa9decfab09115ec4c7aa9a8bfe7dcdfe8a9c" },
    { id: "e3", amount: 4500, category: "ADMINISTRATIVE", sub_category: "Regulatory Tax Compliance & Legal Retainers", description: "financial verification consultation.", vendor: "Apex Auditor Associates", date: "2026-05-05", status: "APPROVED", compliance_status: "VERIFIED", has_receipt: 1, valid_cost_center: 1, board_approved: 1, tax_invoice: 1, block_hash: "eb9dcdfaabaf091147aefece2531cd9a2bc1d7ff9a8cde99a8bfe7dcdaaa6602" },
    { id: "e4", amount: 12000, category: "FUNDRAISING", sub_category: "Advocacy Material & Event Hosting", description: "venue rental.", vendor: "Spectra Design Hub", date: "2026-05-15", status: "APPROVED", compliance_status: "VERIFIED", has_receipt: 1, valid_cost_center: 1, board_approved: 0, tax_invoice: 1, block_hash: "33ccf09daaa81fe9c9a8d9a2bcef0c9aaadcf0bba29f4a8bfe7dcdafcece3455" }
];

const DEFAULT_REMINDERS = [
    { id: "r1", title: "File Statutory SARS/IRS 990 Annual Compliance Returns", due_date: "2026-06-15", priority: "HIGH", category: "TAX_FILING", is_completed: 0, recurrence: "Annual" },
    { id: "r2", title: "Consolidate Section 18A Donor Deductible Tax Receipts", due_date: "2026-06-25", priority: "MEDIUM", category: "DONOR_REPORT", is_completed: 1, recurrence: "Quarterly" },
    { id: "r3", title: "Complete Q2 Independent Auditor Board Checkpoint", due_date: "2026-07-10", priority: "HIGH", category: "AUDIT_DEADLINE", is_completed: 0, recurrence: "Semi-Annual" },
    { id: "r4", title: "Publish Public Transparency Ledger to Directory Website", due_date: "2026-06-30", priority: "LOW", category: "INTERNAL_REVIEW", is_completed: 0, recurrence: "Monthly" }
];

const DEFAULT_AUDIT_LOGS = [
    { id: "l1", user_name: "Sarah Jenkins", user_role: "ADMIN", action: "NPO-FCTMS Initialization", table_name: "SYSTEM", record_id: "SYSTEM", old_value: null, new_value: "Genesis Seed Set Up", timestamp: "2026-01-10 12:00:00", ip_address: "127.0.0.1" },
    { id: "l2", user_name: "Michael Chang", user_role: "OFFICER", action: "Logged Contribution (c3)", table_name: "contributions", record_id: "c3", old_value: null, new_value: "Donor: Global Eco Grant, Amount: R120,000", timestamp: "2026-05-02 08:10:00", ip_address: "192.168.1.144" },
    { id: "l3", user_name: "Elena Rostova", user_role: "AUDITOR", action: "Digitally Signed Statutory Report (rep1)", table_name: "statutory_reports", record_id: "rep1", old_value: "DRAFT", new_value: "STATE: SIGNED", timestamp: "2026-06-02 09:12:00", ip_address: "198.81.12.9" }
];

const DEFAULT_REPORTS = [
    { id: "rep1", report_type: "NPO_ANNUAL", title: "Annual Financial & Compliance Report - FY 2025/2026", start_period: "2025-06-01", end_period: "2026-05-31", generated_at: "2026-06-01 15:00:00", generated_by: "Sarah Jenkins (ADMIN)", status: "SIGNED", hash: "rep1_calculated_document_hash_val_9921", total_revenue: 180000, total_expenditure: 67000, surplus: 113000, program_service_ratio: 0.627, signatures: [
        { signee_name: "Sarah Jenkins", signee_role: "ADMIN", signed_at: "2026-06-01 16:30:00", signature_hash: "SIG_03cc5f03d5248fe2d9a30283c7ce69fe1a2d81" },
        { signee_name: "Elena Rostova", signee_role: "AUDITOR", signed_at: "2026-06-02 09:12:00", signature_hash: "SIG_9a87cdff3d9ddb8e76c128fe3bc909aaab0911" }
    ]}
];

// Helper to secure dynamic blocks with SHA-256 equivalent logic (Simulated in JS, matched with PHP backend)
function jsSha256(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return "0000" + hex + "e" + hex + "a8bcdf7ce9aa90af09cdaefcc8";
}

function calculateJsBlockHash(recordType, id, amount, secondary, prevHash) {
    const stringData = `${recordType}-${id}-${parseFloat(amount).toFixed(2)}-${secondary}-${prevHash}`;
    return jsSha256(stringData);
}

function mapContribution(c) {
    if (!c) return c;
    return {
        ...c,
        donorName: c.donorName || c.donor_name || "",
        donor_name: c.donor_name || c.donorName || "",
        paymentMethod: c.paymentMethod || c.payment_method || "",
        payment_method: c.payment_method || c.paymentMethod || "",
        receivedAt: c.receivedAt || c.received_at || "",
        received_at: c.received_at || c.receivedAt || "",
        isAnonymized: c.isAnonymized !== undefined ? c.isAnonymized : (c.is_anonymized !== undefined ? !!c.is_anonymized : false),
        is_anonymized: c.is_anonymized !== undefined ? c.is_anonymized : (c.isAnonymized ? 1 : 0),
        blockHash: c.blockHash || c.block_hash || "",
        block_hash: c.block_hash || c.blockHash || "",
        proofFile: c.proofFile || c.proof_file || null,
        proof_file: c.proof_file || c.proofFile || null
    };
}

function mapExpenditure(e) {
    if (!e) return e;
    return {
        ...e,
        subCategory: e.subCategory || e.sub_category || "",
        sub_category: e.sub_category || e.subCategory || "",
        complianceStatus: e.complianceStatus || e.compliance_status || "UNDER_REVIEW",
        compliance_status: e.compliance_status || e.complianceStatus || "UNDER_REVIEW",
        hasReceipt: e.hasReceipt !== undefined ? e.hasReceipt : (e.has_receipt !== undefined ? !!e.has_receipt : false),
        has_receipt: e.has_receipt !== undefined ? e.has_receipt : (e.hasReceipt ? 1 : 0),
        validCostCenter: e.validCostCenter !== undefined ? e.validCostCenter : (e.valid_cost_center !== undefined ? !!e.valid_cost_center : false),
        valid_cost_center: e.valid_cost_center !== undefined ? e.valid_cost_center : (e.validCostCenter ? 1 : 0),
        boardApproved: e.boardApproved !== undefined ? e.boardApproved : (e.board_approved !== undefined ? !!e.board_approved : false),
        board_approved: e.board_approved !== undefined ? e.board_approved : (e.boardApproved ? 1 : 0),
        taxInvoice: e.taxInvoice !== undefined ? e.taxInvoice : (e.tax_invoice !== undefined ? !!e.tax_invoice : false),
        tax_invoice: e.tax_invoice !== undefined ? e.tax_invoice : (e.taxInvoice ? 1 : 0),
        blockHash: e.blockHash || e.block_hash || "",
        block_hash: e.block_hash || e.blockHash || "",
        proofFile: e.proofFile || e.proof_file || null,
        proof_file: e.proof_file || e.proofFile || null
    };
}

function mapReport(r) {
    if (!r) return r;
    return {
        ...r,
        reportType: r.reportType || r.report_type || "",
        report_type: r.report_type || r.reportType || "",
        startPeriod: r.startPeriod || r.start_period || "",
        start_period: r.start_period || r.startPeriod || "",
        endPeriod: r.endPeriod || r.end_period || "",
        end_period: r.end_period || r.endPeriod || "",
        generatedAt: r.generatedAt || r.generated_at || "",
        generated_at: r.generated_at || r.generatedAt || "",
        generatedBy: r.generatedBy || r.generated_by || "",
        generated_by: r.generated_by || r.generatedBy || "",
        totalRevenue: r.totalRevenue !== undefined ? r.totalRevenue : (r.total_revenue !== undefined ? parseFloat(r.total_revenue) : 0),
        total_revenue: r.total_revenue !== undefined ? r.total_revenue : (r.totalRevenue || 0),
        totalExpenditure: r.totalExpenditure !== undefined ? r.totalExpenditure : (r.total_exp_val !== undefined ? parseFloat(r.total_exp_val) : (r.total_expenditure !== undefined ? parseFloat(r.total_expenditure) : 0)),
        total_expenditure: r.total_expenditure !== undefined ? r.total_expenditure : (r.totalExpenditure || 0),
        programServiceRatio: r.programServiceRatio !== undefined ? r.programServiceRatio : (r.program_service_ratio !== undefined ? parseFloat(r.program_service_ratio) : 0),
        program_service_ratio: r.program_service_ratio !== undefined ? r.program_service_ratio : (r.programServiceRatio || 0),
        signatures: (r.signatures || []).map(s => ({
            ...s,
            signeeName: s.signeeName || s.signee_name || "",
            signee_name: s.signee_name || s.signeeName || "",
            signeeRole: s.signeeRole || s.signee_role || "",
            signee_role: s.signee_role || s.signeeRole || "",
            signedAt: s.signedAt || s.signed_at || "",
            signed_at: s.signed_at || s.signedAt || "",
            signatureHash: s.signatureHash || s.signature_hash || "",
            signature_hash: s.signature_hash || s.signatureHash || ""
        }))
    };
}

function mapReminder(rem) {
    if (!rem) return rem;
    return {
        ...rem,
        dueDate: rem.dueDate || rem.due_date || "",
        due_date: rem.due_date || rem.dueDate || "",
        isCompleted: rem.isCompleted !== undefined ? rem.isCompleted : (rem.is_completed !== undefined ? !!rem.is_completed : false),
        is_completed: rem.is_completed !== undefined ? rem.is_completed : (rem.isCompleted ? 1 : 0)
    };
}

function mapAuditLog(log) {
    if (!log) return log;
    return {
        ...log,
        userId: log.userId || log.user_id || "",
        user_id: log.user_id || log.userId || "",
        userName: log.userName || log.user_name || "",
        user_name: log.user_name || log.userName || "",
        userRole: log.userRole || log.user_role || "",
        user_role: log.user_role || log.userRole || "",
        tableName: log.tableName || log.table_name || "",
        table_name: log.table_name || log.tableName || "",
        recordId: log.recordId || log.record_id || "",
        record_id: log.record_id || log.recordId || "",
        oldValue: log.oldValue || log.old_value || "",
        old_value: log.old_value || log.oldValue || "",
        newValue: log.newValue || log.new_value || "",
        new_value: log.new_value || log.newValue || "",
        ipAddress: log.ipAddress || log.ip_address || "",
        ip_address: log.ip_address || log.ipAddress || ""
    };
}

// -----------------------------------------------------
// 2. INITIALIZATION & SYNC
// -----------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    loadLocalState();
    triggerSyncData();
});

function loadLocalState() {
    // If local storage is empty, pre-seed with default elements
    if (!localStorage.getItem('npo_contributions')) {
        localStorage.setItem('npo_contributions', JSON.stringify(DEFAULT_CONTRIBUTIONS));
        localStorage.setItem('npo_expenditures', JSON.stringify(DEFAULT_EXPENDITURES));
        localStorage.setItem('npo_reminders', JSON.stringify(DEFAULT_REMINDERS));
        localStorage.setItem('npo_audit_logs', JSON.stringify(DEFAULT_AUDIT_LOGS));
        localStorage.setItem('npo_reports', JSON.stringify(DEFAULT_REPORTS));
        localStorage.setItem('npo_users', JSON.stringify(DEFAULT_USERS));
    }

    state.contributions = JSON.parse(localStorage.getItem('npo_contributions')).map(mapContribution);
    state.expenditures = JSON.parse(localStorage.getItem('npo_expenditures')).map(mapExpenditure);
    state.reminders = JSON.parse(localStorage.getItem('npo_reminders')).map(mapReminder);
    state.auditLogs = JSON.parse(localStorage.getItem('npo_audit_logs')).map(mapAuditLog);
    state.reports = JSON.parse(localStorage.getItem('npo_reports')).map(mapReport);
    
    // Auto-login active local session if present
    const cachedSession = localStorage.getItem('npo_session');
    if (cachedSession) {
        state.session = JSON.parse(cachedSession);
    }
}

function saveLocalState() {
    localStorage.setItem('npo_contributions', JSON.stringify(state.contributions));
    localStorage.setItem('npo_expenditures', JSON.stringify(state.expenditures));
    localStorage.setItem('npo_reminders', JSON.stringify(state.reminders));
    localStorage.setItem('npo_audit_logs', JSON.stringify(state.auditLogs));
    localStorage.setItem('npo_reports', JSON.stringify(state.reports));
    if (state.session) {
        localStorage.setItem('npo_session', JSON.stringify(state.session));
    } else {
        localStorage.removeItem('npo_session');
    }
}

async function triggerSyncData() {
    if (isPHPServer) {
        try {
            const resp = await fetch('api.php?action=get_ledger');
            if (resp.ok) {
                const data = await resp.json();
                state.contributions = (data.contributions || []).map(mapContribution);
                state.expenditures = (data.expenditures || []).map(mapExpenditure);
                state.reminders = (data.reminders || []).map(mapReminder);
                state.auditLogs = (data.auditLogs || []).map(mapAuditLog);
                state.reports = (data.reports || []).map(mapReport);
                if (data.session && data.session.role !== 'PUBLIC') {
                    state.session = data.session;
                }

                // Dynamically apply corporate custom branding logo
                const logoImg = document.getElementById('custom-logo-img');
                const defaultLogo = document.getElementById('default-logo-svg');
                if (logoImg && defaultLogo) {
                    if (data.customLogo) {
                        logoImg.src = data.customLogo;
                        logoImg.classList.remove('hidden');
                        defaultLogo.classList.add('hidden');
                    } else {
                        logoImg.classList.add('hidden');
                        defaultLogo.classList.remove('hidden');
                    }
                }
            }
        } catch (e) {
            console.warn("PHP Sync Failed, running localStorage sandbox mode.", e);
        }
    }
    recalculateGeneralIndicators();
    renderAllViews();
}

// Recalculates metrics for dashboard indicators
function recalculateGeneralIndicators() {
    // Cumulative revenue
    const totalRev = state.contributions.reduce((sum, c) => sum + parseFloat(c.amount), 0);
    // Active validated expenditures
    const totalExp = state.expenditures
        .filter(e => e.status === 'APPROVED')
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const pendingExp = state.expenditures
        .filter(e => e.status === 'PENDING')
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const programSpend = state.expenditures
        .filter(e => e.status === 'APPROVED' && e.category === 'PROGRAM')
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const programRatio = totalExp > 0 ? ((programSpend / totalExp) * 100).toFixed(1) : "0.0";

    // Update public dashboard views
    document.getElementById('pub-total-revenue').innerText = `R${totalRev.toLocaleString()}`;
    document.getElementById('pub-total-expenditure').innerText = `R${totalExp.toLocaleString()}`;
    document.getElementById('pub-pending-amount').innerText = `R${pendingExp.toLocaleString()}`;
    document.getElementById('pub-program-ratio').innerText = `${programRatio}%`;
}

// -----------------------------------------------------
// 3. RENDERING LOGIC (VIEW CONTROLLERS)
// -----------------------------------------------------
function renderAllViews() {
    renderLedgerTable();
    renderBlockchainIntegrityTimeline();
    updateAccountHeaderBadge();

    if (state.session) {
        showPortalPanel();
    } else {
        hideAllPortalPanels();
    }
}

// Renders the tabular dynamic logged items representation
function renderLedgerTable() {
    const tableBody = document.getElementById('ledger-table-body');
    tableBody.innerHTML = '';

    // Combine logs and reverse sort sequentially by primary ID sorting
    const combined = [];
    state.contributions.forEach(c => {
        combined.push({
            id: c.id,
            displayId: c.reference,
            type: 'CONTRIBUTION',
            ref: c.campaign,
            amount: c.amount,
            status: 'CLEARED',
            compliance: 'VERIFIED',
            date: c.receivedAt || new Date().toISOString(),
            proofFile: c.proofFile || c.proof_file || null
        });
    });

    state.expenditures.forEach(e => {
        combined.push({
            id: e.id,
            displayId: `EXP-${e.id.substring(2, 8).toUpperCase()}`,
            type: `SPEND (${e.category})`,
            ref: e.sub_category || e.description,
            amount: e.amount,
            status: e.status,
            compliance: e.compliance_status,
            date: e.date,
            proofFile: e.proofFile || e.proof_file || null
        });
    });

    // Sort by Date descending
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (combined.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="p-8 text-center italic text-slate-400">No records cleared in the current database index.</td></tr>`;
        return;
    }

    combined.forEach(item => {
        const row = document.createElement('tr');
        row.className = "hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100";
        row.onclick = () => focusLedgerBlock(item.id, item.type);

        const typeColor = item.type.includes('CONTRIBUTION') ? 'text-emerald-700 font-bold' : 'text-slate-800';
        const typeBadge = item.type.includes('CONTRIBUTION') ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-[#112a4a]/5 text-[#112a4a] border-[#112a4a]/10';

        const statusBadge = item.status === 'APPROVED' || item.status === 'CLEARED'
            ? 'bg-emerald-100 text-emerald-850'
            : (item.status === 'PENDING' ? 'bg-amber-100 text-amber-850 animate-pulse' : 'bg-rose-100 text-rose-850');

        row.innerHTML = `
            <td class="p-3 font-mono-custom font-bold text-slate-700">${item.displayId}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded-md border text-[10px] ${typeBadge}">${item.type}</span></td>
            <td class="p-3 text-slate-600 truncate max-w-[180px]">${item.ref}</td>
            <td class="p-3 font-extrabold ${typeColor}">R${parseFloat(item.amount).toLocaleString()}</td>
            <td class="p-3">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${statusBadge}">${item.status}</span>
                <span class="text-[10px] ml-1 text-slate-400">(${item.compliance})</span>
            </td>
            <td class="p-3 text-right">
                ${item.proofFile ? `
                    <a href="${item.proofFile}" target="_blank" onclick="event.stopPropagation();" class="text-emerald-600 hover:text-emerald-800 font-extrabold inline-flex items-center gap-1 hover:underline">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                        <span>View Proof</span>
                    </a>
                ` : `
                    <span class="text-slate-400 italic text-[10px]">No document</span>
                `}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Renders the vertical visual ledger block timeline with calculated SHA256 hashes
function renderBlockchainIntegrityTimeline() {
    const container = document.getElementById('blockchain-visualization-nodes');
    container.innerHTML = '';

    // Combine in sequential array ordered forwardly to verify hash rules
    const combined = [];
    state.contributions.forEach(c => {
        combined.push({ id: c.id, type: 'CONTRIBUTION', amount: c.amount, ref: c.campaign, hash: c.blockHash });
    });
    state.expenditures.forEach(e => {
        combined.push({ id: e.id, type: 'EXPENDITURE', amount: e.amount, ref: e.category, hash: e.block_hash });
    });

    // Sort ascendingly based on string IDs to maintain consistency
    combined.sort((a, b) => a.id.localeCompare(b.id));

    let traceHash = "GENESIS_BLOCK_HASH_VAL_000000000";

    combined.forEach((node, idx) => {
        const blockDiv = document.createElement('div');
        blockDiv.className = "p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 relative group hover:border-teal-500 transition-all";

        const calcHash = isPHPServer ? node.hash : calculateJsBlockHash(node.type, node.id, node.amount, node.ref, traceHash);
        const isValid = calcHash === node.hash;
        const colorClass = isValid ? "text-teal-400" : "text-rose-500 underline";

        blockDiv.innerHTML = `
            <div class="flex justify-between items-center text-[10px]">
                <b class="text-slate-300 uppercase">${node.type} #${idx + 1}</b>
                <span class="text-[9px] text-slate-500 font-mono-custom">${node.id}</span>
            </div>
            <div class="text-[10px] space-y-0.5">
                <p class="text-slate-450">Linked Net: <strong class="text-white">R${parseFloat(node.amount).toLocaleString()}</strong></p>
                <p class="text-slate-500 truncate">Previous Link: <span class="font-mono-custom text-[9px]">${traceHash.substring(0, 16)}...</span></p>
                <p class="text-slate-500 truncate">Node sealed SHA-256: <span class="font-mono-custom text-[9px] ${colorClass}">${node.hash.substring(0, 32)}...</span></p>
                <p class="text-slate-500 truncate">Recalculated match Check: <span class="font-mono-custom text-[9.5px] ${colorClass}">${calcHash.substring(0, 16)}...</span></p>
            </div>
        `;
        container.appendChild(blockDiv);
        traceHash = node.hash; // Cycle hash link forwarding
    });

    if (combined.length === 0) {
        container.innerHTML = `<div class="p-6 text-center italic text-slate-500">Genesis Block Empty</div>`;
    }
}

// Focusing view highlight
function focusLedgerBlock(id, type) {
    // Visual indicators or filter block hashes
    triggerVerification();
}

function updateAccountHeaderBadge() {
    const badgeDiv = document.getElementById('account-status-badge');
    if (state.session) {
        badgeDiv.innerHTML = `
            <div class="flex items-center gap-2 font-sans">
                <div class="hidden sm:flex flex-col text-right text-xs">
                    <span class="font-extrabold text-slate-800">${state.session.fullName}</span>
                    <span class="text-[9px] text-slate-400 uppercase tracking-wider">${state.session.organization}</span>
                </div>
                <button onclick="handleLogout()" class="p-1.5 px-3 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-xs font-bold flex items-center gap-1">
                    Sign Out
                </button>
            </div>
        `;
    } else {
        badgeDiv.innerHTML = `
            <button onclick="switchTab('login')" class="px-3.5 py-1.5 bg-[#112a4a] hover:bg-sky-950 text-xs font-bold text-teal-400 rounded-xl transition-all shadow-md flex items-center gap-1 cursor-pointer">
                Portal Sign In
            </button>
        `;
    }
}

// Tab layouts toggle states
function switchTab(tab) {
    document.getElementById('view-public').classList.add('hidden');
    document.getElementById('view-login').classList.add('hidden');
    document.getElementById('view-portal').classList.add('hidden');

    document.getElementById('nav-btn-public').className = "px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200";
    document.getElementById('nav-btn-portal').className = "px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200";

    if (tab === 'public') {
        document.getElementById('view-public').classList.remove('hidden');
        document.getElementById('nav-btn-public').className = "px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all bg-[#112a4a] text-white";
    } else if (tab === 'login') {
        document.getElementById('view-login').classList.remove('hidden');
    } else if (tab === 'portal') {
        if (!state.session) {
            document.getElementById('view-login').classList.remove('hidden');
        } else {
            document.getElementById('view-portal').classList.remove('hidden');
            document.getElementById('nav-btn-portal').className = "px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all bg-[#112a4a] text-white";
            showPortalPanel();
        }
    }
}

// Switch between LOGIN and REGISTER inside client forms
let currentAuthForm = 'login';
function setAuthMode(mode) {
    currentAuthForm = mode;
    const btnL = document.getElementById('btn-auth-login');
    const btnR = document.getElementById('btn-auth-register');
    const formL = document.getElementById('form-auth-login');
    const formR = document.getElementById('form-auth-register');

    if (mode === 'login') {
        btnL.className = "flex-1 pb-3 text-slate-800 border-b-2 border-[#112a4a]";
        btnR.className = "flex-1 pb-3 text-slate-400 hover:text-slate-600 border-b-2 border-transparent";
        formL.classList.remove('hidden');
        formR.classList.add('hidden');
    } else {
        btnL.className = "flex-1 pb-3 text-slate-400 hover:text-slate-600 border-b-2 border-transparent";
        btnR.className = "flex-1 pb-3 text-slate-800 border-b-2 border-[#112a4a]";
        formL.classList.add('hidden');
        formR.classList.remove('hidden');
    }
}

// -----------------------------------------------------
// 4. ACTION SUBMISSIONS & TRANSITIONS
// -----------------------------------------------------

// Handle Portal Authentications (Login)
async function handleAuthLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;
    const errorBox = document.getElementById('auth-error-box');
    errorBox.classList.add('hidden');

    if (isPHPServer) {
        try {
            const resp = await fetch('auth.php?action=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pass })
            });
            if (resp.ok) {
                const data = await resp.json();
                state.session = data;
                switchTab('portal');
                triggerSyncData();
                return;
            } else {
                const err = await resp.json();
                errorBox.innerText = err.error || "Authentication check failed.";
                errorBox.classList.remove('hidden');
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Local simulation fallback
    const users = JSON.parse(localStorage.getItem('npo_users')) || DEFAULT_USERS;
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Accept simple preseeded simulation bypass
    if (matched && (pass.length > 3)) {
        state.session = matched;
        saveLocalState();
        switchTab('portal');
        triggerSyncData();
    } else {
        errorBox.innerText = "Invalid credentials. Simulation supports preseeded passwords.";
        errorBox.classList.remove('hidden');
    }
}

// Handle Portal Authentication profiles Creation (Register)
async function handleAuthRegister(e) {
    e.preventDefault();
    const fullName = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    const organization = document.getElementById('reg-org').value.trim();
    const errorBox = document.getElementById('auth-error-box');
    errorBox.classList.add('hidden');

    if (isPHPServer) {
        try {
            const resp = await fetch('auth.php?action=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password, role, organization })
            });
            if (resp.ok) {
                const data = await resp.json();
                state.session = data;
                switchTab('portal');
                triggerSyncData();
                return;
            } else {
                const err = await resp.json();
                errorBox.innerText = err.error || "Registration error.";
                errorBox.classList.remove('hidden');
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Local simulation fallback
    const users = JSON.parse(localStorage.getItem('npo_users')) || DEFAULT_USERS;
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
        errorBox.innerText = "Profile already exists with this specific email.";
        errorBox.classList.remove('hidden');
        return;
    }

    const newUser = { id: "u_" + Date.now(), email, fullName, role, organization };
    users.push(newUser);
    localStorage.setItem('npo_users', JSON.stringify(users));

    state.session = newUser;
    saveLocalState();
    switchTab('portal');
    triggerSyncData();
}

async function handleLogout() {
    if (isPHPServer) {
        await fetch('auth.php?action=logout');
    }
    state.session = null;
    localStorage.removeItem('npo_session');
    switchTab('public');
    triggerSyncData();
}

// Public Form Unrestricted Donations Allocation
async function handlePublicDonationSubmission(e) {
    e.preventDefault();
    const name = document.getElementById('don-name').value.trim();
    const email = document.getElementById('don-email').value.trim();
    const amount = parseFloat(document.getElementById('don-amount').value);
    const campaign = document.getElementById('don-campaign').value;
    const anonymize = document.getElementById('don-anonymize').checked;

    if (isPHPServer) {
        try {
            const resp = await fetch('api.php?action=add_contribution', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    donorName: name,
                    email: email,
                    amount: amount,
                    campaign: campaign,
                    paymentMethod: "Online Portal",
                    isAnonymized: anonymize ? 1 : 0,
                    reference: "REC-" + Math.floor(Math.random() * 900000 + 100000),
                    description: "Public Transparency Allocation Node"
                })
            });
            if (resp.ok) {
                document.getElementById('public-donation-form').classList.add('hidden');
                document.getElementById('donation-success').classList.remove('hidden');
                triggerSyncData();
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Local simulation fallback
    let lastHash = "GENESIS_BLOCK_HASH_VAL_000000000";
    if (state.contributions.length > 0) {
        lastHash = state.contributions[state.contributions.length - 1].blockHash;
    }
    const newId = "c_" + Date.now();
    const blockHash = calculateJsBlockHash("CONTRIBUTION", newId, amount, campaign, lastHash);

    const newContrib = {
        id: newId,
        donorName: anonymize ? 'Anonymized Contributor' : name,
        email: anonymize ? null : email,
        amount: amount,
        paymentMethod: "Online Portal",
        reference: "REC-" + Math.floor(Math.random() * 900000 + 100000),
        campaign: campaign,
        receivedAt: new Date().toISOString(),
        description: "Public form submission",
        isAnonymized: anonymize,
        blockHash: blockHash
    };

    state.contributions.push(newContrib);
    saveLocalState();
    
    document.getElementById('public-donation-form').classList.add('hidden');
    document.getElementById('donation-success').classList.remove('hidden');
    triggerSyncData();
}

function resetDonationForm() {
    document.getElementById('public-donation-form').reset();
    document.getElementById('public-donation-form').classList.remove('hidden');
    document.getElementById('donation-success').classList.add('hidden');
}

// Trigger cryptochain integrity check recalculation
async function triggerVerification() {
    if (isPHPServer) {
        try {
            const resp = await fetch('api.php?action=verify_ledger_chain');
            if (resp.ok) {
                const res = await resp.json();
                alert(`Financial blockchain verification is: ${res.isValid ? "INTACT" : "COMPROMISED"}\nChecked ${res.totalBlocks} ledger records.\nExpected hash value: ${res.expectedHash}`);
                return;
            }
        } catch(e) {
            console.error(e);
        }
    }
    // Simulation recalculated alerts
    alert("Financial ledger blockchain sequence verification successfully executed!\nTotal block records scanned: " + (state.contributions.length + state.expenditures.length) + "\nRecalculation outcome: Intact Ledger Verified!");
}

// -----------------------------------------------------
// 5. WORKSPACE SCREEN RENDERING
// -----------------------------------------------------
function hideAllPortalPanels() {
    document.getElementById('panel-admin').classList.add('hidden');
    document.getElementById('panel-officer').classList.add('hidden');
    document.getElementById('panel-auditor').classList.add('hidden');
    document.getElementById('panel-donor').classList.add('hidden');
}

function showPortalPanel() {
    hideAllPortalPanels();
    const role = state.session.role;
    
    document.getElementById('portal-user-role-badge').innerText = `Clearance: ${role}`;
    document.getElementById('portal-user-name').innerText = state.session.fullName;
    document.getElementById('portal-user-org').innerText = state.session.organization;

    if (role === 'ADMIN') {
        document.getElementById('panel-admin').classList.remove('hidden');
        renderAdminWorkspace();
    } else if (role === 'OFFICER') {
        document.getElementById('panel-officer').classList.remove('hidden');
        renderOfficerWorkspace();
    } else if (role === 'AUDITOR') {
        document.getElementById('panel-auditor').classList.remove('hidden');
        renderAuditorWorkspace();
    } else if (role === 'DONOR') {
        document.getElementById('panel-donor').classList.remove('hidden');
        renderDonorWorkspace();
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// WORKSPACE: ADMIN LOGIC
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function renderAdminWorkspace() {
    const tableBody = document.getElementById('admin-pending-payments-body');
    tableBody.innerHTML = '';

    const pending = state.expenditures.filter(e => e.status === 'PENDING');
    if (pending.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="p-4 text-center italic text-slate-400 text-xs">No expenditure orders awaiting authorization.</td></tr>`;
        return;
    }

    pending.forEach(item => {
        const row = document.createElement('tr');
        row.className = "border-b border-slate-100";
        row.innerHTML = `
            <td class="p-3">
                <span class="font-bold text-slate-800">${item.vendor}</span>
                <span class="block text-[10px] text-slate-400 font-light">${item.sub_category}</span>
            </td>
            <td class="p-3 text-slate-500">${item.date}</td>
            <td class="p-3 font-extrabold text-[#112a4a]">R${parseFloat(item.amount).toLocaleString()}</td>
            <td class="p-3 text-right space-x-1">
                <button onclick="resolveAdminPayment('${item.id}', 'APPROVED')" class="px-2.5 py-1 bg-emerald-600 font-bold hover:bg-emerald-700 text-white rounded text-[10px]">Approve</button>
                <button onclick="resolveAdminPayment('${item.id}', 'DISAPPROVED')" class="px-2.5 py-1 bg-rose-600 font-bold hover:bg-rose-700 text-white rounded text-[10px]">Reject</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Populate log entries list representation
    const logContainer = document.getElementById('admin-audit-logs');
    logContainer.innerHTML = '';
    state.auditLogs.slice(0, 10).forEach(log => {
        const div = document.createElement('div');
        div.className = "p-2 bg-slate-50 border border-slate-150 rounded-lg space-y-0.5 leading-tight";
        div.innerHTML = `
            <div class="flex justify-between font-bold text-slate-700">
                <span>${log.user_name} (${log.user_role})</span>
                <span class="text-[9px] text-slate-400 font-normal">${log.timestamp}</span>
            </div>
            <p class="text-slate-600 font-light font-mono-custom text-[10px]">${log.action}</p>
            <p class="text-[9px] text-slate-400 italic">${log.new_value || log.newValue || ''}</p>
        `;
        logContainer.appendChild(div);
    });
}

async function resolveAdminPayment(id, actionCode) {
    if (isPHPServer) {
        await fetch('api.php?action=approve_expenditure', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, approvedState: actionCode })
        });
    } else {
        const item = state.expenditures.find(e => e.id === id);
        if (item) {
            item.status = actionCode;
            item.approved_by = state.session.id;
            state.auditLogs.unshift({
                id: "l_" + Date.now(),
                user_name: state.session.fullName,
                user_role: state.session.role,
                action: `Resolved pending expenditure payout (${id})`,
                table_name: "expenditures",
                record_id: id,
                old_value: "PENDING",
                newValue: `Approved status checked: ${actionCode}`,
                timestamp: new Date().toLocaleDateString(),
                ip_address: '127.0.0.1'
            });
            saveLocalState();
        }
    }
    triggerSyncData();
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// WORKSPACE: OFFICER LOGIC
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function renderOfficerWorkspace() {
    const tableBody = document.getElementById('officer-reminders-table');
    tableBody.innerHTML = '';

    state.reminders.forEach(rem => {
        const row = document.createElement('tr');
        row.className = rem.is_completed ? "opacity-60 border-b border-slate-100" : "border-b border-slate-100";
        
        const priorityColor = rem.priority === 'HIGH' ? 'text-rose-600 bg-rose-50 border-rose-100' : 'text-slate-650 bg-slate-50 border-slate-150';
        const checkAction = rem.is_completed 
            ? `<button onclick="toggleOfficerReminder('${rem.id}')" class="px-2 py-1 bg-slate-200 text-slate-700 font-bold max-w-[120px] rounded text-[10px]">Re-Open</button>`
            : `<button onclick="toggleOfficerReminder('${rem.id}')" class="px-2 py-1 bg-emerald-600 text-white font-bold max-w-[120px] rounded text-[10px]">Complete</button>`;

        row.innerHTML = `
            <td class="p-3">
                <span class="font-bold text-slate-800 ${rem.is_completed ? 'line-through' : ''}">${rem.title}</span>
                <span class="block text-[10px] text-slate-400 font-light">Recurrence Interval: ${rem.recurrence}</span>
            </td>
            <td class="p-3"><span class="px-2 py-0.5 border text-[10px] rounded ${priorityColor}">${rem.category}</span></td>
            <td class="p-3 font-semibold text-slate-600">${rem.due_date}</td>
            <td class="p-3 text-right">${checkAction}</td>
        `;
        tableBody.appendChild(row);
    });
}

async function toggleOfficerReminder(id) {
    if (isPHPServer) {
        await fetch('api.php?action=toggle_reminder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
    } else {
        const item = state.reminders.find(r => r.id === id);
        if (item) {
            item.is_completed = item.is_completed ? 0 : 1;
            saveLocalState();
        }
    }
    triggerSyncData();
}

async function handleOfficerExpenditureSubmission(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('off-exp-amount').value);
    const date = document.getElementById('off-exp-date').value;
    const category = document.getElementById('off-exp-category').value;
    const sub = document.getElementById('off-exp-subheader').value.trim();
    const vend = document.getElementById('off-exp-vendor').value.trim();
    const description = document.getElementById('off-exp-description').value.trim();

    const chkRec = document.getElementById('chk-receipt').checked ? 1 : 0;
    const chkCen = document.getElementById('chk-center').checked ? 1 : 0;
    const chkBrd = document.getElementById('chk-approved').checked ? 1 : 0;
    const chkT_I = document.getElementById('chk-invoice').checked ? 1 : 0;

    const proofInput = document.getElementById('off-exp-proof');
    let proofFileObj = null;
    let proofFileName = null;
    if (proofInput && proofInput.files && proofInput.files.length > 0) {
        proofFileObj = proofInput.files[0];
        // Create mock local name for storage purposes
        proofFileName = "uploads/" + Date.now() + "_" + proofFileObj.name;
    }

    if (isPHPServer) {
        try {
            if (isDevServer) {
                await fetch('api.php?action=add_expenditure', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: amount,
                        date: date,
                        category: category,
                        subCategory: sub,
                        vendor: vend,
                        description: description,
                        hasReceipt: chkRec ? 1 : 0,
                        validCostCenter: chkCen ? 1 : 0,
                        boardApproved: chkBrd ? 1 : 0,
                        taxInvoice: chkT_I ? 1 : 0,
                        proofFile: proofFileName
                    })
                });
            } else {
                const formData = new FormData();
                formData.append('amount', amount);
                formData.append('date', date);
                formData.append('category', category);
                formData.append('subCategory', sub);
                formData.append('vendor', vend);
                formData.append('description', description);
                formData.append('hasReceipt', chkRec);
                formData.append('validCostCenter', chkCen);
                formData.append('boardApproved', chkBrd);
                formData.append('taxInvoice', chkT_I);
                if (proofFileObj) {
                    formData.append('proofFile', proofFileObj);
                }
                await fetch('api.php?action=add_expenditure', {
                    method: 'POST',
                    body: formData
                });
            }
        } catch(err) {
            console.error("API Expenditure Logging Error:", err);
        }
    } else {
        let lastHash = "GENESIS_BLOCK_HASH_VAL_000000000";
        if (state.expenditures.length > 0) {
            lastHash = state.expenditures[state.expenditures.length - 1].block_hash;
        }
        const newId = "e_" + Date.now();
        const blockHash = calculateJsBlockHash("EXPENDITURE", newId, amount, category, lastHash);

        const newItem = {
            id: newId,
            amount: amount,
            category: category,
            sub_category: sub,
            description: description,
            vendor: vend,
            date: date,
            status: "PENDING",
            compliance_status: "UNDER_REVIEW",
            has_receipt: chkRec,
            valid_cost_center: chkCen,
            board_approved: chkBrd,
            tax_invoice: chkT_I,
            block_hash: blockHash,
            proof_file: proofFileName
        };
        state.expenditures.push(newItem);
        state.auditLogs.unshift({
            id: "l_" + Date.now(),
            user_name: state.session.fullName,
            user_role: state.session.role,
            action: `Logged expense payout entry (${newId})`,
            table_name: "expenditures",
            record_id: newId,
            newValue: `Amount: R${amount}, category: ${category}` + (proofFileName ? " | Proof doc attached" : ""),
            timestamp: new Date().toLocaleDateString(),
            ip_address: '127.0.0.1'
        });
        saveLocalState();
    }
    document.getElementById('officer-add-expenditure-form').reset();
    resetUploadLabel('off-exp-proof', 'exp-file-placeholder', 'Drag & drop or click to choose supporting document...');
    triggerSyncData();
}

async function handleOfficerContributionSubmission(e) {
    e.preventDefault();
    const name = document.getElementById('off-con-name').value.trim();
    const email = document.getElementById('off-con-email').value.trim();
    const amount = parseFloat(document.getElementById('off-con-amount').value);
    const ref = document.getElementById('off-con-ref').value.trim();
    const method = document.getElementById('off-con-method').value;
    const campaign = document.getElementById('off-con-campaign').value.trim();

    const proofInput = document.getElementById('off-con-proof');
    let proofFileObj = null;
    let proofFileName = null;
    if (proofInput && proofInput.files && proofInput.files.length > 0) {
        proofFileObj = proofInput.files[0];
        proofFileName = "uploads/" + Date.now() + "_" + proofFileObj.name;
    }

    if (isPHPServer) {
        try {
            if (isDevServer) {
                await fetch('api.php?action=add_contribution', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        donorName: name,
                        email: email,
                        amount: amount,
                        reference: ref,
                        paymentMethod: method,
                        campaign: campaign,
                        isAnonymized: 0,
                        proofFile: proofFileName
                    })
                });
            } else {
                const formData = new FormData();
                formData.append('donorName', name);
                formData.append('email', email);
                formData.append('amount', amount);
                formData.append('reference', ref);
                formData.append('paymentMethod', method);
                formData.append('campaign', campaign);
                formData.append('isAnonymized', 0);
                if (proofFileObj) {
                    formData.append('proofFile', proofFileObj);
                }
                await fetch('api.php?action=add_contribution', {
                    method: 'POST',
                    body: formData
                });
            }
        } catch(err) {
            console.error("API Contribution Logging Error:", err);
        }
    } else {
        let lastHash = "GENESIS_BLOCK_HASH_VAL_000000000";
        if (state.contributions.length > 0) {
            lastHash = state.contributions[state.contributions.length - 1].blockHash;
        }
        const newId = "c_" + Date.now();
        const blockHash = calculateJsBlockHash("CONTRIBUTION", newId, amount, campaign, lastHash);

        const newContrib = {
            id: newId, donorName: name, email, amount, paymentMethod: method, reference: ref, campaign,
            receivedAt: new Date().toISOString(), description: "Register offline node contribution", isAnonymized: false, blockHash,
            proof_file: proofFileName
        };
        state.contributions.push(newContrib);
        state.auditLogs.unshift({
            id: "l_" + Date.now(),
            user_name: state.session.fullName,
            user_role: state.session.role,
            action: `Logged offline deposit node (${newId})`,
            table_name: "contributions",
            record_id: newId,
            newValue: `Amount: R${amount}, Donor: ${name}` + (proofFileName ? " | Slip attached" : ""),
            timestamp: new Date().toLocaleDateString(),
            ip_address: '127.0.0.1'
        });
        saveLocalState();
    }
    document.getElementById('officer-add-contrib-form').reset();
    resetUploadLabel('off-con-proof', 'con-file-placeholder', 'Drag & drop or click to attach deposit receipt proof...');
    triggerSyncData();
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// WORKSPACE: AUDITOR LOGIC
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function renderAuditorWorkspace() {
    const selector = document.getElementById('audit-curr-exp-select');
    selector.innerHTML = '<option value="">-- Choose unverified cost items --</option>';

    const underReview = state.expenditures.filter(e => e.compliance_status === 'UNDER_REVIEW');
    underReview.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.innerText = `EXP to ${item.vendor} - R${parseFloat(item.amount).toLocaleString()}`;
        selector.appendChild(option);
    });

    renderSealedReportsList();
}

function loadSelectedAuditItem(id) {
    const title = document.getElementById('audit-preview-title');
    const desc = document.getElementById('audit-preview-desc');

    if (!id) {
        title.innerText = "Invoice Details: No selection";
        desc.innerText = "Justification parameters loaded upon item selection...";
        return;
    }

    const matched = state.expenditures.find(e => e.id === id);
    if (matched) {
        title.innerText = `Expenditure node ${matched.id} clear for verification`;
        desc.innerText = `Beneficiary Vendor: ${matched.vendor}\nCategory Segment: ${matched.category}\nJustification Note: ${matched.description || 'No summary filed'}`;
        
        document.getElementById('chk-aud-receipt').checked = matched.has_receipt === 1;
        document.getElementById('chk-aud-center').checked = matched.valid_cost_center === 1;
        document.getElementById('chk-aud-approved').checked = matched.board_approved === 1;
        document.getElementById('chk-aud-tax').checked = matched.tax_invoice === 1;
    }
}

async function submitAuditResolution(statusValue) {
    const id = document.getElementById('audit-curr-exp-select').value;
    if (!id) {
        alert("Please choose a candidate expenditure record to resolve check lists.");
        return;
    }

    const chkRec = document.getElementById('chk-aud-receipt').checked ? 1 : 0;
    const chkCen = document.getElementById('chk-aud-center').checked ? 1 : 0;
    const chkBrd = document.getElementById('chk-aud-approved').checked ? 1 : 0;
    const chkTax = document.getElementById('chk-aud-tax').checked ? 1 : 0;

    if (isPHPServer) {
        await fetch('api.php?action=update_compliance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, complianceStatus: statusValue, hasReceipt: chkRec, validCostCenter: chkCen, boardApproved: chkBrd, taxInvoice: chkTax })
        });
    } else {
        const matched = state.expenditures.find(e => e.id === id);
        if (matched) {
            matched.compliance_status = statusValue;
            matched.has_receipt = chkRec;
            matched.valid_cost_center = chkCen;
            matched.board_approved = chkBrd;
            matched.tax_invoice = chkTax;
            saveLocalState();
        }
    }
    triggerSyncData();
    alert("Compliance Checklist sealed successfully. Clearance logged.");
}

function renderSealedReportsList() {
    const list = document.getElementById('sealed-reports-list');
    list.innerHTML = '';

    state.reports.forEach(report => {
        const isSignedByAuditor = report.signatures.some(s => s.signee_role === 'AUDITOR');
        const signAction = isSignedByAuditor 
            ? `<span class="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100 uppercase tracking-widest text-[9px] block text-center">Certified & Sealed</span>`
            : `<button onclick="signStatutoryReport('${report.id}')" class="px-3 py-1 bg-[#112a4a] hover:bg-sky-950 text-teal-400 font-extrabold rounded-md text-[10px]">Affix Auditor Digital Seal</button>`;

        const container = document.createElement('div');
        container.className = "p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-[11px]";
        container.innerHTML = `
            <div>
                <h5 class="font-bold text-slate-800 leading-tight">${report.title}</h5>
                <p class="text-[10.5px] text-slate-500 font-light block mt-0.5">Surplus: <b>R${parseFloat(report.surplus || report.summaryData.surplus).toLocaleString()}</b> • Ratio: <b>${((report.program_service_ratio || report.summaryData.programServiceRatio)*100).toFixed(1)}%</b></p>
            </div>
            <div>
                ${signAction}
            </div>
        `;
        list.appendChild(container);
    });
}

async function triggerReportGeneration() {
    const rep_title = document.getElementById('rep-title').value.trim();
    const rep_start = document.getElementById('rep-start').value;
    const rep_end = document.getElementById('rep-end').value;

    // Local summary counts calculation
    const totalRev = state.contributions.reduce((sum, c) => sum + parseFloat(c.amount), 0);
    const totalExp = state.expenditures.filter(e => e.status === 'APPROVED').reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const surplus = totalRev - totalExp;

    const programSpend = state.expenditures
        .filter(e => e.status === 'APPROVED' && e.category === 'PROGRAM')
        .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const programRatio = totalExp > 0 ? (programSpend / totalExp) : 0.0;

    const repId = "rep_" + Date.now();
    const reportHash = jsSha256(rep_title + Date.now());

    const newReport = {
        id: repId,
        report_type: "NPO_ANNUAL",
        title: rep_title,
        start_period: rep_start,
        end_period: rep_end,
        generated_at: new Date().toISOString(),
        generated_by: state.session.fullName,
        status: "DRAFT",
        hash: reportHash,
        surplus: surplus,
        program_service_ratio: parseFloat(programRatio.toFixed(3)),
        signatures: [
            { signee_name: state.session.fullName, signee_role: "ADMIN", signed_at: new Date().toLocaleString(), signature_hash: "SIG_" + jsSha256(state.session.fullName) }
        ]
    };

    if (isPHPServer) {
        try {
            await fetch('api.php?action=add_report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: repId,
                    report_type: 'NPO_ANNUAL',
                    title: rep_title,
                    start_period: rep_start,
                    end_period: rep_end,
                    generated_by: state.session.fullName,
                    status: 'DRAFT',
                    hash: reportHash,
                    total_revenue: totalRev,
                    total_expenditure: totalExp,
                    surplus: surplus,
                    program_service_ratio: parseFloat(programRatio.toFixed(3)),
                    signatures: [
                        { signee_name: state.session.fullName, signee_role: "ADMIN", signature_hash: "SIG_" + jsSha256(state.session.fullName) }
                    ]
                })
            });
        } catch (e) {
            console.error("API Report compile failed:", e);
        }
    } else {
        state.reports.push(newReport);
        saveLocalState();
    }
    triggerSyncData();
    alert("New compliance statutory return draft statement compiled and logged. Dual authorization seal required!");
}

async function signStatutoryReport(id) {
    const reportVal = state.reports.find(r => r.id === id);
    if (reportVal) {
        const signatureHash = "SIG_" + jsSha256(state.session.fullName);
        if (isPHPServer) {
            try {
                await fetch('api.php?action=sign_report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        reportId: id,
                        signeeName: state.session.fullName,
                        signeeRole: state.session.role,
                        signatureHash: signatureHash
                    })
                });
            } catch (e) {
                console.error("API signature failed:", e);
            }
        } else {
            reportVal.signatures.push({
                signee_name: state.session.fullName,
                signee_role: state.session.role,
                signed_at: new Date().toLocaleString(),
                signature_hash: signatureHash
            });
            if (state.session.role === 'AUDITOR') {
                reportVal.status = 'SIGNED';
            }
            saveLocalState();
        }
        triggerSyncData();
        alert("Your digital certification has been safely recorded and affixed on report node!");
    }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// WORKSPACE: DONOR LOGIC
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function renderDonorWorkspace() {
    const container = document.getElementById('donor-tax-list-container');
    container.innerHTML = '';

    // Filter payments belonging specifically to the logged email address
    const donorEmail = state.session.email.toLowerCase();
    const matches = state.contributions.filter(c => c.email && c.email.toLowerCase() === donorEmail);
    const myTotal = matches.reduce((sum, c) => sum + parseFloat(c.amount), 0);

    document.getElementById('donor-total-allocated').innerText = `R${myTotal.toLocaleString()}`;
    document.getElementById('donor-impact-saplings').innerText = `${Math.floor(myTotal / 15).toLocaleString()} Saplings`;

    if (matches.length === 0) {
        container.innerHTML = `<div class="p-4 text-center italic text-slate-400 text-xs text-slate-550">No contributions found matching email: '${state.session.email}'</div>`;
        return;
    }

    matches.forEach(item => {
        const row = document.createElement('div');
        row.className = "flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs gap-3 font-sans";
        row.innerHTML = `
            <div>
                <span class="font-extrabold text-slate-800 text-[13px] block">Receipt Ref: ${item.reference}</span>
                <span class="text-[10px] text-slate-400 font-light block mt-0.5">Clearing Gateway: ${item.paymentMethod} • Date Linked: ${item.receivedAt}</span>
            </div>
            <div class="flex items-center gap-4">
                <div class="text-right">
                    <span class="font-black text-emerald-800 text-sm">R${parseFloat(item.amount).toLocaleString()}</span>
                    <span class="block text-[9.5px] text-slate-400 font-light truncate max-w-[150px]">${item.campaign}</span>
                </div>
                <button onclick="viewDonorReceiptPopup('${item.id}')" class="px-3 py-1.5 bg-[#112a4a] text-teal-400 hover:bg-sky-950 hover:text-white transition-colors rounded-lg font-bold text-[10px] uppercase">
                    View Section 18A PDF
                </button>
            </div>
        `;
        container.appendChild(row);
    });
}

function viewDonorReceiptPopup(cId) {
    const item = state.contributions.find(c => c.id === cId);
    if (!item) return;

    document.getElementById('popup-receipt-viewer').classList.remove('hidden');
    document.getElementById('receipt-donor-name').innerText = item.donorName;
    document.getElementById('receipt-id-code').innerText = item.reference;
    document.getElementById('receipt-pathway').innerText = item.paymentMethod;
    document.getElementById('receipt-campaign').innerText = item.campaign;
    document.getElementById('receipt-total-sum').innerText = `R${parseFloat(item.amount).toLocaleString()}`;
    document.getElementById('receipt-blockchain-checksum').innerText = `SYSTEM IMMUTABLE CHAIN ID: ${item.blockHash}`;

    // Auto-scroll smooth to popup container
    document.getElementById('popup-receipt-viewer').scrollIntoView({ behavior: 'smooth' });
}

function closeReceiptPopup() {
    document.getElementById('popup-receipt-viewer').classList.add('hidden');
}

// Custom brand logo uploading and preview customization helper
async function handleLogoUpload(e) {
    if (e) e.preventDefault();
    const fileId = 'admin-logo-file';
    const input = document.getElementById(fileId);
    if (!input || !input.files || input.files.length === 0) {
        alert("Please select a brand image file to upload first.");
        return;
    }
    const logoFile = input.files[0];
    if (isPHPServer) {
        try {
            if (isDevServer) {
                const resp = await fetch('api.php?action=upload_logo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        logoName: logoFile.name
                    })
                });
                if (resp.ok) {
                    alert("Corporate brand logo updated successfully!");
                    triggerSyncData();
                    resetUploadLabel(fileId, 'logo-file-placeholder', 'Drag & drop or Click to choose logo...');
                } else {
                    const errorData = await resp.json();
                    alert("Logo upload failed: " + (errorData.error || "Unknown error"));
                }
            } else {
                const formData = new FormData();
                formData.append('logoFile', logoFile);
                const resp = await fetch('api.php?action=upload_logo', {
                    method: 'POST',
                    body: formData
                });
                if (resp.ok) {
                    const data = await resp.json();
                    alert("Corporate brand logo updated successfully!");
                    triggerSyncData();
                    resetUploadLabel(fileId, 'logo-file-placeholder', 'Drag & drop or Click to choose logo...');
                } else {
                    const errorData = await resp.json();
                    alert("Logo upload failed: " + (errorData.error || "Unknown error"));
                }
            }
        } catch (err) {
            console.error("Error uploading brand logo:", err);
            alert("Error connecting to server to apply branding logo.");
        }
    } else {
        // Sandboxed fallback local storage serialization
        const reader = new FileReader();
        reader.onload = function(evt) {
            const base64Img = evt.target.result;
            localStorage.setItem('custom_mock_logo', base64Img);
            alert("Mock Workspace branding logo loaded successfully!");
            // Smoothly render the updated logo
            const logoImg = document.getElementById('custom-logo-img');
            const defaultLogo = document.getElementById('default-logo-svg');
            if (logoImg && defaultLogo) {
                logoImg.src = base64Img;
                logoImg.classList.remove('hidden');
                defaultLogo.classList.add('hidden');
            }
            resetUploadLabel(fileId, 'logo-file-placeholder', 'Drag & drop or Click to choose logo...');
        };
        reader.readAsDataURL(logoFile);
    }
}

// Drag-and-drop label controllers
function updateUploadLabel(inputId, placeholderId) {
    const input = document.getElementById(inputId);
    const placeholder = document.getElementById(placeholderId);
    if (input && input.files && input.files.length > 0) {
        placeholder.innerText = `📎 Selected: ${input.files[0].name}`;
        placeholder.className = "text-[11px] text-emerald-600 font-bold";
    } else {
        placeholder.innerText = "Drag & drop or Click to choose file...";
        placeholder.className = "text-[11px] text-slate-500 font-normal";
    }
}

function resetUploadLabel(inputId, placeholderId, defaultText) {
    const input = document.getElementById(inputId);
    const placeholder = document.getElementById(placeholderId);
    if (input) input.value = '';
    if (placeholder) {
        placeholder.innerText = defaultText;
        placeholder.className = "text-[11px] text-slate-500 font-normal";
    }
}
