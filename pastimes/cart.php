<?php include 'config.php'; ?>
<?php 
if (!isset($_SESSION['userId'])) {
    header("Location: login.php");
    exit;
}
?>
<?php include 'header.php'; ?>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="space-y-12">
        <div class="flex justify-between items-end">
            <h2 class="text-4xl font-black tracking-tight">Your Bag.</h2>
            <p class="text-gray-400 font-medium">Checkout is fast and secure.</p>
        </div>

        <div class="grid lg:grid-cols-3 gap-12">
            <!-- Bag Items -->
            <div class="lg:col-span-2 space-y-4">
                <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 text-center space-y-6">
                    <div class="w-20 h-20 bg-gray-50 rounded-full mx-auto flex items-center justify-center">
                        <i data-lucide="shopping-cart" class="w-10 h-10 text-gray-200"></i>
                    </div>
                    <div class="space-y-2">
                        <h3 class="text-xl font-bold">Your bag is empty.</h3>
                        <p class="text-gray-400 max-w-xs mx-auto">Looks like you haven't added anything to your bag yet.</p>
                    </div>
                    <a href="shop.php" class="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors">Start Shopping</a>
                </div>
            </div>

            <!-- Summary -->
            <div class="space-y-6">
                <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
                    <h3 class="font-bold text-lg">Order Summary</h3>
                    <div class="space-y-4 text-sm font-medium">
                        <div class="flex justify-between text-gray-400">
                            <span>Subtotal</span>
                            <span>R0.00</span>
                        </div>
                        <div class="flex justify-between text-gray-400">
                            <span>Shipping</span>
                            <span>Calculated at next step</span>
                        </div>
                        <div class="pt-4 border-t border-gray-50 flex justify-between text-lg font-black">
                            <span>Total</span>
                            <span>R0.00</span>
                        </div>
                    </div>
                    <button disabled class="w-full bg-gray-100 text-gray-400 py-4 rounded-full font-bold cursor-not-allowed">
                        Proceed to Checkout
                    </button>
                </div>
                
                <div class="flex items-center gap-4 text-xs font-bold text-gray-400 justify-center">
                    <div class="flex items-center gap-1"><i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Secure Payment</div>
                    <div class="flex items-center gap-1"><i data-lucide="truck" class="w-3.5 h-3.5"></i> Fast Delivery</div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php include 'footer.php'; ?>
