import express from 'express'

import VM from '../models/vm'

import authenticate from '../utils/authenticate.utils'
import { handleError } from '../utils/errors.utils'
import { extractObjectId } from '../utils/generate.utils'

const app = express()

app.post('/create', authenticate, async (req, res) => {
		const userId = extractObjectId(req.user)

		try {
				const vm = await new VM().create(userId)

				res.send(vm)
		} catch (error) {
				handleError(error, res)
		}
})

app.delete('/:id', authenticate, async (req, res) => {
		const { id } = req.params

		try {
				const vm = await new VM().load(id)
				await vm.destroy()

				res.sendStatus(200)
		} catch (error) {
				handleError(error, res)
		}
})

export default app
