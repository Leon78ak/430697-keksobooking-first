'use strict';

var usersNumb = 8;

var TITLE = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPE_OF_BUILDING = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

var CHECK_TIME = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PRICE_MIN = 1000,
    PRICE_MAX = 1000000;

var MIN_X = 300,
    MAX_X = 900,
    MIN_Y = 100,
    MAX_Y = 500;

var MIN_ROOMS = 1,
    MAX_ROOMS = 5,
    MIN_GUESTS = 1,
    MAX_GUESTS = 10;

var PIN_HEIGHT = 18;

/**
 * возвращает случайное целое
 * @param  {number} min
 * @param  {number} max
 * @return {number}
 */
var randomInteger = function(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

/**
 * возвращает случайное значение из переданного массива значений
 * @param {array} array - массив значений
 * @return {*}
 */
var randomArrayValue = function(array) {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * создает массив чисел-номеров пользователей
 * @param  {number} min
 * @param  {number} max
 * @return {array}
 */
var createArrayOfNumbers = function(min, max) {
  var array = [];
  for (var i = min; i <= max; i++) {
    array.push(i);
  }
  return array;
}

/**
 * возвращает неповторяющееся случайное значение из переданного массива значений
 * @param {array} array - массив значений
 * @return {string}
 */
var randomUniqueArrayValue = function(array) {
  var randValue = Math.floor(Math.random() * array.length);
  return array.splice(randValue, 1);
};

/**
 * возвращает новый массив случайной длины случайных значений
 * @param  {array} array  - массив значений
 * @return {array}       новый массив
 */
var randomArray = function(array) {
  // копируем исходный массив
  var arrayCopy = array.slice(0);
  // генерим случайное число - максимальное значение индекса массива больше 0
  var randValue = Math.floor(1 + Math.random() * arrayCopy.length);
  // перетрясем исходный массив значений в случайном порядке
  var compareRandom = function(a, b) {
    //  Math.random() возвращает результат от 0 до 1. Вычтем 0.5, чтобы область значений стала [-0.5 ... 0.5)
    return Math.random() - 0.5;
  }
  // отсортируем исходный массив значений в случайном порядке
  arrayCopy.sort(compareRandom);
  return arrayCopy.slice(0, randValue);
};

var createUUID = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

/**
 * функция-обертка для создания массива объектов с данными
 * @return {array} [description]
 */
var createNotice = function(usersNumb) {
  var notices = [];
  var arrayUsersNumbers = createArrayOfNumbers(1, usersNumb);

  for (var i = 0; i < usersNumb; i++) {
    var x = randomInteger(MIN_X, MAX_X);
    var y = randomInteger(MIN_Y, MAX_Y);

    notices[i] = {
      id: createUUID(),

      author: {
        avatar: 'img/avatars/user0' + randomUniqueArrayValue(arrayUsersNumbers) + '.png',
      },

      offer: {
        title: randomUniqueArrayValue(TITLE),
        address: x + ', ' + y,
        price: randomInteger(PRICE_MIN, PRICE_MAX),
        type: randomArrayValue(Object.keys(TYPE_OF_BUILDING)),
        rooms: randomInteger(MIN_ROOMS, MAX_ROOMS),
        guests: randomInteger(MIN_GUESTS, MAX_GUESTS),
        checkin: randomArrayValue(CHECK_TIME),
        checkout: randomArrayValue(CHECK_TIME),
        features: randomArray(FEATURES),
        description: '',
        photos: []
      },

      location: {
        x: x,
        y: y
      }
    }
  }

  return notices;
};

var notices = createNotice(usersNumb);

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapFilters = map.querySelector('.map__filters-container');
var popupFeatures = map.querySelector('.popup__features');
var template = document.querySelector('template');
var similarPinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');
var featuresTemplate = template.content.querySelector('.popup__features');

// map.classList.remove('map--faded');

/**
 * функция возвращает смещение острия метки
 * @return {[array} массив значений смещение по x, смещение по y
 */
var getPinOffset = function() {
  var offsetX = (similarPinTemplate.querySelector('img').height) + PIN_HEIGHT;
  // как добавить паддинг вокруг img?
  var offsetY = (similarPinTemplate.querySelector('img').width) / 2;

  return [offsetX, offsetY];
};

/**
 * отрисовывает метку на карте
 * @param  {card} pin - элемент массива объектов с данными
 * @return {Element}
 */
var renderPin = function (pin) {
  var pinElement = similarPinTemplate.cloneNode(true);
  var img = pinElement.querySelector('img');
  img.src = pin.author.avatar;
  pinElement.style ='left: ' + (pin.location.x + getPinOffset()[0]) + 'px; top:' + (pin.location.y + getPinOffset()[1]) + 'px;';
  pinElement.setAttribute('id', pin.id);
  return pinElement;
};

var fragmentPin = document.createDocumentFragment();
for (var i = 0; i < notices.length; i++) {
  fragmentPin.appendChild(renderPin(notices[i]));
};

mapPins.appendChild(fragmentPin);

/**
 * создает объявление-описание объекта недвижимости
 * @param  {card} card элемент массива объектов с данными
 * @return {Element}
 */
var renderCard = function(card) {
  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('h3').textContent = card.offer.title;
  cardElement.querySelector('p small').textContent = card.offer.address;
  cardElement.querySelector('.popup__price').textContent = card.offer.price;
  cardElement.querySelector('h4').textContent = TYPE_OF_BUILDING[card.offer.type];
  cardElement.querySelector('h4 + p').textContent = card.offer.rooms + ' для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до' + card.offer.checkout;
  var ul = cardElement.querySelector('.popup__features');
  ul.innerHTML = '';
  var features = card.offer.features;
  features.forEach(function(feature) {
    var featureElement = document.createElement('li');
    featureElement.classList.add('feature', 'feature--' + feature);
    ul.appendChild(featureElement);
  });
  cardElement.querySelector('.popup__features + p').textContent = card.offer.description;
  cardElement.querySelector('.popup__avatar').setAttribute('src', card.author.avatar);

  return cardElement;
};



// var fragmentCard = document.createDocumentFragment();
// fragmentCard.appendChild(renderCard(notices[0]));

// map.insertBefore(fragmentCard, mapFilters);


// module4
//
// после того как на блоке map__pin--main произойдет событие mouseup
var map = document.querySelector('.map');
var mapPinMain = map.querySelector('.map__pin--main');
var mapPin = map.querySelectorAll('.map__pin');
var noticeForm = document.querySelector('.notice__form');
// добавим атрибут disabled блоку fieldset, содержащему поле формы
var fieldset = noticeForm.querySelectorAll('fieldset');
var activePin = null;

for (var i = 0; i < fieldset.length; i++) {
  fieldset[i].classList.add('disabled');
}
// скроем метки похожих объявлений
for (var i = 0; i < mapPin.length; i++) {
  if (!mapPin[i].classList.contains('map__pin--main')) {
    mapPin[i].classList.add('hidden');
  }
}
/**
 * обработчик события mouseup на главном пине
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
var mainPinMouseUpHandler = function(evt) {
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  for (var i = 0; i < fieldset.length; i++) {
    fieldset[i].classList.remove('disabled');
  }

  for (var i = 0; i < mapPin.length; i++) {
    if (mapPin[i].classList.contains('hidden')) {
      mapPin[i].classList.remove('hidden');
      mapPin[i].addEventListener('keydown', pinKeyDownHandler);
    }
  }
}

mapPinMain.addEventListener('mouseup', mainPinMouseUpHandler);

var openPopup = function(node) {
  var item = renderCard(notices.filter(function(item) {
    if (item.id === node.getAttribute('id')) {
      return item;
    }
  })[0]);

  var fragmentCard = document.createDocumentFragment();
  fragmentCard.appendChild(item);

  map.insertBefore(fragmentCard, mapFilters);
}

// отключим показ по умолчанию первой карточки из набора объявлений


// добавляем  класс map__pin--active при клике на любой из элементов .map__pin
var pinClickHandler = function(node) {
  // Если до этого у другого элемента существовал класс pin--active, то у этого элемента класс нужно убрать
  if (activePin) {
    activePin.classList.remove('map__pin--active');
  }

  activePin = node;
  activePin.classList.add('map__pin--active');

  openPopup(activePin);
};

var popupClose = function() {
for (var i = 0; i < map.children.length; i++) {
    if (map.children[i].classList.contains('popup')) {
      var popup = map.children[i];
      map.removeChild(popup);

      activePin.classList.remove('map__pin--active');
    }
  }
};
// //  и должен показываться элемент .popup
// создадим функцию открытия и закрытия попапа
// var openPopup = function() {
//   popup.classList.remove('hidden');
// }
var pinKeyDownHandler = function(evt) {
  if (evt.keyCode === 13) {
    openPopup();
  }
}

// делегируем обработку клика на пине на блок .map__pins
var pinsContainer = map.querySelector('.map__pins');
pinsContainer.addEventListener('click', function(evt) {
  var target = evt.target;
  while (target !== pinsContainer) {
    if (target.className === 'map__pin') {
      pinClickHandler(target);

      document.addEventListener('keydown', function(evt) {
        if (evt.keyCode === 27) {
          popupClose();
        }
      });
      return;
    }
    target = target.parentNode;
  }
});

map.addEventListener('click',function(evt) {
  var target = evt.target;

  if (target && target.className === 'popup__close') {
    popupClose();
  }
});

/**
 * обработчик при нажатии enter на кнопке закрытия попапа
 * @param  {[type]} evt [description]
 * @return {[type]}     [description]
 */
var popupKeydownHandler = function(evt) {
  var target = evt.target;

  if (target && target.className === 'popup__close') {
    if (evt.keyCode === 13) {
      popupClose();
    }
  }
};
// Если диалог открыт и фокус находится на крестике,
// то нажатие клавиши ENTER приводит к закрытию диалога и деактивации элемента .map__pin, который был помечен как активный
map.addEventListener('keydown', popupKeydownHandler, true);
