let basket = [];
let overlayTimeout;
let isDelivery = true;

function renderDishes() {
    clearDishContainers();

    for (let i = 0; i < myDishes.length; i++) {
        let dish = myDishes[i];
        let basketItem = getBasketItem(dish.name);
        let buttonText = basketItem ? `Added ${basketItem.amount}` : 'Add to basket';
        let buttonClass = basketItem ? 'btn-add-basket is-added' : 'btn-add-basket';
        let html = getMenuCardTemplate(dish, i, buttonText, buttonClass);

        insertDishByCategory(dish.category, html);
    }
}

function clearDishContainers() {
    document.getElementById('gimbap-list').innerHTML = '';
    document.getElementById('ramen-list').innerHTML = '';
    document.getElementById('rice-list').innerHTML = '';
}

function insertDishByCategory(category, html) {
    let containerMap = {
        gimbap: 'gimbap-list',
        ramen: 'ramen-list',
        rice: 'rice-list'
    };
    let containerId = containerMap[category];
    if (containerId) {
        document.getElementById(containerId).innerHTML += html;
    }
}

function getBasketItem(menuItemName) {
    for (let i = 0; i < basket.length; i++) {
        if (basket[i].name === menuItemName) {
            return basket[i];
        }
    }
    return null;
}

function addToBasket(index) {
    let dish = myDishes[index];
    let itemIndex = -1;
    let basketItem;
    let btn;

    document.getElementById('basketWrapper').classList.remove('d-none');

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

    basketItem = getBasketItem(dish.name);
    btn = document.getElementById(`menu-btn-${index}`);
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
    document.getElementById('addedItems').innerHTML = getEmptyBasketTemplate();
}

function showBasketItems() {
    let itemsHTML = '';

    document.querySelector('.basket').classList.remove('is-empty');

    for (let i = 0; i < basket.length; i++) {
        let item = basket[i];
        let itemTotalPrice = item.price * item.amount;
        let isSingle = item.amount === 1;

        let trashHeaderHTML = !isSingle
            ? `<img src="./assets/icons/trash.svg" alt="Delete" class="btn-trash-top" onclick="deleteBasketItem(${i})">`
            : '';

        let controlLeftHTML = isSingle
            ? `<img src="./assets/icons/trash.svg" alt="Delete" class="btn-control-trash" onclick="deleteBasketItem(${i})">`
            : `<img src="./assets/icons/minus.svg" alt="Decrease" class="btn-control-icon" onclick="decreaseAmount(${i})">`;

        itemsHTML += getBasketItemTemplate(item, itemTotalPrice, i, trashHeaderHTML, controlLeftHTML);
    }

    document.getElementById('addedItems').innerHTML = itemsHTML;
}

function showReceipt() {
    let subtotal = 0;
    let deliveryFee = 4.99;
    let finalDeliveryFee;
    let total;
    let activeDeliveryClass;
    let activePickupClass;
    let deliveryRowHTML;

    for (let i = 0; i < basket.length; i++) {
        subtotal += basket[i].price * basket[i].amount;
    }

    finalDeliveryFee = isDelivery ? deliveryFee : 0;
    total = subtotal + finalDeliveryFee;

    activeDeliveryClass = isDelivery ? 'switch-btn active' : 'switch-btn';
    activePickupClass = !isDelivery ? 'switch-btn active' : 'switch-btn';

    deliveryRowHTML = isDelivery
        ? `<span>${deliveryFee.toFixed(2).replace('.', ',')}€</span>`
        : `<span class="discount-text">- ${deliveryFee.toFixed(2).replace('.', ',')}€ (Pickup)</span>`;

    document.getElementById('basketTotal').innerHTML = getBasketTotalTemplate(
        subtotal,
        deliveryRowHTML,
        total,
        activeDeliveryClass,
        activePickupClass
    );
}

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

function categoryMenu() {
    document.getElementById('nav-menu').classList.toggle('is-open');
}

function goToCategory(categoryId) {
    categoryMenu();
    document.getElementById(categoryId).scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.body.style.overflow = '';
        document.getElementById('basketWrapper').classList.remove('is-open');
    }
});