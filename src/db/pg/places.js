/* eslint-disable no-underscore-dangle */
const log = require('../../utils/logger')(__filename);

module.exports = (client) => {
  return {
    createPlace: async (place) => {
      try {
        if (!place) {
          throw new Error('ERROR: No place defined');
        }

        // place.phones = `{${place.phones.map((p) => `"${p}"`).join(', ')}}`;
        if (!place.website) place.website = null;
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

        log.debug(res.rows[0], 'New place created:');
        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
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

        const { rows: photos } = await client.query(
          `SELECT id, url, author_name, author_link FROM photos
            WHERE place_id = $1;`,
          [id],
        );

        place.photos = photos;

        return place;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    getPlaces: async (filters, limit, page) => {
      try {
        const { categoryId, types, accessibility, dogFriendly, childFriendly } = filters;

        if (!categoryId === !types) {
          throw new Error('ERROR: Invalid filters!');
        }

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
        values.push((page - 1) * limit);

        let queryAccessibility = '';
        if (accessibility) queryAccessibility = 'AND accessibility';
        if (dogFriendly) queryAccessibility += ' AND dog_friendly';
        if (childFriendly) queryAccessibility += ' AND child_friendly';

        const { rows: places } = await client.query(
          `SELECT id, name, address, phones, website, main_photo, work_time, rating
            FROM places
            WHERE ${queryFilter} ${queryAccessibility}
              AND moderated AND deleted_at IS NULL
            ORDER BY popularity_rating DESC
            LIMIT $${values.length - 1} OFFSET $${values.length};`,
          values,
        );

        values.splice(-2);
        const {
          rows: [count],
        } = await client.query(
          `SELECT COUNT(*) FROM places
            WHERE ${queryFilter} ${queryAccessibility}
              AND moderated AND deleted_at IS NULL;`,
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
        log.error(err.message || err);
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

        // if (place.phones) place.phones = `{${place.phones.map((p) => `"${p}"`).join(', ')}}`;
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

        log.debug(res.rows[0], 'Place updated:');
        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
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
        log.error(err.message || err);
        throw err;
      }
    },
  };
};
