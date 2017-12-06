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

map.classList.remove('map--faded');

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

var createFeaturesElement = function (array) {
  array.forEach(function(feature) {
    var featureElement = document.createElement('li');
    featureElement.classList.add('feature', 'feature--' + feature);

    return featureElement;
  });
};

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
  cardElement.querySelector('.popup__features').innerHTML = '';
  cardElement.querySelector('.popup__features').appendChild(createFeaturesElement(obj.offer.features));

  return cardElement;
};

var fragmentCard = document.createDocumentFragment();
for (var i = 0; i < notices.length; i++) {
  fragmentCard.appendChild(renderCard(notices[i]));
};

map.insertBefore(fragmentCard, mapFilters);
