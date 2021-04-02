/* eslint-disable no-plusplus */
const log = require('../../utils/logger')(__filename);

module.exports = (client) => {
  return {
    addPhotos: async (photos, id, nameId) => {
      try {
        if (!photos.length) {
          throw new Error('ERROR: No photos defined');
        }

        if (!id) {
          throw new Error('ERROR: No id defined!');
        }

        if (nameId !== 'place_id' && nameId !== 'event_id') {
          throw new Error('ERROR: Invalid parameter nameId!');
        }

        const query = [];
        const values = [];
        let i = 0;
        let parameters;

        const AddParameter = (value) => {
          if (value) {
            parameters.push(`$${++i}`);
            values.push(value);
          } else {
            parameters.push('NULL');
          }
        };

        for (const photo of photos) {
          parameters = [];

          AddParameter(photo.url);
          AddParameter(photo.author_name);
          AddParameter(photo.author_link);
          AddParameter(id);

          query.push(`(${parameters.join(', ')})`);
        }

        const res = await client.query(
          `INSERT INTO photos (url, author_name, author_link, ${nameId})
            VALUES ${query.join(', ')}
            RETURNING id, url, author_name, author_link;`,
          values,
        );

        log.debug(`${res.rows.length} new photos was added.`);
        return res.rows;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    getPhotos: async (id, nameId) => {
      try {
        if (!id) {
          throw new Error('ERROR: No id defined!');
        }

        if (nameId !== 'place_id' && nameId !== 'event_id') {
          throw new Error('ERROR: Invalid parameter nameId!');
        }

        const res = await client.query(
          `SELECT id, url, author_name, author_link FROM photos
            WHERE ${nameId} = $1;`,
          [id],
        );

        return res.rows;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    deletePhotos: async (ids) => {
      try {
        if (!ids.length) {
          throw new Error('ERROR: No photos defined!');
        }

        const query = [];
        for (const [i] of ids.entries()) {
          query.push(`$${i + 1}`);
        }

        await client.query(`DELETE FROM photos WHERE id IN (${query.join(', ')})`, ids);

        return true;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },
  };
};
