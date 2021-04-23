const db = require('../../data/knex')
const Colors = require('./colors-model')
const { seedData } = require('../../data/seeds/colors')

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db('colors').truncate()
})

afterAll(async () => {
    await db.destroy()
})

describe('setup correct: env & seeds', () => {
    test('correct env', () => {
        expect(process.env.DB_ENV).toBe('testing')
    })
    test('database initially empty', async () => {
        const database = await db('colors')
        expect(Array.isArray(database))
        expect(database).toHaveLength(0)
    })
    test('seed populates', async () => {
        await db.seed.run()
        const seedOutput = await db('colors')

        expect(seedOutput).toHaveLength(3)
        expect(seedOutput[0]).toMatchObject(seedData[0])
        expect(seedOutput[1]).toMatchObject(seedData[1])
        expect(seedOutput[2]).toMatchObject(seedData[2])
    })
})

describe('colors model', () => {
    describe('get functions', () => {
        test('get()', async () => {
            await db.seed.run()
            const data = await Colors.get()

            expect(Array.isArray(data))
            expect(data).toHaveLength(3)
        })

        test('getById(id)', async () => {
            await db.seed.run()
            const first = await Colors.getById(1)

            expect(typeof first).toBe('object')
            expect(typeof first).not.toBe('array')
            expect(first).toMatchObject({ id: first.id, ...seedData[0] })
        })
    })

    describe('add function', () => {
        test('adds object to database', async () => {
            await Colors.add(seedData[0])
            expect(await db('colors')).toHaveLength(1)
            await Colors.add(seedData[1])
            expect(await db('colors')).toHaveLength(2)
        })
        test('returns the object from the database', async () => {
            const output = await Colors.add(seedData[0])
            expect(output).toMatchObject({ id: output.id, ...seedData[0] })
        })
    })

    describe('update function', () => {
        test('database has same size after update', async () => {
            const color = await Colors.add(seedData[0])
            expect(await db('colors')).toHaveLength(1)
    
            await Colors.update(color.id, { name: 'blue' })
            expect(await db('colors')).toHaveLength(1)
        })
        test('database has updated object', async () => {
            const color = await Colors.add(seedData[0])
            expect(color.name).toEqual('red')
            
            await Colors.update(color.id, { name: 'blue' })
            expect(await db('colors').where('name', 'blue').first()).toBeDefined()
            expect(await db('colors').where('name', 'red').first()).toBeUndefined()

        })
        test('returns the object from the database', async () => {
            const color = await Colors.add(seedData[0])
            const updated = await Colors.update(color.id, { name: 'blue' })
            expect(updated).toMatchObject({ ...seedData[0], id: color.id, name: 'blue' })
        })
    })

    describe('remove function', () => {
        test('changes size of database', async () => {
            await db.seed.run()
            expect(await db('colors')).toHaveLength(3)
            
            await Colors.remove(1)
            expect(await db('colors')).toHaveLength(2)
            await Colors.remove(2)
            expect(await db('colors')).toHaveLength(1)
            await Colors.remove(3)
            expect(await db('colors')).toHaveLength(0)
        })
        test('returns the removed object', async () => {
            await db.seed.run()
            const removed = await Colors.remove(1)
            expect(removed).toBeDefined()
            expect(removed).toMatchObject({ ...seedData[0], id: removed.id })
        })
        test('removed object no longer in database', async () => {
            await db.seed.run()
            const removed = await Colors.remove(1)
            expect(await Colors.getById(removed.id)).toBeUndefined()
            expect(await db('colors').where('name', removed.name).first()).toBeUndefined()
        })
    })
})