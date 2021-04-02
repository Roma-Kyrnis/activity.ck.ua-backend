const {
  createOrganization,
  getOrganizations,
  updateOrganization,
  deleteOrganization,
} = require('../../../db');

async function create(ctx) {
  const userId = ctx.state.authPayload.id;

  try {
    await createOrganization({
      ...ctx.request.body,
      user_id: userId,
    });
  } catch (err) {
    if (err.name === 'DatabaseError') throw err;
    throw ctx.throw(400, `User with id ${userId} does not exist`);
  }

  ctx.body = { message: 'OK' };
}

async function getProposed(ctx) {
  const organizations = await getOrganizations(false);

  ctx.body = { proposedOrganizations: organizations };
}

async function getApproved(ctx) {
  const organizations = await getOrganizations(true);

  ctx.body = { proposedOrganizations: organizations };
}

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

  ctx.assert(organization, 400, `Organization with id ${id} doesn't exist`);

  ctx.body = { message: 'OK' };
}

async function remove(ctx) {
  const id = parseInt(ctx.request.params.id, 10);
  await deleteOrganization(id);

  ctx.body = { message: 'OK' };
}

module.exports = { create, getProposed, getApproved, getAll, update, remove };
