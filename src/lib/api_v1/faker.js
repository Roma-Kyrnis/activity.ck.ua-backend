const faker = require('faker');

const {
  faker: { userId },
} = require('../../config');

// const user = {
//   name: '',
//   avatar: '',
//   email: '',
//   passwordHash: '',
// }

const organization = {
  name: faker.name.findName(),
  phones: faker.random.arrayElements().map(() => faker.phone.phoneNumber('+380#########')),
  email: faker.internet.email(),
  user_id: userId,
};

module.exports = { organization };
