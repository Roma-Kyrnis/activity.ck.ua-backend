const logger = require('./logger');

module.exports = (filename) => {
  const log = logger(filename);

  return (message) => {
    log.fatal(message);
    process.exit(1);
  };
};
