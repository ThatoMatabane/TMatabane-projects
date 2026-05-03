    <footer class="bg-white border-t border-gray-100 py-16 mt-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-12">
            <div class="space-y-6">
                <div class="text-2xl font-black tracking-tighter text-indigo-600 flex items-center gap-2">
                    <i data-lucide="shopping-bag" class="w-6 h-6"></i>
                    PASTIMES
                </div>
                <p class="text-sm text-gray-500 leading-relaxed">The future of fashion is circular. We connect lovers of pre-owned pieces in a sustainable, high-end ecosystem.</p>
            </div>
            <div>
                <h4 class="font-bold mb-6 text-sm uppercase tracking-widest text-gray-400">Discover</h4>
                <ul class="space-y-4 text-sm font-medium text-gray-600">
                    <li class="hover:text-indigo-600 transition-colors cursor-pointer">Menswear</li>
                    <li class="hover:text-indigo-600 transition-colors cursor-pointer">Womenswear</li>
                    <li class="hover:text-indigo-600 transition-colors cursor-pointer">Sustainability</li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold mb-6 text-sm uppercase tracking-widest text-gray-400">Connect</h4>
                <ul class="space-y-4 text-sm font-medium text-gray-600">
                    <li class="hover:text-indigo-600 transition-colors cursor-pointer">Messaging</li>
                    <li class="hover:text-indigo-600 transition-colors cursor-pointer">Seller Dashboard</li>
                    <li class="hover:text-indigo-600 transition-colors cursor-pointer">Ratings</li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold mb-6 text-sm uppercase tracking-widest text-gray-400">Newsletter</h4>
                <div class="bg-gray-100 p-1 rounded-full flex">
                    <input type="email" placeholder="Email address" class="bg-transparent border-none outline-none text-sm px-4 flex-1">
                    <button class="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors">Join</button>
                </div>
            </div>
        </div>
    </footer>
    <div id="toast-container" class="fixed bottom-8 right-8 z-[100] flex flex-col gap-2"></div>

    <script>
        lucide.createIcons();

        function showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all transform translate-y-4 opacity-0 scale-95
                ${type === 'success' ? 'bg-white text-gray-900 border-indigo-100' : 'bg-red-50 text-red-600 border-red-100'}`;
            
            toast.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                    <i data-lucide="check-circle" class="w-4 h-4 text-indigo-600"></i>
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

        // Add to bag interaction
        document.querySelectorAll('button').forEach(btn => {
            if(btn.innerText.includes('Add to Bag') || btn.querySelector('[data-lucide="shopping-cart"]')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    showToast('Item added to your bag!');
                });
            }
        });
    </script>
</body>
</html>
