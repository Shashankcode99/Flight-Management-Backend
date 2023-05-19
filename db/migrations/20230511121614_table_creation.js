/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("phone").notNullable();
    table.string("address");
    table.boolean("isadmin");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("routes", function (table) {
    table.increments("id").primary();
    table.string("origin");
    table.string("destination");
    table.string("departure_airport");
    table.string("arrival_airport");
    table.float("distance");
    table.string("travel_time");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("flights", function (table) {
    table.increments("id").primary();
    table.integer("flight_number");
    table.string("airline_name");
    table.integer("route_id").unsigned();
    table.foreign("route_id").references("routes.id");
    table.dateTime("departure_time");
    table.dateTime("arrival_time");
    table.integer("total_seats");
    table.integer("remaining_seats");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("seatings", function (table) {
    table.increments("id").primary();
    table.integer("flight_id").unsigned();
    table.foreign("flight_id").references("flights.id");
    table.integer("seat_number");
    table.boolean("is_booked");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("bookings", function (table) {
    table.increments("id").primary();
    table.integer("flight_id").unsigned();
    table.foreign("flight_id").references("flights.id");
    table.integer("users_id").unsigned();
    table.foreign("users_id").references("users.id");
    table.integer("seat_number");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("users");
  await knex.schema.dropTable("routes");
  await knex.schema.dropTable("flights");
  await knex.schema.dropTable("seatings");
  await knex.schema.dropTable("bookings");
};
