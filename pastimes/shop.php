<?php include 'config.php'; ?>
<?php include 'header.php'; ?>

<?php 
$categoryFilter = isset($_GET['category']) ? $conn->real_escape_string($_GET['category']) : '';
$whereClause = "WHERE status = 'available'";
if ($categoryFilter) {
    $whereClause .= " AND category = '$categoryFilter'";
}
?>
<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
    <aside class="w-64 hidden lg:block space-y-8 h-fit sticky top-24">
        <div>
            <h3 class="font-bold mb-4 uppercase text-xs tracking-widest text-gray-400">Filters</h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-bold mb-2">Category</label>
                    <div class="space-y-2 text-sm font-medium">
                        <a href="shop.php" class="flex items-center gap-2 hover:text-indigo-600 transition-colors <?php echo !$categoryFilter ? 'text-indigo-600 font-bold' : 'text-gray-500'; ?>">
                            <i data-lucide="layout-grid" class="w-4 h-4"></i> All Categories
                        </a>
                        <a href="shop.php?category=Womenswear" class="flex items-center gap-2 hover:text-indigo-600 transition-colors <?php echo $categoryFilter == 'Womenswear' ? 'text-indigo-600 font-bold' : 'text-gray-500'; ?>">
                            <i data-lucide="shopping-basket" class="w-4 h-4"></i> Womenswear
                        </a>
                        <a href="shop.php?category=Menswear" class="flex items-center gap-2 hover:text-indigo-600 transition-colors <?php echo $categoryFilter == 'Menswear' ? 'text-indigo-600 font-bold' : 'text-gray-500'; ?>">
                            <i data-lucide="shirt" class="w-4 h-4"></i> Menswear
                        </a>
                        <a href="shop.php?category=Sneakers" class="flex items-center gap-2 hover:text-indigo-600 transition-colors <?php echo $categoryFilter == 'Sneakers' ? 'text-indigo-600 font-bold' : 'text-gray-500'; ?>">
                            <i data-lucide="footprints" class="w-4 h-4"></i> Sneakers
                        </a>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-2">Price Range</label>
                    <input type="range" class="w-full accent-indigo-600" min="0" max="5000" step="100">
                    <div class="flex justify-between text-[10px] text-gray-400 mt-1 uppercase font-bold">
                        <span>R0</span>
                        <span>R5000+</span>
                    </div>
                </div>
            </div>
        </div>
    </aside>

    <div class="flex-1 space-y-8">
        <div class="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100">
            <h2 class="text-xl font-bold tracking-tight">
                <?php echo $categoryFilter ? $categoryFilter : 'All Items'; ?>
            </h2>
            <select class="text-sm border-none bg-transparent font-bold outline-none cursor-pointer">
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
            </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <?php
            $sql = "SELECT * FROM products $whereClause ORDER BY createdAt DESC";
            $result = $conn->query($sql);
            if ($result && $result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
            ?>
                <div class="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div class="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                        <img src="<?php echo $row['imageUrl']; ?>" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        <div class="absolute top-4 left-4">
                            <span class="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-900 shadow-sm border border-gray-100">
                                <?php echo $row['condition_status']; ?>
                            </span>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest"><?php echo $row['brand']; ?></div>
                        <h3 class="font-bold text-gray-900 mt-1"><?php echo $row['name']; ?></h3>
                        <div class="flex justify-between items-center mt-4">
                            <span class="font-black text-lg">R<?php echo number_format($row['price'], 2); ?></span>
                            <a href="product.php?id=<?php echo $row['productId']; ?>" class="text-indigo-600 text-xs font-bold uppercase tracking-wider hover:underline">View Piece</a>
                        </div>
                    </div>
                </div>
            <?php
                }
            } else {
            ?>
                <div class="col-span-full py-20 text-center space-y-4">
                    <div class="w-16 h-16 bg-gray-50 rounded-full mx-auto flex items-center justify-center">
                        <i data-lucide="search-slash" class="w-8 h-8 text-gray-300"></i>
                    </div>
                    <h3 class="text-xl font-bold">No items found.</h3>
                    <p class="text-gray-400 max-w-xs mx-auto">Try adjusting your filters or checking back later for new drops.</p>
                </div>
            <?php
            }
            ?>
        </div>
    </div>
</main>

<?php include 'footer.php'; ?>
