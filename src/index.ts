import server from './server'
import log from './utils/log.utils'

const port = process.env.PORT || 6000
server.listen(port, () => log(`Listening on :${port}`, 'web'))