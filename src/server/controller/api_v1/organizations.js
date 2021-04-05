const { getOrganizations, updateOrganization, deleteOrganization } = require('../../../db');

async function getAll(ctx) {
  const [approvedOrganizations, proposedOrganizations] = await Promise.all([
    getOrganizations(true),
    getOrganizations(false),
  ]);

  ctx.body = { approvedOrganizations, proposedOrganizations };
}

async function update(ctx) {
  const id = parseInt(ctx.request.params.id, 10);
  const organization = await updateOrganization({ ...ctx.request.body, id });

  ctx.assert(organization, 409, `Organization with id ${id} doesn't exist`);

  ctx.body = { message: 'OK' };
}

async function remove(ctx) {
  const id = parseInt(ctx.request.params.id, 10);
  await deleteOrganization(id);

  ctx.body = { message: 'OK' };
}

module.exports = { getAll, update, remove };
