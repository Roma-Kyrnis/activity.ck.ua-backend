const { getOrganizations } = require('../../../db');

async function getAll(ctx) {
  const organizations = await getOrganizations();

  ctx.body = { organizations };
}

module.exports = { getAll };
