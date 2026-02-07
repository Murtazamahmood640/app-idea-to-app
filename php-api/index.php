<?php
/**
 * BayPro API Router
 * Upload this entire 'api' folder into your backend-php/ directory on Hostinger
 */

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/helpers/jwt.php';
require_once __DIR__ . '/helpers/response.php';

// Parse the request URI
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = '/backend-php/api';
$path = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace($basePath, '', $path);
$path = trim($path, '/');
$method = getRequestMethod();

// Simple router
$routes = [
    // Auth
    'GET:auth/me'           => 'controllers/auth.php@me',
    'POST:auth/login'       => 'controllers/auth.php@login',
    'POST:auth/register'    => 'controllers/auth.php@register',
    'POST:auth/logout'      => 'controllers/auth.php@logout',

    // Products
    'GET:products'          => 'controllers/products.php@index',
    'GET:products/(\d+)'    => 'controllers/products.php@show',

    // Categories
    'GET:categories'        => 'controllers/categories.php@index',

    // Orders
    'GET:orders'            => 'controllers/orders.php@index',
    'GET:orders/(\d+)'      => 'controllers/orders.php@show',
    'POST:orders/checkout'  => 'controllers/orders.php@checkout',

    // Cart (server-side)
    'GET:cart'              => 'controllers/cart.php@index',
    'POST:cart/add'         => 'controllers/cart.php@add',
    'PUT:cart/update'       => 'controllers/cart.php@update',
    'DELETE:cart/remove/(\d+)' => 'controllers/cart.php@remove',

    // Vendor
    'GET:vendor/dashboard'  => 'controllers/vendor.php@dashboard',
    'GET:vendor/products'   => 'controllers/vendor.php@products',
    'POST:vendor/products'  => 'controllers/vendor.php@createProduct',
    'PUT:vendor/products/(\d+)'  => 'controllers/vendor.php@updateProduct',
    'DELETE:vendor/products/(\d+)' => 'controllers/vendor.php@deleteProduct',
    'GET:vendor/sales'      => 'controllers/vendor.php@sales',

    // User
    'PUT:user/profile'      => 'controllers/user.php@updateProfile',
    'GET:user/addresses'    => 'controllers/user.php@addresses',

    // Payment
    'POST:payment/payfast/initiate' => 'controllers/payment.php@initiate',
    'POST:payment/payfast/callback' => 'controllers/payment.php@callback',
];

// Match route
$matched = false;
foreach ($routes as $route => $handler) {
    [$routeMethod, $routePath] = explode(':', $route, 2);

    if ($method !== $routeMethod) continue;

    $pattern = '#^' . $routePath . '$#';
    if (preg_match($pattern, $path, $matches)) {
        [$file, $function] = explode('@', $handler);
        $filePath = __DIR__ . '/' . $file;

        if (file_exists($filePath)) {
            require_once $filePath;
            array_shift($matches); // Remove full match
            call_user_func_array($function, $matches);
        } else {
            errorResponse("Controller not found: $file", 500);
        }

        $matched = true;
        break;
    }
}

if (!$matched) {
    errorResponse('Endpoint not found', 404);
}
