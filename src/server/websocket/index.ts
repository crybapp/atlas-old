import Mesa from '@cryb/mesa'

import axios from 'axios'

export default (mesa: Mesa) => {
    mesa.on('connection', client => {
        console.log('Client connected')

        client.authenticate(async ({ token }, done) => {
            try {
                const { data: user } = await axios.post(process.env.AUTH_BASE_URL, { token }), { type, info: { id } } = user
                if(type !== 'vm') return client.disconnect(1008)

                console.log('Client with id', id, 'authenticated')
                done(null, { id: id, user })
            } catch(error) {
                done(error)
            }
        })

        client.on('message', message => {
            console.log('Recieved message from', client.id || 'unauthorized', message.serialize())
        })

        client.on('disconnect', () => {
            console.log('Client disconnected')
        })
    })
}