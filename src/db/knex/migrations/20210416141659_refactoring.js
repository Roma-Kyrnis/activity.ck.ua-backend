exports.up = async (knex) => {
  await knex.schema.table('organizations', (table) => {
    table.timestamp('deleted_at').nullable();
  });

  await knex.schema.table('reviews', (table) => {
    table.renameColumn('review_text', 'comment');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable('photos', (table) => {
    table.string('url', 1024).notNullable().alter();
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable('photos', (table) => {
    table.string('url').notNullable().alter();
  });

  await knex.schema.table('reviews', (table) => {
    table.renameColumn('comment', 'review_text');
    table.dropColumn('created_at');
  });

  await knex.schema.table('organizations', (table) => {
    table.dropColumn('deleted_at');
  });
};
