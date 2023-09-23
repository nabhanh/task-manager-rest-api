import {
  integer,
  pgTable,
  primaryKey,
  text,
  uniqueIndex
} from 'drizzle-orm/pg-core';

const ForeignKeyAction = {
  onUpdate: 'cascade' as const,
  onDelete: 'cascade' as const
};

export const user = pgTable(
  'user',
  {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    phone: text('phone').notNull(),
    password: text('password').notNull(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull()
  },
  users => ({
    emailIdx: uniqueIndex('email_idx').on(users.email)
  })
);

export const theatre = pgTable('theatre', {
  theatre_id: integer('theatre_id').primaryKey(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pincode: integer('pincode').notNull(),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull()
});

export const movie = pgTable('movie', {
  movie_id: integer('movie_id').primaryKey(),
  name: text('name').notNull(),
  language: text('language').notNull(),
  duration: integer('duration').notNull(),
  release_date: text('release_date').notNull(),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull()
});

export const movie_theatre = pgTable(
  'movie_theatre',
  {
    movie_id: integer('movie_id').notNull(),
    theatre_id: integer('theatre_id').notNull(),
    created_at: text('created_at').notNull(),
    updated_at: text('updated_at').notNull()
  },
  movie_theatre => ({
    movie_theatre_pk: uniqueIndex('movie_theatre_pk').on(
      movie_theatre.movie_id,
      movie_theatre.theatre_id
    )
  })
);

export const screen = pgTable('screen', {
  screen_id: integer('screen_id').primaryKey(),
  name: text('name').notNull(),
  theatre_id: integer('theatre_id')
    .notNull()
    .references(() => theatre.theatre_id, ForeignKeyAction),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull()
});

export const movie_screening = pgTable(
  'movie_screening',
  {
    movie_id: integer('movie_id')
      .notNull()
      .references(() => movie.movie_id, ForeignKeyAction),
    screen_id: integer('screen_id')
      .notNull()
      .references(() => screen.screen_id, ForeignKeyAction),
    start_time: text('start_time').notNull(),
    end_time: text('end_time').notNull(),
    custom_repeat: text('custom_repeat'),
    created_at: text('created_at').notNull(),
    updated_at: text('updated_at').notNull()
  },
  movie_screening => ({
    pk: primaryKey(movie_screening.movie_id, movie_screening.screen_id)
  })
);
