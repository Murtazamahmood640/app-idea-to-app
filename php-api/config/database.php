<?php
/**
 * BayPro Database Configuration
 * Update these values with your Hostinger MySQL credentials
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');  // Update this
define('DB_USER', 'your_database_user');  // Update this
define('DB_PASS', 'your_database_password');  // Update this

define('JWT_SECRET', 'your-secret-key-change-this-to-something-random');
define('JWT_EXPIRY', 86400 * 7); // 7 days

function getDBConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit;
    }
}
