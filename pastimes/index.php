<?php include 'config.php'; ?>
<?php include 'header.php'; ?>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
    <!-- Hero Section -->
    <section class="relative rounded-[2.5rem] overflow-hidden aspect-[21/9] flex items-center">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" class="absolute inset-0 w-full h-full object-cover brightness-50" alt="Hero">
        <div class="relative px-12 space-y-6 max-w-2xl">
            <h1 class="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">
                CURATED <br> <span class="text-indigo-400">THRIFT.</span>
            </h1>
            <p class="text-lg text-gray-200">Find unique, pre-loved gems that tell a story. Sustainability is built in.</p>
            <a href="shop.php" class="inline-flex bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-indigo-600 hover:text-white transition-all transform hover:scale-105 items-center gap-2">
                Browse Collection <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
        </div>
    </section>

    <!-- Sustainability Section -->
    <section class="bg-indigo-900 rounded-[2.5rem] p-12 text-white overflow-hidden relative">
        <div class="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div class="space-y-6">
                <div class="inline-flex items-center gap-2 px-4 py-1 bg-indigo-800 rounded-full text-xs font-bold uppercase tracking-wider">
                    <i data-lucide="leaf" class="w-3.5 h-3.5 text-green-400"></i>
                    Sustainability Impact
                </div>
                <h2 class="text-4xl font-bold tracking-tight">Thrift for the Planet</h2>
                <p class="text-indigo-200 text-lg">Every purchase helps reduce the fashion industry's footprint.</p>
                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-indigo-800/50 p-6 rounded-2xl border border-indigo-700">
                        <div class="text-3xl font-black">1.2M+</div>
                        <div class="text-xs text-indigo-300 font-medium">Liters of Water Saved (ZA)</div>
                    </div>
                    <div class="bg-indigo-800/50 p-6 rounded-2xl border border-indigo-700">
                        <div class="text-3xl font-black">8,400</div>
                        <div class="text-xs text-indigo-300 font-medium">Items Repurposed Locally</div>
                    </div>
                </div>
            </div>
            <div class="hidden md:block">
                <img src="https://images.unsplash.com/photo-1540221652346-e5dd6b1d4c2e?q=80&w=2070&auto=format&fit=crop" class="rounded-3xl shadow-2xl rotate-3" alt="Sustainable fashion">
            </div>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="space-y-8">
        <div class="flex justify-between items-end">
            <div>
                <h2 class="text-3xl font-bold tracking-tight">Recent Drops</h2>
                <p class="text-gray-500">Hand-picked items added this week.</p>
            </div>
            <a href="shop.php" class="text-indigo-600 font-bold flex items-center gap-1 hover:underline">
                View Shop <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </a>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <?php
            $sql = "SELECT * FROM products WHERE status = 'available' LIMIT 6";
            $result = $conn->query($sql);
            while($row = $result->fetch_assoc()) {
                ?>
                <div class="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                    <div class="aspect-[4/5] relative overflow-hidden bg-gray-100">
                        <img src="<?php echo $row['imageUrl']; ?>" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="<?php echo $row['name']; ?>">
                        <div class="absolute top-4 left-4">
                            <span class="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-900 shadow-sm border border-gray-100">
                                <?php echo $row['condition_status']; ?>
                            </span>
                        </div>
                    </div>
                    <div class="p-6 space-y-2">
                        <div class="flex justify-between items-start">
                            <div>
                                <div class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1"><?php echo $row['brand']; ?></div>
                                <h3 class="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors"><?php echo $row['name']; ?></h3>
                            </div>
                            <div class="font-black text-lg text-gray-900">R<?php echo number_format($row['price'], 2); ?></div>
                        </div>
                        <div class="flex justify-between items-center pt-2">
                            <div class="text-xs text-gray-400 font-medium">Size: <?php echo $row['size']; ?></div>
                            <a href="product.php?id=<?php echo $row['productId']; ?>" class="bg-indigo-50 text-indigo-600 p-2 rounded-full hover:bg-indigo-600 hover:text-white transition-colors">
                                <i data-lucide="plus" class="w-4 h-4"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <?php
            }
            ?>
        </div>
    </section>
</main>

<?php include 'footer.php'; ?>
