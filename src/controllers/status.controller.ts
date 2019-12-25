import express from 'express'

const app = express()

app.get('/', (req, res) => res.send({
	instance: 'cryb.app',
    origin: 'https://github.com/crybapp/xen'
}))

export default app
