<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pastimes Online Store | Curated Thrift</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50 text-gray-900">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center gap-8">
                    <a href="index.php" class="text-2xl font-black tracking-tighter text-indigo-600 flex items-center gap-2">
                        <i data-lucide="shopping-bag" class="w-6 h-6"></i>
                        PASTIMES
                    </a>
                    <div class="hidden md:flex items-center gap-6">
                        <a href="shop.php" class="text-sm font-medium hover:text-indigo-600 transition-colors">Shop All</a>
                        <a href="shop.php?category=Womenswear" class="text-sm font-medium hover:text-indigo-600 transition-colors">Womenswear</a>
                        <a href="shop.php?category=Menswear" class="text-sm font-medium hover:text-indigo-600 transition-colors">Menswear</a>
                        <a href="shop.php?category=Sneakers" class="text-sm font-medium hover:text-indigo-600 transition-colors">Sneakers</a>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <div class="hidden sm:flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
                        <i data-lucide="search" class="w-4 h-4 text-gray-400"></i>
                        <input type="text" placeholder="Find yours..." class="bg-transparent border-none outline-none text-sm w-40 lg:w-64">
                    </div>
                    <?php if(isset($_SESSION['userId'])): ?>
                        <a href="cart.php" class="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                        </a>
                        <a href="profile.php" class="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                            <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <i data-lucide="user" class="w-4 h-4 text-indigo-600"></i>
                            </div>
                            <span class="hidden lg:block text-sm font-bold uppercase tracking-tight"><?php echo explode(' ', $_SESSION['fullName'])[0]; ?></span>
                        </a>
                        <a href="logout.php" class="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest hidden md:block">Logout</a>
                    <?php else: ?>
                        <div class="flex items-center gap-4">
                            <a href="login.php" class="text-sm font-bold text-gray-600 hover:text-indigo-600">Login</a>
                            <a href="register.php" class="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all">Join</a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>
