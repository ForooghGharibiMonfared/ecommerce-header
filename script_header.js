
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Header Elements
            const openSearchOverlayButton = document.getElementById('openSearchOverlayButton');
            const cartIconContainer = document.getElementById('cartIconContainer');
            const cartItemCountSpan = document.getElementById('cartItemCount');
            const productsNavLink = document.getElementById('productsNavLink');

            // Cart Modal Elements
            const cartModal = document.getElementById('cartModal');
            const closeCartModalButton = document.getElementById('closeCartModal');
            const cartItemsContainer = document.getElementById('cartItemsContainer');
            const cartTotalSpan = document.getElementById('cartTotal');
            const checkoutButton = document.getElementById('checkoutButton');

            // Search Overlay Elements
            const searchOverlay = document.getElementById('searchOverlay');
            const overlaySearchInput = document.getElementById('overlaySearchInput');
            const overlaySearchButton = document.getElementById('overlaySearchButton');
            const searchResultsContainer = document.getElementById('searchResultsContainer');
            const closeSearchOverlayButton = document.getElementById('closeSearchOverlay');

            // Notification Element
            const notificationElement = document.getElementById('notification');

            // --- Simulated Cart Data ---
            let cart = {
                items: [],
                total: 0
            };

            // --- Simulated Product Data for Search (Only T-shirts 1-4) ---
            const allProducts = [
                { id: 101, name: 'T-shirt 1: Classic White', price: 19.99, image: 'https://placehold.co/80x80/e0e0e0/333333?text=T-Shirt+1', category: 't-shirt' },
                { id: 102, name: 'T-shirt 2: Graphic Design', price: 24.50, image: 'https://placehold.co/80x80/d0d0d0/333333?text=T-Shirt+2', category: 't-shirt' },
                { id: 103, name: 'T-shirt 3: Vintage Style', price: 22.00, image: 'https://placehold.co/80x80/c0c0c0/333333?text=T-Shirt+3', category: 't-shirt' },
                { id: 104, name: 'T-shirt 4: Sporty Performance', price: 29.99, image: 'https://placehold.co/80x80/b0b0b0/333333?text=T-Shirt+4', category: 't-shirt' }
            ];

            /**
             * Displays a temporary notification message.
             * @param {string} message - The message to display.
             * @param {number} duration - Duration in milliseconds (default: 3000).
             */
            function showNotification(message, duration = 3000) {
                notificationElement.textContent = message;
                notificationElement.classList.remove('hidden');
                notificationElement.classList.add('show');

                setTimeout(() => {
                    notificationElement.classList.remove('show');
                    setTimeout(() => {
                        notificationElement.classList.add('hidden');
                    }, 300); // Match transition duration
                }, duration);
            }

            /**
             * Simulates fetching cart data from an API.
             * @returns {Promise<Object>} A promise that resolves with cart data.
             */
            async function fetchCartData() {
                await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
                // In a real app, you'd fetch from a backend. For now, use local 'cart' state.
                return JSON.parse(JSON.stringify(cart)); // Return a deep copy
            }

            /**
             * Updates the cart item count displayed on the header.
             */
            function updateCartItemCount() {
                const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
                cartItemCountSpan.textContent = totalItems;
                if (totalItems === 0) {
                    cartItemCountSpan.classList.add('hidden');
                } else {
                    cartItemCountSpan.classList.remove('hidden');
                }
                console.log('Cart item count updated to:', totalItems); // Debug log
            }

            /**
             * Renders the cart items inside the modal.
             */
            function renderCartItems() {
                cartItemsContainer.innerHTML = ''; // Clear previous items
                if (cart.items.length === 0) {
                    cartItemsContainer.innerHTML = '<p class="text-center text-gray-500 py-4">Your cart is empty.</p>';
                    cartTotalSpan.textContent = '$0.00';
                    console.log('Cart rendered: Empty'); // Debug log
                    return;
                }

                cart.items.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('flex', 'items-center', 'justify-between', 'py-3', 'px-2', 'border-b', 'border-gray-100', 'last:border-b-0', 'bg-white', 'rounded-md', 'shadow-sm', 'mb-2'); // Enhanced styling
                    itemDiv.innerHTML = `
                        <div class="flex items-center space-x-4">
                            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover shadow-md">
                            <div>
                                <p class="font-semibold text-lg text-gray-800">${item.name}</p>
                                <p class="text-sm text-gray-600">$${item.price.toFixed(2)} x ${item.quantity}</p>
                            </div>
                        </div>
                        <p class="font-bold text-lg text-gray-800">$${(item.price * item.quantity).toFixed(2)}</p>
                    `;
                    cartItemsContainer.appendChild(itemDiv);
                });

                cartTotalSpan.textContent = `$${cart.total.toFixed(2)}`;
                console.log('Cart rendered:', cart.items.length, 'items. Total:', cart.total.toFixed(2)); // Debug log
            }

            /**
             * Adds an item to the cart.
             * @param {Object} product - The product object to add.
             * @param {number} quantity - The quantity to add.
             */
            function addItemToCart(product, quantity = 1) {
                console.log('addItemToCart called for product:', product.name); // Debug log
                const existingItemIndex = cart.items.findIndex(item => item.id === product.id);
                if (existingItemIndex > -1) {
                    cart.items[existingItemIndex].quantity += quantity;
                    console.log('Updated quantity for existing item:', product.name, 'New quantity:', cart.items[existingItemIndex].quantity); // Debug log
                } else {
                    cart.items.push({ ...product, quantity });
                    console.log('Added new item:', product.name); // Debug log
                }
                cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                updateCartItemCount();
                renderCartItems(); // Update modal if open
                showNotification(`${product.name} added to cart!`); // Show notification
                console.log('Item added to cart:', product.name, 'Quantity:', quantity);
            }

            /**
             * Renders search results in the overlay.
             * @param {Array<Object>} results - Array of product objects to display.
             */
            function renderSearchResults(results) {
                searchResultsContainer.innerHTML = '';
                if (results.length === 0) {
                    searchResultsContainer.innerHTML = '<p class="text-center text-gray-500 py-4 text-lg">No products found for this search.</p>';
                    return;
                }

                results.forEach(product => {
                    const resultDiv = document.createElement('div');
                    resultDiv.classList.add('flex', 'items-center', 'justify-between', 'py-3', 'px-2', 'border-b', 'border-gray-100', 'last:border-b-0', 'hover:bg-blue-50', 'rounded-lg', 'transition', 'duration-150', 'shadow-sm', 'mb-2');
                    resultDiv.innerHTML = `
                        <div class="flex items-center space-x-4">
                            <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-lg object-cover shadow-md">
                            <div>
                                <p class="font-semibold text-lg text-gray-800">${product.name}</p>
                                <p class="text-blue-700 font-bold text-md">$${product.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <button class="add-to-cart-btn bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 shadow-md text-sm transform hover:scale-105"
                                data-product-id="${product.id}">
                            Add to Cart
                        </button>
                    `;
                    searchResultsContainer.appendChild(resultDiv);
                });

                // Add event listeners to newly rendered "Add to Cart" buttons
                searchResultsContainer.querySelectorAll('.add-to-cart-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const productId = parseInt(event.target.dataset.productId);
                        const productToAdd = allProducts.find(p => p.id === productId);
                        console.log('Add to Cart button clicked. Product ID:', productId, 'Product found:', productToAdd); // Debug log
                        if (productToAdd) {
                            addItemToCart(productToAdd);
                        } else {
                            console.error('Product not found for ID:', productId); // Debug log
                        }
                    });
                });
            }

            /**
             * Filters products based on search query.
             * @param {string} query - The search string.
             * @returns {Array<Object>} Filtered list of products.
             */
            function filterProducts(query) {
                const lowerCaseQuery = query.toLowerCase();
                // Only search within the predefined T-shirt products
                return allProducts.filter(product =>
                    product.name.toLowerCase().includes(lowerCaseQuery)
                );
            }

            /**
             * Initializes the cart by fetching data and updating the UI.
             */
            async function initializeCart() {
                try {
                    const fetchedCart = await fetchCartData();
                    cart = fetchedCart; // Update local cart state
                    updateCartItemCount();
                    renderCartItems();
                    console.log('Cart initialized.'); // Debug log
                } catch (error) {
                    console.error('Error initializing cart:', error);
                }
            }

            // --- Event Listeners ---

            // Open search overlay from main search bar
            openSearchOverlayButton.addEventListener('click', () => {
                searchOverlay.classList.remove('hidden');
                // Apply transition styles
                setTimeout(() => {
                    searchOverlay.querySelector('div').style.transform = 'translateY(0)';
                    searchOverlay.querySelector('div').style.opacity = '1';
                }, 10);
                overlaySearchInput.focus(); // Focus on input when opened
                renderSearchResults(allProducts); // Show all T-shirts initially
                console.log('Search overlay opened from main search bar.'); // Debug log
            });

            // Open search overlay from "Products" navigation link
            productsNavLink.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior
                searchOverlay.classList.remove('hidden');
                // Apply transition styles
                setTimeout(() => {
                    searchOverlay.querySelector('div').style.transform = 'translateY(0)';
                    searchOverlay.querySelector('div').style.opacity = '1';
                }, 10);
                overlaySearchInput.value = ''; // Clear any previous search
                overlaySearchInput.focus();
                renderSearchResults(allProducts); // Show all T-shirts
                console.log('Search overlay opened from Products link.'); // Debug log
            });


            // Close search overlay
            closeSearchOverlayButton.addEventListener('click', () => {
                // Apply transition styles
                searchOverlay.querySelector('div').style.transform = 'translateY(-20px)';
                searchOverlay.querySelector('div').style.opacity = '0';
                setTimeout(() => {
                    searchOverlay.classList.add('hidden');
                    overlaySearchInput.value = ''; // Clear search input
                    searchResultsContainer.innerHTML = ''; // Clear results
                    console.log('Search overlay closed.'); // Debug log
                }, 300); // Match transition duration
            });

            // Close search overlay when clicking outside
            searchOverlay.addEventListener('click', (event) => {
                if (event.target === searchOverlay) {
                    // Apply transition styles
                    searchOverlay.querySelector('div').style.transform = 'translateY(-20px)';
                    searchOverlay.querySelector('div').style.opacity = '0';
                    setTimeout(() => {
                        searchOverlay.classList.add('hidden');
                        overlaySearchInput.value = '';
                        searchResultsContainer.innerHTML = '';
                        console.log('Search overlay closed by clicking outside.'); // Debug log
                    }, 300); // Match transition duration
                }
            });

            // Handle search input in overlay
            overlaySearchInput.addEventListener('keyup', (event) => {
                const query = overlaySearchInput.value.trim();
                const filtered = filterProducts(query);
                renderSearchResults(filtered);
                console.log('Search input changed. Query:', query, 'Results count:', filtered.length); // Debug log
            });

            // Handle search button in overlay
            overlaySearchButton.addEventListener('click', () => {
                const query = overlaySearchInput.value.trim();
                const filtered = filterProducts(query);
                renderSearchResults(filtered);
                console.log('Search button clicked. Query:', query, 'Results count:', filtered.length); // Debug log
            });

            // Open cart modal
            cartIconContainer.addEventListener('click', () => {
                cartModal.classList.remove('hidden');
                // Apply transition styles
                setTimeout(() => {
                    cartModal.querySelector('div').style.transform = 'translateY(0)';
                    cartModal.querySelector('div').style.opacity = '1';
                }, 10);
                renderCartItems(); // Re-render every time it opens to ensure fresh data
                console.log('Cart modal opened.'); // Debug log
            });

            // Close cart modal
            closeCartModalButton.addEventListener('click', () => {
                // Apply transition styles
                cartModal.querySelector('div').style.transform = 'translateY(-20px)';
                cartModal.querySelector('div').style.opacity = '0';
                setTimeout(() => {
                    cartModal.classList.add('hidden');
                    console.log('Cart modal closed.'); // Debug log
                }, 300); // Match transition duration
            });

            // Close cart modal when clicking outside
            cartModal.addEventListener('click', (event) => {
                if (event.target === cartModal) {
                    // Apply transition styles
                    cartModal.querySelector('div').style.transform = 'translateY(-20px)';
                    cartModal.querySelector('div').style.opacity = '0';
                    setTimeout(() => {
                        cartModal.classList.add('hidden');
                        console.log('Cart modal closed by clicking outside.'); // Debug log
                    }, 300); // Match transition duration
                }
            });

            // Checkout button click (dummy action)
            checkoutButton.addEventListener('click', () => {
                console.log('Proceeding to checkout with total:', cart.total.toFixed(2));
                // In a real application, this would navigate to a checkout page
                // For demonstration, let's clear the cart and close the modal
                cart.items = [];
                cart.total = 0;
                updateCartItemCount();
                renderCartItems();
                showNotification('Checkout initiated! Cart cleared.');
                // Apply transition styles for closing
                cartModal.querySelector('div').style.transform = 'translateY(-20px)';
                cartModal.querySelector('div').style.opacity = '0';
                setTimeout(() => {
                    cartModal.classList.add('hidden');
                    console.log('Checkout completed and cart cleared.'); // Debug log
                }, 300); // Match transition duration
            });

            // Initial cart load on page load
            initializeCart();
        });
    </script>