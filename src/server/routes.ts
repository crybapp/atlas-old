import { Application } from 'express'

export default (app: Application) => {
		app.use('/vm', require('../controllers/vm.controller').default)
		app.use('/vms', require('../controllers/vms.controller').default)

		app.use('/code', require('../controllers/code.controller').default)
		app.use('/status', require('../controllers/status.controller').default)
}
