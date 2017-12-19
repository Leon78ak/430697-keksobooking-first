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

var TYPE_OF_ACCOMODATION = {
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

// переменные-разметочные теги
window.map = document.querySelector('.map');
window.template = document.querySelector('template');
// window.noticeForm = document.querySelector('.notice__form');
/**
 * возвращает случайное целое
 * @param  {number} min
 * @param  {number} max
 * @return {number}
 */
var randomInteger = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

/**
 * возвращает случайное значение из переданного массива значений
 * @param {array} array - массив значений
 * @return {*}
 */
var randomArrayValue = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * создает массив чисел-номеров пользователей
 * @param  {number} min
 * @param  {number} max
 * @return {array}
 */
var createArrayOfNumbers = function (min, max) {
  var array = [];
  for (var i = min; i <= max; i++) {
    array.push(i);
  }
  return array;
};

/**
 * возвращает неповторяющееся случайное значение из переданного массива значений
 * @param {array} array - массив значений
 * @return {string}
 */
var randomUniqueArrayValue = function (array) {
  var randValue = Math.floor(Math.random() * array.length);
  return array.splice(randValue, 1);
};

/**
 * возвращает новый массив случайной длины случайных значений
 * @param  {array} array  - массив значений
 * @return {array}       новый массив
 */
var randomArray = function (array) {
  // копируем исходный массив
  var arrayCopy = array.slice(0);
  // генерим случайное число - максимальное значение индекса массива больше 0
  var randValue = Math.floor(1 + Math.random() * arrayCopy.length);
  // перетрясем исходный массив значений в случайном порядке
  var compareRandom = function (a, b) {
    //  Math.random() возвращает результат от 0 до 1. Вычтем 0.5, чтобы область значений стала [-0.5 ... 0.5)
    return Math.random() - 0.5;
  };

  // отсортируем исходный массив значений в случайном порядке
  arrayCopy.sort(compareRandom);
  return arrayCopy.slice(0, randValue);
};

var createUUID = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

/**
 * функция для создания массива объектов объявлений
 * @param  {number} usersNumb количество пользователей
 * @return {array}
 */
var createNotice = function (usersNumb) {
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
        type: randomArrayValue(Object.keys(TYPE_OF_ACCOMODATION)),
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

var mapPins = map.querySelector('.map__pins');
var mapFilters = map.querySelector('.map__filters-container');

var similarPinTemplate = template.content.querySelector('.map__pin');
var cardTemplate = template.content.querySelector('.map__card');

/**
 * [getPinOffset description]
 * @return {[type]} [description]
 */
var getPinOffset = function () {
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
// for (var i = 0; i < notices.length; i++) {
//   fragmentPin.appendChild(renderPin(notices[i]));
// };
notices.forEach(function (notice) {
  fragmentPin.appendChild(renderPin(notice));
});

mapPins.appendChild(fragmentPin);

/**
 * создает объявление-описание объекта недвижимости
 * @param  {card} card элемент массива объектов с данными
 * @return {Element}
 */
var renderCard = function (card) {
  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('h3').textContent = card.offer.title;
  cardElement.querySelector('p small').textContent = card.offer.address;
  cardElement.querySelector('.popup__price').textContent = card.offer.price;
  cardElement.querySelector('h4').textContent = TYPE_OF_ACCOMODATION[card.offer.type];
  cardElement.querySelector('h4 + p').textContent = card.offer.rooms + ' для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('h4 + p + p').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до' + card.offer.checkout;
  var ul = cardElement.querySelector('.popup__features');
  ul.innerHTML = '';
  var features = card.offer.features;
  features.forEach(function (feature) {
    var featureElement = document.createElement('li');
    featureElement.classList.add('feature', 'feature--' + feature);
    ul.appendChild(featureElement);
  });
  cardElement.querySelector('.popup__features + p').textContent = card.offer.description;
  cardElement.querySelector('.popup__avatar').setAttribute('src', card.author.avatar);

  return cardElement;
};


// module4
//
// после того как на блоке map__pin--main произойдет событие mouseup
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
var mainPinMouseUpHandler = function() {
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
};

mapPinMain.addEventListener('mouseup', mainPinMouseUpHandler);

var openPopup = function () {
  var item = renderCard(notices.filter(function (item) {
    if (item.id === activePin.getAttribute('id')) {
      return item;
    }
  })[0]);

  var fragmentCard = document.createDocumentFragment();
  fragmentCard.appendChild(item);

  map.insertBefore(fragmentCard, mapFilters);
};

// отключим показ по умолчанию первой карточки из набора объявлений


// добавляем  класс map__pin--active при клике на любой из элементов .map__pin
var pinClickHandler = function (node) {
  // Если до этого у другого элемента существовал класс pin--active, то у этого элемента класс нужно убрать
  if (activePin) {
    activePin.classList.remove('map__pin--active');
    popupClose();
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
// и должен показываться элемент .popup
// создадим функцию открытия и закрытия попапа
// var openPopup = function() {
// popup.classList.remove('hidden');
// }
var pinKeyDownHandler = function (evt) {
  window.util.isEscEvent(evt, openPopup);
};

// делегируем обработку клика на пине на блок .map__pins
var pinsContainer = map.querySelector('.map__pins');
pinsContainer.addEventListener('click', function (evt) {
  var target = evt.target;
  while (target !== pinsContainer) {
    if (target.className === 'map__pin') {
      pinClickHandler(target);

      document.addEventListener('keydown', function (evtKeydown) {
        window.util.isEscEvent(evtKeydown, popupClose);
      });
      return;
    }
    target = target.parentNode;
  }
});

map.addEventListener('click', function (evt) {
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
var popupKeydownHandler = function (evt) {
  var target = evt.target;

  if (target && target.className === 'popup__close') {
    window.util.isEnterEvent(evt, popupClose);
  };
};
// Если диалог открыт и фокус находится на крестике,
// то нажатие клавиши ENTER приводит к закрытию диалога и деактивации элемента .map__pin, который был помечен как активный
map.addEventListener('keydown', popupKeydownHandler, true);

// // module4-task2!!!
//   // валидация формы
//   // Проверка правильности введенных данных

//   // Поля «время заезда» и «время выезда» синхронизированы.
//   // При изменении одного из полей, значение второго автоматически выставляется точно таким же — например,
//   //  если время заезда указано «после 14», то время выезда будет равно «до 14»
//   var timeIn = noticeForm.querySelector('#timein');
//   var timeOut = noticeForm.querySelector('#timeout');

//   timeIn.addEventListener('change', function (evt) {
//     timeOut.value = timeIn.value;
//   });

//   // Значение поля «Тип жилья» синхронизировано с минимальной ценой следующим образом:
//   // «Лачуга» — минимальная цена 0
//   // «Квартира» — минимальная цена 1000
//   // «Дом» — минимальная цена 5000
//   // «Дворец» — минимальная цена 10000
//   // С типом жилья должна синхронизироваться только минимальная цена,
//   // само значение поля при этом изменять не нужно.
//   //  Если у пользователя введены данные, которые не подходят,
//   // эта проблема будет найдена на этапе валидации формы в момент отправки
//   var typeOfAccomodation = noticeForm.querySelector('#type');
//   var price = noticeForm.querySelector('#price');

//   var TYPE_TO_PRICE = {
//     bungalo: 0,
//     flat: 1000,
//     house: 5000,
//     palace: 10000
//   };

//   var syncPrice = function() {
//     var selectedField = typeOfAccomodation.value;
//     price.min = TYPE_TO_PRICE[selectedField];
//   };

//   // при загрузке страницы синхронизируем поле формы
//   window.syncPrice();

//   var changeTypeOfAccomodationHandler = function() {
//     syncPrice();
//   };

//   typeOfAccomodation.addEventListener('change', changeTypeOfAccomodationHandler);

//   // Количество комнат связано с количеством гостей:
//   // 1 комната — «для одного гостя»
//   // 2 комнаты — «для 2-х или 1-го гостя»
//   // 3 комнаты — «для 2-х, 1-го или 3-х гостей»
//   // 100 комнат — «не для гостей==»
//   // При изменении количества комнат должно автоматически меняться количество гостей,
//   // которых можно разместить. В обратную сторону синхронизацию делать не нужно
//   var roomNumber = noticeForm.querySelector('#room_number');
//   var capacity = noticeForm.querySelector('#capacity');
//   var capacitys = capacity.options;
//   var roomNumbers = roomNumber.options;

//   // дизеблим при загрузке все опции capacity
//   var disabledOption = function() {
//     Array.from(capacitys).forEach(function(option) {
//       option.disabled = true;
//     })
//   };

//   window.disabledOption();

//   // функция для синхронизации поля выбора количества комнат
//   var roomNumberSync = function () {
//     Array.from(capacitys).filter(function(capacity) {
//       if (roomNumber.value === '100') {
//         capacity.value === '0';
//         capacity.selected = true;
//         capacity.disabled = true;
//       }
//       else if (capacity.value <= roomNumber.value && capacity.value !== '0') {
//         if (capacity.value === roomNumber.value) {
//           capacity.selected = true;
//         }
//         capacity.disabled = false;
//       }
//       else {
//         capacity.disabled = true;
//       }
//     });
//   };

//   // при загрузке страницы
//   // синхронизируем поле выбора количества комнат
//   // с полем количества гостей
//   window.roomNumberSync();
//   // при изменении значения количества комнат
//   // изменяем доступные значения количества гостей
//   roomNumber.addEventListener('change', roomNumberSync);

//   var titleInput = noticeForm.querySelector('#title');
//   var addressInput = noticeForm.querySelector('#address');
//   var priceInput = noticeForm.querySelector('#price');

//   var inputValidity = function (input) {
//     if (input.validity.tooShort) {
//       input.setCustomValidity('Заголовок должен состоять минимум из ' + input.getAttribute('minlength') + ' символов');
//     } else if (input.validity.tooLong) {
//       input.setCustomValidity('Заголовок должен состоять максимум из ' + input.getAttribute('maxlength') + ' символов');
//     } else if (input.validity.valueMissing) {
//       input.setCustomValidity('Обязательное поле');
//     } else if (input.validity.rangeUnderflow) {
//       input.setCustomValidity('Минимальное значение цены ' + input.getAttribute('min'));
//     } else if (input.validity.tooLong) {
//       input.setCustomValidity('Максимальное значение цены ' + input.getAttribute('max'));
//     } else {
//       input.setCustomValidity('');
//     }
//   }

//   titleInput.addEventListener('invalid', function () {
//     inputValidity(title);
//   });

//   priceInput.addEventListener('invalid', function () {
//     inputValidity(price);
//   });

//   addressInput.addEventListener('invalid', function () {
//     inputValidity(address);
//   });
//   // ?что-то не выводит ошибку при пустом адресе?

//   capacity.addEventListener('invalid', function () {
//     inputValidity(capacity);
//   });

//   // ?уже делаем на полях формы???
//   // При отправке формы нужно проверить правильно ли заполнены поля и если какие-то поля заполнены неверно,
//   //  то нужно выделить неверные поля красной рамкой
//   // var submitFormHandler = function (evt) {
//   //   Array.from(noticeForm.elements).forEach(function(input) {
//   //     inputValidity();
//   //   });
//   // };

//   // noticeForm.addEventListener('submit', submitFormHandler);
