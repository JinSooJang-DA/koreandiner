function getBasketItem(menuItemName) {
    for (let i = 0; i < basket.length; i++) {
        if (basket[i].name === menuItemName) {
            return basket[i];
        }
    }
    return null;
}

function getMenuCardTemplate(menuItem, i) {
    const basketItem = getBasketItem(menuItem.name);

    let buttonText = 'Add to basket';
    let buttonClass = 'btn-add-basket';

    if (basketItem) {
        buttonText = 'Added ' + basketItem.amount;
        buttonClass = 'btn-add-basket is-added';
    }

    return `
    <article class="menu-card">
        <picture>
            <source media="(max-width: 768px)" srcset="${menuItem.imageMobile}">
            <img src="${menuItem.image}" alt="${menuItem.name}" class="menu-card-img" loading="lazy">
        </picture>
        <div class="menu-card-right">
            <div class="menu-card-header">
                <h4 class="menu-card-title">${menuItem.name}</h4>
                <span class="menu-card-price desktop-price">${menuItem.price.toFixed(2).replace('.', ',')}€</span>
            </div>
            
            <p class="menu-card-desc">${menuItem.description}</p>
            
            <div class="menu-card-footer">
                <span class="menu-card-price mobile-price">${menuItem.price.toFixed(2).replace('.', ',')}€</span>
                <button type="button" id="menu-btn-${i}" class="${buttonClass}" onclick="addToBasket(${i})">
                    ${buttonText}
                </button>
            </div>
        </div>
    </article>
    `;
}

function getBasketItemTemplate(item, itemTotalPrice, i) {
    const isSingle = item.amount === 1;

    let trashHeaderHTML = '';
    if (!isSingle) {
        trashHeaderHTML = `
            <img src="./assets/icons/trash.svg" alt="Delete" class="btn-trash-top" onclick="deleteBasketItem(${i})">
        `;
    }

    // 아이템이 1개일 때는 휴지통 아이콘, 2개 이상일 때는 마이너스 아이콘
    let controlLeftHTML = isSingle 
        ? `<img src="./assets/icons/trash.svg" alt="Delete" class="btn-control-trash" onclick="deleteBasketItem(${i})">`
        : `<img src="./assets/icons/minus.svg" alt="Decrease" class="btn-control-icon" onclick="decreaseAmount(${i})">`;

    return `
        <div class="basket-item">
            <div class="basket-item-header">
                <span class="basket-item-title">${item.amount} x ${item.name}</span>
                ${trashHeaderHTML}
            </div>

            <div class="basket-item-bottom">
                <div class="basket-item-controls">
                    ${controlLeftHTML}
                    <span class="item-amount-num">${item.amount}</span>
                    <img src="./assets/icons/plus.svg" alt="Increase" class="btn-control-icon" onclick="increaseAmount(${i})">
                </div>
                <span class="basket-item-price">${itemTotalPrice.toFixed(2).replace('.', ',')}€</span>
            </div>
        </div>
    `;
}

function getBasketTotalTemplate(subtotal, deliveryFee, total) {
    const activeDeliveryClass = isDelivery ? 'switch-btn active' : 'switch-btn';
    const activePickupClass = !isDelivery ? 'switch-btn active' : 'switch-btn';
    
    const deliveryRowHTML = isDelivery 
        ? `<span>${deliveryFee.toFixed(2).replace('.', ',')}€</span>` 
        : `<span class="discount-text">- ${deliveryFee.toFixed(2).replace('.', ',')}€ (Pickup)</span>`;

    return `
        <div class="delivery-switch-container">
            <button type="button" class="${activeDeliveryClass}" onclick="toggleDeliveryOption(true)">Delivery</button>
            <button type="button" class="${activePickupClass}" onclick="toggleDeliveryOption(false)">Pickup</button>
        </div>
        <div class="basket-total-wrapper">
            <div class="total-row"><span>Subtotal</span><span>${subtotal.toFixed(2).replace('.', ',')}€</span></div>
            <div class="total-row"><span>Delivery fee</span>${deliveryRowHTML}</div>
            <div class="total-divider"></div>
            <div class="total-row total-bold"><span>Total</span><span>${total.toFixed(2).replace('.', ',')}€</span></div>
            <button type="button" class="btn-buy-now" onclick="checkoutOrder()">Buy now (${total.toFixed(2).replace('.', ',')}€)</button>
        </div>
    `;
}