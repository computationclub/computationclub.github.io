(function (exports) {
  'use strict';

  var CellularAutomaton = (function () {
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
      this.cells = options.cells;
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

  var CellGrid = (function () {
    var scrollContext = function (context, columns, rows, cellSize) {
      var width = columns * cellSize, height = rows * cellSize;

      var imageData = context.getImageData(0, cellSize, width, height - cellSize);
      context.putImageData(imageData, 0, 0);
      context.clearRect(0, height - cellSize, width, cellSize);
    };

    var nextRow = function () {
      if (this.row < this.rows - 1) {
        ++this.row;
      } else {
        scrollContext(this.context, this.columns, this.rows, this.cellSize);
      }
    };

    var drawCell = function (context, column, row, size) {
      context.fillRect(column * size, row * size, size, size);
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
        if (cellularAutomaton.cellAt(column)) {
          drawCell(this.context, column, this.row, this.cellSize);
        }
      }

      nextRow.call(this);
    };

    return constructor;
  }());

  exports.CellGrid = CellGrid;
  exports.CellularAutomaton = CellularAutomaton;
}(this));
