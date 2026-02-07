<?php
/**
 * Authentication Controller
 */

function login() {
    $data = getRequestBody();

    if (empty($data['email']) || empty($data['password'])) {
        errorResponse('Email and password are required', 422, [
            'email' => ['Email is required'],
            'password' => ['Password is required'],
        ]);
    }

    $pdo = getDBConnection();

    // Check if users table has the expected columns - adapt query to your schema
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->execute([$data['email']]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($data['password'], $user['password'])) {
        errorResponse('Invalid email or password', 401);
    }

    $token = generateJWT($user['id'], $user['email'], $user['role'] ?? 'customer');

    successResponse([
        'user' => formatUser($user),
        'token' => $token,
    ], 'Login successful');
}

function register() {
    $data = getRequestBody();

    $errors = [];
    if (empty($data['name'])) $errors['name'] = ['Name is required'];
    if (empty($data['email'])) $errors['email'] = ['Email is required'];
    if (empty($data['password'])) $errors['password'] = ['Password is required'];
    if (!empty($errors)) errorResponse('Validation failed', 422, $errors);

    $pdo = getDBConnection();

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->execute([$data['email']]);
    if ($stmt->fetch()) {
        errorResponse('Validation failed', 422, ['email' => ['Email already registered']]);
    }

    $role = $data['role'] ?? 'customer';
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

    $stmt = $pdo->prepare(
        "INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())"
    );
    $stmt->execute([$data['name'], $data['email'], $hashedPassword, $role]);

    $userId = $pdo->lastInsertId();

    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    $token = generateJWT($user['id'], $user['email'], $user['role']);

    successResponse([
        'user' => formatUser($user),
        'token' => $token,
    ], 'Registration successful', 201);
}

function me() {
    $authUser = requireAuth();
    $pdo = getDBConnection();

    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$authUser['user_id']]);
    $user = $stmt->fetch();

    if (!$user) errorResponse('User not found', 404);

    successResponse(['user' => formatUser($user)]);
}

function logout() {
    // With JWT, just respond success - client removes token
    successResponse(null, 'Logged out successfully');
}

function formatUser($user) {
    return [
        'id' => (int)$user['id'],
        'name' => $user['name'] ?? '',
        'email' => $user['email'],
        'phone' => $user['phone'] ?? null,
        'role' => $user['role'] ?? 'customer',
        'avatar' => $user['avatar'] ?? null,
        'created_at' => $user['created_at'] ?? date('Y-m-d H:i:s'),
        'updated_at' => $user['updated_at'] ?? date('Y-m-d H:i:s'),
    ];
}
