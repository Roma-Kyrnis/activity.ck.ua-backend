const { checkError } = require('../checkError');
const log = require('../../utils/logger')(__filename);

module.exports = (client) => {
  return {
    createOrganization: async ({ name, phones, email, user_id: userId }) => {
      try {
        if (!name) {
          throw new Error('ERROR: No organization name defined');
        }
        if (!email) {
          throw new Error('ERROR: No organization email defined');
        }
        if (!userId) {
          throw new Error('ERROR: No user_id defined');
        }

        // phones = `{${phones.map((p) => `"${p}"`).join(', ')}}`;

        const res = await client.query(
          `INSERT INTO organizations (name, phones, email, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id;`,
          [name, phones, email, userId],
        );

        log.debug(res.rows[0], 'New organization created:');
        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw checkError(err);
      }
    },

    getOrganizations: async (isModerated) => {
      try {
        const query =
          isModerated === undefined ? '' : `WHERE ${isModerated ? '' : 'NOT'} moderated`;

        const res = await client.query(
          `SELECT id, name, phones, email, moderated FROM organizations
            ${query};`,
        );

        return res.rows;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },

    updateOrganization: async ({ id, ...organization }) => {
      try {
        if (!id) {
          throw new Error('ERROR: No organization id defined');
        }

        if (!Object.keys(organization).length) {
          throw new Error('ERROR: Nothing to update');
        }

        /* if (organization.phones) {
          organization.phones = `{${organization.phones.map((p) => `"${p}"`).join(', ')}}`;
        } */

        const query = [];
        const values = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const [i, [k, v]] of Object.entries(organization).entries()) {
          query.push(`${k} = $${i + 1}`);
          values.push(v);
        }

        values.push(id);

        const res = await client.query(
          `UPDATE organizations SET ${query.join(', ')}
            WHERE id = $${values.length}
            RETURNING id, name, phones, email, user_id;`,
          values,
        );

        log.debug(res.rows[0], 'Organization updated:');
        return res.rows[0];
      } catch (err) {
        log.error(err.message || err);
        throw checkError(err);
      }
    },

    deleteOrganization: async (id) => {
      try {
        if (!id) {
          throw new Error('ERROR: No organization id defined');
        }
        await client.query('DELETE FROM organizations WHERE id = $1;', [id]);
        /* await client.query('UPDATE organizations SET deleted_at = $1 WHERE id = $2;', [
          new Date(),
          id,
        ]); */

        return true;
      } catch (err) {
        log.error(err.message || err);
        throw err;
      }
    },
  };
};
