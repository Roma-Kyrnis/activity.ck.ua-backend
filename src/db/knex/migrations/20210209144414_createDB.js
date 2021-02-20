exports.up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('avatar').notNullable();
    table.string('password_hash').nullable();
    table.string('email').notNullable();
    table
      .enu('role', ['user', 'organizer', 'moderator'], {
        useNative: true,
        enumName: 'role_type',
      })
      .notNullable()
      .defaultTo('user');
    table.uuid('refresh_token').nullable();
    // table.boolean('banned').notNullable().defaultTo(false);
    table.timestamp('deleted_at').nullable();
    table.timestamps();
    table.unique('email', 'users_email_unk');
  });

  await knex.schema.createTable('organizations', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('phones').notNullable();
    table.string('email').notNullable();
    // table.string('address').notNullable();
    // table.text('description').notNullable();
    table.integer('user_id').notNullable();
    table.foreign('user_id', 'organizations_fk0').references('users.id');
  });

  await knex.schema.createTable('general_info', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('address').notNullable();
    // table.specificType('coordinates', 'POINT').notNullable();
    table.string('phones').nullable();
    table.string('website').nullable();
    table.string('main_photo').notNullable();
    table.text('description').notNullable();
    table.boolean('accessibility').notNullable().defaultTo(false);
    table.boolean('dog_friendly').notNullable().defaultTo(false);
    table.boolean('child_friendly').notNullable().defaultTo(false);
    table.integer('user_id').notNullable();
    table.boolean('moderated').notNullable().defaultTo(false);
    table.timestamp('deleted_at').nullable();
    table.timestamps();
    table.foreign('user_id', 'general_info_fk0').references('users.id');
  });

  await knex.schema.createTable('places', (table) => {
    table.increments('id');
    table.string('category_id').notNullable();
    table.string('type').nullable();
    table.json('work_time').notNullable();
    table.decimal('rating').notNullable().defaultTo(1.0);
    table.integer('organization_id').notNullable();
    table.foreign('organization_id', 'places_fk0').references('organizations.id');
    table.inherits('general_info');
  });

  await knex.schema.createTable('reviews', (table) => {
    // table.increments('id');
    table.integer('place_id').notNullable();
    table.integer('user_id').notNullable();
    table.integer('rating').notNullable();
    table.text('review_text').notNullable();
    table.foreign('place_id', 'reviews_fk0').references('places.id');
    table.foreign('user_id', 'reviews_fk1').references('users.id');
    table.primary(['place_id', 'user_id'], 'reviews_pkey');
  });

  await knex.schema.createTable('visited_places', (table) => {
    table.integer('place_id').notNullable();
    table.integer('user_id').notNullable();
    table.foreign('place_id', 'visited_places_fk0').references('places.id');
    table.foreign('user_id', 'visited_places_fk1').references('users.id');
    table.primary(['place_id', 'user_id'], 'visited_places_pkey');
  });

  await knex.schema.createTable('favorites_places', (table) => {
    table.integer('place_id').notNullable();
    table.integer('user_id').notNullable();
    table.foreign('place_id', 'favorites_places_fk0').references('places.id');
    table.foreign('user_id', 'favorites_places_fk1').references('users.id');
    table.primary(['place_id', 'user_id'], 'favorites_places_pkey');
  });

  await knex.schema.createTable('events', (table) => {
    table.increments('id');
    table.specificType('passing_time', 'INTERVAL').notNullable();
    table.string('organizer').notNullable();
    table.integer('place_id').nullable();
    table.decimal('price').notNullable().defaultTo(0.0);
    table.text('program').notNullable();
    table.foreign('place_id', 'events_fk0').references('places.id');
    table.foreign('user_id', 'events_fk1').references('users.id');
    table.inherits('general_info');
  });

  await knex.schema.createTable('chosen_events', (table) => {
    table.integer('event_id').notNullable();
    table.integer('user_id').notNullable();
    table.foreign('event_id', 'chosen_events_fk0').references('events.id');
    table.foreign('user_id', 'chosen_events_fk1').references('users.id');
    table.primary(['event_id', 'user_id'], 'chosen_events_pkey');
  });

  await knex.schema.createTable('photos', (table) => {
    table.increments('id');
    table.string('photo_url').notNullable();
    table.string('author_name').notNullable();
    table.string('author_link').nullable();
    table.integer('place_id').nullable();
    table.integer('event_id').nullable();
    table.foreign('place_id', 'photos_fk0').references('places.id');
    table.foreign('event_id', 'photos_fk1').references('events.id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('photos');
  await knex.schema.dropTable('chosen_events');
  await knex.schema.dropTable('events');
  await knex.schema.dropTable('favorites_places');
  await knex.schema.dropTable('visited_places');
  await knex.schema.dropTable('reviews');
  await knex.schema.dropTable('places');
  await knex.schema.dropTable('general_info');
  await knex.schema.dropTable('organizations');
  await knex.schema.dropTable('users');
  await knex.raw('DROP TYPE "role_type"');
};
