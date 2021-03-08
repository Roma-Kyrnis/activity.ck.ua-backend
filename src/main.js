const { start, stop } = require('./server');
const { close } = require('./db');
const { gracefulShutdown } = require('./utils');

const log = require('./utils/logger')(__filename);

async function boot() {
  gracefulShutdown(async (err) => {
    if (err) log.error(`\n\nServer stopped because of ${err}`);

    await stop();

    await close();

    log.info('Server stopped!');
    process.exit(1);
  });
  await start();
}

boot();
