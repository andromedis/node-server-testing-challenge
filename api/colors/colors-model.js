const db = require('../../data/knex')

function get() {
    return db('colors')
}

function getById(id) {
    return db('colors').where({ id }).first()
}

async function add(color) {
    const [ id ] = await db('colors').insert(color)
    return getById(id)
}

async function update(id, changes) {
    await db('colors').where({ id }).update(changes)
    return getById(id)
}

async function remove(id) {
    const color = await getById(id)
    await db('colors').where({ id }).del()
    return color
}

module.exports = {
    get,
    getById,
    add,
    update,
    remove
}