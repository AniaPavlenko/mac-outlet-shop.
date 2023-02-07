'use strict';

// swiper set up
new Swiper('.swiper', {
  autoplay: {
    delay: 2000,
    stopOnLastSlide: false,
    disableOnIteraction: false,
  },
  speed: 800,
});

class Item {
  constructor(item) {
    Object.assign(this, item);
    this.isliked = false;
    this.order = Math.trunc(Math.round() * 1500);
  }

  get isAvailableToPurchase() {
    return this.orderInfo.inStock > 0;
  }

  get absoluteImgPath() {
    return `img/${this.imgUrl}`;
  }

  toggleLike() {
    return (this.isliked = !this.isliked);
  }

  checkIsNameIncludes(name) {
    const itemTitleToLowerCase = name.toLowerCase();
    return this.name.toLowerCase().includes(itemTitleToLowerCase);
  }

  checkIsColorIncludes(colors) {
    if (!colors.length) return true;

    for (const color of colors) {
      const isExist = this.color.includes(color);
      if (isExist) {
        return true;
      }
      return false;
    }
  }

  checkIsStorageIncludes(storages) {
    if (!storages.length) return true;

    for (const storage of storages) {
      if (this.storage === storage) {
        return true;
      }
    }
    return false;
  }

  checkIsOSIncludes(opSystems) {
    if (!opSystems.length) return true;

    for (const os of opSystems) {
      if (this.os === os) {
        return true;
      }
    }
    return false;
  }

  checkIsDisplayIncludes(displays) {
    if (!displays.length) return true;

    for (const display of displays) {
      if (display === '<5' && this.display < 5) {
        return true;
      }
      if (display === '5-7' && this.display >= 5 && this.display < 7) {
        return true;
      }
      if (display === '7-12' && this.display >= 7 && this.display < 12) {
        return true;
      }
      if (display === '12-16' && this.display >= 12 && this.display <= 16) {
        return true;
      }
      if (display === '+16' && this.display > 16 && this.display !== null) {
        return true;
      }
    }
  }

  checkIsPriceIncludes(prices) {
    if (!prices.length) return true;

    for (const price of prices) {
      if (this.price === price) {
        return true;
      }
    }
    return false;
  }
}

class GoodsDataBase {
  constructor() {
    this.items = items.map(item => new Item(item));
  }

  get availableColors() {
    return this.items
      .reduce((acc, item) => [...acc, ...item.color], [])
      .filter((item, index, arr) => arr.indexOf(item) === index);
  }

  get availableStorage() {
    return this.items
      .map(item => item.storage)
      .filter(
        (item, index, arr) => arr.indexOf(item) === index && item !== null
      )
      .sort((a, b) => {
        return b - a;
      });
  }

  get availableOS() {
    return this.items
      .map(item => item.os)
      .filter(
        (item, index, arr) => arr.indexOf(item) === index && item !== null
      );
  }

  get availableDisplay() {
    let allDisplays = ['<5', '5-7', '7-12', '12-16', '+16'];
    return allDisplays.filter(
      (item, index, arr) => arr.indexOf(item) === index && item !== null
    );
  }

  get availablePrice() {
    return this.items
      .map(item => item.price)
      .filter(
        (item, index, arr) => arr.indexOf(item) === index && item !== null
      );
  }

  searchByName(name) {
    const itemNameToLowerCase = name.toLowerCase();

    return this.items.filter(item =>
      item.name.toLowerCase().includes(itemNameToLowerCase)
    );
  }

  filterItems(filter = {}) {
    const {
      name = '',
      color = [],
      storage = [],
      os = [],
      display = [],
      price = [],
    } = filter;

    return this.items.filter(item => {
      const isNameIncluded = item.checkIsNameIncludes(name);
      if (!isNameIncluded) return false;

      const isColorIncluded = item.checkIsColorIncludes(color);
      if (!isColorIncluded) return false;

      const isStorageIncluded = item.checkIsStorageIncludes(storage);
      if (!isStorageIncluded) return false;

      const isOSIncluded = item.checkIsOSIncludes(os);
      if (!isOSIncluded) return false;

      const isDisplyIncluded = item.checkIsDisplayIncludes(display);
      if (!isDisplyIncluded) return false;

      const isPriceIncluded = item.checkIsPriceIncludes(price);
      if (!isPriceIncluded) return false;

      return true;
    });
  }
}

class RenderCards {
  constructor(itemsBase) {
    this.cardsContainer = document.querySelector('.main-goods');
    this.rendering(itemsBase.items);
  }

  static renderCard(item) {
    const cardElem = document.createElement('li');
    cardElem.className = 'card-item';

    cardElem.innerHTML = `
      <div class="card-box">
      <img src="img/icons/like_empty.svg" alt="" class="card-like" />
      <img src="${item.absoluteImgPath}" alt="${item.name}" class="card-img" />
      <h3 class="card-name">${item.name}</h3>
      <p class="card-availability">${item.orderInfo.inStock} left in stock</p>
      <p class="card-price">Price <span class="mark">${item.price}$</span></p>
      <button class="primary-button">Add to cart</button>
    </div>
    <div class="card-review">
      <p class="review">
        <span class="mark">${item.orderInfo.reviews}%</span> Positive review
        Above avarage
      </p>
      <p class="orders">
        <span class="mark">${Math.trunc(Math.random() * 1500)}</span> orders
      </p>
    </div>
    `;

    //like & dislike
    const likeBtn = cardElem.querySelector('.card-like');

    if (item.isliked) {
      likeBtn.src = 'img/icons/like_filled.svg';
    }

    likeBtn.addEventListener('click', e => {
      likeBtn.classList.toggle('card-like-active');
      e.stopPropagation();
    });

    //buttons set up
    const primaryButton = cardElem.querySelector('.primary-button');
    const iconDisable = cardElem.querySelector('.card-availability');

    if (item.isAvailableToPurchase) {
      primaryButton.addEventListener('click', e => {
        e.stopPropagation();
      });
    } else {
      primaryButton.disabled = true;
      primaryButton.classList.add('disable-button');
      iconDisable.classList.add('card-non-availability');
    }

    primaryButton.addEventListener('click', () => {
      cart.addToCart(item);
      renderCart.renderCartItems(cart.items);
    });

    // modal functional block
    const addModal = function () {
      const modal = document.querySelector('.main-modal');
      const overlay = document.querySelector('.overlay');

      modal.classList.remove('hidden');
      overlay.classList.remove('hidden');

      const closeModal = function () {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
      };

      overlay.addEventListener('click', closeModal);

      // modal can be closed by ESC button on keyboard
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
          closeModal();
        }
      });

      modal.innerHTML = `
        <div class="modal-img-container">
        <img class="modal-img" src="${item.absoluteImgPath}" alt="${
        item.name
      }" />
      </div>
      <div class="modal-middle-block">
        <p class="modal-title">${item.name}</p>
        <div class="modal-review-container">
          <p class="modal-review review">
            <span class="mark">${
              item.orderInfo.reviews
            }%</span> Positive reviews Above avarage
          </p>
          <p class="modal-review-orders">
            <span class="mark">${Math.trunc(Math.random() * 1500)}</span> orders
          </p>
        </div>
        <ul class="modal-item-details">
          <li class="modal-item-color">
            <span class="modal-item-mark">Color:</span> ${item.color.join(', ')}
          </li>
          <li class="modal-item-os">
            <span class="modal-item-mark">Operating System:</span> ${item.os}
          </li>
          <li class="modal-item-chip">
            <span class="modal-item-mark">Chip:</span> ${item.chip.name}
          </li>
          <li class="modal-item-height">
            <span class="modal-item-mark">Height:</span> ${item.size.height} cm
          </li>
          <li class="modal-item-width">
            <span class="modal-item-mark">Width:</span> ${item.size.width} cm
          </li>
          <li class="modal-item-depth">
            <span class="modal-item-mark">Depth:</span> ${item.size.depth} cm
          </li>
          <li class="modal-item-weight">
            <span class="modal-item-mark">Weight:</span> ${item.size.weight} g
          </li>
        </ul>
      </div>
      <div class="modal-item-sale-data">
        <p class="modal-price">$ ${item.price}</p>
        <p class="modal-left-in-stock">
          Stock: <span class="mark">${item.orderInfo.inStock}</span> pcs.
        </p>
        <button class="primary-button">Add to cart</button>
      </div>      
        `;

      const primaryButton = modal.querySelector('.primary-button');
      if (!item.isAvailableToPurchase) {
        primaryButton.disabled = true;
        primaryButton.classList.add('disable-button');
      }
    };

    cardElem.addEventListener('click', addModal);

    return cardElem;
  }

  rendering(items) {
    this.cardsContainer.innerHTML = ``;

    const elements = items.map(item => RenderCards.renderCard(item));

    this.cardsContainer.append(...elements);
  }
}

class Filter {
  #itemsBase = null;
  #rendering = null;
  constructor(itemsBase, rendering) {
    this.name = '';
    this.sort = 'default';
    this.color = [];
    this.storage = [];
    this.os = [];
    this.display = [];
    this.from = 0;
    this.to = Infinity;
    this.#itemsBase = itemsBase;
    this.#rendering = rendering;
  }

  setFilter(key, value) {
    if (!Array.isArray(this[key])) {
      this[key] = value;
      this.#findAndRerender();
      console.log(this);
      return;
    }

    if (this[key].includes(value)) {
      this[key] = this[key].filter(val => val !== value);
    } else {
      this[key].push(value);
    }
    this.#findAndRerender();
    console.log(this);
  }

  #findAndRerender() {
    const items = this.#itemsBase.filterItems({ ...this });
    this.#rendering.rendering(items);
  }
}

class RenderFilters {
  #filter = null;
  constructor(itemsBase, filter) {
    this.#filter = filter;
    this.filterContainer = document.querySelector('.main-filters');
    this.filterOptions = [
      {
        displayName: 'Price',
        name: 'price',
        options: itemsBase.availablePrice,
      },
      {
        displayName: 'Color',
        name: 'color',
        options: itemsBase.availableColors,
      },
      {
        displayName: 'Memory',
        name: 'storage',
        options: itemsBase.availableStorage,
      },
      {
        displayName: 'OS',
        name: 'os',
        options: itemsBase.availableOS,
      },

      {
        displayName: 'Display',
        name: 'display',
        options: itemsBase.availableDisplay,
      },
    ];

    // search in search line
    const liveSearch = document.querySelector('.search-request');

    liveSearch.oninput = event => {
      const foundItems = itemsBase.searchByName(event.target.value);
      renderCards.rendering(foundItems);
    };

    this.filterRendering(this.filterOptions);
  }

  renderFilter(optionsData) {
    const filterAccordion = document.createElement('button');
    filterAccordion.className = 'accordion';

    filterAccordion.innerHTML = `
    <p class="accordion-title">${optionsData.displayName}</p>
    <img class="accordion-icon" src="img/icons/arrow_left.svg" alt=""/>
    `;
    this.filterContainer.append(filterAccordion);

    const accordionPanel = document.createElement('div');
    accordionPanel.className = 'accordion-panel';

    if (optionsData.name !== 'price') {
      // creating html for all filters but price
      const optionsElements = optionsData.options.map(option => {
        const filterOption = document.createElement('label');
        filterOption.innerHTML = `<span>${option}</span>`;

        const filterCheckbox = document.createElement('input');
        filterCheckbox.type = 'checkbox';
        filterCheckbox.value = option;
        filterCheckbox.onchange = () => {
          this.#filter.setFilter(optionsData.name, option);
        };

        filterOption.appendChild(filterCheckbox);

        return filterOption;
      });
      accordionPanel.append(...optionsElements);
      this.filterContainer.append(accordionPanel);
    }

    if (optionsData.name === 'price') {
      //creating html for price filter
      const priceMin = document.createElement('label');
      const priceMax = document.createElement('label');
      const inputPriceMin = document.createElement('input');
      const inputPriceMax = document.createElement('input');
      const inputPriceMinName = document.createElement('p');
      const inputPriceMaxName = document.createElement('p');
      accordionPanel.className = 'accordion-panel';
      accordionPanel.className = 'accordion-panel-price';
      inputPriceMin.className = 'min-price-input';
      inputPriceMax.className = 'max-price-input';

      inputPriceMin.type = 'number';
      inputPriceMax.type = 'number';

      inputPriceMinName.innerHTML = 'From';
      inputPriceMaxName.innerHTML = 'To';
      inputPriceMinName.style.fontSize = '16px';
      inputPriceMaxName.style.fontSize = '16px';

      priceMin.append(inputPriceMinName, inputPriceMin);
      priceMax.append(inputPriceMaxName, inputPriceMax);

      accordionPanel.append(priceMin, priceMax);
      this.filterContainer.append(accordionPanel);
    }
    //accordion animation
    filterAccordion.addEventListener('click', function () {
      this.classList.toggle('active');

      const panel = this.nextElementSibling;
      if (panel.style.display === 'block') {
        panel.style.display = 'none';
      } else {
        panel.style.display = 'block';
      }
    });

    return filter;
  }

  filterRendering() {
    this.filterContainer.innerHTML = '';

    const filtersElements = this.filterOptions.map(optionsData =>
      this.renderFilter(optionsData)
    );

    return filtersElements;
  }
}

class Cart {
  constructor() {
    this.items = [];
  }

  addToCart(item) {
    const id = item.id;
    const itemInCart = this.items.find(good => good.id === id);

    if (itemInCart) {
      if (itemInCart.amount < 4) {
        itemInCart.amount++;
      }
      return itemInCart;
    }
    const addedItemToCart = {
      id,
      item,
      amount: 1,
    };
    return this.items.push(addedItemToCart);
  }

  get totalAmount() {
    return this.items.reduce((acc, good) => {
      return acc + good.amount;
    }, 0);
  }

  get totalPrice() {
    return this.items.reduce((acc, good) => {
      return acc + good.amount * good.item.price;
    }, 0);
  }

  minusItem(item) {
    const id = item.id;
    const itemInCart = this.items.find(good => good.id === id);
    if (itemInCart.amount > 1) {
      itemInCart.amount--;
    }

    return cart.items;
  }

  removeItem(item) {
    item.amount = 0;
    this.items = this.items.filter(good => good.amount > 0);
  }
}

class RenderCart {
  constructor() {
    this.cartContainer = document.querySelector('.cart-added-items');
    this.renderCartItems(cart.items);
    this.openCartModal();
  }

  renderCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-added-element';
    cartItem.innerHTML = `
    <img src="${item.item.absoluteImgPath}" alt="${item.item.name}" class="cart-item-img" />
          <div class="cart-right-block">
            <p class="cart-item-name">${item.item.name}</p>
            <p class="cart-item-price">$${item.item.price}</p>
          </div>
          <div class="cart-item-amount">
            <img
              src="img/icons/arrow_left.png"
              alt=""
              class="cart-item-amount-left-arrow"
            />
            <p class="cart-item-qty">${item.amount}</p>
            <img
              src="img/icons/arrow_right.png"
              alt=""
              class="cart-item-amount-right-arrow"
            />
            <img src="img/icons/remove.png" alt="" class="cart-item-delete" />
    `;

    const totalAmount = document.querySelector('.total-item-qty');
    totalAmount.innerHTML = `Total amount: <span>${cart.totalAmount} ptc.</span>`;

    const totalPrice = document.querySelector('.total-item-price');
    totalPrice.innerHTML = `Total price: <span>$${cart.totalPrice}</span>`;

    const cartIconItemAmount = document.querySelector('.cart-icon-item-amount');
    if (cart.totalAmount > 0) {
      cartIconItemAmount.classList.remove('cart-icon-hidden');
      cartIconItemAmount.innerHTML = `${cart.totalAmount}`;
    } else {
      cartIconItemAmount.classList.add('.cart-icon-hidden');
    }

    const minusItem = cartItem.querySelector('.cart-item-amount-left-arrow');
    minusItem.addEventListener('click', () => {
      cart.minusItem(item);
      renderCart.renderCartItems(cart.items);
    });

    const plusItem = cartItem.querySelector('.cart-item-amount-right-arrow');
    plusItem.addEventListener('click', () => {
      cart.addToCart(item);
      renderCart.renderCartItems(cart.items);
    });

    const deteteItem = cartItem.querySelector('.cart-item-delete');
    deteteItem.addEventListener('click', () => {
      cart.removeItem(item);
      renderCart.renderCartItems(cart.items);
      totalAmount.innerHTML = `Total amount: <span>${cart.totalAmount} ptc.</span>`;
      totalPrice.innerHTML = `Total price: <span>$${cart.totalPrice}</span>`;
      cartIconItemAmount.innerHTML = `${cart.totalAmount}`;
    });

    return cartItem;
  }

  renderCartItems(items) {
    this.cartContainer.innerHTML = ``;
    let goods = items.map(item => {
      return this.renderCartItem(item);
    });
    return this.cartContainer.append(...goods);
  }

  openCartModal() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.querySelector('.cart-container');

    cartIcon.addEventListener('click', () => {
      cartModal.classList.toggle('cart-hidden');
    });
  }
}

const itemsBase = new GoodsDataBase();
const cart = new Cart();
const renderCart = new RenderCart(cart);
const renderCards = new RenderCards(itemsBase, cart, renderCart);
const filter = new Filter(itemsBase, renderCards);
const renderFilters = new RenderFilters(itemsBase, filter);
