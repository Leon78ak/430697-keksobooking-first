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
  var randValue = Math.floor(Math.random() * array.length);

  function compareRandom(a, b) {
    return Math.random() - 0.5;
  }

  array.sort(compareRandom);
  return array.slice(0, randValue);
};

/**
 * функция-обертка для создания массива объектов
 * @return {array} [description]
 */
var makeNotice = function(usersNumb) {
  var notices = [];

  for (var i = 0; i < usersNumb; i++) {
    var x = randomInteger(MIN_X, MAX_X);
    var y = randomInteger(MIN_Y, MAX_Y);

    notices[i] = {
      author: {
        get avatar() {
          return 'img/avatars/user0' + randomInteger(1, usersNumb) + '.png';
          }
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

var notices = makeNotice(usersNumb);

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
 * @param  {obj} pin - элемент массива объектов с данными
 * @return {Element}
 */
var renderPin = function (pin) {
  var pinElement = similarPinTemplate.cloneNode(true);
  pinElement.style ='left: ' + (pin.location.x + getPinOffset()[0]) + 'px; top:' + (pin.location.y + getPinOffset()[1]) + 'px;';
  pinElement.querySelector('img').src = notices[i].author.avatar;

  return pinElement;
};

var fragmentPin = document.createDocumentFragment();
for (var i = 0; i < notices.length; i++) {
  fragmentPin.appendChild(renderPin(notices[i]));

};
mapPins.appendChild(fragmentPin);

// var createFeaturesElement = function (array) {
//   return array.forEach(function(feature) {
//     var featureElement = document.createElement('li');
//     featureElement.classList.add('feature', 'feature--' + feature);

//   });
// };

/**
 * создает объявление-описание объекта недвижимости
 * @param  {obj} obj элемент массива объектов с данными
 * @return {Element}
 */
var renderCard = function(obj) {
  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('h3').textContent = obj.offer.title;
  cardElement.querySelector('p small').textContent = obj.address;
  cardElement.querySelector('.popup__price').textContent = obj.price;
  cardElement.querySelector('h4').textContent = TYPE_OF_BUILDING[obj.offer.type];
  cardElement.querySelector('h4 + p').textContent = obj.offer.rooms + ' для ' + obj.offer.guests + ' гостей';
  cardElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до' + obj.offer.checkout;
  // cardElement.querySelector('.popup__features').innerHTML = '';
  // cardElement.querySelector('.popup__features').appendChild(createFeaturesElement(obj.offer.features));

  return cardElement;
};

var fragmentCard = document.createDocumentFragment();
for (var i = 0; i < notices.length; i++) {
  fragmentCard.appendChild(renderCard(notices[i]));
};

map.insertBefore(fragmentCard, mapFilters);


// после того как на блоке map__pin--main произойдет событие mouseup
var map = document.querySelector('.map');
var mapPinMain = map.querySelector('.map__pin--main');
var mapPin = map.querySelectorAll('.map__pin');
var noticeForm = document.querySelector('.notice__form');
// добавим атрибут disabled блоку fieldset, содержащему поле формы
var fieldset = noticeForm.querySelectorAll('fieldset');

for (var i = 0; i < fieldset.length; i++) {
  fieldset[i].classList.add('disabled');
}
// скроем метки похожих объявлений
for (var i = 0; i < mapPin.length; i++) {
  if (!mapPin[i].classList.contains('map__pin--main')) {
    mapPin[i].classList.add('hidden');
  }
}
// обработчик
var buttonMouseUpHandler = function(evt) {
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  for (var i = 0; i < fieldset.length; i++) {
    fieldset[i].classList.remove('disabled');
  }

  for (var i = 0; i < mapPin.length; i++) {
    if (mapPin[i].classList.contains('hidden')) {
      mapPin[i].classList.remove('hidden');
    }
  }
}

mapPinMain.addEventListener('mouseup', buttonMouseUpHandler);
// у карты убрать класс map--faded;
// mapPinMain.addEventListener('mouseup', function(evt) {
//   map.classList.remove('map--faded');
// });
// // у формы убрать класс notice__form--disabled и сделать все поля формы активными
// mapPinMain.addEventListener('mouseup', function(evt) {
//   noticeForm.classList.remove('notice__form--disabled');
// });
// показать на карте метки похожих объявлений , созданные в прошлом задании;
// mapPinMain.addEventListener('mouseup', function(evt) {
//   mapPin[i].classList.remove('hidden');
// });

// отключим показ по умолчанию первой карточки из набора объявлений
var popup = map.querySelectorAll('.popup');
for (var i = 0; i < popup.length; i++) {
  popup[i].classList.add('hidden');
}
var activeElement = null;
// добавляем  класс map__pin--active при клике на любой из элементов .map__pin
var buttonClickHandler = function(evt) {
  // Если до этого у другого элемента существовал класс pin--active, то у этого элемента класс нужно убрать
  if (activeElement) {
    activeElement.classList.remove('map__pin--active');
  }

  activeElement = evt.currentTarget;
  activeElement.classList.add('map__pin--active');
};

for (var i = 0; i < mapPin.length; i++) {
  mapPin[i].addEventListener('click', buttonClickHandler);
}

//  и должен показываться элемент .popup
//  ???


//  При нажатии на элемент .popup__close карточка объявления должна скрываться.
//  При этом должен деактивироваться элемент .map__pin, который был помечен как активный
// При показе карточки на карточке должна отображаться актуальная информация
//  о текущем выбранном объекте (заголовок, адрес, цена, время заезда и выезда).
//  Добавить обработчики для альтернативного ввода с клавиатуры keydown для кнопок открытия/закрытия объявлений:

// Если пин объявления в фокусе .map__pin, то диалог с подробностями должен показываться по нажатию кнопки ENTER
// Когда диалог открыт, то клавиша ESC должна закрывать диалог и деактивировать элемент .map__pin,
//  который был помечен как активный
// Если диалог открыт и фокус находится на крестике,
// то нажатие клавиши ENTER приводит к закрытию диалога и деактивации элемента .map__pin, который был помечен как активный
