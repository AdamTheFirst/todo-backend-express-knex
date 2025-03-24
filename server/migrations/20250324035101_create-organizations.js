
exports.up = function(knex) {
  return knex.schema.createTable("organizations", table => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.string("invite_code").unique();
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("organizations");
};
