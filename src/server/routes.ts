import { Application } from 'express'

export default (app: Application) => {
    app.use('/status', require('../controllers/status.controller').default)
    
    app.use('/code', require('../controllers/code.controller').default)
}
