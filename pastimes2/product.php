<?php include 'config.php'; ?>
<?php include 'header.php'; ?>

<?php
$productId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$sql = "SELECT p.*, u.fullName as sellerName FROM products p JOIN users u ON p.userId = u.userId WHERE p.productId = $productId";
$result = $conn->query($sql);
$product = $result->fetch_assoc();

if (!$product) {
    echo "<div class='text-center py-20 font-bold text-gray-400'>Product not found</div>";
    exit;
}
?>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
    <div class="grid md:grid-cols-2 gap-12">
        <!-- Gallery -->
        <div class="space-y-4">
            <div class="aspect-[4/5] bg-darkCard border border-darkBorder rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img src="<?php echo $product['imageUrl']; ?>" class="w-full h-full object-cover">
            </div>
        </div>

        <!-- Details -->
        <div class="space-y-8">
            <div class="space-y-3">
                <div class="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                    <?php echo $product['brand']; ?> • <?php echo $product['category']; ?>
                </div>
                <h1 class="text-4xl font-black tracking-tight text-white"><?php echo $product['name']; ?></h1>
                <div class="text-3xl font-black text-indigo-300">R<?php echo number_format($product['price'], 2); ?></div>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="p-4 bg-darkCard border border-darkBorder rounded-2xl">
                    <div class="text-xs text-gray-500 font-bold uppercase mb-1 tracking-wider">Condition</div>
                    <div class="font-bold text-gray-200"><?php echo $product['condition_status']; ?></div>
                </div>
                <div class="p-4 bg-darkCard border border-darkBorder rounded-2xl">
                    <div class="text-xs text-gray-500 font-bold uppercase mb-1 tracking-wider">Size</div>
                    <div class="font-bold text-gray-200"><?php echo $product['size']; ?></div>
                </div>
            </div>

            <p class="text-gray-300 leading-relaxed text-sm font-medium"><?php echo $product['description']; ?></p>

            <div class="flex gap-4">
                <button onclick="addToBag(<?php echo $product['productId']; ?>)" class="flex-1 bg-indigo-600 text-white py-4 rounded-full font-bold text-lg hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-98">
                    <i data-lucide="shopping-cart" class="w-5 h-5"></i> Add to Bag
                </button>
                <a href="messaging.php?productId=<?php echo $product['productId']; ?>&sellerId=<?php echo $product['userId']; ?>" class="p-4 border border-darkBorder bg-darkCard text-gray-300 hover:text-indigo-400 rounded-full hover:bg-darkBg transition-colors flex items-center justify-center">
                    <i data-lucide="message-square" class="w-6 h-6"></i>
                </a>
            </div>

            <!-- Seller Info -->
            <div class="flex items-center gap-4 p-6 bg-darkCard rounded-3xl border border-darkBorder">
                <div class="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center">
                    <i data-lucide="user" class="w-5 h-5 text-indigo-400"></i>
                </div>
                <div class="flex-1">
                    <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Seller</div>
                    <div class="font-bold text-gray-200"><?php echo $product['sellerName']; ?></div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php include 'footer.php'; ?>
