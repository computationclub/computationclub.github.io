(function (exports) {
  'use strict';

  var CellularAutomaton = (function () {
    var makeCells = function (size) {
      var cells = new Array(size);

      for (var i = 0; i < size; ++i) {
        cells[i] = false;
      }
      cells[cells.length - 1] = true;

      return cells;
    };

    var padCells = function () {
      this.cells.unshift(false);
      this.left--;
      this.cells.push(false);
      this.right++;
    };

    var trimCells = function () {
      if (!this.cells[0]) {
        this.cells.shift();
        this.left++;
      }

      if (!this.cells[this.cells.length - 1]) {
        this.cells.pop();
        this.right--;
      }
    };

    var constructor = function (options) {
      this.rule = options.rule;
      this.cells = makeCells(options.size);
      this.left = 0;
      this.right = this.cells.length - 1;
    };

    constructor.prototype.step = function () {
      padCells.call(this);

      this.cells = this.cells.map(function (middle, column) {
        return this.rule.apply(this.cells[column - 1], middle, this.cells[column + 1]);
      }, this);

      trimCells.call(this);
    };

    constructor.prototype.cellAt = function (column) {
      return this.cells[column - this.left];
    };

    return constructor;
  }());

  exports.CellularAutomaton = CellularAutomaton;
}(this));
