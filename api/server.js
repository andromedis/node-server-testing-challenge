const express = require('express')
const Colors = require('./colors/colors-model')

const server = express()
server.use(express.json())

server.post('/api/colors', async (req, res) => {
    try {
        const color = await Colors.add(req.body)
        res.status(201).json(color)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

server.delete('/api/colors/:id', async (req, res) => {
    try {
        const deleted = await Colors.remove(req.params.id)
        const [status, json] = deleted ? [200, deleted] : [404, { message: `color not found`}]
        res.status(status).json(json)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})


server.get('/api/colors', async (req, res) => {
    try {
        const colors = await Colors.get()
        res.status(200).json(colors)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

server.get('/api/colors/:id', async (req, res) => {
    try {
        const color = await Colors.getById(req.params.id)
        const [status, json] = color ? [200, color] : [404, { message: `color not found`}]
        res.status(status).json(json)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

server.put('/api/colors/:id', async (req, res) => {
    try {
        const updated = await Colors.update(req.params.id, req.body)
        const [status, json] = updated ? [200, updated] : [404, { message: 'color not found' }]
        res.status(status).json(json)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = server