import express from 'express'

const app = express()

app.get('/', (req, res) => res.send({
    instance: process.env.BASE_INSTANCE_URL,
    origin: process.env.PORTAL_GIT_ORIGIN
}))

export default app
