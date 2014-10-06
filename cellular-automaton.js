/* jshint bitwise: false */
/* global window */

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

  var CellularAutomaton = (function () {
    var makeCells = function (cellCount) {
      var cells = [];
      for (var i = 0; i < cellCount; ++i) {
        cells[i] = false;
      }
      cells[cells.length - 1] = true;

      return cells;
    };

    var constructor = function (options) {
      this.rule = options.rule;
      this.cells = makeCells(options.cellCount);
    };

    constructor.prototype.step = function () {
      this.cells = this.cells.map(function (middle, column) {
        return this.rule.apply(this.cells[column - 1], middle, this.cells[column + 1]);
      }, this);
    };

    constructor.prototype.cellAt = function (column) {
      return this.cells[column];
    };

    return constructor;
  }());

  var drawCells = function (cellularAutomaton, context, row, cellCount, cellSize) {
    for (var column = 0; column < cellCount; ++column) {
      if (cellularAutomaton.cellAt(column)) {
        context.fillRect(column * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  };

  var scrollContext = function (context, cellCount, rowCount, cellSize) {
    var width = cellCount * cellSize, height = rowCount * cellSize;

    var imageData = context.getImageData(0, cellSize, width, height - cellSize);
    context.putImageData(imageData, 0, 0);
    context.clearRect(0, height - cellSize, width, cellSize);
  };

  exports.drawCellularAutomaton = function (options) {
    var canvas = options.canvas,
      cellSize = options.cellSize,
      rule = options.rule,
      rowsPerSecond = options.rowsPerSecond;

    var context = canvas.getContext('2d');

    var cellCount = Math.floor(canvas.width / cellSize);
    var cellularAutomaton = new CellularAutomaton({
      rule: rule,
      cellCount: cellCount
    });

    var rowCount = Math.floor(canvas.height / cellSize);
    var row = 0;

    window.setInterval(function () {
      drawCells(cellularAutomaton, context, row, cellCount, cellSize);
      cellularAutomaton.step();

      if (row < rowCount - 1) {
        ++row;
      } else {
        scrollContext(context, cellCount, rowCount, cellSize);
      }
    }, 1000 / rowsPerSecond);
  };

  exports.Rule = Rule;
}(this));
