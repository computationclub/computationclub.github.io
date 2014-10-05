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

  var scrollContext = function (context, cellCount, rowCount, cellSize) {
    var width = cellCount * cellSize, height = rowCount * cellSize;

    var imageData = context.getImageData(0, cellSize, width, height - cellSize);
    context.putImageData(imageData, 0, 0);
    context.clearRect(0, height - cellSize, width, cellSize);
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

    window.setInterval(function () {
      drawCells(cells, context, row, cellSize);
      cells = nextCells(cells, ruleNumber);

      if (row < rowCount - 1) {
        ++row;
      } else {
        scrollContext(context, cellCount, rowCount, cellSize);
      }
    }, 1000 / rowsPerSecond);
  };
}(this));
