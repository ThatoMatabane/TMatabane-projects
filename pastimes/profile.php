<?php include 'config.php'; ?>
<?php 
if (!isset($_SESSION['userId'])) {
    header("Location: login.php");
    exit;
}
$userId = $_SESSION['userId'];
$userSql = "SELECT * FROM users WHERE userId = $userId";
$user = $conn->query($userSql)->fetch_assoc();
?>
<?php include 'header.php'; ?>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid md:grid-cols-3 gap-12">
        <!-- Profile Side -->
        <div class="space-y-8">
            <div class="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center space-y-4">
                <div class="w-24 h-24 bg-indigo-100 rounded-full mx-auto flex items-center justify-center">
                    <i data-lucide="user" class="w-12 h-12 text-indigo-600"></i>
                </div>
                <div>
                    <h2 class="text-2xl font-black tracking-tight"><?php echo $user['fullName']; ?></h2>
                    <p class="text-gray-400 font-medium uppercase text-[10px] tracking-widest mt-1"><?php echo $user['role']; ?> Account</p>
                </div>
                <div class="pt-4 border-t border-gray-50 flex justify-center gap-4 text-xs font-bold text-gray-500">
                    <div class="text-center">
                        <div class="text-indigo-600 text-lg">0</div>
                        <div>Orders</div>
                    </div>
                    <div class="text-center">
                        <div class="text-indigo-600 text-lg">0</div>
                        <div>Reviews</div>
                    </div>
                </div>
            </div>

            <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-4">
                <h3 class="font-bold text-sm uppercase tracking-widest text-gray-400">Settings</h3>
                <ul class="space-y-4 text-sm font-medium">
                    <li class="flex items-center gap-3 text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors">
                        <i data-lucide="edit-3" class="w-4 h-4"></i> Edit Profile
                    </li>
                    <li class="flex items-center gap-3 text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors">
                        <i data-lucide="map-pin" class="w-4 h-4"></i> Shipping Address
                    </li>
                    <li class="flex items-center gap-3 text-gray-600 hover:text-indigo-600 cursor-pointer transition-colors">
                        <i data-lucide="lock" class="w-4 h-4"></i> Change Password
                    </li>
                </ul>
            </div>
        </div>

        <!-- Content Area -->
        <div class="md:col-span-2 space-y-12">
            <div class="flex justify-between items-end">
                <h2 class="text-4xl font-black tracking-tight">Dashboard.</h2>
                <?php if($user['role'] == 'seller' || $user['role'] == 'admin'): ?>
                    <button class="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all">List New Item</button>
                <?php endif; ?>
            </div>

            <div class="bg-white p-12 rounded-[3.5rem] border border-gray-100 text-center space-y-6">
                <div class="w-20 h-20 bg-gray-50 rounded-full mx-auto flex items-center justify-center">
                    <i data-lucide="package" class="w-10 h-10 text-gray-200"></i>
                </div>
                <div class="space-y-2">
                    <h3 class="text-xl font-bold">No activity yet.</h3>
                    <p class="text-gray-400 max-w-xs mx-auto leading-relaxed">You haven't placed any orders or listed any items recently. Start your journey today!</p>
                </div>
                <a href="shop.php" class="inline-block bg-indigo-50 text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-100 transition-colors">Start Shopping</a>
            </div>
        </div>
    </div>
</main>

<?php include 'footer.php'; ?>
