const db = require('../data/knex')
const server = require('./server')
const request = require('supertest')

const red = { name: 'red', isPrimary: 1 }
const green = { name: 'green', isPrimary: 0 }
const blue = { name: 'blue', isPrimary: 1 }

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

describe('colors server', () => {
    describe('POST /api/colors', () => {
        test('responds with 201 and object for new color', async () => {
            const res = await request(server).post('/api/colors').send(red)
            
            expect(res.status).toBe(201)
            expect(res.body).toMatchObject({ ...red, id: 1 })
            expect(res.body.message).toBeUndefined()
        })

        test('responds with 500 and error message for existing color', async () => {
            let res = await request(server).post('/api/colors').send(red)
            res = await request(server).post('/api/colors').send(red)
            
            expect(res.status).toBe(500)
            expect(res.body.message).toBeDefined()
        })
    })

    describe('DELETE /api/colors/:id', () => {
        test('responds with 201 and deleted color for successful delete', async () => {
            let res = await request(server).post('/api/colors').send(red)
            res = await request(server).delete(`/api/colors/${res.body.id}`)

            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({ ...red, id: 1 })
            expect(res.body.message).toBeUndefined()

            res = await request(server).get('/api/colors')
            expect(Array.isArray(res.body))
            expect(res.body).toHaveLength(0)
        })

        test('responds with 404 and error message for non-existing color', async () => {
            const res = await request(server).delete(`/api/colors/1`)

            expect(res.status).toBe(404)
            expect(res.body).toMatchObject({ message: 'color not found' })
        })
    })

    describe('GET /api/colors', () => {
        test('responds with 200 and empty array on success with empty database', async () => {
            let res = await request(server).get('/api/colors')

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body))
            expect(res.body).toHaveLength(0)
            expect(res.body.message).toBeUndefined()
        })
        test('responds with 200 and colors array on success', async () => {
            await request(server).post('/api/colors').send(red)
            await request(server).post('/api/colors').send(green)
            await request(server).post('/api/colors').send(blue)

            let res = await request(server).get('/api/colors')
            expect(res.status).toBe(200)
            expect(Array.isArray(res.body))
            expect(res.body).toHaveLength(3)
            expect(res.body.message).toBeUndefined()
        })
    })

    describe('GET /api/colors/:id', () => {
        test('responds with 200 and color object on success', async () => {
            let res = await request(server).post('/api/colors').send(red)
            res = await request(server).get(`/api/colors/${res.body.id}`)

            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({ ...red, id: 1 })
            expect(res.body.message).toBeUndefined()
        })
        test('responds with 404 and error message for non-existing color', async () => {
            const res = await request(server).get(`/api/colors/1`)

            expect(res.status).toBe(404)
            expect(res.body).toMatchObject({ message: 'color not found' })
        })
    })

    describe('PUT /api/colors/:id', () => {
        test('responds with 200 and updated color object on success', async () => {
            let res = await request(server).post('/api/colors').send(red)
            res = await request(server).put(`/api/colors/${res.body.id}`).send({ name: 'orange' })

            expect(res.status).toBe(200)
            expect(res.body).toMatchObject({ ...red, id: 1, name: 'orange' })
            expect(res.body.message).toBeUndefined()
        })
        test('responds with 404 and error message for non-existing color', async () => {
            const res = await request(server).put('/api/colors/1').send({ name: 'orange' })

            expect(res.status).toBe(404)
            expect(res.body).toMatchObject({ message: 'color not found' })
        })
        test('responds with 500 and error message for non-unique name', async () => {
            await request(server).post('/api/colors').send(red)
            await request(server).post('/api/colors').send(green)
            const res = await request(server).put('/api/colors/1').send({ name: 'green' })

            expect(res.status).toBe(500)
            expect(res.body.message).toBeDefined()
        })
    })
})