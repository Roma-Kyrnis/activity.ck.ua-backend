/* eslint-disable no-underscore-dangle */
const log = require('../../utils/logger')(__filename);
const {
  content: { EVENTS_PERIOD },
} = require('../../config');
const { checkError } = require('../checkError');
const { queryAccessibility } = require('./queryBuilder');

module.exports = (client) => {
  return {
    createEvent: async (event) => {
      try {
        if (!event) {
          throw new Error('ERROR: No event defined!');
        }

        if (!event.website) event.website = null;
        if (!event.place_id) event.place_id = null;

        const timestamp = new Date();

        const res = await client.query(
          `INSERT INTO events (name, address, phones, website, main_photo, description,
              accessibility, dog_friendly, child_friendly, user_id, start_time, end_time, organizer,
              place_id, price, program, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            RETURNING id, name, address, phones, website, main_photo, description, accessibility,
              dog_friendly, child_friendly, user_id, start_time, end_time, organizer, place_id, price,
              program, created_at, updated_at;`,
          [
            event.name,
            event.address,
            event.phones,
            event.website,
            event.main_photo,
            event.description,
            event.accessibility,
            event.dog_friendly,
            event.child_friendly,
            event.user_id,
            event.start_time,
            event.end_time,
            event.organizer,
            event.place_id,
            event.price,
            event.program,
            timestamp,
            timestamp,
          ],
        );

        log.debug(res.rows[0], 'New event created:');
        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw checkError(err);
      }
    },

    getEvent: async (id) => {
      try {
        if (!id) {
          throw new Error('ERROR: No event id defined!');
        }

        const res = await client.query(
          `SELECT id, name, address, phones, website, description, accessibility, dog_friendly,
              child_friendly, start_time, end_time, organizer, place_id, price, program
            FROM events
            WHERE id = $1 AND moderated AND deleted_at IS NULL;`,
          [id],
        );

        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    getEvents: async (startTime, limit, page, filters) => {
      try {
        if (!startTime) {
          throw new Error('ERROR: No start_time defined!');
        }

        const {
          rows: [{ count }],
        } = await client.query(
          `SELECT COUNT(*) FROM events
            WHERE start_time > $1 AND start_time < $1 + $2 AND end_time > now()
              ${queryAccessibility(filters)} AND moderated AND deleted_at IS NULL;`,
          [new Date(startTime), EVENTS_PERIOD],
        );
        const total = Number(count);

        const offset = (page - 1) * limit;
        const { rows: events } = await client.query(
          `SELECT id, name, main_photo, start_time
            FROM events
            WHERE start_time > $1 AND start_time < $1 + $2 AND end_time > now()
              ${queryAccessibility(filters)} AND moderated AND deleted_at IS NULL
            ORDER BY start_time
            LIMIT $3 OFFSET $4;`,
          [new Date(startTime), EVENTS_PERIOD, limit, offset],
        );

        const res = {};
        res.events = events;
        res._total = total;
        res._totalPages = Math.ceil(total / limit);

        return res;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    getCurrentEvents: async (limit, page, filters) => {
      try {
        const {
          rows: [{ count }],
        } = await client.query(
          // start_time > TIMESTAMP 'today'
          `SELECT COUNT(*) FROM events
            WHERE end_time > now() AND end_time < TIMESTAMP 'tomorrow' AND start_time < now()
              ${queryAccessibility(filters)} AND moderated AND deleted_at IS NULL;`,
        );
        const total = Number(count);

        const offset = (page - 1) * limit;
        const { rows: events } = await client.query(
          `SELECT id, name, main_photo, start_time
            FROM events
            WHERE end_time > now() AND end_time < TIMESTAMP 'tomorrow' AND start_time < now()
              ${queryAccessibility(filters)} AND moderated AND deleted_at IS NULL
            ORDER BY start_time
            LIMIT $1 OFFSET $2;`,
          [limit, offset],
        );

        const res = {};
        res.events = events;
        res._total = total;
        res._totalPages = Math.ceil(total / limit);

        return res;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    isUserEvent: async (userId, eventId) => {
      try {
        if (!eventId) {
          throw new Error('ERROR: No eventId defined!');
        }

        const res = await client.query(
          `SELECT id
            FROM events
            WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL;`,
          [eventId, userId],
        );

        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    getUserEvents: async (userId, limit, page) => {
      try {
        if (!userId) {
          throw new Error('ERROR: No userId defined');
        }

        const {
          rows: [{ count }],
        } = await client.query(
          `SELECT COUNT(*) FROM events
            WHERE end_time > now() AND user_id = $1 AND deleted_at IS NULL;`,
          [userId],
        );
        const total = Number(count);

        const offset = (page - 1) * limit;
        const { rows: events } = await client.query(
          `SELECT id, name, main_photo, start_time
            FROM events
            WHERE end_time > now() AND user_id = $1 AND deleted_at IS NULL
            ORDER BY start_time
            LIMIT $2 OFFSET $3;`,
          [userId, limit, offset],
        );

        const res = {};
        res.events = events;
        res._total = total;
        res._totalPages = Math.ceil(total / limit);

        return res;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    getPlaceEvents: async (placeId, limit, page) => {
      try {
        if (!placeId) {
          throw new Error('ERROR: No placeId defined');
        }

        const {
          rows: [{ count }],
        } = await client.query(
          `SELECT COUNT(*) FROM events
            WHERE end_time > now() AND place_id = $1 AND moderated AND deleted_at IS NULL;`,
          [placeId],
        );
        const total = Number(count);

        const offset = (page - 1) * limit;
        const { rows: events } = await client.query(
          `SELECT id, name, main_photo, start_time
            FROM events
            WHERE end_time > now() AND place_id = $1 AND moderated AND deleted_at IS NULL
            ORDER BY start_time
            LIMIT $2 OFFSET $3;`,
          [placeId, limit, offset],
        );

        const res = {};
        res.events = events;
        res._total = total;
        res._totalPages = Math.ceil(total / limit);

        return res;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    updateEvent: async ({ id, ...event }) => {
      try {
        if (!id) {
          throw new Error('ERROR: No event id defined');
        }

        if (!Object.keys(event).length) {
          throw new Error('ERROR: Nothing to update');
        }

        event.updated_at = new Date();

        const query = [];
        const values = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const [i, [k, v]] of Object.entries(event).entries()) {
          query.push(`${k} = $${i + 1}`);
          values.push(v);
        }

        values.push(id);

        const res = await client.query(
          `UPDATE events SET ${query.join(', ')}
            WHERE id = $${values.length} AND deleted_at IS NULL
            RETURNING id, name, address, phones, website, main_photo, description, accessibility,
              dog_friendly, child_friendly, user_id, start_time, end_time, organizer, place_id,
              price, program, created_at, updated_at;`,
          values,
        );

        log.debug(res.rows[0], 'Event updated:');
        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw checkError(err);
      }
    },

    deleteEvent: async (id) => {
      try {
        if (!id) {
          throw new Error('ERROR: No event id defined');
        }
        // await client.query('DELETE FROM events WHERE id = $1;', [id]);
        await client.query('UPDATE events SET deleted_at = $1 WHERE id = $2;', [new Date(), id]);

        return true;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },
  };
};
