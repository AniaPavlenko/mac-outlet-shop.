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
}

class GoodsDataBase {
  constructor() {
    this.items = items.map(item => new Item(item));
  }

  searchByName(itemTitle) {
    const itemTitleToLowerCase = itemTitle.toLowerCase();

    return this.items.filter(item =>
      item.name.toLowerCase().includes(itemTitleToLowerCase)
    );
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
            <span class="modal-item-mark">Chip:</span> ${item.chip.name}${
        item.chip.cores
      }
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

const itemsBase = new GoodsDataBase();
const renderCards = new RenderCards(itemsBase);

// --------------- in progress, will be changed -------------- //

// const liveSearch = document.querySelector('.search-request');

// liveSearch.oninput = event => {
//   const foundItems = itemsBase.searchByName(event.target.value);
//   renderCards.rendering(foundItems);
// };

// accordion
const accButtons = document.getElementsByClassName('accordion');

for (let accButton of accButtons) {
  accButton.addEventListener('click', function () {
    this.classList.toggle('active');

    const panel = this.nextElementSibling;
    if (panel.style.display === 'block') {
      panel.style.display = 'none';
    } else {
      panel.style.display = 'block';
    }
  });
}
