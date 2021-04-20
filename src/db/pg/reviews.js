/* eslint-disable no-underscore-dangle */
const { checkError } = require('../checkError');
const log = require('../../utils/logger')(__filename);

module.exports = (client) => {
  return {
    upsertReview: async ({ place_id: placeId, user_id: userId, rating, comment }) => {
      try {
        if (!userId) {
          throw new Error('ERROR: No user_id defined');
        }

        const res = await client.query(
          `INSERT INTO reviews (place_id, user_id, rating, comment)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (place_id, user_id)
            DO UPDATE SET rating = $3, comment = $4, created_at = now()
            RETURNING *;`,
          [placeId, userId, rating, comment],
        );

        // place ratings calculation:
        await client.query(
          `WITH average AS (SELECT AVG(rating) FROM reviews WHERE place_id =$1)
            UPDATE places
            SET rating = (SELECT avg FROM average),
              popularity_rating = (SELECT avg FROM average)
                + log(1 + (SELECT COUNT(*) FROM reviews WHERE place_id =$1))
                + log(1 + (SELECT COUNT(*) FROM visited_places WHERE place_id =$1))
            WHERE id = $1;`,
          [placeId],
        );

        log.debug(res.rows[0], 'New review created or updated:');
        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw checkError(err);
      }
    },

    getReviews: async (placeId, limit, page) => {
      try {
        if (!placeId) throw new Error('ERROR: No placeId defined');

        const {
          rows: [{ count }],
        } = await client.query(
          `SELECT COUNT(*)
            FROM reviews
            WHERE place_id =$1;`,
          [placeId],
        );
        const total = Number(count);

        const offset = (page - 1) * limit;
        const { rows: reviews } = await client.query(
          `SELECT r.rating, r.comment, r.created_at, u.name AS user_name, u.avatar AS user_avatar
            FROM reviews AS r
            JOIN users AS u ON u.id = r.user_id
            WHERE place_id =$1
            ORDER BY r.created_at DESC
            LIMIT $2 OFFSET $3;`,
          [placeId, limit, offset],
        );

        const res = {};
        res.reviews = reviews;
        res._total = total;
        res._totalPages = Math.ceil(total / limit);

        return res;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    updateReview: async ({ place_id: placeId, user_id: userId, ...review }) => {
      try {
        if (!placeId || !userId) {
          throw new Error('ERROR: No placeId or userId defined');
        }

        if (!Object.keys(review).length) {
          throw new Error('ERROR: Nothing to update');
        }

        const query = [];
        const values = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const [i, [k, v]] of Object.entries(review).entries()) {
          query.push(`${k} = $${i + 1}`);
          values.push(v);
        }

        values.push(placeId, userId);

        const res = await client.query(
          `UPDATE reviews SET ${query.join(', ')}
            WHERE place_id = $${values.length - 1} AND user_id = $${values.length}
            RETURNING place_id, user_id, rating, comment, created_at;`,
          values,
        );

        log.debug(res.rows[0], 'Review updated:');
        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw checkError(err);
      }
    },

    deleteReview: async (placeId, userId) => {
      try {
        if (!placeId || !userId) {
          throw new Error('ERROR: No placeId or userId defined');
        }

        await client.query('DELETE FROM reviews WHERE place_id = $1 AND user_id = $2;', [
          placeId,
          userId,
        ]);

        return true;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },
  };
};
