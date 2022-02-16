const containerProducts = document.querySelector('.items');
const containerCartItems = document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const totalValueProductsCart = () => {
  const storage = JSON.parse(getSavedCartItems()) || [];
  const resultTotal = storage.reduce(
    (acc, currentItem) => acc + currentItem.salePrice,
    0,
  );

  localStorage.setItem(
    'cartItemsTotal',
    resultTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  );
  return resultTotal;
};

const printValueProductsCart = () => {
  const elementH3Total = document.querySelector('#cart__total');
  const valueTotalStorage = localStorage.getItem('cartItemsTotal') || [];
  elementH3Total.innerText = valueTotalStorage;
};

function cartItemClickListener(event, sku) {
  event.target.parentNode.remove();
  const storage = JSON.parse(getSavedCartItems()) || [];
  const resultFind = storage.find((returnItem) => returnItem.sku === sku);
  const resultIndex = storage.indexOf(resultFind);
  storage.splice(resultIndex, 1);
  saveCartItems(JSON.stringify(storage));
  totalValueProductsCart();
  printValueProductsCart();
}

function createCartItemElement({ sku, name, salePrice, image }) {
  const li = document.createElement('li');
  const close = document.createElement('span');
  close.id = 'close';
  close.innerText = 'X';

  li.className = 'cart__item';
  li.innerHTML = `
  <img src="${image}" class="cart__image" />
  <div class="item-content">
  <span id=name>${name}</span>
  <span id=price>R$  ${salePrice.toFixed(2)}</span>
  <span id="codigo">Código: ${sku}</span>
  </div>
  `;

  close.addEventListener('click', (event) => cartItemClickListener(event, sku));
  li.appendChild(close);
  return li;
}

async function addItemToCart(sku) {
  const {
    title: name,
    price: salePrice,
    thumbnail: image,
  } = await fetchItem(sku);
  containerCartItems.appendChild(
    createCartItemElement({ sku, name, salePrice, image }),
  );

  const storage = JSON.parse(getSavedCartItems()) || [];
  storage.push({ sku, name, salePrice, image });
  saveCartItems(JSON.stringify(storage));
  totalValueProductsCart();
  printValueProductsCart();
}

function createProductItemElement({ sku, name, image, salePrice }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement(
      'span',
      'item__price',
      salePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    ),
  );
  const btnAddCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddCart.addEventListener('click', () => addItemToCart(sku));
  section.appendChild(btnAddCart);
  return section;
}

const clearCartAllItems = () => {
  const elementH3Total = document.querySelector('#cart__total');
  localStorage.removeItem('cartItems');
  localStorage.removeItem('cartItemsTotal');
  containerCartItems.innerHTML = '';
  elementH3Total.innerHTML = 0;
};

const btnClearAllItems = document.querySelector('.empty-cart');
btnClearAllItems.addEventListener('click', () => {
  clearCartAllItems();
});

function createIsLoading() {
  const container = document.querySelector('main');
  const isLoading = document.createElement('span');
  isLoading.classList.add('loading');
  isLoading.innerText = 'carregando...';
  container.appendChild(isLoading);
}

function removeIsLoading() {
  const isLoadingRemove = document.querySelector('.loading');
  isLoadingRemove.innerHTML = '';
}

const renderItemsToSreen = async (category) => {
  createIsLoading();
  const data = await fetchProducts((category));
  containerProducts.innerHTML = '';
  data.results.forEach((element) => {
    const {
      id: sku,
      title: name,
      thumbnail: image,
      price: salePrice,
    } = element;
    containerProducts.appendChild(
      createProductItemElement({ sku, name, image, salePrice }),
    );
    removeIsLoading();
  });
};

renderItemsToSreen('computador');

// function update() {
//   const select = document.getElementById('category');
//   select.addEventListener('change', (event) => {
//     const option = event.target.value;
//     renderItemsToSreen(option);
//   });
// }

// update();

window.onload = () => {
  printValueProductsCart();
  if (getSavedCartItems() === null) {
 return localStorage
    .setItem('cartItems', JSON.stringify([])); 
}
  if (getSavedCartItems() === undefined) return;

  printValueProductsCart();
  const listItemsStorage = getSavedCartItems();
  const resultGetLocalStorage = JSON.parse(listItemsStorage);
  resultGetLocalStorage.forEach((item) => {
    const { sku, name, salePrice, image } = item;
    containerCartItems.appendChild(
      createCartItemElement({ sku, name, salePrice, image }),
    );
  });
};
