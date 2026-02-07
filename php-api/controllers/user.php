<?php
/**
 * User Controller
 */

function updateProfile() {
    $authUser = requireAuth();
    $data = getRequestBody();
    $pdo = getDBConnection();

    $fields = [];
    $values = [];

    if (isset($data['name'])) { $fields[] = "name = ?"; $values[] = $data['name']; }
    if (isset($data['phone'])) { $fields[] = "phone = ?"; $values[] = $data['phone']; }

    if (!empty($fields)) {
        $fields[] = "updated_at = NOW()";
        $values[] = $authUser['user_id'];
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
        $pdo->prepare($sql)->execute($values);
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$authUser['user_id']]);
    $user = $stmt->fetch();

    require_once __DIR__ . '/auth.php';
    successResponse(['user' => formatUser($user)], 'Profile updated');
}

function addresses() {
    $authUser = requireAuth();
    $pdo = getDBConnection();

    $stmt = $pdo->prepare("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC");
    $stmt->execute([$authUser['user_id']]);
    $addresses = $stmt->fetchAll();

    $formatted = array_map(function($addr) {
        return [
            'id' => (int)$addr['id'],
            'name' => $addr['name'],
            'phone' => $addr['phone'],
            'address_line1' => $addr['address_line1'],
            'address_line2' => $addr['address_line2'] ?? null,
            'city' => $addr['city'],
            'state' => $addr['state'],
            'postal_code' => $addr['postal_code'],
            'country' => $addr['country'] ?? 'South Africa',
            'is_default' => (bool)$addr['is_default'],
        ];
    }, $addresses);

    successResponse($formatted);
}
