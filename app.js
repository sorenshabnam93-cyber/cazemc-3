let cart = JSON.parse(localStorage.getItem("cart")) || [];
let ign = localStorage.getItem("ign") || "";

function updateCart() {
    document.getElementById("cartCount").textContent = cart.length;
}

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
}

function openIGN() {
    document.getElementById("ignModal").style.display = "block";
}

function closeIGN() {
    document.getElementById("ignModal").style.display = "none";
}

function saveIGN() {
    const value = document.getElementById("ignInput").value;
    if (!value) return alert("Enter IGN");

    localStorage.setItem("ign", value);
    ign = value;
    closeIGN();
}

function loadCartPage() {
    let box = document.getElementById("cartItems");
    let total = 0;

    cart.forEach(item => {
        total += item.price;
        box.innerHTML += `<p>${item.name} - ₹${item.price}</p>`;
    });

    document.getElementById("totalPrice").textContent = total;
}

function loadCheckout() {
    document.getElementById("showIGN").textContent = ign;
    let total = cart.reduce((a,b) => a + b.price, 0);
    document.getElementById("checkoutTotal").textContent = total;
}

updateCart();
