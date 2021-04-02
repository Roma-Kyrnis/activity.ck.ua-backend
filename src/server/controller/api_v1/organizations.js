const { getOrganizations } = require('../../../db');

async function getAll(ctx) {
  const [approvedOrganizations, proposedOrganizations] = await Promise.all([
    getOrganizations(true),
    getOrganizations(false),
  ]);

  ctx.body = { approvedOrganizations, proposedOrganizations };
}

module.exports = { getAll };
