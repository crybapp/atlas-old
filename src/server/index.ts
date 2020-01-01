import dotenv from 'dotenv'
dotenv.config()

import { createServer } from 'http'

import Mesa from '@cryb/mesa'
import express, { json } from 'express'

import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { connect } from 'mongoose'

import routes from './routes'
import websocket from './websocket'
// import passport from '../config/passport.config'

const app = express()
const server = createServer(app)

const mesa = new Mesa({
	server,
	namespace: 'atlas',

	heartbeat: {
		enabled: true,
		interval: 10000,
		maxAttempts: 3
	},
	reconnect: {
		enabled: true,
		interval: 5000
	}
})

connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })

app.use(helmet())

app.use(cors())
app.use(json())
app.use(morgan('dev'))
// app.use(passport.initialize())

routes(app)
websocket(mesa)

export default server
