/* jshint bitwise: false */
/* global window */

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
      ruleNumber = options.ruleNumber,
      rowsPerSecond = options.rowsPerSecond;

    var context = canvas.getContext('2d');

    var cellCount = Math.floor(canvas.width / cellSize);
    var cells = makeCells(cellCount);

    var rowCount = Math.floor(canvas.height / cellSize);
    var row = 0;

    var interval = window.setInterval(function () {
      drawCells(cells, context, row, cellSize);
      cells = nextCells(cells, ruleNumber);

      if (row < rowCount) {
        ++row;
      } else {
        window.clearInterval(interval);
      }
    }, 1000 / rowsPerSecond);
  };
}(this));
