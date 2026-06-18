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
            <h3 class="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">Filters</h3>
            <div class="space-y-6">
                <div>
                    <label class="block text-sm font-bold mb-3 text-gray-300">Category</label>
                    <div class="space-y-3 text-sm font-medium">
                        <a href="shop.php" class="flex items-center gap-2 hover:text-indigo-450 transition-colors <?php echo !$categoryFilter ? 'text-indigo-400 font-bold' : 'text-gray-400'; ?>">
                            <i data-lucide="layout-grid" class="w-4 h-4"></i> All Categories
                        </a>
                        <a href="shop.php?category=Womenswear" class="flex items-center gap-2 hover:text-indigo-450 transition-colors <?php echo $categoryFilter == 'Womenswear' ? 'text-indigo-400 font-bold' : 'text-gray-400'; ?>">
                            <i data-lucide="shopping-basket" class="w-4 h-4"></i> Womenswear
                        </a>
                        <a href="shop.php?category=Menswear" class="flex items-center gap-2 hover:text-indigo-450 transition-colors <?php echo $categoryFilter == 'Menswear' ? 'text-indigo-400 font-bold' : 'text-gray-400'; ?>">
                            <i data-lucide="shirt" class="w-4 h-4"></i> Menswear
                        </a>
                        <a href="shop.php?category=Sneakers" class="flex items-center gap-2 hover:text-indigo-450 transition-colors <?php echo $categoryFilter == 'Sneakers' ? 'text-indigo-400 font-bold' : 'text-gray-400'; ?>">
                            <i data-lucide="footprints" class="w-4 h-4"></i> Sneakers
                        </a>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold mb-3 text-gray-300">Price Range</label>
                    <input type="range" class="w-full h-1 bg-darkBorder rounded-lg appearance-none cursor-pointer accent-indigo-500" min="0" max="5000" step="100">
                    <div class="flex justify-between text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-wider">
                        <span>R0</span>
                        <span>R5000+</span>
                    </div>
                </div>
            </div>
        </div>
    </aside>

    <div class="flex-1 space-y-8">
        <div class="flex justify-between items-center bg-darkCard p-5 rounded-[2rem] border border-darkBorder">
            <h2 class="text-xl font-black tracking-tight text-white">
                <?php echo $categoryFilter ? $categoryFilter : 'All Items'; ?>
            </h2>
            <select class="text-sm border-none bg-transparent font-bold outline-none cursor-pointer text-indigo-400 hover:text-indigo-300">
                <option class="bg-darkBg text-gray-300">Newest Arrivals</option>
                <option class="bg-darkBg text-gray-300">Price: Low to High</option>
                <option class="bg-darkBg text-gray-300">Price: High to Low</option>
            </select>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <?php
            $sql = "SELECT * FROM products $whereClause ORDER BY createdAt DESC";
            $result = $conn->query($sql);
            if ($result && $result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
            ?>
                <div class="group bg-darkCard rounded-[2.5rem] border border-darkBorder overflow-hidden shadow-sm hover:shadow-indigo-500/5 hover:border-indigo-500/20 transition-all duration-500 relative flex flex-col">
                    <div class="aspect-[4/5] bg-darkBg relative overflow-hidden">
                        <img src="<?php echo $row['imageUrl']; ?>" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        
                        <!-- Badges -->
                        <div class="absolute top-4 left-4 flex flex-col gap-2">
                            <span class="bg-darkBg/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-300 shadow-sm border border-indigo-500/10 inline-block w-fit">
                                <?php echo $row['condition_status']; ?>
                            </span>
                            <span class="bg-emerald-500/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-emerald-400 border border-emerald-500/20 shadow-sm inline-block w-fit">
                                <i data-lucide="leaf" class="w-3 h-3 inline mr-1"></i> Sustainable
                            </span>
                        </div>

                        <!-- Quick Actions -->
                        <div class="absolute inset-0 bg-darkBg/60 opacity-0 group-hover:opacity-100 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center gap-3">
                            <button onclick="addToBag(<?php echo $row['productId']; ?>)" class="bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 hover:bg-indigo-500 transition-all cursor-pointer">
                                <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                            </button>
                            <a href="product.php?id=<?php echo $row['productId']; ?>" class="bg-darkCard border border-darkBorder text-gray-200 p-4 rounded-full shadow-2xl hover:scale-110 hover:text-indigo-400 active:scale-95 transition-all">
                                <i data-lucide="eye" class="w-5 h-5"></i>
                            </a>
                        </div>
                    </div>
                    <div class="p-6 flex-1 flex flex-col">
                        <div class="flex justify-between items-start mb-2">
                            <div class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest"><?php echo $row['brand']; ?></div>
                            <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">Size <?php echo $row['size']; ?></div>
                        </div>
                        <h3 class="font-bold text-gray-100 leading-tight mb-4 group-hover:text-indigo-400 transition-colors"><?php echo $row['name']; ?></h3>
                        <div class="mt-auto flex justify-between items-center bg-[#171a24] -mx-6 -mb-6 p-6 border-t border-darkBorder">
                            <span class="font-black text-xl text-indigo-300">R<?php echo number_format($row['price'], 2); ?></span>
                            <span class="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Market Value: <span class="line-through">R<?php echo number_format($row['price'] * 1.8, 0); ?></span></span>
                        </div>
                    </div>
                </div>
            <?php
                }
            } else {
            ?>
                <div class="col-span-full py-20 text-center space-y-4">
                    <div class="w-16 h-16 bg-darkCard border border-darkBorder rounded-full mx-auto flex items-center justify-center">
                        <i data-lucide="search-slash" class="w-8 h-8 text-gray-400"></i>
                    </div>
                    <h3 class="text-xl font-bold text-white">No items found.</h3>
                    <p class="text-gray-400 max-w-xs mx-auto text-sm">Try adjusting your filters or checking back later for new drops.</p>
                </div>
            <?php
            }
            ?>
        </div>
    </div>
</main>

<?php include 'footer.php'; ?>
