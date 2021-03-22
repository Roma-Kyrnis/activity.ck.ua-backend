const { start, stop } = require('./server');
const { init, end } = require('./db');
const { gracefulShutdown } = require('./utils');

const log = require('./utils/logger')(__filename);

async function boot() {
  gracefulShutdown(async (err) => {
    if (err) log.error(`Server stopped because of ${err}`);

    await stop();
    await end();

    log.info('Server stopped!');
    process.exit(1);
  });
  await init();
  await start();
}

boot();
