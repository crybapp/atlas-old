import { camelCase } from 'lodash'

import WebSocket from 'ws'

import WSEvent from './event'
import WSMessage from './message'

import client from '../../../config/redis.config'

import { WSLogPrefix } from '../log'
import log from '../../../utils/log.utils'
import { verifyToken } from '../../../utils/generate.utils'

type SocketConfigKey = 'id' | 'type' | 'user' | 'group' | 'authenticated' | 'last_heartbeat_at'
const socketKeys: SocketConfigKey[] = ['id', 'type', 'user', 'group', 'authenticated', 'last_heartbeat_at']

export default class WSSocket {
    id: string

    authenticated: boolean = false
    lastHeartbeatAt: number

    private socket: WebSocket

    constructor(socket: WebSocket) {
        this.socket = socket

        socketKeys.forEach(key => {
            if(socket[key])
                this[camelCase(key)] = socket[key]
        })
    }

    set(key: SocketConfigKey, value: any, save: boolean = true) {
        this.socket[key] = value
        this[camelCase(key)] = value

        if(save) this.save()
    }

    save() {
        const { id, authenticated, lastHeartbeatAt } = this
        if(!id) return

        client.hset('client_sessions', id, JSON.stringify({ id, authenticated, lastHeartbeatAt }))
    }

    send = (message: WSMessage) => this.socket.send(JSON.stringify(message.serialize()))

    private sendUndeliverableMessages = async () => {
        try {
            const _undelivered = await client.hget('undelivered_events', this.id)
            let undelivered: WSEvent[] = []

            if(_undelivered)
                undelivered = JSON.parse(_undelivered)

            undelivered.forEach((event, s) => this.socket.send(JSON.stringify({ ...event, s })))

            client.hset('undelivered_events', this.id, JSON.stringify([]))
        } catch(error) {
            console.error(error)
        }
    }
    
    authenticate = async (token: string) => {
        const { id }: { id: string } = await verifyToken(token).catch(console.error)

        // try {
        //     // Fetch user
        //     const user = await new User().load(id)
        //     if(!user) return 

        //     // Set user
        //     this.set('user', user)
    
        //     // Log update
        //     log(`Authenticated user ${user.name} (${user.id})`, [ WSLogPrefix, { content: 'auth', color: 'GREEN' }], 'CYAN')

        //     this.sendUndeliverableMessages()
        // } catch(error) {
        //     console.error(error)

        //     this.socket.close(1013)

        //     return error
        // }

        // const save = false

        // this.set('id', id, save)
        // this.set('last_heartbeat_at', Date.now(), save)
        // this.set('authenticated', true, save)

        // try {
        //     await client.sadd('connected_clients', id)
        // } catch(error) {
        //     console.error(error)
        // }

        // if(!save) this.save()
    }

    close = (code: number) => this.socket.close(code)
}
