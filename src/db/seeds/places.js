const {
  init,
  end,
  createUser,
  checkUser,
  updateUser,
  createOrganization,
  updateOrganization,
} = require('../index');
const { faker } = require('../../lib/api_v1');
const { moderator } = require('../../config');
const log = require('../../utils/logger')(__filename);

async function plantSeeds() {
  try {
    await init();

    const user = await checkUser(moderator.email);
    let userId;
    if (!user) {
      const { id } = await createUser(moderator);
      userId = id;
    } else {
      userId = user.id;
    }
    await updateUser({ id: userId, role: 'moderator' });

    log.info(`Moderator with ${userId} id created`);

    const { id: organizationId } = await createOrganization({
      ...faker.organization,
      user_id: userId,
    });
    await updateOrganization({ id: organizationId, moderated: true });

    log.info(`Create moderated organization with ${organizationId} id created`);
  } catch (err) {
    log.fatal(err);
  } finally {
    await end();
    process.exit(0);
  }
}

plantSeeds();
