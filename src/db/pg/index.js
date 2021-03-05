/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { checkError } = require('../checkError');

module.exports = (config) => {
  const client = new Pool(config);

  return {
    testConnection: async () => {
      try {
        console.log(`hello from pg testConnection`);
        await client.query('SELECT NOW();');
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    close: async () => {
      console.log(`INFO: Closing pg DB wrapper`);
      client.end();
    },

    createUser: async ({ name, avatar, email, passwordHash }) => {
      try {
        if (!name) {
          throw new Error('ERROR: No user name defined');
        }
        if (!avatar) {
          throw new Error('ERROR: No user avatar defined');
        }
        if (!email) {
          throw new Error('ERROR: No user email defined');
        }

        const timestamp = new Date();

        const res = await client.query(
          `INSERT INTO users (name, avatar, email, password_hash, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, name, avatar, email, role, created_at, updated_at;`,
          [name, avatar, email, passwordHash, timestamp, timestamp],
        );

        console.log(`DEBUG: New user created: ${JSON.stringify(res.rows[0])}`);
        return res.rows[0];
      } catch (err) {
        // logger
        console.error(err.message || err);
        throw checkError(err);
      }
    },

    getUser: async (email) => {
      try {
        if (!email) {
          throw new Error('ERROR: No user email defined');
        }

        const res = await client.query(
          `SELECT id, name, avatar, email, role, created_at, updated_at FROM users
            WHERE email = $1 AND deleted_at IS NULL;`,
          [email],
        );

        return res.rows[0];
      } catch (err) {
        // logger
        console.error(err.message || err);
        throw err;
      }
    },

    getUserCredentials: async (email) => {
      try {
        if (!email) {
          throw new Error('ERROR: No user email defined');
        }

        const res = await client.query(
          `SELECT id, email, password_hash, role, refresh_token FROM users
            WHERE email = $1 AND deleted_at IS NULL;`,
          [email],
        );

        return res.rows[0];
      } catch (err) {
        // logger
        console.error(err.message || err);
        throw err;
      }
    },

    updateUser: async ({ id, ...user }) => {
      try {
        if (!id) {
          throw new Error('ERROR: No user id defined');
        }

        if (!Object.keys(user).length) {
          throw new Error('ERROR: Nothing to update');
        }

        user.updated_at = new Date();

        const query = [];
        const values = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const [i, [k, v]] of Object.entries(user).entries()) {
          query.push(`${k} = $${i + 1}`);
          values.push(v);
        }

        values.push(id);

        const res = await client.query(
          `UPDATE users SET ${query.join(', ')}
            WHERE id = $${values.length} AND deleted_at IS NULL
            RETURNING id, name, avatar, email, role, created_at, updated_at;`,
          values,
        );

        console.log(`DEBUG: User updated: ${JSON.stringify(res.rows[0])}`);
        return res.rows[0];
      } catch (err) {
        // logger
        console.error(err.message || err);
        throw checkError(err);
      }
    },

    deleteUser: async (id) => {
      try {
        if (!id) {
          throw new Error('ERROR: No user id defined');
        }
        // await client.query('DELETE FROM users WHERE id = $1;', [id]);
        await client.query('UPDATE users SET deleted_at = $1 WHERE id = $2;', [new Date(), id]);

        return true;
      } catch (err) {
        // logger
        console.error(err.message || err);
        throw err;
      }
    },

    // place.user_id, place.organization_id
    createPlace: async (place) => {
      try {
        if (!place) {
          throw new Error('ERROR: No place defined');
        }

        // if (!place.phones) place.phones = null;
        place.phones = `{${place.phones.map((p) => `"${p}"`).join(', ')}}`;
        if (!place.website) place.website = null;
        /* if (!place.accessibility) place.accessibility = false;
        if (!place.dog_friendly) place.dog_friendly = false;
        if (!place.child_friendly) place.child_friendly = false; */
        if (!place.type_id) place.type_id = null;

        const timestamp = new Date();

        const res = await client.query(
          `INSERT INTO places (name, address, phones, website, main_photo, description,
              accessibility, dog_friendly, child_friendly, user_id, category_id, type_id, work_time,
              organization_id, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING id, name, address, phones, website, main_photo, description, accessibility,
              dog_friendly, child_friendly, user_id, category_id, type_id, work_time, organization_id,
              created_at, updated_at;`,
          [
            place.name,
            place.address,
            place.phones,
            place.website,
            place.main_photo,
            place.description,
            place.accessibility,
            place.dog_friendly,
            place.child_friendly,
            place.user_id,
            place.category_id,
            place.type_id,
            place.work_time,
            place.organization_id,
            timestamp,
            timestamp,
          ],
        );

        console.log(`DEBUG: New place created: ${JSON.stringify(res.rows[0])}`);
        return res.rows[0];
      } catch (err) {
        // logger
        console.error(err.message || err);
        throw err;
      }
    },

    // + events & reviews
    getPlace: async (id) => {
      try {
        if (!id) {
          throw new Error('ERROR: No place id defined');
        }

        const {
          rows: [place],
        } = await client.query(
          `SELECT id, name, address, phones, website, description, accessibility,
              dog_friendly, child_friendly, work_time, rating,
              organization_id FROM places
            WHERE id = $1 AND moderated AND deleted_at IS NULL;`,
          [id],
        );

        place.phones = place.phones.slice(1, -1).split(',');

        const { rows: photos } = await client.query(
          `SELECT id, url, author_name, author_link FROM photos
            WHERE place_id = $1;`,
          [id],
        );

        place.photos = photos;

        return place;
      } catch (err) {
        // logger
        console.error(err.message || err);
        throw err;
      }
    },

    getPlaces: async (categoryId, types, accessibility, dogFrnd, childFrnd, limit, page) => {
      try {
        let queryFilter;
        const values = [];

        if (categoryId) {
          queryFilter = 'category_id = $1';
          values.push(categoryId);
        }

        if (types) {
          const query = [];
          // eslint-disable-next-line no-restricted-syntax
          for (const [i, v] of types.entries()) {
            query.push(`$${i + 1}`);
            values.push(v);
          }
          queryFilter = `type_id IN (${query.join(', ')})`;
        }

        if (!values.length) {
          throw new Error('ERROR: No filters!');
        }

        values.push(limit);
        values.push(page * limit + 1);

        let queryAccessibility = '';
        if (accessibility) queryAccessibility = 'AND accessibility';
        if (dogFrnd) queryAccessibility += ' AND dog_friendly';
        if (childFrnd) queryAccessibility += ' AND child_friendly';

        const { rows: places } = await client.query(
          `SELECT id, name, address, phones, website, main_photo, work_time, rating
            FROM places
            WHERE ${queryFilter} ${queryAccessibility}
              AND moderated AND deleted_at IS NULL
            ORDER BY popularity_rating DESC
            LIMIT $${values.length - 1} OFFSET $${values.length};`,
          values,
        );

        places.forEach((place) => {
          place.phones = place.phones.slice(1, -1).split(',');
        });

        const {
          rows: [count],
        } = await client.query(
          `SELECT COUNT(*) FROM places
            WHERE ${queryFilter} ${queryAccessibility}
              AND moderated AND deleted_at IS NULL
            ORDER BY popularity_rating DESC
            LIMIT $${values.length - 1} OFFSET $${values.length};`,
          values,
        );

        const res = {};
        res.places = places;
        /* res._limit = limit;
        res._page = page; */
        res._total = count;
        res._totalPages = Math.ceil(count / limit);

        return res;
      } catch (err) {
        // logger
        console.error(err.message || err);
        throw err;
      }
    },

    updatePlace: async ({ id, ...place }) => {
      try {
        if (!id) {
          throw new Error('ERROR: No place id defined');
        }

        if (!Object.keys(place).length) {
          throw new Error('ERROR: Nothing to update');
        }

        if (place.phones) place.phones = `{${place.phones.map((p) => `"${p}"`).join(', ')}}`;
        place.updated_at = new Date();

        const query = [];
        const values = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const [i, [k, v]] of Object.entries(place).entries()) {
          query.push(`${k} = $${i + 1}`);
          values.push(v);
        }

        values.push(id);

        const res = await client.query(
          `UPDATE places SET ${query.join(', ')}
            WHERE id = $${values.length} AND deleted_at IS NULL
            RETURNING id, name, address, phones, website, main_photo, description, accessibility,
              dog_friendly, child_friendly, user_id, category_id, type_id, work_time, organization_id,
              created_at, updated_at;`,
          values,
        );

        console.log(`DEBUG: Place updated: ${JSON.stringify(res.rows[0])}`);
        return res.rows[0];
      } catch (err) {
        // logger
        console.error(err.message || err);
        throw err;
      }
    },

    deletePlace: async (id) => {
      try {
        if (!id) {
          throw new Error('ERROR: No place id defined');
        }
        // await client.query('DELETE FROM places WHERE id = $1;', [id]);
        await client.query('UPDATE places SET deleted_at = $1 WHERE id = $2;', [new Date(), id]);

        return true;
      } catch (err) {
        // logger
        console.error(err.message || err);
        throw err;
      }
    },
  };
};
