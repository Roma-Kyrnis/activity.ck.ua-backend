const { firebase } = require('../../../lib/api_v1');

async function getCustomToken(ctx) {
  const { id, role } = ctx.state.authPayload;

  const token = await firebase.getCustomToken(id, role);

  ctx.body = { token };
}

module.exports = { getCustomToken };
