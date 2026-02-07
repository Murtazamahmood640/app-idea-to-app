<?php
/**
 * Payment Controller - PayFast Integration
 * Update with your PayFast merchant credentials
 */

define('PAYFAST_MERCHANT_ID', 'your_merchant_id');     // Update
define('PAYFAST_MERCHANT_KEY', 'your_merchant_key');    // Update
define('PAYFAST_PASSPHRASE', 'your_passphrase');        // Update
define('PAYFAST_SANDBOX', true); // Set to false for production
define('PAYFAST_URL', PAYFAST_SANDBOX ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process');

function initiate() {
    $authUser = requireAuth();
    $data = getRequestBody();
    $pdo = getDBConnection();

    if (empty($data['order_id'])) {
        errorResponse('Order ID is required', 422);
    }

    $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ? AND customer_id = ?");
    $stmt->execute([$data['order_id'], $authUser['user_id']]);
    $order = $stmt->fetch();

    if (!$order) errorResponse('Order not found', 404);

    // Get user details
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$authUser['user_id']]);
    $user = $stmt->fetch();

    // Build PayFast data
    $pfData = [
        'merchant_id' => PAYFAST_MERCHANT_ID,
        'merchant_key' => PAYFAST_MERCHANT_KEY,
        'return_url' => 'https://partsbaypro.com/home/payment-success.php?order_id=' . $order['id'],
        'cancel_url' => 'https://partsbaypro.com/home/payment-cancel.php?order_id=' . $order['id'],
        'notify_url' => 'https://partsbaypro.com/backend-php/api/payment/payfast/callback',
        'name_first' => explode(' ', $user['name'])[0] ?? '',
        'name_last' => explode(' ', $user['name'])[1] ?? '',
        'email_address' => $user['email'],
        'amount' => number_format($order['total'], 2, '.', ''),
        'item_name' => 'BayPro Order ' . $order['order_number'],
        'custom_str1' => $order['id'],
    ];

    // Generate signature
    $pfParamString = '';
    foreach ($pfData as $key => $val) {
        $pfParamString .= $key . '=' . urlencode(trim($val)) . '&';
    }
    $pfParamString = rtrim($pfParamString, '&');

    if (!empty(PAYFAST_PASSPHRASE)) {
        $pfParamString .= '&passphrase=' . urlencode(PAYFAST_PASSPHRASE);
    }

    $pfData['signature'] = md5($pfParamString);

    successResponse([
        'payment_url' => PAYFAST_URL,
        'form_data' => $pfData,
    ]);
}

function callback() {
    // PayFast ITN (Instant Transaction Notification)
    $pfData = $_POST;

    if (empty($pfData)) {
        errorResponse('No data received', 400);
    }

    $pdo = getDBConnection();
    $orderId = $pfData['custom_str1'] ?? null;

    if (!$orderId) {
        errorResponse('No order ID', 400);
    }

    // Verify payment status
    $paymentStatus = $pfData['payment_status'] ?? '';

    if ($paymentStatus === 'COMPLETE') {
        $pdo->prepare("UPDATE orders SET payment_status = 'paid', status = 'confirmed', payment_reference = ?, updated_at = NOW() WHERE id = ?")
            ->execute([$pfData['pf_payment_id'] ?? '', $orderId]);
    } elseif ($paymentStatus === 'CANCELLED') {
        $pdo->prepare("UPDATE orders SET payment_status = 'failed', updated_at = NOW() WHERE id = ?")
            ->execute([$orderId]);
    }

    http_response_code(200);
    echo 'OK';
    exit;
}
