<?php include 'config.php'; ?>
<?php include 'header.php'; ?>

<?php
$productId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$sql = "SELECT p.*, u.fullName as sellerName FROM products p JOIN users u ON p.userId = u.userId WHERE p.productId = $productId";
$result = $conn->query($sql);
$product = $result->fetch_assoc();

if (!$product) {
    echo "<div class='text-center py-20 font-bold'>Product not found</div>";
    exit;
}
?>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
    <div class="grid md:grid-cols-2 gap-12">
        <!-- Gallery -->
        <div class="space-y-4">
            <div class="aspect-[4/5] bg-gray-100 rounded-[2.5rem] overflow-hidden">
                <img src="<?php echo $product['imageUrl']; ?>" class="w-full h-full object-cover">
            </div>
        </div>

        <!-- Details -->
        <div class="space-y-8">
            <div class="space-y-2">
                <div class="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                    <?php echo $product['brand']; ?> • <?php echo $product['category']; ?>
                </div>
                <h1 class="text-4xl font-black tracking-tight"><?php echo $product['name']; ?></h1>
                <div class="text-3xl font-bold text-gray-900">R<?php echo number_format($product['price'], 2); ?></div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-white border border-gray-100 rounded-2xl">
                    <div class="text-xs text-gray-400 font-bold uppercase mb-1">Condition</div>
                    <div class="font-bold"><?php echo $product['condition_status']; ?></div>
                </div>
                <div class="p-4 bg-white border border-gray-100 rounded-2xl">
                    <div class="text-xs text-gray-400 font-bold uppercase mb-1">Size</div>
                    <div class="font-bold"><?php echo $product['size']; ?></div>
                </div>
            </div>

            <p class="text-gray-500 leading-relaxed"><?php echo $product['description']; ?></p>

            <div class="flex gap-4">
                <button class="flex-1 bg-indigo-600 text-white py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    <i data-lucide="shopping-cart" class="w-5 h-5"></i> Add to Bag
                </button>
                <button class="p-4 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors">
                    <i data-lucide="message-square" class="w-6 h-6 text-gray-600"></i>
                </button>
            </div>

            <!-- Seller Info -->
            <div class="flex items-center gap-4 p-6 bg-white rounded-3xl border border-gray-100">
                <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <i data-lucide="user" class="w-6 h-6 text-indigo-600"></i>
                </div>
                <div class="flex-1">
                    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Seller</div>
                    <div class="font-bold"><?php echo $product['sellerName']; ?></div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php include 'footer.php'; ?>
