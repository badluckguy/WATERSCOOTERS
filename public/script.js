// Initialize the cart from localStorage or create an empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add items to the cart with image
function addToCart(id, price, name, imageUrl) {
    console.log(`Adding item to cart: ${name}, ID: ${id}`);  // Debug log

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if item already exists
        console.log(`Increased quantity for ${name} to ${existingItem.quantity}`);
    } else {
        cart.push({ id, price, name, imageUrl, quantity: 1 }); // Add new item with imageUrl to the cart
        console.log(`Added new item to cart: ${name}`);
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // Update cart count in the UI
    console.log("Cart updated:", cart);  // Debug log of updated cart
}

// Function to update the cart item count in the UI
function updateCartCount() {
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0); // Total item count
    document.getElementById('header-cart-count').textContent = cartCount; // Update cart icon count
    console.log(`Updated cart count: ${cartCount}`);  // Debug log
}

// Function to render cart items in the cart modal with images
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity; // Calculate total price
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div style="display: flex; align-items: center;">
                <img src="${item.imageUrl}" alt="${item.name}" style="width: 80px; height: 80px; margin-right: 10px;">
                <div>
                    <strong>Item:</strong> ${item.name}<br>
                    <strong>Price:</strong> $${item.price}<br>
                    <strong>Quantity:</strong> 
                    <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`; // Update total price
    console.log("Rendered cart items with images:", cart);  // Debug log
}

// Function to handle increasing or decreasing quantity
function updateQuantity(index, action) {
    if (action === 'increase') {
        cart[index].quantity += 1;
    } else if (action === 'decrease' && cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    }
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    renderCartItems(); // Re-render the cart items
    updateCartCount(); // Update the cart count
    console.log(`Updated quantity of item at index ${index} to ${cart[index].quantity}`);  // Debug log
}

// Function to handle removing items from the cart
function removeItemFromCart(index) {
    console.log(`Removing item at index ${index}`);  // Debug log
    cart.splice(index, 1); // Remove the item from the cart array
    localStorage.setItem('cart', JSON.stringify(cart)); // Update localStorage
    renderCartItems(); // Re-render the cart items
    updateCartCount(); // Update the cart count
}

// Safely attach event listeners, ensuring that they are not added multiple times
function safelyAttachEventListener(selector, event, handler) {
    const element = document.querySelector(selector);
    if (element) {
        console.log(`Attaching event listener to ${selector}`);  // Debug log
        element.removeEventListener(event, handler); // Remove any previous event listener
        element.addEventListener(event, handler);    // Attach new event listener
    }
}

// Handle "Add to Cart" button click for Waterscooter X200
function addToCartX200() {
    console.log('Adding Waterscooter X200 to cart'); // Debug log
    addToCart(1, 500, 'Waterscooter X200', 'images/waterscooter1.png'); // Updated price to $500
    alert('Waterscooter X200 has been added to your cart!');
}

// Handle "Add to Cart" button click for Waterscooter X300
function addToCartX300() {
    console.log('Adding Waterscooter X300 to cart'); // Debug log
    addToCart(2, 450, 'Waterscooter X300', 'images/orangewaterscooter1.png'); // Adds Waterscooter X300 with ID 2, price $450, and image URL
    alert('Waterscooter X300 has been added to your cart!');
}

// Handle "Add to Cart" button click for Goggles
function addToCartGoggles() {
    console.log('Adding Goggles to cart'); // Debug log
    addToCart(3, 25.99, 'Goggles', 'images/goggles01-1.png'); // Adds Goggles with ID 3, price $25.99, and image URL
    alert('Goggles have been added to your cart!');
}

// Safely attach event listeners
document.addEventListener('DOMContentLoaded', () => {
    safelyAttachEventListener('#add-to-cart-x200', 'click', addToCartX200);
    safelyAttachEventListener('#add-to-cart-x300', 'click', addToCartX300);
    safelyAttachEventListener('#add-to-cart-goggles', 'click', addToCartGoggles); // Ensure this works for the goggles product

    // Handle Cart icon click to show cart items before checkout
    safelyAttachEventListener('#cart-icon', 'click', () => {
        renderCartItems(); // Render cart items in the modal
        document.getElementById('cart-modal').style.display = 'block'; // Show the cart modal
    });

    // Handle Remove item button click in the cart modal
    document.getElementById('cart-items').addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('remove-item')) {
            removeItemFromCart(index); // Remove the item from the cart
        } else if (e.target.classList.contains('increase-quantity')) {
            updateQuantity(index, 'increase'); // Increase the quantity
        } else if (e.target.classList.contains('decrease-quantity')) {
            updateQuantity(index, 'decrease'); // Decrease the quantity
        }
    });

    // Initialize the cart count on page load
    updateCartCount(); // Update the cart count display on load

    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent the default form submission

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            fetch('http://localhost:3000/send-message', { // Ensure this URL is correct
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            })        
            .then(response => {
                if (response.ok) {
                    // Redirect to thankyou.html
                    window.location.href = '/thankyou.html';
                } else {
                    alert('Error sending message. Please try again.');
                    return response.text().then(text => console.error('Server error:', text));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error sending your message. Please try again.');
            });
        });
    }
});

// Handle Proceed to Checkout button click
safelyAttachEventListener('#proceed-checkout', 'click', () => {
    if (cart.length > 0) {
        console.log("Proceeding to checkout with cart items: ", cart);  // Debug log

        // Check if all items have valid name, price, and quantity
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            if (!item.name || !item.price || item.quantity <= 0) {
                console.error(`Invalid item at index ${i}:`, item);
                alert('There is an issue with one or more items in your cart. Please review.');
                return;
            }
        }

        fetch('/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: cart
            }),
        })
        .then(res => res.json())
        .then(data => {
            console.log("Received from server: ", data);  // Debug log
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe Checkout
            } else {
                console.error('Error: Checkout session URL not found.');
                alert('Checkout session failed. Please try again.');
            }
        })
        .catch(e => {
            console.error('Checkout session error:', e);  // Log any errors
            alert('Error occurred during checkout. Please try again.');
        });
    } else {
        alert('Your cart is empty.');
    }
});

// Close the cart modal
safelyAttachEventListener('#close-cart-modal', 'click', () => {
    document.getElementById('cart-modal').style.display = 'none'; // Properly close the cart modal
});
