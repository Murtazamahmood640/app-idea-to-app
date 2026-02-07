<?php
/**
 * Products Controller
 */

function index() {
    $pdo = getDBConnection();

    $where = ["p.is_active = 1"];
    $params = [];

    // Search
    if (!empty($_GET['search'])) {
        $where[] = "(p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)";
        $searchTerm = '%' . $_GET['search'] . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    // Category filter
    if (!empty($_GET['category'])) {
        $where[] = "c.slug = ?";
        $params[] = $_GET['category'];
    }

    // Brand filter
    if (!empty($_GET['brand'])) {
        $where[] = "p.brand = ?";
        $params[] = $_GET['brand'];
    }

    // Condition filter
    if (!empty($_GET['condition']) && $_GET['condition'] !== 'all') {
        $where[] = "p.`condition` = ?";
        $params[] = $_GET['condition'];
    }

    // Price range
    if (!empty($_GET['min_price'])) {
        $where[] = "COALESCE(p.sale_price, p.price) >= ?";
        $params[] = (float)$_GET['min_price'];
    }
    if (!empty($_GET['max_price'])) {
        $where[] = "COALESCE(p.sale_price, p.price) <= ?";
        $params[] = (float)$_GET['max_price'];
    }

    // Location filter
    if (!empty($_GET['location'])) {
        $where[] = "p.location = ?";
        $params[] = $_GET['location'];
    }

    $whereClause = implode(' AND ', $where);

    // Sorting
    $orderBy = "p.created_at DESC";
    if (!empty($_GET['sort'])) {
        switch ($_GET['sort']) {
            case 'price_asc': $orderBy = "COALESCE(p.sale_price, p.price) ASC"; break;
            case 'price_desc': $orderBy = "COALESCE(p.sale_price, p.price) DESC"; break;
            case 'newest': $orderBy = "p.created_at DESC"; break;
        }
    }

    // Pagination
    $page = max(1, (int)($_GET['page'] ?? 1));
    $perPage = min(50, max(1, (int)($_GET['per_page'] ?? 20)));
    $offset = ($page - 1) * $perPage;

    // Count total
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE $whereClause");
    $countStmt->execute($params);
    $total = $countStmt->fetchColumn();

    // Fetch products
    $sql = "SELECT p.*, c.name as category_name, c.slug as category_slug, u.name as vendor_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN users u ON p.vendor_id = u.id
            WHERE $whereClause
            ORDER BY $orderBy
            LIMIT $perPage OFFSET $offset";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    // Fetch images for all products
    $productIds = array_column($products, 'id');
    $formattedProducts = [];

    foreach ($products as $product) {
        $formattedProducts[] = formatProduct($pdo, $product);
    }

    jsonResponse([
        'success' => true,
        'data' => $formattedProducts,
        'meta' => [
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
            'per_page' => $perPage,
            'total' => (int)$total,
        ],
    ]);
}

function show($id) {
    $pdo = getDBConnection();

    $stmt = $pdo->prepare(
        "SELECT p.*, c.name as category_name, c.slug as category_slug, u.name as vendor_name
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN users u ON p.vendor_id = u.id
         WHERE p.id = ?"
    );
    $stmt->execute([$id]);
    $product = $stmt->fetch();

    if (!$product) errorResponse('Product not found', 404);

    successResponse(formatProduct($pdo, $product));
}

function formatProduct($pdo, $product) {
    // Get images
    $imgStmt = $pdo->prepare("SELECT id, url, is_primary FROM product_images WHERE product_id = ?");
    $imgStmt->execute([$product['id']]);
    $images = $imgStmt->fetchAll();

    // If no images in product_images table, check for image column
    if (empty($images) && !empty($product['image'])) {
        $imageUrl = $product['image'];
        // Make relative URLs absolute
        if (strpos($imageUrl, 'http') !== 0) {
            $imageUrl = 'https://partsbaypro.com/backend-php/' . ltrim($imageUrl, '/');
        }
        $images = [['id' => 0, 'url' => $imageUrl, 'is_primary' => true]];
    }

    // Format images URLs
    foreach ($images as &$img) {
        if (strpos($img['url'], 'http') !== 0) {
            $img['url'] = 'https://partsbaypro.com/backend-php/' . ltrim($img['url'], '/');
        }
        $img['is_primary'] = (bool)$img['is_primary'];
    }

    // Parse JSON fields safely
    $modelCompat = is_string($product['model_compatibility'] ?? null)
        ? json_decode($product['model_compatibility'], true) ?? []
        : ($product['model_compatibility'] ?? []);

    $specs = is_string($product['specifications'] ?? null)
        ? json_decode($product['specifications'], true) ?? []
        : ($product['specifications'] ?? []);

    $dimensions = is_string($product['dimensions'] ?? null)
        ? json_decode($product['dimensions'], true)
        : ($product['dimensions'] ?? null);

    return [
        'id' => (int)$product['id'],
        'vendor_id' => (int)($product['vendor_id'] ?? 0),
        'vendor_name' => $product['vendor_name'] ?? '',
        'name' => $product['name'] ?? '',
        'description' => $product['description'] ?? '',
        'price' => (float)($product['price'] ?? 0),
        'sale_price' => !empty($product['sale_price']) ? (float)$product['sale_price'] : null,
        'category_id' => (int)($product['category_id'] ?? 0),
        'category_name' => $product['category_name'] ?? '',
        'brand' => $product['brand'] ?? '',
        'model_compatibility' => $modelCompat,
        'year_range_start' => $product['year_range_start'] ? (int)$product['year_range_start'] : null,
        'year_range_end' => $product['year_range_end'] ? (int)$product['year_range_end'] : null,
        'condition' => $product['condition'] ?? 'new',
        'sku' => $product['sku'] ?? '',
        'stock_quantity' => (int)($product['stock_quantity'] ?? 0),
        'images' => $images,
        'specifications' => $specs,
        'weight' => $product['weight'] ? (float)$product['weight'] : null,
        'dimensions' => $dimensions,
        'warranty_months' => $product['warranty_months'] ? (int)$product['warranty_months'] : null,
        'is_active' => (bool)($product['is_active'] ?? true),
        'created_at' => $product['created_at'] ?? '',
        'updated_at' => $product['updated_at'] ?? '',
    ];
}
