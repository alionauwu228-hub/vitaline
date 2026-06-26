const loginBtn = document.getElementById("login-btn");
const modal = document.getElementById("login-modal");
const closeBtn = document.getElementById("close-btn");

loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    modal.classList.add("active");
    document.body.classList.add("no-scroll");
});

closeBtn.addEventListener("click", function () {
    modal.classList.remove("active");
    document.body.classList.remove("no-scroll");
});
let cartCount = parseInt(localStorage.getItem("cartCount")) || 0;
const cartCountElement = document.getElementById("cart-count");
const addToCartButtons = document.querySelectorAll(".cart-btn, .product-cart-btn");
let boughtProducts = JSON.parse(localStorage.getItem("boughtProducts")) || [];

function updateHeaderCart() {
    if (cartCountElement) {
        if (cartCount > 0) {
            cartCountElement.textContent = cartCount;
            cartCountElement.style.display = "block";
        } else {
            cartCountElement.style.display = "none";
        }
    }
}
updateHeaderCart();
addToCartButtons.forEach(button => {
    const productName = button.dataset.name;
    const isBought = boughtProducts.some(prod => prod.name === productName);
    if (productName && isBought) {
        button.textContent = "В корзине";
        button.disabled = true;
        button.style.opacity = "0.7";
        button.style.cursor = "default";
    }
});
addToCartButtons.forEach(button => {
    button.addEventListener("click", function () {
        const productName = button.dataset.name;
        const productPrice = parseInt(button.dataset.price) || 0;
        const isBought = boughtProducts.some(prod => prod.name === productName);
        if (productName && !isBought) {
            boughtProducts.push({ name: productName, price: productPrice });
            localStorage.setItem("boughtProducts", JSON.stringify(boughtProducts));
            cartCount++;
            localStorage.setItem("cartCount", cartCount);
            updateHeaderCart();
            const sameButtons = document.querySelectorAll(`[data-name="${productName}"]`);
            sameButtons.forEach(btn => {
                btn.textContent = "В корзине";
                btn.disabled = true;
                btn.style.opacity = "0.7";
                btn.style.cursor = "default";
            });
        }
    });
});
if (window.location.href.includes("cart.html")) {
    const emptyCartBlock = document.getElementById("empty-cart");
    const filledCartBlock = document.getElementById("filled-cart");
    const listContainer = document.getElementById("cart-items-list");
    const clearCartBtn = document.getElementById("clear-cart-btn");
    const summaryCount = document.getElementById("summary-count");
    const summarySubtotal = document.getElementById("summary-subtotal");
    const summaryTotalPrice = document.getElementById("summary-total-price");
    const productDetails = {
        "Нурофен": {
            fullName: "Нурофен Экспресс Форте капсулы 400 мг 20 шт",
            imgSrc: "nurofen.svg"
        },
        "Bioderma": {
            fullName: "Bioderma Гель-крем для тела после солнца 200 мл",
            imgSrc: "bioderma.svg"
        },
        "Магне Б6": {
            fullName: "Магне Б6 форте таблетки покрыт.плен.об. 100 мг+10 мг 100 шт",
            imgSrc: "magneB6.svg"
        },
        "Эвалар": {
            fullName: "Мишки Эвалар Витамин жевательные пастилки 60 шт",
            imgSrc: "evalar.svg"
        }
    };
    if (boughtProducts.length > 0) {
        if (emptyCartBlock) emptyCartBlock.style.display = "none";
        if (filledCartBlock) filledCartBlock.style.display = "grid";
        if (listContainer) {
            listContainer.innerHTML = "";
            let totalPrice = 0;
            boughtProducts.forEach(prod => {
                totalPrice += prod.price;
                const details = productDetails[prod.name] || { fullName: prod.name, imgSrc: "cartbig.svg" };
                listContainer.innerHTML += `
                    <div class="cart-item-row">
                        <img class="cart-item-img" src="${details.imgSrc}" alt="${prod.name}">
                        <div class="cart-item-info">
                            <h4>${details.fullName}</h4>
                            <span class="cart-item-status">Доставка сегодня</span>
                        </div>
                        <div class="cart-item-price">${prod.price} ₽</div>
                    </div>
                `;
            });
            if (summaryCount) summaryCount.textContent = `${boughtProducts.length} товара`;
            if (summarySubtotal) summarySubtotal.textContent = `${totalPrice} ₽`;
            if (summaryTotalPrice) summaryTotalPrice.textContent = `${totalPrice} ₽`;
        }
    }
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", function () {
            localStorage.removeItem("boughtProducts");
            localStorage.removeItem("cartCount");
            window.location.reload();
        });
    }
}
const searchInput = document.querySelector(".search-input");
const searchBtn = document.getElementById("search-btn");
const searchErrorBadge = document.getElementById("search-error-badge");
function performSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim().toLowerCase();
    if (query === "") {
        if (searchErrorBadge) searchErrorBadge.style.style.display = "none";
        return;
    }
    if (searchErrorBadge) searchErrorBadge.style.display = "none";
    if (query.includes("нурофен")) {
        window.location.href = "nurofen.html";
    } else if (query.includes("bioderma") || query.includes("биодерма")) {
        window.location.href = "bioderma.html";
    } else if (query.includes("magneB6") || query.includes("magne") || query.includes("магне") || query.includes("магне Б6")) {
        window.location.href = "magneB6.html";
    } else if (query.includes("мишки эвалар") || query.includes("мишки") || query.includes("эвалар")) {
        window.location.href = "evalar.html";
    } else {
        if (searchErrorBadge) {
            searchErrorBadge.style.display = "block";
            setTimeout(() => {
                searchErrorBadge.style.display = "none";
            }, 4000);
        }
    }
}
if (searchBtn) {
    searchBtn.addEventListener("click", performSearch);
}
if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            performSearch();
        }
    });
}