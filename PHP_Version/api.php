<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");

// Path to data file
$dbFile = __DIR__ . '/database.json';

// Handle POST request: Save database
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $decoded = json_decode($input, true);
    
    if (!$decoded) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid JSON data"]);
        exit;
    }
    
    // Write new content to database.json
    if (file_put_contents($dbFile, json_encode($decoded, JSON_PRETTY_PRINT))) {
        echo json_encode(["status" => "success", "message" => "Database saved successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to write database file"]);
    }
    exit;
}

// Handle GET request: Load database
if (file_exists($dbFile)) {
    echo file_get_contents($dbFile);
} else {
    // Return empty schema if database.json does not exist
    echo json_encode([
        "students" => [],
        "settings" => [],
        "bookStock" => 0,
        "inquiries" => [],
        "tasks" => []
    ]);
}
?>
