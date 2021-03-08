const log = require('./logger')(__filename);

module.exports = (message) => {
  log.fatal(message);
  process.exit(1);
};
