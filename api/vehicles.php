<?php
// ========================================================
// CIS 483 / 583 - MNSU CampusEco
// Phase 3: Task 3.4 - Vehicle Status & Battery API Endpoint
// Author: Pratik Niroula
// ========================================================

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Fallback if MySQL is offline
if (!$pdo) {
    echo json_encode([
        'status' => 'mock',
        'vehicle' => ['name' => 'EcoCart 04', 'battery' => 82, 'status' => 'On Delivery']
    ]);
    exit();
}

// 1. GET: Fetch vehicle info
if ($method === 'GET') {
    $stmt = $pdo->query('SELECT cart_code, name, battery_level AS battery, status FROM vehicles LIMIT 1');
    echo json_encode(['status' => 'success', 'vehicle' => $stmt->fetch()]);
    exit();
}

// 2. PUT: Update vehicle battery
if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $pdo->prepare('UPDATE vehicles SET battery_level = :battery, status = :status WHERE cart_code = "cart04"');
    $stmt->execute([
        ':battery' => intval($data['battery']),
        ':status'  => $data['status'] ?? 'Available'
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Vehicle updated']);
    exit();
}
