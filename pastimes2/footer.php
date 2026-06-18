    <footer class="bg-darkBg border-t border-darkBorder py-16 mt-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12">
            <div class="space-y-6">
                <div class="text-2xl font-black tracking-tighter text-indigo-400 flex items-center gap-2">
                    <i data-lucide="shopping-bag" class="w-6 h-6"></i>
                    PASTIMES
                </div>
                <p class="text-sm text-gray-400 leading-relaxed">The future of fashion is circular. We connect lovers of pre-owned pieces in a sustainable, high-end ecosystem.</p>
            </div>
            <div>
                <h4 class="font-bold mb-6 text-sm uppercase tracking-widest text-gray-500">Discover</h4>
                <ul class="space-y-4 text-sm font-medium text-gray-400">
                    <li class="hover:text-indigo-400 transition-colors cursor-pointer" onclick="location.href='shop.php?category=Menswear'">Menswear</li>
                    <li class="hover:text-indigo-400 transition-colors cursor-pointer" onclick="location.href='shop.php?category=Womenswear'">Womenswear</li>
                    <li class="hover:text-indigo-400 transition-colors cursor-pointer" onclick="location.href='index.php'">Sustainability</li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold mb-6 text-sm uppercase tracking-widest text-gray-500">Connect</h4>
                <ul class="space-y-4 text-sm font-medium text-gray-400">
                    <li class="hover:text-indigo-400 transition-colors cursor-pointer" onclick="location.href='messaging.php'">Messaging</li>
                    <li class="hover:text-indigo-400 transition-colors cursor-pointer" onclick="location.href='profile.php'">Seller Dashboard</li>
                    <li class="hover:text-indigo-400 transition-colors cursor-pointer" onclick="location.href='shop.php'">Ratings</li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold mb-6 text-sm uppercase tracking-widest text-gray-500">Newsletter</h4>
                <div class="bg-darkCard border border-darkBorder p-1.5 rounded-full flex items-center focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                    <input type="email" placeholder="Email address" class="bg-transparent border-none outline-none text-sm px-4 flex-1 text-gray-200 placeholder-gray-500">
                    <button class="bg-indigo-600 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 transition-colors">Join</button>
                </div>
            </div>
        </div>
    </footer>
    <div id="toast-container" class="fixed bottom-8 right-8 z-[100] flex flex-col gap-2"></div>

    <script>
        lucide.createIcons();

        function addToBag(productId) {
            const formData = new FormData();
            formData.append('productId', productId);
            
            fetch('add_to_cart.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showToast(data.message);
                } else {
                    showToast(data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Something went wrong', 'error');
            });
        }

        function showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all transform translate-y-4 opacity-0 scale-95
                ${type === 'success' ? 'bg-darkCard text-gray-100 border-darkBorder' : 'bg-red-950/80 text-red-100 border-red-900/50'}`;
            
            toast.innerHTML = `
                <div class="w-8 h-8 rounded-full ${type === 'success' ? 'bg-indigo-500/10' : 'bg-red-500/10'} flex items-center justify-center">
                    <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-4 h-4 ${type === 'success' ? 'text-indigo-450' : 'text-red-400'}"></i>
                </div>
                <span class="font-bold text-sm tracking-tight">${message}</span>
            `;

            container.appendChild(toast);
            lucide.createIcons({ props: { parent: toast } });

            // Animate in
            setTimeout(() => {
                toast.classList.remove('translate-y-4', 'opacity-0', 'scale-95');
            }, 10);

            // Animate out
            setTimeout(() => {
                toast.classList.add('translate-y-4', 'opacity-0', 'scale-95');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        // Initial call to icons
        lucide.createIcons();
    </script>
</body>
</html>
