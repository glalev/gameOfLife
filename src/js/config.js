const width = 800;
const height = 600;

module.exports = {
  gridOptions: {
    width,
    height,

    colors: [0x222222, 0xdddd00],
    padding: 1
  },
  canvasOptions: {
    width,
    height,
    backgroundColor: '0x555555'
  },
  initDataOptions: {
    columns: 9,
    rows: 7,
    livingPercent: 20
  },
  refreshInterval: 50, // in ms
  containerId: 'app-container'
};
