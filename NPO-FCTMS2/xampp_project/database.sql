-- ==========================================
-- NPO-FCTMS SECURE TRANSACTIONAL LEDGER SYSTEM
-- database.sql - DB schema initialization for XAMPP / phpMyAdmin / MySQL
-- ==========================================

CREATE DATABASE IF NOT EXISTS npo_compliance;
USE npo_compliance;

-- Drop existing tables to ensure a clean build
DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS reminders;
DROP TABLE IF EXISTS expenditures;
DROP TABLE IF EXISTS contributions;
DROP TABLE IF EXISTS users;

-- 1. USERS TABLE
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'OFFICER', 'AUDITOR', 'DONOR', 'PUBLIC') NOT NULL,
    organization VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. CONTRIBUTIONS TABLE
CREATE TABLE contributions (
    id VARCHAR(50) PRIMARY KEY,
    donor_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    reference VARCHAR(50) NOT NULL,
    campaign VARCHAR(100) NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    is_anonymized TINYINT(1) DEFAULT 0,
    block_hash VARCHAR(64) NOT NULL,
    proof_file VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. EXPENDITURES TABLE
CREATE TABLE expenditures (
    id VARCHAR(50) PRIMARY KEY,
    amount DECIMAL(15, 2) NOT NULL,
    category ENUM('PROGRAM', 'OPERATIONAL', 'ADMINISTRATIVE', 'FUNDRAISING') NOT NULL,
    sub_category VARCHAR(150) NOT NULL,
    description TEXT,
    approved_by VARCHAR(50),
    vendor VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'DISAPPROVED') DEFAULT 'PENDING',
    compliance_status ENUM('UNDER_REVIEW', 'VERIFIED', 'FAILED') DEFAULT 'UNDER_REVIEW',
    has_receipt TINYINT(1) DEFAULT 0,
    valid_cost_center TINYINT(1) DEFAULT 0,
    board_approved TINYINT(1) DEFAULT 0,
    tax_invoice TINYINT(1) DEFAULT 0,
    block_hash VARCHAR(64) NOT NULL,
    proof_file VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. ROADMAP DEADLINES / REMINDERS TABLE
CREATE TABLE reminders (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    due_date DATE NOT NULL,
    priority ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_completed TINYINT(1) DEFAULT 0,
    recurrence VARCHAR(50) DEFAULT 'Once-off',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. STATUTORY REPORTS TABLE
CREATE TABLE reports (
    id VARCHAR(50) PRIMARY KEY,
    report_type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    start_period DATE NOT NULL,
    end_period DATE NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by VARCHAR(150) NOT NULL,
    status ENUM('DRAFT', 'SIGNED') DEFAULT 'DRAFT',
    hash VARCHAR(64) NOT NULL,
    total_revenue DECIMAL(15, 2) NOT NULL,
    total_expenditure DECIMAL(15, 2) NOT NULL,
    surplus DECIMAL(15, 2) NOT NULL,
    program_service_ratio DECIMAL(5, 3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. REPORT SIGNATURES TABLE
CREATE TABLE signatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_id VARCHAR(50) NOT NULL,
    signee_name VARCHAR(100) NOT NULL,
    signee_role VARCHAR(20) NOT NULL,
    signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    signature_hash VARCHAR(64) NOT NULL,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. AUDIT LOGS TABLE
CREATE TABLE audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_role VARCHAR(20) NOT NULL,
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(50) NOT NULL,
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ==========================================
-- SEED DATA SETS
-- ==========================================

-- Standard seeded credentials with corresponding password (e.g. for Admin is Admin1234!)
-- Seeded passwords are hashed using default PHP password_hash(..., PASSWORD_BCRYPT)
INSERT INTO users (id, email, password_hash, full_name, role, organization, created_at) VALUES
('u1', 'admin@npo.org', '$2y$10$UbyP8hEunO2W4WzJMyxOqufKOfiG9PjO9v1oGvUpv3o7Mge9uZmKi', 'Sarah Jenkins', 'ADMIN', 'Global Green Foundation', '2026-01-10 12:00:00'),
('u2', 'finance@npo.org', '$2y$10$kOfy8hEunO2W4WzJMyxOqufKOfiG9PjO9v1oGvUpv3o7Mge9uZmKi', 'Michael Chang', 'OFFICER', 'Global Green Foundation', '2026-01-12 12:00:00'),
('u3', 'auditor@independent.com', '$2y$10$PjOfy8hEunO2W4WzJMyxOqufKOfiG9PjO9v1oGvUpv3o7Mge9uZmKi', 'Elena Rostova', 'AUDITOR', 'Peak Audit Associates', '2026-01-15 12:00:00'),
('u4', 'donor@gmail.com', '$2y$10$Mge9y8hEunO2W4WzJMyxOqufKOfiG9PjO9v1oGvUpv3o7Mge9uZmKi', 'Dr. Arthur Pendelton', 'DONOR', 'Pendelton Family Trust', '2026-02-01 12:00:00');

-- Seeded Contributions (chained hashes)
INSERT INTO contributions (id, donor_name, email, amount, payment_method, reference, campaign, received_at, description, is_anonymized, block_hash) VALUES
('c1', 'Dr. Arthur Pendelton', 'donor@gmail.com', 15000.00, 'Wire Transfer', 'DON-2026-001', 'Reforestation Project Africa', '2026-04-10 10:30:00', 'Annual unrestricted donor allocation for tree planting programs.', 0, '63cc5f03d5248fe2d9a30283c7ce69fe1a2d81fdfd23608cc29d1ff04d9abbcb'),
('c2', 'Anonymized Contributor', NULL, 45000.00, 'ACH Direct Debit', 'DON-2026-002', 'Urban Agriculture Greenhouses', '2026-04-18 14:45:00', 'Sponsorship allocation for climate-tech hydroponic development.', 1, '9cce81fb7d2a58bceaa843394627d3e91a2da382cf8a2f4a1bc9a7dd18e7bcc3'),
('c3', 'Global Eco Grant', 'grants@ecofund.org', 120000.00, 'EFT Grant Transfer', 'GRT-998822', 'Rainforest Canopy Preservation', '2026-05-02 08:00:00', 'Q2 Restricted Grant Funding for preservation operations.', 0, '4ca9bbfcfda4e9ec598f829f79888d66dfab091176bc5aefce99aa8dffceaa09');

-- Seeded Expenditures (related log)
INSERT INTO expenditures (id, amount, category, sub_category, description, approved_by, vendor, date, status, compliance_status, has_receipt, valid_cost_center, board_approved, tax_invoice, block_hash) VALUES
('e1', 42000.00, 'PROGRAM', 'Direct Seed & Fertilizer Logistics', 'Sourcing 50,000 indigenous saplings and bio-fertilizer shipments.', 'u1', 'AgriSupply Co. (Pty) LTD', '2026-04-20', 'APPROVED', 'VERIFIED', 1, 1, 1, 1, 'bc2888df7ce9aa90abf9119bdcc3aa8bfe9cf58fecc99adfa0aefce9a987ddee'),
('e2', 8500.00, 'OPERATIONAL', 'Eco-Tech Monitoring Sensors', 'Internet-of-Things solar soil and rainfall analyzer systems.', 'u1', 'IoT Hardware Solutions', '2026-04-25', 'APPROVED', 'VERIFIED', 1, 1, 0, 1, 'cf235fab9daefcc838bdca991b1fa9decfab09115ec4c7aa9a8bfe7dcdfe8a9c'),
('e3', 4500.00, 'ADMINISTRATIVE', 'Regulatory Tax Compliance & Legal Retainers', 'Statutory annual statement audits and financial verification consultation.', 'u1', 'Apex Auditor Associates', '2026-05-05', 'APPROVED', 'VERIFIED', 1, 1, 1, 1, 'eb9dcdfaabaf091147aefece2531cd9a2bc1d7ff9a8cde99a8bfe7dcdaaa6602'),
('e4', 12000.00, 'FUNDRAISING', 'Advocacy Material & Event Hosting', 'Graphic printing and public educational venue rental.', 'u1', 'Spectra Design Hub', '2026-05-15', 'APPROVED', 'VERIFIED', 1, 1, 0, 1, '33ccf09daaa81fe9c9a8d9a2bcef0c9aaadcf0bba29f4a8bfe7dcdafcece3455');

-- Seeded reminders
INSERT INTO reminders (id, title, due_date, priority, category, is_completed, recurrence, created_at) VALUES
('r1', 'File Statutory SARS/IRS 990 Annual Compliance Returns', '2026-06-15', 'HIGH', 'TAX_FILING', 0, 'Annual', '2026-05-01 12:00:00'),
('r2', 'Consolidate Section 18A Donor Deductible Tax Receipts', '2026-06-25', 'MEDIUM', 'DONOR_REPORT', 1, 'Quarterly', '2026-05-01 12:00:00'),
('r3', 'Complete Q2 Independent Auditor Board Checkpoint', '2026-07-10', 'HIGH', 'AUDIT_DEADLINE', 0, 'Semi-Annual', '2026-05-10 12:00:00'),
('r4', 'Publish Public Transparency Ledger to Directory Website', '2026-06-30', 'LOW', 'INTERNAL_REVIEW', 0, 'Monthly', '2026-05-12 12:00:00');

-- Seeded statutory reports
INSERT INTO reports (id, report_type, title, start_period, end_period, generated_at, generated_by, status, hash, total_revenue, total_expenditure, surplus, program_service_ratio) VALUES
('rep1', 'NPO_ANNUAL', 'Annual Financial & Compliance Report - FY 2025/2026', '2025-06-01', '2026-05-31', '2026-06-01 15:00:00', 'Sarah Jenkins (ADMIN)', 'SIGNED', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 180000.00, 67000.00, 113000.00, 0.627);

-- Seeded Report Signatures
INSERT INTO signatures (report_id, signee_name, signee_role, signed_at, signature_hash) VALUES
('rep1', 'Sarah Jenkins', 'ADMIN', '2026-06-01 16:30:00', 'SIG_03cc5f03d5248fe2d9a30283c7ce69fe1a2d81'),
('rep1', 'Elena Rostova', 'AUDITOR', '2026-06-02 09:12:00', 'SIG_9a87cdff3d9ddb8e76c128fe3bc909aaab0911');

-- Seeded logs
INSERT INTO audit_logs (id, user_id, user_name, user_role, action, table_name, record_id, old_value, new_value, timestamp, ip_address) VALUES
('l1', 'u1', 'Sarah Jenkins', 'ADMIN', 'NPO-FCTMS System Initialization', 'SYSTEM', 'SYSTEM', NULL, 'Genesis Seed Set Up', '2026-01-10 12:00:00', '127.0.0.1'),
('l2', 'u2', 'Michael Chang', 'OFFICER', 'Logged Contribution Transaction (c3)', 'contributions', 'c3', NULL, 'Donor: Global Eco Eco Grant, Amount: $120,000', '2026-05-02 08:10:00', '192.168.1.144'),
('l3', 'u3', 'Elena Rostova', 'AUDITOR', 'Digitally Signed Statutory Report (rep1)', 'statutory_reports', 'rep1', 'DRAFT', 'STATE: SIGNED - Verification OK', '2026-06-02 09:12:00', '198.81.12.9');
