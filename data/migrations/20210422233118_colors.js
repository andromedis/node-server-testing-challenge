exports.up = function(knex) {
    return knex.schema.createTable('colors', table => {
        table.increments()
        table.text('name', 128).unique().notNullable()
        table.boolean('isPrimary')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('colors')
};
