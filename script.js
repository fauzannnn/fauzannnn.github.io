let cart = [];

// Fungsi untuk menambah item ke keranjang
function addToCart(id, name, price) {
    const product = { id, name, price };
    cart.push(product);
    updateCartCount();
    alert(`${name} telah ditambahkan ke keranjang.`);
}

// Fungsi untuk memperbarui tampilan jumlah item di keranjang
function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

// Fungsi untuk pindah ke halaman checkout
function goToCheckout() {
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = "checkout.html";
}

// Fungsi untuk menampilkan keranjang di halaman checkout
function displayCart() {
    const cartList = document.getElementById('cart-list');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - Rp${item.price.toLocaleString()}`;
        cartList.appendChild(listItem);
        totalPrice += item.price;
    });

    document.getElementById('total-price').textContent = `Total: Rp${totalPrice.toLocaleString()}`;
}

// Fungsi untuk menampilkan popup "Pesanan Berhasil"
function completeOrder() {
    // Validasi input
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const shipping = document.getElementById('shipping').value;

    if (!name || !phone || !address || !shipping) {
        alert("Lengkapi semua detail pengiriman.");
        return;
    }

    // Tampilkan popup konfirmasi
    showConfirmationPopup();
}

// Fungsi untuk menampilkan popup konfirmasi
function showConfirmationPopup() {
    // Buat elemen overlay
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    // Buat popup konten
    const popup = document.createElement('div');
    popup.classList.add('popup');
    
    const checkmark = document.createElement('span');
    checkmark.classList.add('checkmark');
    checkmark.innerHTML = '&#10003;'; // simbol centang

    const message = document.createElement('p');
    message.classList.add('message');
    message.textContent = 'Pesanan Berhasil!';

    popup.appendChild(checkmark);
    popup.appendChild(message);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Hapus popup setelah beberapa detik
    setTimeout(() => {
        document.body.removeChild(overlay);
        localStorage.removeItem('cart');
        window.location.href = "index.html"; // Kembali ke halaman utama
    }, 3000);
}

// Panggil fungsi displayCart di halaman checkout
if (window.location.pathname.includes("checkout.html")) {
    displayCart();
}