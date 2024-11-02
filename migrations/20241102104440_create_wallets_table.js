/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('wallets', function (table) {
        table.increments('id').primary();
        table.text('address').unique().notNullable();
        table.text('private_key').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('wallets');
};
