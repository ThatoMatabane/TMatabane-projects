<?php
/**
 * NPO-FCTMS Financial Compliance Module
 * auth.php - Role-Based User Access Control (Login & Register)
 * Inputs: JSON raw document or Standard HTTP POST requests
 */

header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

// Parse incoming request method
$db = Database::connect();
$method = $_SERVER['REQUEST_METHOD'];

// Parse JSON input payloads
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    if ($action === 'login') {
        $email = isset($input['email']) ? trim($input['email']) : '';
        $password = isset($input['password']) ? trim($input['password']) : '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["error" => "Email and password parameters are required."]);
            exit();
        }

        // Fetch user from DB
        $stmt = $db->prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(["error" => "Invalid corporate email or password credential."]);
            exit();
        }

        // Start session and log success
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['full_name'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['user_org'] = $user['organization'];

        // Write to audit log automatically
        $logId = "l_auth_" . uniqid();
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $logStmt = $db->prepare("INSERT INTO audit_logs (id, user_id, user_name, user_role, action, table_name, record_id, newValue, ip_address) VALUES (?, ?, ?, ?, ?, 'users', ?, ?, ?)");
        $logStmt->execute([
            $logId, 
            $user['id'], 
            $user['full_name'], 
            $user['role'], 
            "User session established via auth credential", 
            $user['id'], 
            "Session Active: Role = " . $user['role'], 
            $ip
        ]);

        echo json_encode([
            "id" => $user['id'],
            "email" => $user['email'],
            "fullName" => $user['full_name'],
            "role" => $user['role'],
            "organization" => $user['organization']
        ]);
        exit();

    } elseif ($action === 'register') {
        $fullName = isset($input['fullName']) ? trim($input['fullName']) : '';
        $email = isset($input['email']) ? trim($input['email']) : '';
        $password = isset($input['password']) ? trim($input['password']) : '';
        $role = isset($input['role']) ? trim($input['role']) : 'PUBLIC';
        $organization = isset($input['organization']) ? trim($input['organization']) : '';

        if (empty($fullName) || empty($email) || empty($password) || empty($organization)) {
            http_response_code(400);
            echo json_encode(["error" => "All mandatory registration fields are required."]);
            exit();
        }

        // Check if user already exists
        $checkStmt = $db->prepare("SELECT COUNT(*) FROM users WHERE LOWER(email) = LOWER(?)");
        $checkStmt->execute([$email]);
        if ($checkStmt->fetchColumn() > 0) {
            http_response_code(400);
            echo json_encode(["error" => "An active secure account with this email address already exists."]);
            exit();
        }

        // Validate selected role
        $validRoles = ['ADMIN', 'OFFICER', 'AUDITOR', 'DONOR', 'PUBLIC'];
        if (!in_array($role, $validRoles)) {
            $role = 'PUBLIC';
        }

        // Cryptographically hash password securely utilizing standard BCRYPT algorithm
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $newId = "u_" . uniqid();

        // Save user to DB
        $stmt = $db->prepare("INSERT INTO users (id, email, password_hash, full_name, role, organization) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$newId, $email, $passwordHash, $fullName, $role, $organization]);

        // Start session for the new registrant
        session_start();
        $_SESSION['user_id'] = $newId;
        $_SESSION['user_name'] = $fullName;
        $_SESSION['user_role'] = $role;
        $_SESSION['user_org'] = $organization;

        // Auto log auditing events
        $logId = "l_auth_" . uniqid();
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $logStmt = $db->prepare("INSERT INTO audit_logs (id, user_id, user_name, user_role, action, table_name, record_id, newValue, ip_address) VALUES (?, ?, ?, ?, ?, 'users', ?, ?, ?)");
        $logStmt->execute([
            $logId, 
            $newId, 
            $fullName, 
            $role, 
            "Registered new profile in system", 
            $newId, 
            "Registered user: Name=$fullName, Role=$role, Org=$organization", 
            $ip
        ]);

        echo json_encode([
            "id" => $newId,
            "email" => $email,
            "fullName" => $fullName,
            "role" => $role,
            "organization" => $organization
        ]);
        exit();

    } elseif ($action === 'logout') {
        session_start();
        session_destroy();
        echo json_encode(["success" => true, "message" => "Corporate session ended safely."]);
        exit();
        
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Invalid action parameter. Supported: 'login', 'register', 'logout'"]);
        exit();
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Compliance failure: " . $e->getMessage()]);
}
