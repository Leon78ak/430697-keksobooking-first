// файл card.js
'use strict';

(function () {
   var cardTemplate = template.content.querySelector('.map__card');
   /**
   * создает объявление-описание объекта недвижимости
   * @param  {card} card элемент массива объектов с данными
   * @return {Element}
   */
  window.card = {
    renderCard: function (card) {
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
    }
  };
})();
