// файл pin.js
'use strict';

(function () {

  var PIN_HEIGHT = 18;

  var mapPins = document.querySelector('.map__pins');
  window.template = document.querySelector('template');
  var similarPinTemplate = template.content.querySelector('.map__pin');

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
  window.data.notices.forEach(function (notice) {
    fragmentPin.appendChild(renderPin(notice));
  });

  mapPins.appendChild(fragmentPin);

})();
