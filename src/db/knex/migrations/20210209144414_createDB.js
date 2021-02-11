exports.up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('avatar').notNullable();
    table.string('password_hash').notNullable();
    table.string('email').notNullable();
    table
      .enu('role', ['user', 'organizer', 'moderator'], {
        useNative: true,
        enumName: 'role_type',
      })
      .notNullable()
      .defaultTo('user');
    table.uuid('refresh_token').nullable();
    table.timestamp('deleted_at').nullable();
    table.timestamps();
    table.unique('email', 'users_email_unk');
  });

  await knex.schema.createTable('places', (table) => {
    table.increments('id');
    table.string('category_id').notNullable();
    table.string('type').nullable();
    table.string('name').notNullable();
    table.string('phone').nullable();
    table.string('address').notNullable();
    table.string('website').nullable();
    table.json('work_time').notNullable();
    table.boolean('accessibility').notNullable().defaultTo(false);
    table.boolean('dog_friendly').notNullable().defaultTo(false);
    table.boolean('child_friendly').notNullable().defaultTo(false);
    table.text('about_info').notNullable();
    table.decimal('rating').notNullable().defaultTo(1.0);
    table.timestamp('deleted_at').nullable();
    table.timestamps();
    table.integer('user_id').notNullable();
    table.integer('moderated').nullable();
    table.foreign('user_id', 'places_fk0').references('users.id');
    table.foreign('moderated', 'places_fk1').references('users.id');
  });

  await knex.schema.createTable('places_photos', (table) => {
    table.increments('id');
    table.integer('place_id').notNullable();
    table.string('url').notNullable();
    table.foreign('place_id', 'places_photos_fk0').references('places.id');
  });

  await knex.schema.createTable('reviews', (table) => {
    table.increments('id');
    table.integer('place_id').notNullable();
    table.integer('user_id').notNullable();
    table.integer('rating').notNullable();
    table.text('review_text').notNullable();
    table.foreign('place_id', 'reviews_fk0').references('places.id');
    table.foreign('user_id', 'reviews_fk1').references('users.id');
  });

  await knex.schema.createTable('users_activity_places', (table) => {
    table.increments('id');
    table.integer('place_id').notNullable();
    table.integer('user_id').notNullable();
    table.boolean('visited').notNullable().defaultTo(false);
    table.boolean('chosen').notNullable().defaultTo(false); // selected
    table.foreign('place_id', 'users_activity_places_fk0').references('places.id');
    table.foreign('user_id', 'users_activity_places_fk1').references('users.id');
  });

  await knex.schema.createTable('events', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('address').notNullable();
    table.date('date').notNullable();
    table.time('time').notNullable();
    table.string('organizer').notNullable();
    table.integer('place_id').nullable();
    table.string('phone').notNullable();
    table.string('website').nullable();
    table.boolean('accessibility').notNullable().defaultTo(false);
    table.boolean('dog_friendly').notNullable().defaultTo(false);
    table.decimal('price').notNullable().defaultTo(0.0);
    table.text('about_info').notNullable();
    table.text('program').notNullable();
    table.integer('likes').notNullable().defaultTo(0);
    table.integer('dislikes').notNullable().defaultTo(0);
    table.timestamp('deleted_at').nullable();
    table.timestamps();
    table.integer('user_id').notNullable();
    table.integer('moderated').nullable();
    table.foreign('place_id', 'events_fk0').references('places.id');
    table.foreign('user_id', 'events_fk1').references('users.id');
    table.foreign('moderated', 'events_fk2').references('users.id');
  });

  await knex.schema.createTable('events_photos', (table) => {
    table.increments('id');
    table.integer('event_id').notNullable();
    table.string('url').notNullable();
    table.foreign('event_id', 'events_photos_fk0').references('events.id');
  });

  await knex.schema.createTable('users_activity_events', (table) => {
    table.increments('id');
    table.integer('event_id').notNullable();
    table.integer('user_id').notNullable();
    table.boolean('visited').notNullable().defaultTo(false);
    table.boolean('like').notNullable().defaultTo(false);
    table.boolean('dislike').notNullable().defaultTo(false);
    table.foreign('event_id', 'users_activity_events_fk0').references('events.id');
    table.foreign('user_id', 'users_activity_events_fk1').references('users.id');
  });

  await knex.raw(`ALTER TABLE "users_activity_events"
    ADD CONSTRAINT "users_activity_events_like_check" CHECK(NOT ("like" AND "dislike"))`);
};

exports.down = async (knex) => {
  await knex.schema.dropTable('users_activity_events');
  await knex.schema.dropTable('events_photos');
  await knex.schema.dropTable('events');
  await knex.schema.dropTable('users_activity_places');
  await knex.schema.dropTable('reviews');
  await knex.schema.dropTable('places_photos');
  await knex.schema.dropTable('places');
  await knex.schema.dropTable('users');
  await knex.raw('DROP TYPE "role_type"');
};
