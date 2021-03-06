`use strict`;

//day 1
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonout = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const rating = document.querySelector('.rating');
const minPrice = document.querySelector('.price');
const category = document.querySelector('.category');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const clearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('gloDelivery');

const cart = [];


const getData = async function(url) {

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ошибка по адресу ${url}, статус ошибка ${response.status}!`);
  }

  return await response.json();


};


function toggleModalAuth() {
  modalAuth.classList.toggle('is-open')
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function authorized() {
  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonout.style.display = '';
    cartButton.style.display = '';

    buttonout.removeEventListener('click', logOut);
    checkAuth();
  }

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonout.style.display = 'block';
  cartButton.style.display = 'flex';

  buttonout.addEventListener('click', logOut)
}

function notAuthorized() {

  function logIn(event) {

    function emptyLoginAlert() {
      alert('Введите логин и пароль')
    }

    event.preventDefault();

    if (loginInput.value) {
      login = loginInput.value;
      localStorage.setItem('gloDelivery', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    } else emptyLoginAlert();


  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn)
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

//day 2
function createCardRestaurant(restaurant) {

  const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant;


  const card = document.createElement('a');
  card.classList.add('card');
  card.classList.add('card-restaurant');
  card.info = [ kitchen, name, price, stars ];
  card.products = products;

  card.insertAdjacentHTML('beforeend', `
        <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title">${name}</h3>
                <span class="card-tag tag">${timeOfDelivery}</span>
            </div>
            <div class="card-info">
                <div class="rating">
                    ${stars}
                </div>
                <div class="price">От ${price} ₽</div>
                <div class="category">${kitchen}</div>
             </div>
        </div>
`);

  cardsRestaurants.insertAdjacentElement('beforeend', card);
}

function createCardGood(restaurantMenu) {

  const { image, name, price, description, id } = restaurantMenu;

  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;

  card.insertAdjacentHTML('beforeend', `
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
      <div class="card-heading">
      <h3 class="card-title card-title-reg">${name}</h3>
  </div>
  <div class="card-info">
      <div class="ingredients">${description}
  </div>
  </div>
  <div class="card-buttons">
      <button class="button button-primary button-add-cart">
      <span class="button-card-text">В корзину</span>
  <span class="button-cart-svg"></span>
      </button>
      <strong class="card-price-bold">${price} ₽</strong>
  </div>
  </div>
`);


  cardsMenu.insertAdjacentElement('beforeend', card);

}

function openGoods(event) {

   const target = event.target;
   const restaurant = target.closest('.card-restaurant');

   if (login) {

     if (restaurant) {
       cardsMenu.textContent = '';
       containerPromo.classList.add('hide');
       restaurants.classList.add('hide');
       menu.classList.remove('hide');

       const [ kitchen, name, price, stars ] = restaurant.info;

       restaurantTitle.textContent = name;
       rating.textContent = stars;
       minPrice.textContent = `От ${price} ₽`;
       category.textContent = kitchen;

       getData(`./db/${restaurant.products}`).then(function (data) {
          data.forEach(createCardGood);
       });
     }

   } else {
     toggleModalAuth();
   }
 }

function addToCart(event) {
    const target = event.target;
    const buttonAddToCart = target.closest('.button-add-cart');

    if (buttonAddToCart) {
        const card = target.closest('.card');
        const title = card.querySelector('.card-title-reg').textContent;
        const cost = card.querySelector('.card-price-bold').textContent;
        const id = card.id;

        const food = cart.find(function (item) {
            return item.id === id;
        });

        if (food) {
            food.count += 1;
        } else {
            cart.push({
                id,
                title,
                cost,
                count: 1
            });
        }
    }
 }

function changeCount(event) {

    const target = event.target;

    if (target.classList.contains('counter-button')) {
        const food = cart.find(function (item) {
            return item.id === target.dataset.id
        });
        if (target.classList.contains('counter-minus')) {
            food.count--;
            if (food.count === 0) {
                cart.splice(cart.indexOf(food), 1)
            }
        }
        if (target.classList.contains('counter-plus')) food.count++;

        renderCard();
    }

}

function renderCard() {
    modalBody.textContent = '';

    cart.forEach(function (item) {

        console.log(item);
        const { title, cost, count, id } = item;

        const itemCart = `
            <div class="food-row">
                <span class="food-name">${title}</span>
                <strong class="food-price">${cost}</strong>
                <div class="food-counter">
                    <button class="counter-button counter-minus" data-id="${id}">-</button>
                    <span class="counter">${count}</span>
                    <button class="counter-button counter-plus" data-id="${id}">+</button>
                </div>
            </div>
         `;

        modalBody.insertAdjacentHTML('beforeend', itemCart)
    });

    const totalPrice = cart.reduce(function (result, item) {


        return result + parseInt(item.cost) * item.count;

    }, 0);

        modalPrice.textContent = totalPrice + ' ₽';

}

function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);
  });


  cartButton.addEventListener("click", function() {

      renderCard();
      toggleModal();

  });

  modalBody.addEventListener('click', changeCount);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  cardsMenu.addEventListener('click', addToCart);

  clearCart.addEventListener('click', function (event) {
    cart.length = 0;
    renderCard()
  });

  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide')
  });


  checkAuth();
}

init();



