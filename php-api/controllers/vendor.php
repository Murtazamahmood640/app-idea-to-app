<?php
/**
 * Vendor Controller
 */

function dashboard() {
    $authUser = requireRole('vendor');
    $pdo = getDBConnection();
    $vendorId = $authUser['user_id'];

    // Total products
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM products WHERE vendor_id = ?");
    $stmt->execute([$vendorId]);
    $totalProducts = $stmt->fetchColumn();

    // Total sales & revenue
    $stmt = $pdo->prepare(
        "SELECT COUNT(DISTINCT oi.order_id) as total_sales, COALESCE(SUM(oi.total), 0) as total_revenue
         FROM order_items oi
         WHERE oi.vendor_id = ?"
    );
    $stmt->execute([$vendorId]);
    $salesData = $stmt->fetch();

    // Pending orders
    $stmt = $pdo->prepare(
        "SELECT COUNT(DISTINCT oi.order_id) FROM order_items oi
         JOIN orders o ON oi.order_id = o.id
         WHERE oi.vendor_id = ? AND o.status = 'pending'"
    );
    $stmt->execute([$vendorId]);
    $pendingOrders = $stmt->fetchColumn();

    // Monthly sales (last 4 months)
    $stmt = $pdo->prepare(
        "SELECT DATE_FORMAT(o.created_at, '%b') as month,
                COUNT(DISTINCT o.id) as sales,
                COALESCE(SUM(oi.total), 0) as revenue
         FROM order_items oi
         JOIN orders o ON oi.order_id = o.id
         WHERE oi.vendor_id = ? AND o.created_at >= DATE_SUB(NOW(), INTERVAL 4 MONTH)
         GROUP BY YEAR(o.created_at), MONTH(o.created_at)
         ORDER BY o.created_at ASC"
    );
    $stmt->execute([$vendorId]);
    $monthlySales = $stmt->fetchAll();

    successResponse([
        'total_sales' => (int)$salesData['total_sales'],
        'total_revenue' => (float)$salesData['total_revenue'],
        'total_products' => (int)$totalProducts,
        'pending_orders' => (int)$pendingOrders,
        'monthly_sales' => array_map(function($m) {
            return [
                'month' => $m['month'],
                'sales' => (int)$m['sales'],
                'revenue' => (float)$m['revenue'],
            ];
        }, $monthlySales),
    ]);
}

function products() {
    $authUser = requireRole('vendor');
    $pdo = getDBConnection();

    $stmt = $pdo->prepare(
        "SELECT p.*, c.name as category_name FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.vendor_id = ? ORDER BY p.created_at DESC"
    );
    $stmt->execute([$authUser['user_id']]);
    $products = $stmt->fetchAll();

    require_once __DIR__ . '/products.php';
    $formatted = array_map(function($p) use ($pdo) {
        return formatProduct($pdo, $p);
    }, $products);

    successResponse($formatted);
}

function createProduct() {
    $authUser = requireRole('vendor');
    $pdo = getDBConnection();

    // Handle both JSON and FormData
    $data = $_POST ?: getRequestBody();

    if (empty($data['name']) || empty($data['price'])) {
        errorResponse('Name and price are required', 422);
    }

    $modelCompat = $data['model_compatibility'] ?? [];
    if (is_string($modelCompat)) {
        $modelCompat = array_filter(array_map('trim', explode("\n", $modelCompat)));
    }

    $specs = $data['specifications'] ?? [];
    $dims = $data['dimensions'] ?? null;

    $stmt = $pdo->prepare(
        "INSERT INTO products (vendor_id, category_id, name, description, price, sale_price, brand, model_compatibility, year_range_start, year_range_end, `condition`, sku, stock_quantity, specifications, weight, dimensions, warranty_months, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())"
    );

    $stmt->execute([
        $authUser['user_id'],
        $data['category_id'] ?? null,
        $data['name'],
        $data['description'] ?? '',
        (float)$data['price'],
        !empty($data['sale_price']) ? (float)$data['sale_price'] : null,
        $data['brand'] ?? '',
        json_encode($modelCompat),
        !empty($data['year_range_start']) ? (int)$data['year_range_start'] : null,
        !empty($data['year_range_end']) ? (int)$data['year_range_end'] : null,
        $data['condition'] ?? 'new',
        $data['sku'] ?? '',
        (int)($data['stock_quantity'] ?? 0),
        json_encode($specs),
        !empty($data['weight']) ? (float)$data['weight'] : null,
        $dims ? json_encode($dims) : null,
        !empty($data['warranty_months']) ? (int)$data['warranty_months'] : null,
    ]);

    $productId = $pdo->lastInsertId();

    // Handle image uploads
    if (!empty($_FILES['images'])) {
        $uploadDir = dirname(__DIR__, 2) . '/product-images/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

        $files = $_FILES['images'];
        $fileCount = is_array($files['name']) ? count($files['name']) : 1;

        for ($i = 0; $i < $fileCount; $i++) {
            $tmpName = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
            $origName = is_array($files['name']) ? $files['name'][$i] : $files['name'];
            $error = is_array($files['error']) ? $files['error'][$i] : $files['error'];

            if ($error !== UPLOAD_ERR_OK) continue;

            $ext = pathinfo($origName, PATHINFO_EXTENSION);
            $filename = 'product-' . $productId . '-' . $i . '-' . time() . '.' . $ext;
            $destination = $uploadDir . $filename;

            if (move_uploaded_file($tmpName, $destination)) {
                $isPrimary = ($i === 0) ? 1 : 0;
                $pdo->prepare("INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, ?)")
                    ->execute([$productId, 'product-images/' . $filename, $isPrimary]);
            }
        }
    }

    require_once __DIR__ . '/products.php';
    $stmt = $pdo->prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?");
    $stmt->execute([$productId]);
    $product = $stmt->fetch();

    successResponse(formatProduct($pdo, $product), 'Product created successfully', 201);
}

function updateProduct($id) {
    $authUser = requireRole('vendor');
    $pdo = getDBConnection();

    // Verify ownership
    $stmt = $pdo->prepare("SELECT id FROM products WHERE id = ? AND vendor_id = ?");
    $stmt->execute([$id, $authUser['user_id']]);
    if (!$stmt->fetch()) errorResponse('Product not found', 404);

    $data = $_POST ?: getRequestBody();

    $fields = [];
    $values = [];

    $allowedFields = ['name', 'description', 'price', 'sale_price', 'category_id', 'brand', 'condition', 'sku', 'stock_quantity', 'weight', 'warranty_months'];
    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $dbField = $field === 'condition' ? '`condition`' : $field;
            $fields[] = "$dbField = ?";
            $values[] = $data[$field];
        }
    }

    if (!empty($data['model_compatibility'])) {
        $mc = is_string($data['model_compatibility'])
            ? array_filter(array_map('trim', explode("\n", $data['model_compatibility'])))
            : $data['model_compatibility'];
        $fields[] = "model_compatibility = ?";
        $values[] = json_encode($mc);
    }

    if (!empty($data['specifications'])) {
        $fields[] = "specifications = ?";
        $values[] = json_encode($data['specifications']);
    }

    if (!empty($data['dimensions'])) {
        $fields[] = "dimensions = ?";
        $values[] = json_encode($data['dimensions']);
    }

    if (!empty($fields)) {
        $fields[] = "updated_at = NOW()";
        $values[] = $id;
        $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?";
        $pdo->prepare($sql)->execute($values);
    }

    successResponse(null, 'Product updated');
}

function deleteProduct($id) {
    $authUser = requireRole('vendor');
    $pdo = getDBConnection();

    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ? AND vendor_id = ?");
    $stmt->execute([$id, $authUser['user_id']]);

    if ($stmt->rowCount() === 0) errorResponse('Product not found', 404);

    successResponse(null, 'Product deleted');
}

function sales() {
    $authUser = requireRole('vendor');
    $pdo = getDBConnection();

    $stmt = $pdo->prepare(
        "SELECT oi.*, o.order_number, o.status, o.created_at, u.name as customer_name
         FROM order_items oi
         JOIN orders o ON oi.order_id = o.id
         JOIN users u ON o.customer_id = u.id
         WHERE oi.vendor_id = ?
         ORDER BY o.created_at DESC"
    );
    $stmt->execute([$authUser['user_id']]);
    $sales = $stmt->fetchAll();

    $formatted = array_map(function($sale) {
        $imageUrl = $sale['product_image'] ?? '';
        if ($imageUrl && strpos($imageUrl, 'http') !== 0) {
            $imageUrl = 'https://partsbaypro.com/backend-php/' . ltrim($imageUrl, '/');
        }
        return [
            'id' => (int)$sale['id'],
            'order_id' => (int)$sale['order_id'],
            'order_number' => $sale['order_number'],
            'product_id' => (int)$sale['product_id'],
            'product_name' => $sale['product_name'],
            'product_image' => $imageUrl,
            'quantity' => (int)$sale['quantity'],
            'price' => (float)$sale['price'],
            'total' => (float)$sale['total'],
            'status' => $sale['status'],
            'customer_name' => $sale['customer_name'],
            'created_at' => $sale['created_at'],
        ];
    }, $sales);

    successResponse($formatted);
}
