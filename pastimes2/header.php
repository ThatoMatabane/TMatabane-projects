<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pastimes Online Store | Curated Thrift</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        darkBg: '#090a0f',        // Extremely rich deep luxury obsidian
                        darkCard: '#13151c',      // Dark card with slightly higher contrast
                        darkBorder: '#1f242e',    // Clean, sleek borders
                        darkAccent: '#6366f1',    // Vibrant Indigo
                    }
                }
            }
        }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-darkBg text-gray-100 selection:bg-indigo-500 selection:text-white min-h-screen flex flex-col">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-darkBg/80 backdrop-blur-md border-b border-darkBorder">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center gap-8">
                    <a href="index.php" class="text-2xl font-black tracking-tighter text-indigo-400 flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <i data-lucide="shopping-bag" class="w-6 h-6"></i>
                        PASTIMES
                    </a>
                    <div class="hidden md:flex items-center gap-6">
                        <a href="shop.php" class="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors">Shop All</a>
                        <a href="shop.php?category=Womenswear" class="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors">Womenswear</a>
                        <a href="shop.php?category=Menswear" class="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors">Menswear</a>
                        <a href="shop.php?category=Sneakers" class="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors">Sneakers</a>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <div class="hidden sm:flex items-center bg-darkCard border border-darkBorder rounded-full px-4 py-2 gap-2 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                        <i data-lucide="search" class="w-4 h-4 text-gray-500"></i>
                        <input type="text" placeholder="Find yours..." class="bg-transparent border-none outline-none text-sm w-40 lg:w-64 text-gray-100 placeholder-gray-500">
                    </div>
                    <?php if(isset($_SESSION['userId'])): ?>
                        <a href="messaging.php" class="p-2 text-gray-300 hover:text-indigo-400 hover:bg-darkCard rounded-full transition-all relative">
                            <i data-lucide="message-square" class="w-5 h-5"></i>
                        </a>
                        <a href="cart.php" class="p-2 text-gray-300 hover:text-indigo-400 hover:bg-darkCard rounded-full transition-all relative">
                            <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                        </a>
                        <a href="profile.php" class="flex items-center gap-2 p-1.5 hover:bg-darkCard rounded-full transition-all">
                            <div class="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                                <i data-lucide="user" class="w-4 h-4 text-indigo-400"></i>
                            </div>
                            <span class="hidden lg:block text-sm font-bold uppercase tracking-tight text-gray-200"><?php echo explode(' ', $_SESSION['fullName'])[0]; ?></span>
                        </a>
                        <a href="logout.php" class="text-xs font-bold text-gray-500 hover:text-red-400 uppercase tracking-widest hidden md:block transition-colors">Logout</a>
                    <?php else: ?>
                        <div class="flex items-center gap-4">
                            <a href="login.php" class="text-sm font-bold text-gray-400 hover:text-indigo-400 transition-colors">Login</a>
                            <a href="register.php" class="bg-indigo-600 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Join</a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>

