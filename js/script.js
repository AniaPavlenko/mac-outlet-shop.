'use strict';

new Swiper('.swiper');

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

    //like/dislike
    const likeBtn = cardElem.querySelector('.card-like');

    if (item.isliked) {
      likeBtn.src = 'img/icons/like_filled.svg';
    }

    likeBtn.addEventListener('click', () => {
      likeBtn.classList.toggle('card-like-active');
    });

    //disable button
    const buttonDisable = cardElem.querySelector('.primary-button');
    const iconDisable = cardElem.querySelector('.card-availability');

    if (item.isAvailableToPurchase) {
      cardElem.addEventListener('click', () => {
        console.log('click'); //temporary (showing that button work)
      });
    } else {
      buttonDisable.disabled = true;
      buttonDisable.classList.add('disable-button');
      iconDisable.classList.add('card-non-availability');
    }

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

const liveSearch = document.querySelector('.search-request');

liveSearch.oninput = event => {
  const foundItems = itemsBase.searchByName(event.target.value);
  renderCards.rendering(foundItems);
};
