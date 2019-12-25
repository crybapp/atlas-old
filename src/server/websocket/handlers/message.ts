import WSEvent from '../models/event'
import WSSocket from '../models/socket'
import WSMessage from '../models/message'

import logMessage from '../log'

export default async (message: WSEvent, socket: WSSocket) => {
    const { op, d, t } = message
    logMessage(message)

    if(op === 1) { // Heartbeat
        socket.set('last_heartbeat_at', Date.now())
        socket.send(new WSMessage(11, {}))
    } else if(op === 2) { // Identify
        const { token } = d

        socket.authenticate(token)
    }
}
