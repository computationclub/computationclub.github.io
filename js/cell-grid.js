(function (exports) {
  'use strict';

  var CellGrid = (function () {
    var scrollContext = function (context, columns, rows, cellSize) {
      var width = columns * cellSize, height = rows * cellSize;

      var imageData = context.getImageData(0, cellSize, width, height - cellSize);
      context.putImageData(imageData, 0, 0);
      context.clearRect(0, height - cellSize, width, cellSize);
    };

    var nextRow = function () {
      this.row = (this.row + 1) % this.rows;
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

      nextRow.call(this);
    };

    return constructor;
  }());

  exports.CellGrid = CellGrid;
}(this));
