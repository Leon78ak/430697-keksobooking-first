// файл map.js
'use strict';

(function () {
  // переменные-разметочные теги
  window.map = document.querySelector('.map');
  window.noticeForm = document.querySelector('.notice__form');
  window.template = document.querySelector('template');
  var mapFilters = map.querySelector('.map__filters-container');
  // module4
  //
  // после того как на блоке map__pin--main произойдет событие mouseup
  window.mapPinMain = map.querySelector('.map__pin--main');
  window.mapPin = map.querySelectorAll('.map__pin');
  // добавим атрибут disabled блоку fieldset, содержащему поле формы
  var fieldset = noticeForm.querySelectorAll('fieldset');
  var activePin = null;

  for (var i = 0; i < fieldset.length; i++) {
    fieldset[i].classList.add('disabled');
  }
  // скроем метки похожих объявлений
  (function () {
    for (var i = 0; i < mapPin.length; i++) {
      if (!mapPin[i].classList.contains('map__pin--main')) {
        mapPin[i].classList.add('hidden');
      }
    }
  })();

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
    var item = window.card.renderCard(window.data.notices.filter(function (item) {
      if (item.id === activePin.getAttribute('id')) {
        return item;
      }
    })[0]);

    var fragmentCard = document.createDocumentFragment();
    fragmentCard.appendChild(item);

    map.insertBefore(fragmentCard, mapFilters);
  };

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

  var mapPinHandle = map.querySelectorAll('.map__pin img');

})();


//   // ?уже делаем на полях формы???
//   // При отправке формы нужно проверить правильно ли заполнены поля и если какие-то поля заполнены неверно,
//   //  то нужно выделить неверные поля красной рамкой
//   // var submitFormHandler = function (evt) {
//   //   Array.from(noticeForm.elements).forEach(function(input) {
//   //     inputValidity();
//   //   });
//   // };

//   // noticeForm.addEventListener('submit', submitFormHandler);
