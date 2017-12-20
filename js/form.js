// файл form.js
'use strict';

(function () {

  var timeIn = noticeForm.querySelector('#timein');
  var timeOut = noticeForm.querySelector('#timeout');
  // Значение поля «Тип жилья» синхронизировано с минимальной ценой
  var typeOfAccomodation = noticeForm.querySelector('#type');
  var price = noticeForm.querySelector('#price');
  // Количество комнат связано с количеством гостей
  var roomNumber = noticeForm.querySelector('#room_number');
  var capacity = noticeForm.querySelector('#capacity');
  var capacitys = capacity.options;
  var roomNumbers = roomNumber.options;
  var titleInput = noticeForm.querySelector('#title');
  var addressInput = noticeForm.querySelector('#address');
  var priceInput = noticeForm.querySelector('#price');

  var TYPE_TO_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  // обработчик изменения значений выбора времени
  timeIn.addEventListener('change', function (evt) {
    timeOut.value = timeIn.value;
  });

  /**
   * синхронизирует поле выбора типа жилья с полем цены
   */
  var syncPrice = function() {
    var selectedField = typeOfAccomodation.value;
    price.min = TYPE_TO_PRICE[selectedField];
  };

  /**
   * обработчик изменений типа жилья
   *
   */
  var changeTypeOfAccomodationHandler = function() {
    syncPrice();
  };

  typeOfAccomodation.addEventListener('change', changeTypeOfAccomodationHandler);

  /**
   * делает недоступными опции с количеством гостей
   * @return {[type]} [description]
   */
  var disabledOption = function() {
    Array.from(capacitys).forEach(function(option) {
      option.disabled = true;
    })
  };

  /**
   * функция для синхронизации поля выбора количества комнат
   * @return {[type]} [description]
   */
  var roomNumberSync = function () {
    Array.from(capacitys).filter(function(capacity) {
      if (roomNumber.value === '100') {
        capacity.value === '0';
        capacity.selected = true;
        capacity.disabled = true;
      }
      else if (capacity.value <= roomNumber.value && capacity.value !== '0') {
        if (capacity.value === roomNumber.value) {
          capacity.selected = true;
        }
        capacity.disabled = false;
      }
      else {
        capacity.disabled = true;
      }
    });
  };

  // при изменении значения количества комнат
  // изменяем доступные значения количества гостей
  roomNumber.addEventListener('change', roomNumberSync);

  /**
   * устанавливает значения валидности поля
   * @param  {element} input поле для заполнения
   * @return {[type]}       [description]
   */
  var inputValidity = function (input) {
    if (input.validity.tooShort) {
      input.setCustomValidity('Заголовок должен состоять минимум из ' + input.getAttribute('minlength') + ' символов');
    } else if (input.validity.tooLong) {
      input.setCustomValidity('Заголовок должен состоять максимум из ' + input.getAttribute('maxlength') + ' символов');
    } else if (input.validity.valueMissing) {
      input.setCustomValidity('Обязательное поле');
    } else if (input.validity.rangeUnderflow) {
      input.setCustomValidity('Минимальное значение цены ' + input.getAttribute('min'));
    } else if (input.validity.tooLong) {
      input.setCustomValidity('Максимальное значение цены ' + input.getAttribute('max'));
    } else {
      input.setCustomValidity('');
    }
  }

  titleInput.addEventListener('invalid', function () {
    inputValidity(title);
  });

  priceInput.addEventListener('invalid', function () {
    inputValidity(price);
  });

  addressInput.addEventListener('invalid', function () {
    inputValidity(address);
  });

  capacity.addEventListener('invalid', function () {
    inputValidity(capacity);
  });

  // ?уже делаем на полях формы???
  // При отправке формы нужно проверить правильно ли заполнены поля и если какие-то поля заполнены неверно,
  //  то нужно выделить неверные поля красной рамкой
  // var submitFormHandler = function (evt) {
  //   Array.from(noticeForm.elements).forEach(function(input) {
  //     inputValidity();
  //   });
  // };

  // noticeForm.addEventListener('submit', submitFormHandler);
  //
  // экспорт - синхронизация при загрузке
  // почему-то не синхронизирует????
  window.form = {
    syncPrice: syncPrice(),
    roomNumberSync: roomNumberSync(),
    disabledOption: disabledOption()
  };
  // // при загрузке страницы синхронизируем поле формы
  // syncPrice();
  // // при загрузке страницы
  // // синхронизируем поле выбора количества комнат
  // // с полем количества гостей
  // roomNumberSync();
  // // дизеблим при загрузке все опции capacity
  // disabledOption();

})();
