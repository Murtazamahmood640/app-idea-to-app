<?php
/**
 * JSON Response helpers
 */

function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function successResponse($data = null, $message = 'Success', $statusCode = 200) {
    jsonResponse([
        'success' => true,
        'message' => $message,
        'data' => $data,
    ], $statusCode);
}

function errorResponse($message = 'Error', $statusCode = 400, $errors = null) {
    $response = [
        'success' => false,
        'message' => $message,
    ];
    if ($errors) {
        $response['errors'] = $errors;
    }
    jsonResponse($response, $statusCode);
}

function getRequestBody() {
    $body = file_get_contents('php://input');
    return json_decode($body, true) ?? [];
}

function getRequestMethod() {
    return $_SERVER['REQUEST_METHOD'];
}
