const { firebase } = require('../../../lib/api_v1');

async function getCustomToken(ctx) {
  const user = {
    id: ctx.state.authPayload.id,
    role: ctx.state.authPayload.role,
  };

  const token = await firebase.getCustomToken(user);

  ctx.body = { token };
}

module.exports = { getCustomToken };
