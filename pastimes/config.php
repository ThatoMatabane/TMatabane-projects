<?php
/* config.php */
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'pastimes_db');

// Graceful connection handling for XAMPP
mysqli_report(MYSQLI_REPORT_STRICT);
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
} catch (Exception $e) {
    die("<div style='font-family:sans-serif; padding:40px; max-width:600px; margin:50px auto; border:1px solid #e5e7eb; background:white; border-radius:24px; shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);'>
        <h2 style='color:#4f46e5; margin-top:0; font-size:24px; font-weight:900;'>Database Connection Required</h2>
        <p style='color:#6b7280; line-height:1.6;'>It looks like the website cannot connect to the database. This is usually because the MySQL service in XAMPP isn't running.</p>
        <div style='background:#f9fafb; padding:20px; border-radius:16px; margin:20px 0; border:1px solid #f3f4f6;'>
            <p style='margin:0; font-size:14px; font-weight:bold; color:#374151;'>Troubleshooting Steps:</p>
            <ol style='font-size:14px; color:#4b5563; margin-top:10px; padding-left:20px;'>
                <li style='margin-bottom:8px'>Open your <b>XAMPP Control Panel</b>.</li>
                <li style='margin-bottom:8px'>Click the <b>'Start'</b> button for <b>MySQL</b>.</li>
                <li style='margin-bottom:8px'>Ensure the database <b>'".DB_NAME."'</b> exists in phpMyAdmin.</li>
            </ol>
        </div>
        <p style='font-size:12px; color:#9ca3af;'>Error Details: " . $e->getMessage() . "</p>
        <button onclick='window.location.reload()' style='background:#4f46e5; color:white; border:none; padding:12px 24px; border-radius:99px; font-weight:bold; cursor:pointer; width:100%; margin-top:10px;'>Retry Connection</button>
    </div>");
}

session_start();
?>
