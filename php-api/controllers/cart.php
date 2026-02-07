<?php
/**
 * Cart Controller (server-side cart - optional, app uses local cart by default)
 */

function index() {
    $authUser = requireAuth();
    successResponse([]);
}

function add() {
    $authUser = requireAuth();
    $data = getRequestBody();
    successResponse(null, 'Item added to cart');
}

function update() {
    $authUser = requireAuth();
    $data = getRequestBody();
    successResponse(null, 'Cart updated');
}

function remove($id) {
    $authUser = requireAuth();
    successResponse(null, 'Item removed');
}
