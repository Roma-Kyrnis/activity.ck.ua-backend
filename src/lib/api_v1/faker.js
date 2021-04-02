const faker = require('faker');

const {
  faker: {
    CATEGORY_IDS,
    TYPE_IDS,
    MIN_PHOTO,
    MAX_PHOTO,
    user: { PASSWORDS },
  },
  places: {
    default: { DAYS },
  },
} = require('../../config');

const user = () => ({
  name: faker.name.findName(),
  avatar: faker.internet.avatar(),
  email: faker.internet.email(),
  passwordHash: faker.random.arrayElement(PASSWORDS),
});

const organization = () => ({
  name: faker.name.findName(),
  phones: faker.random.arrayElements().map(() => faker.phone.phoneNumber('+380#########')),
  email: faker.internet.email(),
});

function getWorkTime() {
  const workTime = {};

  for (let day = 0; day <= faker.random.number({ min: 1, max: 6 }); day += 1) {
    const startMinutes = faker.random.number({ min: 0, max: 24 });
    const endMinutes = faker.random.number({ min: 0, max: 24 });

    workTime[DAYS[day]] = {
      start: `${faker.random.number({ min: 0, max: 24 })}:${
        startMinutes < 10 ? '0' : ''
      }${startMinutes}`,
      end: `${faker.random.number({ min: 0, max: 24 })}:${endMinutes < 10 ? '0' : ''}${endMinutes}`,
    };
  }

  return workTime;
}

const photos = () => {
  return Array.from(new Array(faker.random.number({ min: MIN_PHOTO, max: MAX_PHOTO }))).map(() => {
    const photo = { url: faker.internet.url() };

    if (faker.random.boolean()) {
      photo.author_name = faker.random.arrayElement([null, faker.name.findName()]);
      photo.author_link = faker.internet.url();
    }

    return photo;
  });
};

const place = () => ({
  name: faker.company.companyName(),
  category_id: faker.random.arrayElement(CATEGORY_IDS),
  type_id: faker.random.arrayElement(TYPE_IDS),
  address: faker.address.streetAddress(true),
  phones: faker.random.arrayElements().map(() => faker.phone.phoneNumber('+380#########')),
  website: faker.internet.url(),
  work_time: getWorkTime(),
  accessibility: faker.random.boolean(),
  dog_friendly: faker.random.boolean(),
  child_friendly: faker.random.boolean(),
  description: faker.lorem.text(),
  main_photo: faker.internet.url(),
});

module.exports = { user, organization, photos, place };
