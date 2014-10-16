/* jshint bitwise: false */

(function (exports) {
  'use strict';

  var Rule = (function () {
    var constructor = function (number) {
      this.number = number;
    };

    constructor.prototype.apply = function (p, q, r) {
      return !!(this.number & (1 << ((p << 2) | (q << 1) | (r << 0))));
    };

    return constructor;
  }());

  exports.Rule = Rule;
}(this));
