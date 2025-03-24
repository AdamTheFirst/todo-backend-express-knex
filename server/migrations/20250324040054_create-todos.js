exports.up = function (knex) {
  return knex.schema.createTable("todos", function (table) {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.integer("order");
    table.boolean("completed").defaultTo(false);

    table
      .integer("organization_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("organizations")
      .onDelete("CASCADE");

    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    table
      .integer("project_id")
      .unsigned()
      .references("id")
      .inTable("projects")
      .onDelete("SET NULL");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("todos");
};
