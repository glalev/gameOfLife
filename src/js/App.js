const PIXI = require('pixi.js');
const Grid = require('./Grid');
const Helpers = require('./Helpers');
const config = require('./config');
const STATE = {
  config,
  renderer: null,
  gameStart: null
};

const init = async (state) => {
  const { containerId, canvasOptions, initDataOptions, gridOptions, refreshInterval } = state.config;
  const container = document.getElementById(containerId);
  const renderer = PIXI.autoDetectRenderer(canvasOptions);
  const initialData = Grid.initGridData(initDataOptions);
  const startPromise = new Promise(resolve => {
    const button = document.getElementById('start-button');
    button.addEventListener('click', () => resolve());
  })

  state.renderer = renderer;
  container.appendChild(renderer.view);
  state.gameStart = startPromise;
  const update = Helpers.compose(Grid.getNextGeneration, renderGrid.bind(null, renderer, gridOptions));

  const data = await initialLoop(state, initialData);
  mainLoop(update, initialData);
};

// handles the change /triggered from click/ of a single cell;
const manualUpdate = (render, initialData) => new Promise(resolve => {
  const { data, grid } = render(initialData);

  grid.interactive = true;
  grid.children.forEach(child => child.interactive = true)
  grid.once('click', (e) => {
    const { i, j } = e.target.address;
    const newData = data.slice();
    newData[i][j] = data[i][j] === 1 ? 0 : 1;
    resolve(newData);
  });
});

const renderGrid = (renderer, options, data) => {
  const { width, height } = renderer.view;
  const grid = Grid.getGrid(data, Object.assign({}, { width, height }, options));
  renderer.render(grid);

  return { data, grid };
}

const initialLoop = async (state, initialData) => {
  const { canvasOptions, gridOptions, containerId, initDataOptions } = state.config;
  const renderer = state.renderer;
  const render = renderGrid.bind(null, renderer, gridOptions);

  const nextData = await Promise.race([manualUpdate(render, initialData), state.gameStart]);
  return nextData ? initialLoop(state, nextData) : Promise.resolve(initialData);
}

const mainLoop = (callback, init, interval = 500) => {
  const tick = (now, then, param, innerInterval) => {
    const delta = now - then;
    const timeLeft = innerInterval - delta;
    if(timeLeft > 0) return window.requestAnimationFrame((timeStamp) => tick(timeStamp, now, param, timeLeft));

    const result = callback(param);
    window.requestAnimationFrame((timeStamp) => tick(timeStamp, now, result, interval));
  };

  return window.requestAnimationFrame((timeStamp) => tick(timeStamp, 0, init, interval));
}

window.onload = init.bind(null, STATE);