<?php include 'config.php'; ?>
<?php 
if (!isset($_SESSION['userId'])) {
    header("Location: login.php");
    exit;
}
$userId = $_SESSION['userId'];
$userSql = "SELECT * FROM users WHERE userId = $userId";
$user = $conn->query($userSql)->fetch_assoc();

// Check for deletions (Admin only)
if (isset($_GET['delete_product']) && $user['role'] == 'admin') {
    $delProductId = intval($_GET['delete_product']);
    $conn->query("DELETE FROM carts WHERE productId = $delProductId");
    $conn->query("DELETE FROM messages WHERE productId = $delProductId");
    $conn->query("DELETE FROM products WHERE productId = $delProductId");
    header("Location: profile.php?toast_success=Product+removed+successfully");
    exit;
}

if (isset($_GET['delete_user']) && $user['role'] == 'admin') {
    $delUserId = intval($_GET['delete_user']);
    if ($delUserId != $userId) {
        $conn->query("DELETE FROM carts WHERE userId = $delUserId");
        $conn->query("DELETE FROM messages WHERE senderId = $delUserId OR receiverId = $delUserId");
        $conn->query("DELETE FROM products WHERE userId = $delUserId");
        $conn->query("DELETE FROM users WHERE userId = $delUserId");
        header("Location: profile.php?toast_success=Member+account+deleted");
    } else {
        header("Location: profile.php?toast_error=You+cannot+delete+yourself");
    }
    exit;
}

// Check for product listing
if (isset($_POST['list_item']) && ($user['role'] == 'seller' || $user['role'] == 'admin')) {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $description = mysqli_real_escape_string($conn, $_POST['description']);
    $price = floatval($_POST['price']);
    $size = mysqli_real_escape_string($conn, $_POST['size']);
    $category = mysqli_real_escape_string($conn, $_POST['category']);
    $brand = mysqli_real_escape_string($conn, $_POST['brand']);
    $condition_status = mysqli_real_escape_string($conn, $_POST['condition_status']);
    $colour = mysqli_real_escape_string($conn, $_POST['colour']);
    $imageUrl = mysqli_real_escape_string($conn, $_POST['imageUrl']);

    if (empty($imageUrl)) {
        $imageUrl = 'https://images.unsplash.com/photo-1540221652346-e5dd6b1d4c2e?q=80&w=2070';
    }

    $insertSql = "INSERT INTO products (userId, name, description, price, size, category, brand, condition_status, colour, imageUrl, status) 
                  VALUES ($userId, '$name', '$description', $price, '$size', '$category', '$brand', '$condition_status', '$colour', '$imageUrl', 'available')";
    if ($conn->query($insertSql)) {
        header("Location: profile.php?toast_success=New+drop+listed+successfully!");
    } else {
        header("Location: profile.php?toast_error=Failed+to+list+item+drop");
    }
    exit;
}

// Fetch general stats for dashboard
$totalUsers = $conn->query("SELECT COUNT(*) as cnt FROM users")->fetch_assoc()['cnt'];
$totalProducts = $conn->query("SELECT COUNT(*) as cnt FROM products")->fetch_assoc()['cnt'];
$totalMessages = $conn->query("SELECT COUNT(*) as cnt FROM messages")->fetch_assoc()['cnt'];
?>
<?php include 'header.php'; ?>

<?php if (isset($_GET['toast_success'])): ?>
    <script>
        window.addEventListener('DOMContentLoaded', () => {
            showToast("<?php echo htmlspecialchars($_GET['toast_success']); ?>", 'success');
        });
    </script>
<?php endif; ?>
<?php if (isset($_GET['toast_error'])): ?>
    <script>
        window.addEventListener('DOMContentLoaded', () => {
            showToast("<?php echo htmlspecialchars($_GET['toast_error']); ?>", 'error');
        });
    </script>
<?php endif; ?>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Admin Warning Alert Banner -->
    <?php if ($user['role'] == 'admin'): ?>
        <div class="bg-indigo-950/40 border border-indigo-500/20 rounded-3xl p-6 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0">
                    <i data-lucide="shield-alert" class="w-6 h-6"></i>
                </div>
                <div>
                    <h3 class="font-black text-white tracking-tight">Privileged Administrator Level</h3>
                    <p class="text-sm text-gray-400">Manage database entries, view metrics, and access catalog moderation features.</p>
                </div>
            </div>
            <span class="bg-indigo-600/35 border border-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">System Owner</span>
        </div>
    <?php endif; ?>

    <div class="grid lg:grid-cols-3 gap-12">
        <!-- Profile Side Info -->
        <div class="space-y-8">
            <div class="bg-darkCard p-8 rounded-[2.5rem] border border-darkBorder text-center space-y-4">
                <div class="w-24 h-24 bg-indigo-500/10 border border-indigo-500/20 rounded-full mx-auto flex items-center justify-center relative">
                    <i data-lucide="user" class="w-12 h-12 text-indigo-400"></i>
                    <?php if ($user['role'] == 'admin'): ?>
                        <div class="absolute -bottom-1 -right-1 bg-indigo-500 text-white rounded-full p-1.5 border-4 border-darkCard shadow-lg">
                            <i data-lucide="shield" class="w-4 h-4"></i>
                        </div>
                    <?php endif; ?>
                </div>
                <div>
                    <h2 class="text-2xl font-black tracking-tight text-white"><?php echo $user['fullName']; ?></h2>
                    <p class="text-indigo-400 font-bold uppercase text-[10px] tracking-widest mt-1"><?php echo $user['role']; ?> Account</p>
                    <p class="text-xs text-gray-500/90 mt-1"><?php echo $user['email']; ?></p>
                </div>
                <div class="pt-4 border-t border-darkBorder flex justify-center gap-6 text-xs text-gray-400 font-medium">
                    <div class="text-center">
                        <div class="text-indigo-400 text-lg font-black"><?php echo ($user['role'] == 'admin') ? $totalProducts : '0'; ?></div>
                        <div>Drops</div>
                    </div>
                    <div class="text-center">
                        <div class="text-indigo-400 text-lg font-black"><?php echo ($user['role'] == 'admin') ? $totalUsers : '1'; ?></div>
                        <div>Members</div>
                    </div>
                </div>
            </div>

            <!-- Profile Settings Sidebar Menu -->
            <div class="bg-darkCard p-8 rounded-[2.5rem] border border-darkBorder space-y-4">
                <h3 class="font-bold text-sm uppercase tracking-widest text-gray-500">Settings</h3>
                <ul class="space-y-4 text-sm font-medium">
                    <li onclick="alert('Profile details edit mode is coming in local update.')" class="flex items-center gap-3 text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors">
                        <i data-lucide="edit-3" class="w-4 h-4"></i> Edit Profile
                    </li>
                    <li onclick="alert('Feature coming soon.')" class="flex items-center gap-3 text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors">
                        <i data-lucide="map-pin" class="w-4 h-4"></i> Shipping Address
                    </li>
                    <li onclick="alert('Feature coming soon.')" class="flex items-center gap-3 text-gray-300 hover:text-indigo-400 cursor-pointer transition-colors">
                        <i data-lucide="lock" class="w-4 h-4"></i> Change Password
                    </li>
                </ul>
            </div>
        </div>

        <!-- Content Area -->
        <div class="lg:col-span-2 space-y-12">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h2 class="text-4xl font-black tracking-tight text-white">Dashboard.</h2>
                    <p class="text-gray-400 text-sm mt-0.5">Control center for Pastimes circular fashion operations.</p>
                </div>
                <div class="flex gap-3">
                    <?php if($user['role'] == 'seller' || $user['role'] == 'admin'): ?>
                        <button onclick="toggleModal('addProductModal', true)" class="bg-indigo-600 text-white px-6 py-3 rounded-full text-xs uppercase tracking-wider font-extrabold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                            <i data-lucide="plus" class="w-4 h-4"></i> New Drop
                        </button>
                    <?php endif; ?>
                </div>
            </div>

            <?php if ($user['role'] == 'admin'): ?>
                <!-- Platform Statistics Overview Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div class="bg-darkCard border border-darkBorder p-6 rounded-3xl space-y-2">
                        <div class="flex justify-between items-center text-gray-500">
                            <span class="text-xs font-black uppercase tracking-widest">Active Members</span>
                            <i data-lucide="users" class="w-4 h-4 text-indigo-400"></i>
                        </div>
                        <div class="text-3xl font-black text-white"><?php echo $totalUsers; ?></div>
                        <p class="text-[10px] text-gray-500 font-bold uppercase">Database records verified</p>
                    </div>
                    <div class="bg-darkCard border border-darkBorder p-6 rounded-3xl space-y-2">
                        <div class="flex justify-between items-center text-gray-500">
                            <span class="text-xs font-black uppercase tracking-widest">Active Catalog</span>
                            <i data-lucide="shopping-bag" class="w-4 h-4 text-indigo-400"></i>
                        </div>
                        <div class="text-3xl font-black text-white"><?php echo $totalProducts; ?></div>
                        <p class="text-[10px] text-gray-500 font-bold uppercase">Curated Drops live</p>
                    </div>
                    <div class="bg-darkCard border border-darkBorder p-6 rounded-3xl space-y-2">
                        <div class="flex justify-between items-center text-gray-500">
                            <span class="text-xs font-black uppercase tracking-widest">Communications</span>
                            <i data-lucide="message-square" class="w-4 h-4 text-indigo-400"></i>
                        </div>
                        <div class="text-3xl font-black text-white"><?php echo $totalMessages; ?></div>
                        <p class="text-[10px] text-gray-500 font-bold uppercase">Secure chats active</p>
                    </div>
                </div>

                <!-- Admin Tabs selector -->
                <div class="border-b border-darkBorder/60 flex gap-6 text-sm">
                    <button onclick="switchTab('catalog')" id="tab-catalog" class="py-3 font-bold text-indigo-400 border-b-2 border-indigo-500 outline-none transition-all">Catalog drops (<?php echo $totalProducts; ?>)</button>
                    <button onclick="switchTab('members')" id="tab-members" class="py-3 font-bold text-gray-400 hover:text-white outline-none transition-all">Member List (<?php echo $totalUsers; ?>)</button>
                </div>

                <!-- TAB: CATALOG -->
                <div id="section-catalog" class="space-y-6">
                    <div class="bg-darkCard rounded-[2rem] border border-darkBorder overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="border-b border-darkBorder/60 bg-darkBg/20 text-gray-400 text-xs font-black uppercase tracking-wider">
                                        <th class="p-6">Product</th>
                                        <th class="p-6">Brand / Category</th>
                                        <th class="p-6">ZAR Price</th>
                                        <th class="p-6">Condition</th>
                                        <th class="p-6 text-right">Moderation</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-darkBorder/40 text-sm font-medium text-gray-300">
                                    <?php 
                                    $prodQuery = $conn->query("SELECT p.*, u.fullName as seller FROM products p JOIN users u ON p.userId = u.userId ORDER BY p.productId DESC");
                                    if ($prodQuery && $prodQuery->num_rows > 0):
                                        while ($item = $prodQuery->fetch_assoc()):
                                    ?>
                                        <tr class="hover:bg-darkBg/10 transition-colors">
                                            <td class="p-6 flex items-center gap-4">
                                                <div class="w-12 h-12 rounded-xl border border-darkBorder/85 overflow-hidden bg-darkBg shrink-0">
                                                    <img src="<?php echo $item['imageUrl']; ?>" class="w-full h-full object-cover">
                                                </div>
                                                <div>
                                                    <div class="font-bold text-white"><?php echo htmlspecialchars($item['name']); ?></div>
                                                    <div class="text-xs text-gray-500">Seller: <?php echo htmlspecialchars($item['seller']); ?></div>
                                                </div>
                                            </td>
                                            <td class="p-6">
                                                <div><?php echo htmlspecialchars($item['brand']); ?></div>
                                                <div class="text-[10px] text-indigo-400 font-bold uppercase tracking-wider"><?php echo htmlspecialchars($item['category']); ?></div>
                                            </td>
                                            <td class="p-6 font-mono text-indigo-300 font-bold">R<?php echo number_format($item['price'], 2); ?></td>
                                            <td class="p-6">
                                                <span class="px-2.5 py-1 text-[10px] rounded-full uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                                                    <?php echo htmlspecialchars($item['condition_status']); ?>
                                                </span>
                                            </td>
                                            <td class="p-6 text-right">
                                                <a href="profile.php?delete_product=<?php echo $item['productId']; ?>" onclick="return confirm('Remove absolute listing from Pastimes?');" class="text-red-400 hover:text-red-300 transition-colors inline-flex p-2 hover:bg-red-500/10 rounded-full">
                                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    <?php 
                                        endwhile; 
                                    else:
                                    ?>
                                        <tr>
                                            <td colspan="5" class="p-12 text-center text-gray-500">No drops available.</td>
                                        </tr>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- TAB: MEMBERS -->
                <div id="section-members" class="space-y-6 hidden">
                    <div class="bg-darkCard rounded-[2rem] border border-darkBorder overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="border-b border-darkBorder/60 bg-darkBg/20 text-gray-400 text-xs font-black uppercase tracking-wider">
                                        <th class="p-6">Full Name / Profile</th>
                                        <th class="p-6">Email Address</th>
                                        <th class="p-6">Role Privileges</th>
                                        <th class="p-6">Registered On</th>
                                        <th class="p-6 text-right">Moderation</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-darkBorder/40 text-sm font-medium text-gray-300">
                                    <?php 
                                    $usersQuery = $conn->query("SELECT * FROM users ORDER BY userId ASC");
                                    if ($usersQuery && $usersQuery->num_rows > 0):
                                        while ($uRec = $usersQuery->fetch_assoc()):
                                    ?>
                                        <tr class="hover:bg-darkBg/10 transition-colors">
                                            <td class="p-6 flex items-center gap-4">
                                                <div class="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold uppercase">
                                                    <?php echo substr($uRec['fullName'], 0, 1); ?>
                                                </div>
                                                <div class="font-bold text-white"><?php echo htmlspecialchars($uRec['fullName']); ?></div>
                                            </td>
                                            <td class="p-6 text-gray-400"><?php echo htmlspecialchars($uRec['email']); ?></td>
                                            <td class="p-6">
                                                <span class="px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider
                                                    <?php echo ($uRec['role'] == 'admin') ? 'bg-indigo-500/20 text-indigo-350 border border-indigo-500/30' : 'bg-darkBg text-gray-400 border border-darkBorder'; ?>">
                                                    <?php echo $uRec['role']; ?>
                                                </span>
                                            </td>
                                            <td class="p-6 text-gray-500"><?php echo date('Y-m-d', strtotime($uRec['createdAt'])); ?></td>
                                            <td class="p-6 text-right">
                                                <?php if ($uRec['userId'] != $userId): ?>
                                                    <a href="profile.php?delete_user=<?php echo $uRec['userId']; ?>" onclick="return confirm('Deregister member from Database? This acts as an absolute wipe.');" class="text-red-400 hover:text-red-300 transition-colors inline-flex p-2 hover:bg-red-500/10 rounded-full">
                                                        <i data-lucide="user-x" class="w-4 h-4"></i>
                                                    </a>
                                                <?php else: ?>
                                                    <span class="text-xs text-gray-550 font-bold uppercase italic mr-3">Owner</span>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                    <?php 
                                        endwhile; 
                                    endif; 
                                    ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            <?php else: ?>
                <!-- Standard Buyer / Seller Workspace -->
                <div class="bg-darkCard p-12 rounded-[3.5rem] border border-darkBorder text-center space-y-6">
                    <div class="w-20 h-20 bg-darkBg border border-darkBorder rounded-full mx-auto flex items-center justify-center">
                        <i data-lucide="package" class="w-10 h-10 text-gray-500"></i>
                    </div>
                    <div class="space-y-2">
                        <h3 class="text-xl font-bold text-white">No activity yet.</h3>
                        <p class="text-gray-400 max-w-xs mx-auto leading-relaxed text-sm">You haven't placed any orders or listed any items recently. Start your journey today!</p>
                    </div>
                    <a href="shop.php" class="inline-block bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-8 py-3 rounded-full font-bold hover:bg-indigo-600 hover:text-white transition-all">Start Shopping</a>
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<!-- ADD PRODUCT MODAL -->
<div id="addProductModal" class="fixed inset-0 z-50 overflow-y-auto hidden">
    <!-- Backdrop overlay -->
    <div onclick="toggleModal('addProductModal', false)" class="fixed inset-0 bg-darkBg/85 backdrop-blur-md transition-opacity"></div>

    <div class="flex items-center justify-center min-h-screen p-4">
        <div class="relative bg-darkCard border border-darkBorder w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 space-y-8 overflow-hidden z-10">
            <div class="flex justify-between items-center border-b border-darkBorder pb-4">
                <div>
                    <h3 class="text-2xl font-black text-white tracking-tight">List New drop</h3>
                    <p class="text-xs text-gray-400 mt-0.5">Let your pre-loved gem tell its next story.</p>
                </div>
                <button onclick="toggleModal('addProductModal', false)" class="text-gray-400 hover:text-white hover:bg-darkBg p-2 rounded-full transition-all">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>

            <form method="POST" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Name -->
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 block">Product Title</label>
                        <input type="text" name="name" required placeholder="Retro Varsity Jacket" class="w-full bg-darkBg border border-darkBorder text-gray-100 placeholder-gray-600 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all">
                    </div>
                    <!-- Brand -->
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 block">Brand Designer</label>
                        <input type="text" name="brand" required placeholder="Adidas / Vintage" class="w-full bg-darkBg border border-darkBorder text-gray-100 placeholder-gray-600 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all">
                    </div>
                </div>

                <div class="grid md:grid-cols-3 gap-6">
                    <!-- Price ZAR -->
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 block">ZAR Price (R)</label>
                        <input type="number" step="0.01" name="price" required placeholder="320.00" class="w-full bg-darkBg border border-darkBorder text-gray-100 placeholder-gray-600 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all">
                    </div>
                    <!-- Size -->
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 block">Local Size</label>
                        <input type="text" name="size" required placeholder="M / UK 9" class="w-full bg-darkBg border border-darkBorder text-gray-100 placeholder-gray-600 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all">
                    </div>
                    <!-- Colour -->
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 block">Primary Colour</label>
                        <input type="text" name="colour" required placeholder="Camel / Royal Blue" class="w-full bg-darkBg border border-darkBorder text-gray-100 placeholder-gray-600 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all">
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Category Selection -->
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 block font-bold">Category</label>
                        <select name="category" required class="w-full bg-darkBg border border-darkBorder text-gray-200 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500/40 outline-none appearance-none transition-all">
                            <option value="Menswear">Menswear</option>
                            <option value="Womenswear">Womenswear</option>
                            <option value="Sneakers">Sneakers</option>
                        </select>
                    </div>
                    <!-- Condition Selection -->
                    <div class="space-y-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 block font-bold">Item Condition</label>
                        <select name="condition_status" required class="w-full bg-darkBg border border-darkBorder text-gray-200 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500/40 outline-none appearance-none transition-all">
                            <option value="Near New">Near New</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Great">Great</option>
                            <option value="Good">Good</option>
                        </select>
                    </div>
                </div>

                <!-- Product Image URL -->
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 block">High-Res Image Link</label>
                    <input type="url" name="imageUrl" placeholder="https://images.unsplash.com/photo-..." class="w-full bg-darkBg border border-darkBorder text-gray-100 placeholder-gray-600 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all">
                </div>

                <!-- Product Description -->
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-gray-500 px-3 block">Drop Description</label>
                    <textarea name="description" rows="3" required placeholder="Outline story, measurements, material composition..." class="w-full bg-darkBg border border-darkBorder text-gray-100 placeholder-gray-600 px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/40 outline-none transition-all"></textarea>
                </div>

                <div class="flex gap-4 pt-4">
                    <button type="button" onclick="toggleModal('addProductModal', false)" class="flex-1 border border-darkBorder bg-transparent hover:bg-darkBg text-gray-300 py-4 rounded-full font-bold text-sm transition-all text-center">
                        Cancel
                    </button>
                    <button type="submit" name="list_item" class="flex-1 bg-indigo-600 text-white py-4 rounded-full font-bold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">
                        Publish Drop
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function toggleModal(modalId, show) {
        const modal = document.getElementById(modalId);
        if (show) {
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        } else {
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
    }

    function switchTab(tabName) {
        const catalogBtn = document.getElementById('tab-catalog');
        const membersBtn = document.getElementById('tab-members');
        const catalogSec = document.getElementById('section-catalog');
        const membersSec = document.getElementById('section-members');

        if (tabName === 'catalog') {
            catalogBtn.className = 'py-3 font-bold text-indigo-400 border-b-2 border-indigo-500 outline-none transition-all';
            membersBtn.className = 'py-3 font-bold text-gray-400 hover:text-white outline-none transition-all';
            catalogSec.classList.remove('hidden');
            membersSec.classList.add('hidden');
        } else {
            membersBtn.className = 'py-3 font-bold text-indigo-400 border-b-2 border-indigo-500 outline-none transition-all';
            catalogBtn.className = 'py-3 font-bold text-gray-400 hover:text-white outline-none transition-all';
            membersSec.classList.remove('hidden');
            catalogSec.classList.add('hidden');
        }
    }
</script>

<?php include 'footer.php'; ?>
