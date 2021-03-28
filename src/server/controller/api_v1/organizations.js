const { getOrganizations } = require('../../../db');

async function getAll(ctx) {
  const approvedOrganizations = await getOrganizations(true);
  const proposedOrganizations = await getOrganizations(false);

  ctx.body = { approvedOrganizations, proposedOrganizations };
}

module.exports = { getAll };
