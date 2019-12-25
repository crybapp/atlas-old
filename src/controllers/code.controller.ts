import express from 'express'
import { signToken } from '../utils/generate.utils'

const app = express()

app.post('/', async (req, res) => {
    const { code } = req.body,
            token = await signToken({ id: '123456', code })

    res.send({ id: 'xen-0', token })
})

export default app
