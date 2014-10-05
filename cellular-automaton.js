/* jshint bitwise: false */

(function (exports) {
  'use strict';

  var makeCells = function (cellCount) {
    var cells = [];
    for (var i = 0; i < cellCount; ++i) {
      cells[i] = false;
    }
    cells[cells.length - 1] = true;

    return cells;
  };

  var drawCells = function (cells, context, row, cellSize) {
    cells.forEach(function (cell, column) {
      if (cell) {
        context.fillRect(column * cellSize, row * cellSize, cellSize, cellSize);
      }
    });
  };

  var nextCells = function (cells, ruleNumber) {
    return cells.map(function (middleCell, column) {
      var leftCell = cells[column - 1], rightCell = cells[column + 1];
      var pattern = (leftCell << 2) | (middleCell << 1) | (rightCell << 0);
      return !!(ruleNumber & (1 << pattern));
    });
  };

  exports.drawCellularAutomaton = function (options) {
    var canvas = options.canvas,
      cellSize = options.cellSize,
      ruleNumber = options.ruleNumber;

    var context = canvas.getContext('2d');

    var cellCount = Math.floor(canvas.width / cellSize);
    var cells = makeCells(cellCount);

    var rowCount = Math.floor(canvas.height / cellSize);

    for (var row = 0; row < rowCount; ++row) {
      drawCells(cells, context, row, cellSize);
      cells = nextCells(cells, ruleNumber);
    }
  };
}(this));
