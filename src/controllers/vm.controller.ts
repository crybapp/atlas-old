import express from 'express'

import VM from '../models/vm'

import authenticate from '../utils/authenticate.utils'
import { handleError } from '../utils/errors.utils'
import { extractObjectId, extractObjectType } from '../utils/helpers.utils'

const app = express()

/**
 * Create VM
 */
app.post('/create', authenticate, async (req, res) => {
	const userId = extractObjectId(req.user)

	try {
		const vm = await new VM().create(userId)

		res.send(vm)
	} catch (error) {
		handleError(error, res)
	}
})

/**
 * Unlink VM via Xen token
 */
app.post('/unlink', authenticate, async (req, res) => {
	const type = extractObjectType(req.user)

	if (type !== 'vm')
		return res.sendStatus(401)

	try {
		const vm = await new VM().load(extractObjectId(req.user))
		await vm.unlink()

		res.sendStatus(200)
	} catch (error) {
		handleError(error, res)
	}
})

/**
 * Unlink VM via User token
 */
app.post('/:id/unlink', authenticate, async (req, res) => {
	const type = extractObjectType(req.user)

	if (type !== 'user')
		return res.sendStatus(401)

	const { id } = req.params

	try {
		const vm = await new VM().load(id)
		await vm.unlink()

		res.sendStatus(200)
	} catch (error) {
		handleError(error, res)
	}
})

/**
 * Delete VM via User token
 */
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
