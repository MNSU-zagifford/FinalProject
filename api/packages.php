<?php
// ========================================================
// CIS 483 / 583 - MNSU CampusEco
// Phase 3: Task 3.4 - Packages API Endpoint
// Author: Pratik Niroula
// ========================================================

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// Fallback sample data if MySQL database is not connected
if (!$pdo) {
    echo json_encode([
        'status' => 'mock',
        'packages' => [
            ['tracking' => 'PKG10234', 'destination' => 'Julia Sears Residence', 'priority' => 'Normal', 'status' => 'Loaded'],
            ['tracking' => 'PKG39281', 'destination' => 'Centennial Student Union', 'priority' => 'Urgent', 'status' => 'En Route'],
            ['tracking' => 'PKG57321', 'destination' => 'Memorial Library', 'priority' => 'Normal', 'status' => 'Received']
        ]
    ]);
    exit();
}

// 1. GET: Fetch all packages
if ($method === 'GET') {
    $stmt = $pdo->query('SELECT tracking_number AS tracking, destination, size, weight, priority, status FROM packages ORDER BY id DESC');
    $rows = $stmt->fetchAll();
    echo json_encode(['status' => 'success', 'packages' => $rows]);
    exit();
}

// 2. POST: Add a new package
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['tracking']) || empty($data['destination'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Tracking number and destination are required.']);
        exit();
    }

    // Use parameterized prepared statement to prevent SQL injection
    $stmt = $pdo->prepare('INSERT INTO packages (tracking_number, destination, size, weight, priority, status) VALUES (:tracking, :dest, :size, :weight, :priority, "Received")');
    $stmt->execute([
        ':tracking' => strtoupper(trim($data['tracking'])),
        ':dest'     => trim($data['destination']),
        ':size'     => $data['size'] ?? 'Medium',
        ':weight'   => $data['weight'] ?? 1.0,
        ':priority' => $data['priority'] ?? 'Normal'
    ]);

    http_response_code(201);
    echo json_encode(['status' => 'success', 'message' => 'Package added successfully']);
    exit();
}

// 3. PUT: Update package status
if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    $stmt = $pdo->prepare('UPDATE packages SET status = :status WHERE tracking_number = :tracking');
    $stmt->execute([
        ':status'   => $data['status'],
        ':tracking' => strtoupper(trim($data['tracking']))
    ]);

    echo json_encode(['status' => 'success', 'message' => 'Status updated']);
    exit();
}
