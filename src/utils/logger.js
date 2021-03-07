const pino = require('pino');
const pinoPretty = require('pino-pretty');

const level = process.env.NODE_ENV === 'development' ? 'trace' : 'info';

module.exports = (name = '', conf = { base: { name } }) => {
  let ns = name;
  if (ns) {
    ns = name.split('/src');
  }
  const options = {
    ...conf,
    name: ns[1],
    prettyPrint: { colorize: true, messageFormat: '\n--> {msg}' },
    crlf: true,
    level,
    prettifier: pinoPretty,
    timestamp: () => `,"time":"${new Date(Date.now()).toUTCString()}"`,
  };

  return pino(options);
};
