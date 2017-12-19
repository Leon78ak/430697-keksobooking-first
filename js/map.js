// файл map.js
'use strict';

(function () {
  // переменные-разметочные теги
  window.map = document.querySelector('.map');
  window.template = document.querySelector('template');
  // window.noticeForm = document.querySelector('.notice__form');


  var mapFilters = map.querySelector('.map__filters-container');












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

})();

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
