// LOAD CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartCount();

function updateCartCount() {
    document.getElementById("cartCount").innerText = cart.length;
}

// LOGIN SYSTEM (IGN ONLY)
function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
}
function closeLogin() {
    document.getElementById("loginModal").style.display = "none";
}
function submitLogin() {
    const ign = document.getElementById("ignInput").value.trim();

    if (ign === "") {
        alert("Please enter a valid IGN.");
        return;
    }

    localStorage.setItem("cazemc_ign", ign);
    document.getElementById("loggedUser").innerText = "Hi, " + ign;
    document.getElementById("loginBtn").style.display = "none";
    closeLogin();
}

window.onload = () => {
    const ign = localStorage.getItem("cazemc_ign");
    if (ign) {
        document.getElementById("loggedUser").innerText = "Hi, " + ign;
        document.getElementById("loginBtn").style.display = "none";
    }

    if (window.location.pathname.includes("cart.html")) {
        loadCart();
    }
    if (window.location.pathname.includes("checkout.html")) {
        loadCheckout();
    }
};

// ADD TO CART
function addToCart(name, price) {
    const ign = localStorage.getItem("cazemc_ign");
    if (!ign) {
        openLogin();
        return;
    }

    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    alert(name + " added to cart!");
}

function goCart() {
    window.location.href = "cart.html";
}

// CART PAGE DISPLAY
function loadCart() {
    const box = document.getElementById("cartItems");
    let total = 0;

    box.innerHTML = "";
    cart.forEach((item, index) => {
        total += item.price;

        box.innerHTML += `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>₹${item.price}</p>
                <button onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });

    document.getElementById("totalPrice").innerText = "Total: ₹" + total;
}

function removeItem(i) {
    cart.splice(i, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function goCheckout() {
    window.location.href = "checkout.html";
}

// CHECKOUT PAGE
function loadCheckout() {
    const box = document.getElementById("checkoutBox");
    const ign = localStorage.getItem("cazemc_ign");

    let total = 0;

    box.innerHTML = `<h2>IGN: ${ign}</h2><hr>`;

    cart.forEach(item => {
        total += item.price;
        box.innerHTML += `<p>${item.name} - ₹${item.price}</p>`;
    });

    box.innerHTML += `<hr><h2>Total: ₹${total}</h2>`;
}

function completePurchase() {
    alert("Purchase complete! Items will be delivered in-game.");
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    window.location.href = "index.html";
}
