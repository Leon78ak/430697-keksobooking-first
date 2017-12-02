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
 * @return {string}
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
var makeNotice = function() {

  var notices = [];

  var usersNumb = 8;

  for (var i = 0; i < usersNumb; i++) {
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
        get address() {
          return notices[i].location.x + ' , ' + notices[i].location.y;
        },
        price: randomInteger(1000, 1000000),
        type: randomArrayValue(TYPE_OF_BUILDING),
        rooms: randomInteger(1, 5),
        guests: randomInteger(1, 10),
        checkin: randomArrayValue(CHECK_TIME),
        checkout: randomArrayValue(CHECK_TIME),
        features: [FEATURES],
        description: '',
        photos: []
      },

      location: {
        x: randomInteger(300, 900),
        y: randomInteger(100, 500)
      }
    }
  }

  return notices;
}

