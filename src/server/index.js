const Koa = require('koa');
const helmet = require('koa-helmet');
const morgan = require('koa-morgan');

const router = require('./router');
const { errorHandler } = require('./middleware');
const {
  server: { PORT, HOST, MORGAN_FORMAT },
} = require('../config');
const log = require('../utils/logger')(__filename);

const app = new Koa();

app.use(helmet());
app.use(morgan(MORGAN_FORMAT));

app.use(router.middleware());

app.on('error', errorHandler);

let serverInstance;
function start() {
  serverInstance = app.listen(PORT, HOST, () => {
    log.info(`Server start on "http://${HOST}:${PORT}"`);
  });
}

async function stop(callback) {
  if (serverInstance) await serverInstance.close(callback);
}

module.exports = {
  start,
  stop,
};
