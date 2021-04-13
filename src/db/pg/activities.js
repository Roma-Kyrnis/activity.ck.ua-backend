/* eslint-disable no-underscore-dangle */
const log = require('../../utils/logger')(__filename);
const { checkError } = require('../checkError');

module.exports = (client) => {
  return {
    addFavoritePlace: async (placeId, userId) => {
      try {
        const res = await client.query(
          `INSERT INTO favorite_places (place_id, user_id)
            VALUES ($1, $2)
            RETURNING *;`,
          [placeId, userId],
        );

        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw checkError(err);
      }
    },

    addVisitedPlace: async (placeId, userId) => {
      try {
        const res = await client.query(
          `INSERT INTO visited_places (place_id, user_id)
            VALUES ($1, $2)
            RETURNING *;`,
          [placeId, userId],
        );

        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw checkError(err);
      }
    },

    addScheduledEvent: async (eventId, userId) => {
      try {
        const res = await client.query(
          `INSERT INTO scheduled_events (event_id, user_id)
            VALUES ($1, $2)
            RETURNING *;`,
          [eventId, userId],
        );

        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw checkError(err);
      }
    },

    getFavoritePlaces: async (userId, limit, page) => {
      try {
        const {
          rows: [{ count }],
        } = await client.query(
          `SELECT COUNT(*)
            FROM places
            JOIN favorite_places AS f ON f.place_id = places.id
            WHERE f.user_id = $1 AND deleted_at IS NULL;`,
          [userId],
        );
        const total = Number(count);

        const offset = (page - 1) * limit;
        const { rows: places } = await client.query(
          `SELECT id, name, address, phones, website, main_photo, work_time, rating, organization_id
            FROM places
            JOIN favorite_places AS f ON f.place_id = places.id
            WHERE f.user_id = $1 AND deleted_at IS NULL
            ORDER BY popularity_rating DESC, id DESC
            LIMIT $2 OFFSET $3;`,
          [userId, limit, offset],
        );

        const res = {};
        res.places = places;
        res._total = total;
        res._totalPages = Math.ceil(total / limit);

        return res;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    getVisitedPlaces: async (userId, limit, page) => {
      try {
        const {
          rows: [{ count }],
        } = await client.query(
          `SELECT COUNT(*)
            FROM places
            JOIN visited_places AS v ON v.place_id = places.id
            WHERE v.user_id = $1 AND deleted_at IS NULL;`,
          [userId],
        );
        const total = Number(count);

        const offset = (page - 1) * limit;
        const { rows: places } = await client.query(
          `SELECT id, name, address, phones, website, main_photo, work_time, rating, organization_id
            FROM places
            JOIN visited_places AS v ON v.place_id = places.id
            WHERE v.user_id = $1 AND deleted_at IS NULL
            ORDER BY popularity_rating DESC, id DESC
            LIMIT $2 OFFSET $3;`,
          [userId, limit, offset],
        );

        const res = {};
        res.places = places;
        res._total = total;
        res._totalPages = Math.ceil(total / limit);

        return res;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    getScheduledEvents: async (userId, limit, page) => {
      try {
        const {
          rows: [{ count }],
        } = await client.query(
          `SELECT COUNT(*)
            FROM events
            JOIN scheduled_events AS s ON s.event_id = events.id
            WHERE end_time > now() AND s.user_id = $1 AND deleted_at IS NULL;`,
          [userId],
        );
        const total = Number(count);

        const offset = (page - 1) * limit;
        const { rows: events } = await client.query(
          `SELECT id, name, main_photo, start_time
            FROM events
            JOIN scheduled_events AS s ON s.event_id = events.id
            WHERE end_time > now() AND s.user_id = $1 AND deleted_at IS NULL
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

    detachFavoritePlace: async (placeId, userId) => {
      try {
        await client.query(
          `DELETE FROM favorite_places
            WHERE place_id = $1 AND user_id = $2;`,
          [placeId, userId],
        );

        return true;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    detachVisitedPlace: async (placeId, userId) => {
      try {
        await client.query(
          `DELETE FROM visited_places
            WHERE place_id = $1 AND user_id = $2;`,
          [placeId, userId],
        );

        return true;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    detachScheduledEvent: async (eventId, userId) => {
      try {
        await client.query(
          `DELETE FROM scheduled_events
            WHERE event_id = $1 AND user_id = $2;`,
          [eventId, userId],
        );

        return true;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },
  };
};
