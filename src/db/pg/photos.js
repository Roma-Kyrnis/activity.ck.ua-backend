/* eslint-disable no-plusplus */
const log = require('../../utils/logger')(__filename);

module.exports = (client) => {
  return {
    addPhotos: async (photos, placeId, eventId) => {
      try {
        if (!Object.keys(photos).length) {
          throw new Error('ERROR: No photos defined');
        }

        if (!placeId === !eventId) {
          throw new Error('ERROR: Invalid parameters!');
        }

        const query = [];
        const values = [];
        const id = placeId || eventId;
        let i = 0;

        for (const photo of photos) {
          const parameters = [];

          parameters.push(`$${++i}`);
          values.push(photo.url);

          if (photo.author_name) {
            parameters.push(`$${++i}`);
            values.push(photo.author_name);
          } else {
            parameters.push('NULL');
          }

          if (photo.author_link) {
            parameters.push(`$${++i}`);
            values.push(photo.author_link);
          } else {
            parameters.push('NULL');
          }

          parameters.push(`$${++i}`);
          values.push(id);

          query.push(`(${parameters.join(', ')})`);
        }

        const res = await client.query(
          `INSERT INTO photos (url, author_name, author_link, ${placeId ? 'place_id' : 'event_id'})
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

    getPhotos: async (placeId, eventId) => {
      try {
        if (!placeId === !eventId) {
          throw new Error('ERROR: Invalid parameters!');
        }

        const id = placeId || eventId;

        const res = await client.query(
          `SELECT id, url, author_name, author_link FROM photos
            WHERE ${placeId ? 'place_id' : 'event_id'} = $1;`,
          [id],
        );

        return res.rows;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    deletePhoto: async (id) => {
      try {
        if (!id) {
          throw new Error('ERROR: No photo id defined');
        }

        await client.query('DELETE FROM photos WHERE id = $1;', [id]);

        return true;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },
  };
};
