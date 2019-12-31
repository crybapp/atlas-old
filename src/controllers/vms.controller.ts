import express from 'express'

import VM from '../models/vm'
import StoredVM from '../schemas/vm.schema'

import authenticate from '../utils/authenticate.utils'
import { handleError } from '../utils/errors.utils'
import { extractObjectId } from '../utils/helpers.utils'

const app = express()

app.get('/', authenticate, async (req, res) => {
	const userId = extractObjectId(req.user)

	try {
		const docs = await StoredVM.find({ 'info.owner': userId }),
			vms = docs.map(doc => new VM(doc))

		res.send(vms)
	} catch (error) {
		handleError(error, res)
	}
})

export default app
