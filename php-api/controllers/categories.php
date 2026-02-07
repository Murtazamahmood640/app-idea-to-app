<?php
/**
 * Categories Controller
 */

function index() {
    $pdo = getDBConnection();

    $stmt = $pdo->query(
        "SELECT c.*, COUNT(p.id) as product_count
         FROM categories c
         LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
         GROUP BY c.id
         ORDER BY c.name ASC"
    );
    $categories = $stmt->fetchAll();

    $formatted = array_map(function($cat) {
        return [
            'id' => (int)$cat['id'],
            'name' => $cat['name'],
            'slug' => $cat['slug'] ?? strtolower(str_replace(' ', '-', $cat['name'])),
            'parent_id' => $cat['parent_id'] ? (int)$cat['parent_id'] : null,
            'image' => $cat['image'] ?? null,
            'product_count' => (int)$cat['product_count'],
        ];
    }, $categories);

    successResponse($formatted);
}
