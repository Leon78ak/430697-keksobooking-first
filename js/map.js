'use strict';

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

var TYPE_OF_BUILDING = [
  'flat',
  'house',
  'bungalo'
];

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
}

/**
 * возвращает случайное значение из переданного массива значений
 * @param {array} array - массив значений
 * @return {*}
 */
var randomArrayValue = function(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * возвращает неповторяющееся случайное значение из переданного массива значений
 * @param {array} array - массив значений
 * @return {string}
 */
var randomUniqueArrayValue = function(array) {
  var randValue = array[Math.floor(Math.random() * array.length)];
  array.splice(array.indexOf(randValue), 1);
  return randValue;
}

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
        get title() {
          return randomUniqueArrayValue(TITLE);
        },
        address: x + ', ' + y,
        price: randomInteger(PRICE_MIN, PRICE_MAX),
        type: randomArrayValue(TYPE_OF_BUILDING),
        rooms: randomInteger(MIN_ROOMS, MAX_ROOMS),
        guests: randomInteger(MIN_GUESTS, MAX_GUESTS),
        checkin: randomArrayValue(CHECK_TIME),
        checkout: randomArrayValue(CHECK_TIME),
        features: [FEATURES],
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
}
// переменная для нового массива, как имя?
var notices = makeNotice(8);

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var template = document.querySelector('template');
var similarPinTemplate = template.content.querySelector('.map__pin');

// var pinElement = similarPinTemplate.cloneNode(true);

map.classList.remove('map--faded');
// добавить смещение острия метки!
var getPinOffset = function() {
  var offsetX = (similarPinTemplate.querySelector('img').height) + (similarPinTemplate.querySelector('img').padding) + PIN_HEIGHT;
  var offsetY = (similarPinTemplate.querySelector('img').width) / 2;
/2;
}


/**
 * отрисовывает метку на карте
 * @param  {array} pin - элемент массива объектов с данными
 * @return {Element}
 */
var renderPin = function (pin) {
  var pinElement = similarPinTemplate.cloneNode(true);
  pinElement.style ='left: ' + (pin.location.x +  + 'px; top:' + pin.location.y + 'px;';
  pinElement.querySelector('img').src = notices[i].author.avatar;

  return pinElement;
}

var fragment = document.createDocumentFragment();
for (var i = 0; i < notices.length; i++) {
  fragment.appendChild(renderPin(notices[i]))
}
mapPins.appendChild(fragment);


