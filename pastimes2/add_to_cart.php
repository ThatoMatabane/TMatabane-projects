<?php
include 'config.php';

if (!isset($_SESSION['userId'])) {
    echo json_encode(['status' => 'error', 'message' => 'Please login to add items to your bag.']);
    exit;
}

if (isset($_POST['productId'])) {
    $userId = $_SESSION['userId'];
    $productId = intval($_POST['productId']);
    $quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 1;

    // Check if item already in cart
    $checkSql = "SELECT cartId FROM carts WHERE userId = $userId AND productId = $productId";
    $result = $conn->query($checkSql);

    if ($result->num_rows > 0) {
        $updateSql = "UPDATE carts SET quantity = quantity + $quantity WHERE userId = $userId AND productId = $productId";
        if ($conn->query($updateSql)) {
            echo json_encode(['status' => 'success', 'message' => 'Bag updated!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update bag.']);
        }
    } else {
        $insertSql = "INSERT INTO carts (userId, productId, quantity) VALUES ($userId, $productId, $quantity)";
        if ($conn->query($insertSql)) {
            echo json_encode(['status' => 'success', 'message' => 'Item added to bag!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to add item.']);
        }
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
}
?>
