(function (exports) {
  'use strict';

  var CellGrid = (function () {
    var flipDirection = function () {
      if (this.row === this.rows) {
        this.reverse = true;
      } else if (this.row === 0) {
        this.reverse = false;
      }
    };

    var nextRow = function () {
      if (this.reverse) {
        --this.row;
      } else {
        ++this.row;
      }
    };

    var drawCell = function (context, column, row, size) {
      context.fillRect(column * size, row * size, size, size);
    };

    var clearCell = function (context, column, row, size) {
      context.clearRect(column * size, row * size, size, size);
    };

    var constructor = function (options) {
      this.canvas = options.canvas;
      this.cellSize = options.cellSize;

      this.row = 0;
      this.reverse = false;
      this.context = this.canvas.getContext('2d');
      this.columns = Math.floor(this.canvas.width / this.cellSize);
      this.rows = Math.floor(this.canvas.height / this.cellSize);
    };

    constructor.prototype.draw = function (cellularAutomaton) {
      for (var column = 0; column < this.columns; ++column) {
        if (cellularAutomaton.getCell(column)) {
          drawCell(this.context, column, this.row, this.cellSize);
        } else {
          clearCell(this.context, column, this.row, this.cellSize);
        }
      }

      flipDirection.call(this);
      nextRow.call(this);
    };

    return constructor;
  }());

  exports.CellGrid = CellGrid;
}(this));
