const { start, stop } = require('./server');
const { gracefulShutdown } = require('./utils');

async function boot() {
  gracefulShutdown(async (err) => {
    if (err) console.log(`\n\nServer stopped because of ${err}`);

    await stop();

    console.log('Server stopped!');
    process.exit(1);
  });
  await start();
}

boot();
