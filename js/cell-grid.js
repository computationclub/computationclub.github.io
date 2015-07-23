(function (exports) {
  'use strict';

  var CellGrid = (function () {
    var scrollContext = function (context, width, height) {
      var imageData = context.getImageData(0, 1, width, height - 1);
      context.putImageData(imageData, 0, 0);
      context.clearRect(0, height - 1, width, 1);
    };

    var nextRow = function () {
      if (this.row < this.rows - 1) {
        ++this.row;
      } else {
        scrollContext(this.context, this.columns, this.rows);
      }
    };

    var drawCell = function (context, column, row) {
      context.fillRect(column, row, 1, 1);
    };

    var constructor = function (options) {
      this.canvas = options.canvas;

      this.row = 0;
      this.context = this.canvas.getContext('2d');
      this.columns = this.canvas.width;
      this.rows = this.canvas.height;
    };

    constructor.prototype.draw = function (cellularAutomaton) {
      for (var column = 0; column < this.columns; ++column) {
        if (cellularAutomaton.getCell(column)) {
          drawCell(this.context, column, this.row);
        }
      }

      nextRow.call(this);
    };

    return constructor;
  }());

  exports.CellGrid = CellGrid;
}(this));
