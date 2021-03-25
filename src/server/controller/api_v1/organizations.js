const { getOrganizations } = require('../../../db');

async function getAll(ctx) {
  const organizations = await getOrganizations();

  const response = {
    approvedOrganizations: [],
    proposedOrganizations: [],
  };

  for (const { id, name, moderated } of organizations) {
    if (moderated) response.approvedOrganizations.push({ id, name });
    else response.proposedOrganizations.push({ id, name });
  }

  ctx.body = response;
}

module.exports = { getAll };
