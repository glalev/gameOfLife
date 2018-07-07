const PIXI = require('pixi.js');
const Grid = require('./Grid');
const Helpers = require('./Helpers');
const config = require('./config');

const init = (config) => {
  const {canvasOptions, gridOptions, containerId, initDataOptions} = config;
  const container = document.getElementById(containerId);
  const renderer = PIXI.autoDetectRenderer(canvasOptions);
  const data = Grid.initGridData(initDataOptions);

  const update = Helpers.compose(Grid.getNextGeneration, renderGrid.bind(null, renderer, gridOptions));

  container.appendChild(renderer.view);

  setTicker(update, data, config.refreshInterval);
};

const renderGrid = (renderer, options, data) => {
  const {width, height} = renderer.view;
  const grid = Grid.getGrid(data, Object.assign({}, {width, height}, options));

  renderer.render(grid);

  return data;
}

const setTicker = (callback, init, interval = 500) => {
  const tick = (now, then, param, innerInterval) => {
    const delta = now - then;
    const timeLeft = innerInterval - delta;
    if(timeLeft > 0) return window.requestAnimationFrame((timeStamp) => tick(timeStamp, now, param, timeLeft));

    const result = callback(param);
    window.requestAnimationFrame((timeStamp) => tick(timeStamp, now, result, interval));
  };

  return window.requestAnimationFrame((timeStamp) => tick(timeStamp, 0, init, interval));
}

window.onload = init.bind(null, config);