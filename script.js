let basket = [];
let overlayTimeout; // 초기값 null 불필요

// 1. 메뉴 렌더링
function renderDishes() {
    document.getElementById('gimbap-list').innerHTML = '';
    document.getElementById('ramen-list').innerHTML = '';
    document.getElementById('rice-list').innerHTML = '';

    for (let i = 0; i < myDishes.length; i++) {
        let dish = myDishes[i];
        let html = getMenuCardTemplate(dish, i);

        if (dish.category === "gimbap") {
            document.getElementById('gimbap-list').innerHTML += html;
        } else if (dish.category === "ramen") {
            document.getElementById('ramen-list').innerHTML += html;
        } else if (dish.category === "rice") {
            document.getElementById('rice-list').innerHTML += html;
        }
    }
}

// 2. 장바구니 조작
function addToBasket(index) {
    let dish = myDishes[index];
    document.getElementById('basketWrapper').classList.remove('d-none');

    let itemIndex = -1;
    for (let i = 0; i < basket.length; i++) {
        if (basket[i].name === dish.name) {
            itemIndex = i;
            break;
        }
    }

    if (itemIndex === -1) {
        basket.push({ name: dish.name, price: dish.price, amount: 1 });
    } else {
        basket[itemIndex].amount++;
    }

    renderBasket();
    
    let basketItem = getBasketItem(dish.name);
    let btn = document.getElementById(`menu-btn-${index}`);
    btn.classList.add('is-added');
    btn.innerText = `Added ${basketItem.amount}`;
}

function deleteBasketItem(index) {
    basket.splice(index, 1);
    renderBasket();
    renderDishes();
}

function decreaseAmount(index) {
    if (basket[index].amount > 1) {
        basket[index].amount--;
    } else {
        basket.splice(index, 1);
    }
    renderBasket();
    renderDishes();
}

function increaseAmount(index) {
    basket[index].amount++;
    renderBasket();
    renderDishes();
}

// 3. 장바구니 렌더링
let isDelivery = true; 

function toggleDeliveryOption(delivery) {
    isDelivery = delivery;
    renderBasket();
}

function renderBasket() {
    if (basket.length === 0) {
        showEmptyBasket();
    } else {
        showBasketItems();
        showReceipt();
    }
    updateMobileCartBadge();
}

function showEmptyBasket() {
    document.querySelector('.basket').classList.add('is-empty');
    document.getElementById('basketTotal').innerHTML = '';
    document.getElementById('addedItems').innerHTML = `
        <div class="empty-basket-container">
            <p class="empty-basket-text">Nothing here yet.<br>Go ahead and choose something delicious!</p>
            <div class="empty-basket-icon"><img src="./assets/icons/cart-big.svg" alt="Empty cart"></div>
        </div>
    `;
}

function showBasketItems() {
    document.querySelector('.basket').classList.remove('is-empty');
    let itemsHTML = '';
    for (let i = 0; i < basket.length; i++) {
        let item = basket[i];
        let itemTotalPrice = item.price * item.amount;
        itemsHTML += getBasketItemTemplate(item, itemTotalPrice, i);
    }
    document.getElementById('addedItems').innerHTML = itemsHTML;
}

function showReceipt() {
    let subtotal = 0;
    for (let i = 0; i < basket.length; i++) {
        subtotal += basket[i].price * basket[i].amount;
    }

    let deliveryFee = 4.99;
    let finalDeliveryFee = isDelivery ? deliveryFee : 0;
    let total = subtotal + finalDeliveryFee;

    document.getElementById('basketTotal').innerHTML = getBasketTotalTemplate(subtotal, deliveryFee, total);
}

// 4. 모달 및 모바일 동작
function checkoutOrder() {
    basket = [];
    renderBasket();
    renderDishes();

    if (window.innerWidth > 768) {
        document.getElementById('basketWrapper').classList.add('d-none');
    } else {
        closeMobileBasket(); 
    }

    document.getElementById('orderOverlay').classList.remove('d-none');

    clearTimeout(overlayTimeout);
    overlayTimeout = setTimeout(function() {
        closeOrderOverlay();
    }, 3000);
}

function closeOrderOverlay() {
    document.getElementById('orderOverlay').classList.add('d-none');
}

function openMobileBasket() {
    let basketWrapper = document.getElementById('basketWrapper');
    if (basketWrapper.classList.contains('is-open')) {
        closeMobileBasket();
        return;
    }
    basketWrapper.classList.add('is-open');
    document.body.style.overflow = 'hidden';
}

function closeMobileBasket() {
    document.getElementById('basketWrapper').classList.remove('is-open');
    document.body.style.overflow = '';
}

function updateMobileCartBadge() {
    let badge = document.getElementById('mobileCartCount');
    let cartBtn = document.querySelector('.cart-nav-btn');
    let totalCount = 0;
    
    for (let i = 0; i < basket.length; i++) {
        totalCount += basket[i].amount;
    }

    if (totalCount > 0) {
        badge.innerText = totalCount;
        badge.classList.remove('d-none');
        cartBtn.classList.add('has-items');
    } else {
        badge.classList.add('d-none');
        cartBtn.classList.remove('has-items');
    }
}

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.body.style.overflow = ''; 
        document.getElementById('basketWrapper').classList.remove('is-open');
    }
});

function categoryMenu() {
    document.getElementById('nav-menu').classList.toggle('is-open');
}

function goToCategory(categoryId) {
    categoryMenu();
    document.getElementById(categoryId).scrollIntoView({ behavior: 'smooth' });
}