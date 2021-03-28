const {
  init,
  end,
  createUser,
  checkUser,
  updateUser,
  createOrganization,
  updateOrganization,
  createPlace,
  updatePlace,
} = require('../index');
const { faker } = require('../../lib/api_v1');
const {
  faker: {
    default: { MODERATOR, PLACES_SEEDS, PARAMS },
  },
  roles,
} = require('../../config');
const log = require('../../utils/logger')(__filename);

async function initDefault() {
  const user = await checkUser(MODERATOR.email);
  let userId;
  if (!user) {
    const { id } = await createUser(MODERATOR);
    userId = id;
  } else {
    userId = user.id;
  }
  await updateUser({ id: userId, role: roles.MODERATOR });

  log.info(`MODERATOR with id ${userId} created\n`);

  const { id: organizationId } = await createOrganization({
    ...faker.organization(),
    user_id: userId,
  });
  await updateOrganization({ id: organizationId, moderated: true });

  log.info(`ORGANIZATION with id ${organizationId} created\n`);

  return { userId, organizationId };
}

function getNumber(param) {
  const number = Number.parseInt(param.slice(param.indexOf('=') + 1), 10);
  if (Number.isNaN(number)) return null;
  return number;
}

function getId(params, name) {
  const isParam = params.find((param) => param.includes(name));
  if (isParam) return getNumber(isParam);
  return null;
}

async function initPlaces(params) {
  const count = getId(params, PARAMS.COUNT) || PLACES_SEEDS;

  let userId = getId(params, PARAMS.USER);
  if (!userId) {
    const user = await createUser(faker.user());
    userId = user.id;
  }

  let organizationId = getId(params, PARAMS.ORGANIZATION);
  if (!organizationId) {
    const organization = await createOrganization({ ...faker.organization(), user_id: userId });
    organizationId = organization.id;
  }

  for await (const i of new Array(count)) {
    try {
      const place = await createPlace({
        ...faker.place(),
        user_id: userId,
        organization_id: organizationId,
      });
      await updatePlace({ id: place.id, moderated: true });
    } catch (err) {
      log.error(`Cannot create place: ${err.message}`);
    }
  }

  log.info(`${count} places created`);
}

async function start() {
  log.info(process.argv);
  const type = process.argv.slice(2, 3).toString();
  const params = process.argv.slice(3);
  log.info(params);

  try {
    await init();

    switch (type) {
      case 'default':
        await initDefault();
        break;

      case 'places':
        await initPlaces(params);
        break;

      default:
        break;
    }
  } catch (err) {
    log.fatal(err);
  } finally {
    await end();
    process.exit(0);
  }
}

start();
