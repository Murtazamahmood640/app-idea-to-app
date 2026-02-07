<?php
/**
 * Orders Controller
 */

function index() {
    $authUser = requireAuth();
    $pdo = getDBConnection();

    $stmt = $pdo->prepare(
        "SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC"
    );
    $stmt->execute([$authUser['user_id']]);
    $orders = $stmt->fetchAll();

    $formatted = [];
    foreach ($orders as $order) {
        $itemStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
        $itemStmt->execute([$order['id']]);
        $items = $itemStmt->fetchAll();

        $formattedItems = array_map(function($item) {
            $imageUrl = $item['product_image'] ?? '';
            if ($imageUrl && strpos($imageUrl, 'http') !== 0) {
                $imageUrl = 'https://partsbaypro.com/backend-php/' . ltrim($imageUrl, '/');
            }
            return [
                'id' => (int)$item['id'],
                'product_id' => (int)$item['product_id'],
                'product_name' => $item['product_name'],
                'product_image' => $imageUrl,
                'quantity' => (int)$item['quantity'],
                'price' => (float)$item['price'],
                'total' => (float)$item['total'],
            ];
        }, $items);

        $shippingAddress = is_string($order['shipping_address'] ?? null)
            ? json_decode($order['shipping_address'], true)
            : ($order['shipping_address'] ?? []);

        $formatted[] = [
            'id' => (int)$order['id'],
            'order_number' => $order['order_number'],
            'customer_id' => (int)$order['customer_id'],
            'items' => $formattedItems,
            'subtotal' => (float)$order['subtotal'],
            'shipping' => (float)$order['shipping'],
            'tax' => (float)$order['tax'],
            'total' => (float)$order['total'],
            'status' => $order['status'] ?? 'pending',
            'payment_status' => $order['payment_status'] ?? 'pending',
            'payment_method' => $order['payment_method'] ?? 'PayFast',
            'shipping_address' => $shippingAddress,
            'notes' => $order['notes'] ?? null,
            'created_at' => $order['created_at'],
            'updated_at' => $order['updated_at'],
        ];
    }

    successResponse($formatted);
}

function show($id) {
    $authUser = requireAuth();
    $pdo = getDBConnection();

    $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ? AND customer_id = ?");
    $stmt->execute([$id, $authUser['user_id']]);
    $order = $stmt->fetch();

    if (!$order) errorResponse('Order not found', 404);

    // Get items
    $itemStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
    $itemStmt->execute([$order['id']]);
    $items = $itemStmt->fetchAll();

    $formattedItems = array_map(function($item) {
        $imageUrl = $item['product_image'] ?? '';
        if ($imageUrl && strpos($imageUrl, 'http') !== 0) {
            $imageUrl = 'https://partsbaypro.com/backend-php/' . ltrim($imageUrl, '/');
        }
        return [
            'id' => (int)$item['id'],
            'product_id' => (int)$item['product_id'],
            'product_name' => $item['product_name'],
            'product_image' => $imageUrl,
            'quantity' => (int)$item['quantity'],
            'price' => (float)$item['price'],
            'total' => (float)$item['total'],
        ];
    }, $items);

    $shippingAddress = is_string($order['shipping_address'] ?? null)
        ? json_decode($order['shipping_address'], true)
        : ($order['shipping_address'] ?? []);

    successResponse([
        'id' => (int)$order['id'],
        'order_number' => $order['order_number'],
        'customer_id' => (int)$order['customer_id'],
        'items' => $formattedItems,
        'subtotal' => (float)$order['subtotal'],
        'shipping' => (float)$order['shipping'],
        'tax' => (float)$order['tax'],
        'total' => (float)$order['total'],
        'status' => $order['status'] ?? 'pending',
        'payment_status' => $order['payment_status'] ?? 'pending',
        'payment_method' => $order['payment_method'] ?? 'PayFast',
        'shipping_address' => $shippingAddress,
        'notes' => $order['notes'] ?? null,
        'created_at' => $order['created_at'],
        'updated_at' => $order['updated_at'],
    ]);
}

function checkout() {
    $authUser = requireAuth();
    $data = getRequestBody();
    $pdo = getDBConnection();

    if (empty($data['items']) || empty($data['shipping_address'])) {
        errorResponse('Items and shipping address are required', 422);
    }

    try {
        $pdo->beginTransaction();

        // Calculate totals
        $subtotal = 0;
        $orderItems = [];

        foreach ($data['items'] as $item) {
            $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? AND is_active = 1");
            $stmt->execute([$item['product_id']]);
            $product = $stmt->fetch();

            if (!$product) {
                $pdo->rollBack();
                errorResponse("Product #{$item['product_id']} not found", 404);
            }

            if ($product['stock_quantity'] < $item['quantity']) {
                $pdo->rollBack();
                errorResponse("Insufficient stock for {$product['name']}", 400);
            }

            $price = $product['sale_price'] ?? $product['price'];
            $itemTotal = $price * $item['quantity'];
            $subtotal += $itemTotal;

            // Get product image
            $imgStmt = $pdo->prepare("SELECT url FROM product_images WHERE product_id = ? AND is_primary = 1 LIMIT 1");
            $imgStmt->execute([$product['id']]);
            $img = $imgStmt->fetch();
            $productImage = $img ? $img['url'] : ($product['image'] ?? '');

            $orderItems[] = [
                'product_id' => $product['id'],
                'vendor_id' => $product['vendor_id'],
                'product_name' => $product['name'],
                'product_image' => $productImage,
                'quantity' => $item['quantity'],
                'price' => $price,
                'total' => $itemTotal,
            ];
        }

        $shipping = $subtotal > 500 ? 0 : 50;
        $tax = $subtotal * 0.15;
        $total = $subtotal + $shipping + $tax;

        // Generate order number
        $orderNumber = 'BP-' . date('Y') . '-' . str_pad(rand(1, 99999), 5, '0', STR_PAD_LEFT);

        // Create order
        $stmt = $pdo->prepare(
            "INSERT INTO orders (order_number, customer_id, subtotal, shipping, tax, total, status, payment_status, payment_method, shipping_address, notes, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, 'pending', 'pending', 'PayFast', ?, ?, NOW(), NOW())"
        );
        $stmt->execute([
            $orderNumber,
            $authUser['user_id'],
            $subtotal,
            $shipping,
            $tax,
            $total,
            json_encode($data['shipping_address']),
            $data['notes'] ?? null,
        ]);

        $orderId = $pdo->lastInsertId();

        // Create order items and update stock
        foreach ($orderItems as $orderItem) {
            $stmt = $pdo->prepare(
                "INSERT INTO order_items (order_id, product_id, vendor_id, product_name, product_image, quantity, price, total, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())"
            );
            $stmt->execute([
                $orderId,
                $orderItem['product_id'],
                $orderItem['vendor_id'],
                $orderItem['product_name'],
                $orderItem['product_image'],
                $orderItem['quantity'],
                $orderItem['price'],
                $orderItem['total'],
            ]);

            // Reduce stock
            $pdo->prepare("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?")
                ->execute([$orderItem['quantity'], $orderItem['product_id']]);
        }

        $pdo->commit();

        // Return order with payment URL placeholder
        successResponse([
            'order' => [
                'id' => (int)$orderId,
                'order_number' => $orderNumber,
                'total' => $total,
                'status' => 'pending',
            ],
            // In production, generate actual PayFast payment URL here
            'payment_url' => null,
        ], 'Order created successfully', 201);

    } catch (Exception $e) {
        $pdo->rollBack();
        errorResponse('Failed to create order: ' . $e->getMessage(), 500);
    }
}
