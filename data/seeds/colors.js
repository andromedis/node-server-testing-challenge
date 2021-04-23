const seedData = [
    { name: 'red', isPrimary: 1 },
    { name: 'orange', isPrimary: 0 },
    { name: 'yellow', isPrimary: 1 }
]

function seed(knex) {
    // Deletes ALL existing entries
    return knex('colors').truncate()
        .then(function () {
            // Inserts seed entries
            return knex('colors').insert(seedData);
        });
}

module.exports = {
    seed,
    seedData
}