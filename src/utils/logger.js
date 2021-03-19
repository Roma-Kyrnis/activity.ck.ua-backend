const pino = require('pino');
const pinoPretty = require('pino-pretty');

const level = process.env.NODE_ENV === 'development' ? 'trace' : 'info';

module.exports = (name = '', conf = { base: { name } }) => {
  let ns = name;
  if (ns) {
    const SOURCE_FOLDER = '/src';
    ns = name.slice(name.lastIndexOf(SOURCE_FOLDER) + SOURCE_FOLDER.length);
  }
  const options = {
    ...conf,
    name: ns,
    prettyPrint: { colorize: true, messageFormat: '\n--> {msg}' },
    crlf: true,
    level,
    prettifier: pinoPretty,
    timestamp: () => `,"time":"${new Date().toUTCString()}"`,
  };

  return pino(options);
};
