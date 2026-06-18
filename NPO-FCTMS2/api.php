<?php
/**
 * NPO-FCTMS Financial Compliance Module
 * api.php - Backend REST service handlers for transactions, compliance, and audits
 */

header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

// Helper function to calculate sequential chain block hashes
function calculateBlockHash($recordType, $id, $amount, $secondary, $previousHash) {
    $content = "$recordType-$id-" . floatval($amount) . "-$secondary-$previousHash";
    return hash("sha256", $content);
}

// Security Check helper for endpoints
function getSessionUser() {
    session_start();
    if (isset($_SESSION['user_id'])) {
        return [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'],
            'role' => $_SESSION['user_role'],
            'org' => $_SESSION['user_org']
        ];
    }
    return [
        'id' => 'ANON_CLIENT',
        'name' => 'Public Guest',
        'role' => 'PUBLIC',
        'org' => 'General Public'
    ];
}

$db = Database::connect();

// Auto-run schema migration updates for older DBs
try {
    $db->query("SELECT proof_file FROM expenditures LIMIT 1");
} catch (Exception $e) {
    try {
        $db->query("ALTER TABLE expenditures ADD COLUMN proof_file VARCHAR(255) DEFAULT NULL");
    } catch (Exception $ex) {}
}
try {
    $db->query("SELECT proof_file FROM contributions LIMIT 1");
} catch (Exception $e) {
    try {
        $db->query("ALTER TABLE contributions ADD COLUMN proof_file VARCHAR(255) DEFAULT NULL");
    } catch (Exception $ex) {}
}

$user = getSessionUser();
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// Parse incoming payloads
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

try {
    switch ($action) {
        
        // 1. GET ALL TRANSACTIONS & SYSTEM STATUS
        case 'get_ledger':
            // Fetch Contributions
            $contribs = $db->query("SELECT * FROM contributions ORDER BY received_at DESC")->fetchAll();
            // Fetch Expenditures
            $expends = $db->query("SELECT * FROM expenditures ORDER BY date DESC")->fetchAll();
            // Fetch Reminders
            $reminders = $db->query("SELECT * FROM reminders ORDER BY due_date ASC")->fetchAll();
            // Fetch Audit Logs
            $logs = $db->query("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50")->fetchAll();
            // Fetch Reports
            $reports = $db->query("SELECT * FROM reports ORDER BY generated_at DESC")->fetchAll();
            
            // Link Signatures to report nodes
            foreach ($reports as &$rep) {
                $sigStmt = $db->prepare("SELECT signee_name, signee_role, signed_at, signature_hash FROM signatures WHERE report_id = ?");
                $sigStmt->execute([$rep['id']]);
                $rep['signatures'] = $sigStmt->fetchAll();
            }

            // Check if logo exists
            $logoPath = null;
            if (file_exists('uploads/custom_logo.png')) {
                $logoPath = 'uploads/custom_logo.png';
            } elseif (file_exists('uploads/custom_logo.jpg')) {
                $logoPath = 'uploads/custom_logo.jpg';
            } elseif (file_exists('uploads/custom_logo.svg')) {
                $logoPath = 'uploads/custom_logo.svg';
            }

            echo json_encode([
                "contributions" => $contribs,
                "expenditures" => $expends,
                "reminders" => $reminders,
                "auditLogs" => $logs,
                "reports" => $reports,
                "session" => $user,
                "customLogo" => $logoPath
            ]);
            break;

        // 2. LOG NEW CONTRIBUTIONS
        case 'add_contribution':
            $donorName = isset($input['donorName']) ? trim($input['donorName']) : 'Anonymized Contributor';
            $donorEmail = isset($input['email']) ? trim($input['email']) : null;
            $amount = isset($input['amount']) ? floatval($input['amount']) : 0.00;
            $paymentMethod = isset($input['paymentMethod']) ? trim($input['paymentMethod']) : 'Online Portal';
            $reference = isset($input['reference']) ? trim($input['reference']) : ('REC-' . rand(100000, 999999));
            $campaign = isset($input['campaign']) ? trim($input['campaign']) : 'General Reforestation';
            $description = isset($input['description']) ? trim($input['description']) : 'Contribution allocation';
            $isAnonymized = isset($input['isAnonymized']) ? intval($input['isAnonymized']) : 0;

            if ($amount <= 0 || empty($campaign)) {
                http_response_code(400);
                echo json_encode(["error" => "Contribution amount and target campaign program are required."]);
                exit();
            }

            // Handle Proof Document Upload
            $proofPath = null;
            if (isset($_FILES['proofFile']) && $_FILES['proofFile']['error'] === UPLOAD_ERR_OK) {
                $targetDir = 'uploads/';
                if (!is_dir($targetDir)) {
                    mkdir($targetDir, 0777, true);
                }
                $ext = pathinfo($_FILES['proofFile']['name'], PATHINFO_EXTENSION);
                $uniqueName = uniqid() . '_' . rand(100, 999) . '.' . $ext;
                $targetFile = $targetDir . $uniqueName;
                if (move_uploaded_file($_FILES['proofFile']['tmp_name'], $targetFile)) {
                    $proofPath = $targetFile;
                }
            }
            if (empty($proofPath) && isset($input['proofFile'])) {
                $proofPath = trim($input['proofFile']);
            }

            // Calculate current last sequence hash to lock chain integrity
            $lastHash = "GENESIS_BLOCK_HASH_VAL_000000000";
            $allLogsQuery = $db->query("
                SELECT block_hash FROM contributions 
                UNION ALL 
                SELECT block_hash FROM expenditures 
                LIMIT 1
            ");
            $hasRow = $allLogsQuery->fetch();
            if ($hasRow) {
                // To keep this demo reliable or match exactly, we check the latest added record's hash
                $latestC = $db->query("SELECT block_hash FROM contributions ORDER BY received_at DESC LIMIT 1")->fetch();
                $latestE = $db->query("SELECT block_hash FROM expenditures ORDER BY date DESC LIMIT 1")->fetch();
                if ($latestC) $lastHash = $latestC['block_hash'];
                elseif ($latestE) $lastHash = $latestE['block_hash'];
            }

            $newId = "c_" . uniqid();
            $calculatedHash = calculateBlockHash("CONTRIBUTION", $newId, $amount, $campaign, $lastHash);

            $stmt = $db->prepare("INSERT INTO contributions (id, donor_name, email, amount, payment_method, reference, campaign, description, is_anonymized, block_hash, proof_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $newId,
                $isAnonymized ? 'Anonymized Contributor' : $donorName,
                $isAnonymized ? null : $donorEmail,
                $amount,
                $paymentMethod,
                $reference,
                $campaign,
                $description,
                $isAnonymized,
                $calculatedHash,
                $proofPath
            ]);

            // Append Audit logs
            $logId = "l_" . uniqid();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $logStmt = $db->prepare("INSERT INTO audit_logs (id, user_id, user_name, user_role, action, table_name, record_id, newValue, ip_address) VALUES (?, ?, ?, ?, ?, 'contributions', ?, ?, ?)");
            $logStmt->execute([
                $logId, 
                $user['id'], 
                $user['name'], 
                $user['role'], 
                "Logged new donor contribution transaction ($newId)", 
                $newId, 
                "Donor: " . ($isAnonymized ? "Anonymized" : $donorName) . ", Amount: R$amount, Campaign: $campaign" . ($proofPath ? " (Proof Attached: $proofPath)" : ""), 
                $ip
            ]);

            echo json_encode(["status" => "success", "id" => $newId, "blockHash" => $calculatedHash, "proofFile" => $proofPath]);
            break;

        // 3. LOG NEW EXPENSE RECORD
        case 'add_expenditure':
            // Security: Financial Officers or Admins only
            if ($user['role'] !== 'OFFICER' && $user['role'] !== 'ADMIN') {
                http_response_code(403);
                echo json_encode(["error" => "Access denied. Action strictly restricted to NPO managers."]);
                exit();
            }

            $amount = isset($input['amount']) ? floatval($input['amount']) : 0.00;
            $category = isset($input['category']) ? trim($input['category']) : 'OPERATIONAL';
            $subCategory = isset($input['subCategory']) ? trim($input['subCategory']) : '';
            $description = isset($input['description']) ? trim($input['description']) : '';
            $vendor = isset($input['vendor']) ? trim($input['vendor']) : '';
            $date = isset($input['date']) ? trim($input['date']) : date('Y-m-d');
            
            $hasReceipt = isset($input['hasReceipt']) ? intval($input['hasReceipt']) : 0;
            $validCostCenter = isset($input['validCostCenter']) ? intval($input['validCostCenter']) : 0;
            $boardApproved = isset($input['boardApproved']) ? intval($input['boardApproved']) : 0;
            $taxInvoice = isset($input['taxInvoice']) ? intval($input['taxInvoice']) : 0;

            if ($amount <= 0 || empty($subCategory) || empty($vendor)) {
                http_response_code(400);
                echo json_encode(["error" => "Amount, specific expense program subcategory, and primary vendor parameters are required."]);
                exit();
            }

            // Handle Proof Document Upload
            $proofPath = null;
            if (isset($_FILES['proofFile']) && $_FILES['proofFile']['error'] === UPLOAD_ERR_OK) {
                $targetDir = 'uploads/';
                if (!is_dir($targetDir)) {
                    mkdir($targetDir, 0777, true);
                }
                $ext = pathinfo($_FILES['proofFile']['name'], PATHINFO_EXTENSION);
                $uniqueName = uniqid() . '_' . rand(100, 999) . '.' . $ext;
                $targetFile = $targetDir . $uniqueName;
                if (move_uploaded_file($_FILES['proofFile']['tmp_name'], $targetFile)) {
                    $proofPath = $targetFile;
                }
            }
            if (empty($proofPath) && isset($input['proofFile'])) {
                $proofPath = trim($input['proofFile']);
            }

            // Calculate blockchain hash sequence link
            $lastHash = "GENESIS_BLOCK_HASH_VAL_000000000";
            $latestC = $db->query("SELECT block_hash FROM contributions ORDER BY received_at DESC LIMIT 1")->fetch();
            $latestE = $db->query("SELECT block_hash FROM expenditures ORDER BY date DESC LIMIT 1")->fetch();
            if ($latestE) $lastHash = $latestE['block_hash'];
            elseif ($latestC) $lastHash = $latestC['block_hash'];

            $newId = "e_" . uniqid();
            $calculatedHash = calculateBlockHash("EXPENDITURE", $newId, $amount, $category, $lastHash);

            $stmt = $db->prepare("INSERT INTO expenditures (id, amount, category, sub_category, description, vendor, date, has_receipt, valid_cost_center, board_approved, tax_invoice, block_hash, proof_file) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $newId,
                $amount,
                $category,
                $subCategory,
                $description,
                $vendor,
                $date,
                $hasReceipt,
                $validCostCenter,
                $boardApproved,
                $taxInvoice,
                $calculatedHash,
                $proofPath
            ]);

            // Audited action
            $logId = "l_" . uniqid();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $logStmt = $db->prepare("INSERT INTO audit_logs (id, user_id, user_name, user_role, action, table_name, record_id, newValue, ip_address) VALUES (?, ?, ?, ?, ?, 'expenditures', ?, ?, ?)");
            $logStmt->execute([
                $logId, 
                $user['id'], 
                $user['name'], 
                $user['role'], 
                "Logged pending spend allocation invoice ($newId)", 
                $newId, 
                "Vendor: $vendor, Amount: R$amount, Category: $category" . ($proofPath ? " (Proof Attached: $proofPath)" : ""), 
                $ip
            ]);

            echo json_encode(["status" => "success", "id" => $newId, "blockHash" => $calculatedHash, "proofFile" => $proofPath]);
            break;

        // 4. RESOLVE AND APPROVE PENDING COSTS
        case 'approve_expenditure':
            if ($user['role'] !== 'ADMIN') {
                http_response_code(403);
                echo json_encode(["error" => "Access denied. Only registered NPO Administrators can authorize pending payments."]);
                exit();
            }

            $id = isset($input['id']) ? trim($input['id']) : '';
            $state = isset($input['approvedState']) ? trim($input['approvedState']) : 'APPROVED'; // APPROVED, DISAPPROVED

            if (empty($id)) {
                http_response_code(400);
                echo json_encode(["error" => "Expenditure target ID required."]);
                exit();
            }

            $stmt = $db->prepare("UPDATE expenditures SET status = ?, approved_by = ? WHERE id = ?");
            $stmt->execute([$state, $user['id'], $id]);

            $logId = "l_" . uniqid();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $logStmt = $db->prepare("INSERT INTO audit_logs (id, user_id, user_name, user_role, action, table_name, record_id, oldValue, newValue, ip_address) VALUES (?, ?, ?, ?, ?, 'expenditures', ?, 'PENDING', ?, ?)");
            $logStmt->execute([
                $logId, 
                $user['id'], 
                $user['name'], 
                $user['role'], 
                "Administrative resolved expense request ($id)", 
                $id, 
                "Status: $state, Authorized By: " . $user['name'], 
                $ip
            ]);

            echo json_encode(["status" => "success", "id" => $id, "state" => $state]);
            break;

        // 5. AUDITOR COMPLIANCE SCORE CHECKLIST SIGN OFF
        case 'update_compliance':
            if ($user['role'] !== 'AUDITOR') {
                http_response_code(403);
                echo json_encode(["error" => "Access denied. Compliance score checklists are restricted to Peak Board and External Auditors."]);
                exit();
            }

            $id = isset($input['id']) ? trim($input['id']) : '';
            $status = isset($input['complianceStatus']) ? trim($input['complianceStatus']) : 'VERIFIED'; // VERIFIED, FAILED
            
            $hasReceipt = isset($input['hasReceipt']) ? intval($input['hasReceipt']) : 0;
            $validCostCenter = isset($input['validCostCenter']) ? intval($input['validCostCenter']) : 0;
            $boardApproved = isset($input['boardApproved']) ? intval($input['boardApproved']) : 0;
            $taxInvoice = isset($input['taxInvoice']) ? intval($input['taxInvoice']) : 0;

            if (empty($id)) {
                http_response_code(400);
                echo json_encode(["error" => "Target transaction ID required."]);
                exit();
            }

            $stmt = $db->prepare("UPDATE expenditures SET compliance_status = ?, has_receipt = ?, valid_cost_center = ?, board_approved = ?, tax_invoice = ? WHERE id = ?");
            $stmt->execute([$status, $hasReceipt, $validCostCenter, $boardApproved, $taxInvoice, $id]);

            $logId = "l_" . uniqid();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $logStmt = $db->prepare("INSERT INTO audit_logs (id, user_id, user_name, user_role, action, table_name, record_id, newValue, ip_address) VALUES (?, ?, ?, ?, ?, 'expenditures', ?, ?, ?)");
            $logStmt->execute([
                $logId, 
                $user['id'], 
                $user['name'], 
                $user['role'], 
                "Audited cost compliance metrics ($id)", 
                $id, 
                "Result: $status, Checklist -> Receipt:$hasReceipt, TaxInvoice:$taxInvoice", 
                $ip
            ]);

            echo json_encode(["status" => "success", "id" => $id, "complianceStatus" => $status]);
            break;

        // 6. TOGGLE COMPLIANCE ROADMAP TASKS
        case 'toggle_reminder':
            $id = isset($input['id']) ? trim($input['id']) : '';
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(["error" => "Target reminder ID parameter required."]);
                exit();
            }

            // Fetch current state
            $curStmt = $db->prepare("SELECT is_completed FROM reminders WHERE id = ?");
            $curStmt->execute([$id]);
            $currentVal = $curStmt->fetchColumn();

            $nextVal = $currentVal ? 0 : 1;
            $stmt = $db->prepare("UPDATE reminders SET is_completed = ? WHERE id = ?");
            $stmt->execute([$nextVal, $id]);

            // Auditor trail logs
            $logId = "l_" . uniqid();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $logStmt = $db->prepare("INSERT INTO audit_logs (id, user_id, user_name, user_role, action, table_name, record_id, newValue, ip_address) VALUES (?, ?, ?, ?, ?, 'reminders', ?, ?, ?)");
            $logStmt->execute([
                $logId, 
                $user['id'], 
                $user['name'], 
                $user['role'], 
                "Toggled roadmap milestone completion step ($id)", 
                $id, 
                "Milestone completion state changed to: " . ($nextVal ? "COMPLETED" : "INCOMPLETE"), 
                $ip
            ]);

            echo json_encode(["status" => "success", "id" => $id, "isCompleted" => $nextVal]);
            break;

        // 7. COMPLY & VERIFY IMMUTABLE CRACK DETECTION CHAIN RECALCULATION
        case 'verify_ledger_chain':
            // Fetch all entries ordered sequentially by transaction ID
            $contribs = $db->query("SELECT id, 'CONTRIBUTION' as type, amount, campaign as ref, block_hash FROM contributions")->fetchAll();
            $expends = $db->query("SELECT id, 'EXPENDITURE' as type, amount, category as ref, block_hash FROM expenditures")->fetchAll();

            $combined = array_merge($contribs, $expends);
            usort($combined, function($a, $b) {
                return strcmp($a['id'], $b['id']);
            });

            $currentCalculatedHash = "GENESIS_BLOCK_HASH_VAL_000000000";
            $isValid = true;
            $compromisedCount = 0;
            $recalculatedBlocks = [];

            foreach ($combined as $node) {
                $recalculated = calculateBlockHash(
                    $node['type'],
                    $node['id'],
                    $node['amount'],
                    $node['ref'],
                    $currentCalculatedHash
                );

                $isMatch = ($recalculated === $node['block_hash']);
                if (!$isMatch) {
                    $isValid = false;
                    $compromisedCount++;
                }

                $recalculatedBlocks[] = [
                    "id" => $node['id'],
                    "type" => $node['type'],
                    "calculatedHash" => $recalculated,
                    "storedHash" => $node['block_hash'],
                    "isCompromised" => !$isMatch
                ];

                $currentCalculatedHash = $node['block_hash'];
            }

            echo json_encode([
                "isValid" => $isValid,
                "compromisedCount" => $compromisedCount,
                "totalBlocks" => count($combined),
                "expectedHash" => $currentCalculatedHash,
                "actualHash" => $isValid ? $currentCalculatedHash : "MISMATCH_DETECTED_FRACTURED_INTEGRITY",
                "blocks" => $recalculatedBlocks
            ]);
            break;

        // 8. ADD NEW STATUTORY REPORT
        case 'add_report':
            $id = isset($input['id']) ? trim($input['id']) : '';
            $reportType = isset($input['report_type']) ? trim($input['report_type']) : 'NPO_ANNUAL';
            if (empty($reportType)) {
                $reportType = isset($input['reportType']) ? trim($input['reportType']) : 'NPO_ANNUAL';
            }
            $title = isset($input['title']) ? trim($input['title']) : '';
            $startPeriod = isset($input['start_period']) ? trim($input['start_period']) : '';
            if (empty($startPeriod)) {
                $startPeriod = isset($input['startPeriod']) ? trim($input['startPeriod']) : '';
            }
            $endPeriod = isset($input['end_period']) ? trim($input['end_period']) : '';
            if (empty($endPeriod)) {
                $endPeriod = isset($input['endPeriod']) ? trim($input['endPeriod']) : '';
            }
            $generatedBy = isset($input['generated_by']) ? trim($input['generated_by']) : '';
            if (empty($generatedBy)) {
                $generatedBy = isset($input['generatedBy']) ? trim($input['generatedBy']) : '';
            }
            $status = isset($input['status']) ? trim($input['status']) : 'DRAFT';
            $hash = isset($input['hash']) ? trim($input['hash']) : '';
            $totalRevenue = isset($input['total_revenue']) ? floatval($input['total_revenue']) : 0.0;
            if ($totalRevenue == 0) {
                $totalRevenue = isset($input['totalRevenue']) ? floatval($input['totalRevenue']) : 0.0;
            }
            $totalExpenditure = isset($input['total_expenditure']) ? floatval($input['total_expenditure']) : 0.0;
            if ($totalExpenditure == 0) {
                $totalExpenditure = isset($input['totalExpenditure']) ? floatval($input['totalExpenditure']) : 0.0;
            }
            $surplus = isset($input['surplus']) ? floatval($input['surplus']) : 0.0;
            $programServiceRatio = isset($input['program_service_ratio']) ? floatval($input['program_service_ratio']) : 0.0;
            if ($programServiceRatio == 0) {
                $programServiceRatio = isset($input['programServiceRatio']) ? floatval($input['programServiceRatio']) : 0.0;
            }

            if (empty($id) || empty($title)) {
                http_response_code(400);
                echo json_encode(["error" => "Report ID and title are required parameters."]);
                exit();
            }

            $stmt = $db->prepare("INSERT INTO reports (id, report_type, title, start_period, end_period, generated_by, status, hash, total_revenue, total_expenditure, surplus, program_service_ratio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $id, $reportType, $title, $startPeriod, $endPeriod, $generatedBy, $status, $hash, $totalRevenue, $totalExpenditure, $surplus, $programServiceRatio
            ]);

            // Save signatures if provided
            if (isset($input['signatures']) && is_array($input['signatures'])) {
                foreach ($input['signatures'] as $sig) {
                    $signeeName = isset($sig['signee_name']) ? trim($sig['signee_name']) : (isset($sig['signeeName']) ? trim($sig['signeeName']) : '');
                    $signeeRole = isset($sig['signee_role']) ? trim($sig['signee_role']) : (isset($sig['signeeRole']) ? trim($sig['signeeRole']) : '');
                    $signatureHash = isset($sig['signature_hash']) ? trim($sig['signature_hash']) : (isset($sig['signatureHash']) ? trim($sig['signatureHash']) : '');
                    if (!empty($signeeName)) {
                        $sigStmt = $db->prepare("INSERT INTO signatures (report_id, signee_name, signee_role, signature_hash) VALUES (?, ?, ?, ?)");
                        $sigStmt->execute([$id, $signeeName, $signeeRole, $signatureHash]);
                    }
                }
            }

            // Append Audit Log
            $logId = "l_" . uniqid();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $logStmt = $db->prepare("INSERT INTO audit_logs (id, user_id, user_name, user_role, action, table_name, record_id, newValue, ip_address) VALUES (?, ?, ?, ?, ?, 'reports', ?, ?, ?)");
            $logStmt->execute([
                $logId, 
                $user['id'], 
                $user['name'], 
                $user['role'], 
                "Generated statutory report draft ($id)", 
                $id, 
                "Title: $title, Surplus: R$surplus", 
                $ip
            ]);

            echo json_encode(["status" => "success", "id" => $id]);
            break;

        // 9. SIGN STATUTORY REPORT
        case 'sign_report':
            $reportId = isset($input['reportId']) ? trim($input['reportId']) : (isset($input['report_id']) ? trim($input['report_id']) : '');
            $signeeName = isset($input['signeeName']) ? trim($input['signeeName']) : (isset($input['signee_name']) ? trim($input['signee_name']) : '');
            $signeeRole = isset($input['signeeRole']) ? trim($input['signeeRole']) : (isset($input['signee_role']) ? trim($input['signee_role']) : '');
            $signatureHash = isset($input['signatureHash']) ? trim($input['signatureHash']) : (isset($input['signature_hash']) ? trim($input['signature_hash']) : '');

            if (empty($reportId) || empty($signeeName)) {
                http_response_code(400);
                echo json_encode(["error" => "Report ID and Signee details required."]);
                exit();
            }

            $sigStmt = $db->prepare("INSERT INTO signatures (report_id, signee_name, signee_role, signature_hash) VALUES (?, ?, ?, ?)");
            $sigStmt->execute([$reportId, $signeeName, $signeeRole, $signatureHash]);

            // Update status
            if ($signeeRole === 'AUDITOR') {
                $upStmt = $db->prepare("UPDATE reports SET status = 'SIGNED' WHERE id = ?");
                $upStmt->execute([$reportId]);
            }

            // Append Audit Log
            $logId = "l_" . uniqid();
            $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $logStmt = $db->prepare("INSERT INTO audit_logs (id, user_id, user_name, user_role, action, table_name, record_id, newValue, ip_address) VALUES (?, ?, ?, ?, ?, 'reports', ?, ?, ?)");
            $logStmt->execute([
                $logId, 
                $user['id'], 
                $user['name'], 
                $user['role'], 
                "Digital signature assigned on report ($reportId)", 
                $reportId, 
                "Signee: $signeeName, Role: $signeeRole", 
                $ip
            ]);

            echo json_encode(["status" => "success"]);
            break;

        // 10. UPLOAD SYSTEM LOGO IMAGE
        case 'upload_logo':
            if ($user['role'] !== 'ADMIN') {
                http_response_code(403);
                echo json_encode(["error" => "Access denied. Only system Administrators can customize system logos."]);
                exit();
            }

            if (isset($_FILES['logoFile']) && $_FILES['logoFile']['error'] === UPLOAD_ERR_OK) {
                $targetDir = 'uploads/';
                if (!is_dir($targetDir)) {
                    mkdir($targetDir, 0777, true);
                }
                
                // Clear existing custom logo files to be clean
                $existingLogos = glob($targetDir . 'custom_logo.*');
                if ($existingLogos) {
                    foreach ($existingLogos as $file) {
                        unlink($file);
                    }
                }

                $ext = strtolower(pathinfo($_FILES['logoFile']['name'], PATHINFO_EXTENSION));
                if (!in_array($ext, ['png', 'jpg', 'jpeg', 'svg'])) {
                    http_response_code(400);
                    echo json_encode(["error" => "Unsupported file type. Please upload a PNG, JPG, or SVG logo."]);
                    exit();
                }

                $targetPath = $targetDir . 'custom_logo.' . $ext;
                if (move_uploaded_file($_FILES['logoFile']['tmp_name'], $targetPath)) {
                    
                    // Append Audit Log
                    $logId = "l_" . uniqid();
                    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
                    $logStmt = $db->prepare("INSERT INTO audit_logs (id, user_id, user_name, user_role, action, table_name, record_id, newValue, ip_address) VALUES (?, ?, ?, ?, ?, 'SYSTEM', 'LOGO', ?, ?)");
                    $logStmt->execute([
                        $logId, 
                        $user['id'], 
                        $user['name'], 
                        $user['role'], 
                        "Custom logo branding updated in settings module", 
                        "SYSTEM", 
                        "Logo set to: $targetPath", 
                        $ip
                    ]);

                    echo json_encode(["status" => "success", "customLogo" => $targetPath]);
                    exit();
                }
            }

            http_response_code(400);
            echo json_encode(["error" => "No logo file provided or upload error occurred."]);
            break;

        default:
            http_response_code(400);
            echo json_encode(["error" => "Undefined operations request. Action parameter specified: '$action' is invalid."]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "System Compliance database transaction failure: " . $e->getMessage()]);
}
