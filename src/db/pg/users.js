const { checkError } = require('../checkError');
const log = require('../../utils/logger')(__filename);

module.exports = (client) => {
  return {
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
          [name, avatar, email, passwordHash || null, timestamp, timestamp],
        );

        log.debug(res.rows[0], 'New user created:');
        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw checkError(err);
      }
    },

    getUser: async (id) => {
      try {
        if (!id) {
          throw new Error('ERROR: No user id defined');
        }

        const res = await client.query(
          `SELECT id, name, avatar FROM users
            WHERE id = $1 AND deleted_at IS NULL;`,
          [id],
        );

        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    checkUser: async (email) => {
      try {
        const res = await client.query(
          `SELECT id FROM users
            WHERE email = $1;`,
          [email],
        );

        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    getUserCredentials: async (email) => {
      try {
        if (!email) {
          throw new Error('ERROR: No user email defined');
        }

        const res = await client.query(
          `SELECT id, email, password_hash, role FROM users
            WHERE email = $1 AND deleted_at IS NULL;`,
          [email],
        );

        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    getUserToken: async (id) => {
      try {
        if (!id) {
          throw new Error('ERROR: No user id defined');
        }

        const res = await client.query(
          `SELECT refresh_token FROM users
            WHERE id = $1 AND deleted_at IS NULL;`,
          [id],
        );

        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
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

        log.debug(res.rows[0], 'User updated:');
        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
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
        log.error(err.message || err);
        throw err;
      }
    },
  };
};
