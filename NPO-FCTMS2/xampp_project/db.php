<?php
/**
 * NPO-FCTMS Financial Compliance Module
 * db.php - Database connection class utilizing secure secure PDO.
 * Compatible with XAMPP (Localhost MySQL)
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'npo_compliance');
define('DB_USER', 'root');
define('DB_PASS', ''); // Default empty password for XAMPP users

class Database {
    private static $connection = null;

    public static function connect() {
        if (self::$connection === null) {
            try {
                $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ];
                self::$connection = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // Return descriptive database connectivity failure in JSON format
                header('Content-Type: application/json; charset=utf-8');
                http_response_code(500);
                echo json_encode([
                    "error" => "Database Connection Failure: " . $e->getMessage(),
                    "instructions" => "Please guarantee that Apache and MySQL are running in your XAMPP Control Panel and database.sql is imported into phpMyAdmin."
                ]);
                exit();
            }
        }
        return self::$connection;
    }
}
