const Helpers = require('./Helpers');
const {Container, Graphics, Texture, Sprite} = require('pixi.js');

const _initGridData = (len, livingPercent) => {
  return new Array(len).fill(0).map(() => Math.random() > livingPercent / 100 ? 0 : 1);
};

const initGridData = ({columns, rows, livingPercent}) => {
  return new Array(rows).fill(0).map(() => _initGridData(columns, livingPercent));
};

const _getRow = (options, row, index, data) => {
  const {width, height, padding, colors} = options;
  const columns = row.length;
  const rows = data.length;
  const cellWidth = (width - ((columns - 1) * padding)) / columns;
  const cellHeight = (height - ((rows - 1) * padding)) / rows;

  return row.map((cell, i) => { // TODO add create cell function
    const sprite = new Sprite(Texture.WHITE);
    sprite.width = cellWidth;
    sprite.height = cellHeight;
    sprite.tint = colors[cell];
    sprite.x = i * (cellWidth + padding);
    sprite.y = index * (cellHeight + padding);

    return sprite;
  });
};

const getGrid = (data, options) => {
  const grid = new Container();
  const getRow = _getRow.bind(null, options);
  const cells = Helpers.flat(data.map(getRow));

  grid.addChild(...cells);

  return grid;
};

const _getNeighboursCount = (data, i, j) => {
  const neighboursAddress = [
    [i - 1, j - 1], [i - 1, j], [i - 1, j + 1],
    [i, j - 1], [i, j + 1],
    [i + 1, j - 1], [i + 1, j], [i + 1, j + 1]
  ];

  // treating edge cells neighbours as always dead cells
  return neighboursAddress
    .map(([i, j]) => data[i] && data[i][j] ? data[i][j] : 0)
    .reduce((sum, value) => sum + value, 0);
};

const _getRowNextGeneration = (row, index, data) => {
  return row.map((value, i) => {
    const neighbors = _getNeighboursCount(data, index, i);
    const isAlife = !!value;
    /*
      Any live cell with fewer than two live neighbors dies, as if by under population.
      Any live cell with two or three live neighbors lives on to the next generation.
      Any live cell with more than three live neighbors dies, as if by overpopulation.
      Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
    */
    if (isAlife && neighbors < 2 || neighbors > 3) return 0;
    if (!isAlife && neighbors === 3) return 1;

    return value;
  });
};

const getNextGeneration = (data) => data.map(_getRowNextGeneration);

module.exports = {
  getNextGeneration,
  getGrid,
  initGridData
};
