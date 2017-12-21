// файл util.js
'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    /**
    * возвращает случайное целое
    * @param  {number} min
    * @param  {number} max
    * @return {number}
    */
    randomInteger: function (min, max) {
      var rand = min + Math.random() * (max + 1 - min);
      rand = Math.floor(rand);
      return rand;
    },
    /**
    * возвращает случайное значение из переданного массива значений
    * @param {array} array - массив значений
    * @return {*}
    */
    randomArrayValue: function (array) {
      return array[Math.floor(Math.random() * array.length)];
    },
    /**
    * создает массив чисел-номеров пользователей
    * @param  {number} min
    * @param  {number} max
    * @return {array}
    */
    createArrayOfNumbers: function (min, max) {
      var array = [];
      for (var i = min; i <= max; i++) {
        array.push(i);
      }
      return array;
    },
    /**
    * возвращает неповторяющееся случайное значение из переданного массива значений
    * @param {array} array - массив значений
    * @return {string}
    */
    randomUniqueArrayValue: function (array) {
      var randValue = Math.floor(Math.random() * array.length);
      return array.splice(randValue, 1);
    },
    /**
     * возвращает новый массив случайной длины случайных значений
     * @param  {array} array  - массив значений
     * @return {array}       новый массив
     */
    randomArray: function (array) {
      // копируем исходный массив
      var arrayCopy = array.slice(0);
      // генерим случайное число - максимальное значение индекса массива больше 0
      var randValue = Math.floor(1 + Math.random() * arrayCopy.length);
      // перетрясем исходный массив значений в случайном порядке
      var compareRandom = function (a, b) {
        // Math.random() возвращает результат от 0 до 1. Вычтем 0.5, чтобы область значений стала [-0.5 ... 0.5)
        return Math.random() - 0.5;
      };
      // отсортируем исходный массив значений в случайном порядке
      arrayCopy.sort(compareRandom);
      return arrayCopy.slice(0, randValue);
    },
    createUUID: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    },
  };
})();








