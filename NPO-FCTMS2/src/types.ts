/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  OFFICER = 'OFFICER',
  AUDITOR = 'AUDITOR',
  DONOR = 'DONOR',
  PUBLIC = 'PUBLIC'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organization: string;
  createdAt: string;
}

export interface Contribution {
  id: string;
  donorId?: string;
  donorName: string;
  email?: string;
  amount: number;
  paymentMethod: string;
  reference: string;
  campaign: string;
  receivedAt: string;
  description: string;
  status: 'PENDING' | 'CLEARED' | 'FLAGGED';
  isAnonymized: boolean;
  blockHash: string;
}

export interface Expenditure {
  id: string;
  amount: number;
  category: 'PROGRAM' | 'OPERATIONAL' | 'ADMINISTRATIVE' | 'FUNDRAISING';
  subCategory: string;
  description: string;
  approvedBy?: string;
  vendor: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'DISAPPROVED';
  complianceStatus: 'VERIFIED' | 'FAILED' | 'UNDER_REVIEW';
  complianceCheckDetails: {
    hasReceipt: boolean;
    validCostCenter: boolean;
    boardApproved?: boolean;
    taxInvoice: boolean;
  };
  blockHash: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  tableName: string;
  recordId: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress: string;
}

export interface StatutoryReport {
  id: string;
  reportType: 'IRS_990' | 'SEC_18A' | 'AFS' | 'NPO_ANNUAL';
  title: string;
  startPeriod: string;
  endPeriod: string;
  generatedAt: string;
  generatedBy: string;
  status: 'DRAFT' | 'SIGNED' | 'SUBMITTED';
  hash: string;
  signatures: {
    signeeName: string;
    signeeRole: UserRole;
    signedAt: string;
    signatureHash: string;
  }[];
  summaryData: {
    totalRevenue: number;
    totalExpenditure: number;
    surplus: number;
    programServiceRatio: number; // program cost / total cost
  };
}

export interface TaskReminder {
  id: string;
  title: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'TAX_FILING' | 'AUDIT_DEADLINE' | 'DONOR_REPORT' | 'INTERNAL_REVIEW';
  isCompleted: boolean;
  recurrence: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId?: string; // empty means global public compliance alert
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: 'ALERT' | 'REMINDER' | 'COMPLIANCE' | 'SYSTEM';
}

export interface LedgerVerificationResult {
  isValid: boolean;
  compromisedCount: number;
  totalBlocks: number;
  expectedHash: string;
  actualHash: string;
  recalculatedBlocks: {
    id: string;
    type: 'CONTRIBUTION' | 'EXPENDITURE';
    calculatedHash: string;
    storedHash: string;
    isCompromised: boolean;
  }[];
}
