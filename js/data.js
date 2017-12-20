// файл data.js
'use strict';

(function () {
  window.usersNumb = 8;

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

  window.TYPE_OF_ACCOMODATION = {
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

  /**
  * функция для создания массива объектов объявлений
  * @param  {number} usersNumb количество пользователей
  * @return {array}
  */
  var createNotice = function (usersNumb) {
    var notices = [];
    var arrayUsersNumbers = window.util.createArrayOfNumbers(1, usersNumb);

    for (var i = 0; i < usersNumb; i++) {
      var x = window.util.randomInteger(MIN_X, MAX_X);
      var y = window.util.randomInteger(MIN_Y, MAX_Y);

      notices[i] = {
        id: window.util.createUUID(),

        author: {
          avatar: 'img/avatars/user0' + window.util.randomUniqueArrayValue(arrayUsersNumbers) + '.png',
        },

        offer: {
          title: window.util.randomUniqueArrayValue(TITLE),
          address: x + ', ' + y,
          price: window.util.randomInteger(PRICE_MIN, PRICE_MAX),
          type: window.util.randomArrayValue(Object.keys(TYPE_OF_ACCOMODATION)),
          rooms: window.util.randomInteger(MIN_ROOMS, MAX_ROOMS),
          guests: window.util.randomInteger(MIN_GUESTS, MAX_GUESTS),
          checkin: window.util.randomArrayValue(CHECK_TIME),
          checkout: window.util.randomArrayValue(CHECK_TIME),
          features: window.util.randomArray(FEATURES),
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

  window.data = {
    notices: createNotice(usersNumb)
  }
})();



// ?если мы в модуле к примеру, переменным укажем не var, а window. - нужно
 // засунуть их в объект, который модуль будет возвращать??
