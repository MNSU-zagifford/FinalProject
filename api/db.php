<?php
// ========================================================
// CIS 483 / 583 - MNSU CampusEco
// Phase 3: Task 3.4 - Database Connection (PDO)
// Author: Pratik Niroula
// ========================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');

// Database credentials
$host = '127.0.0.1';
$dbname = 'mnsu_campuseco';
$username = 'root';
$password = '';

try {
    // Create PDO connection with prepared statements enabled
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    // If MySQL isn't running on the machine, set to null
    $pdo = null;
}
