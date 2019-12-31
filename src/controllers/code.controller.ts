import express from 'express'

import VM from '../models/vm'

import { handleError } from '../utils/errors.utils'

const app = express()

app.post('/', async (req, res) => {
	const { code: _code } = req.body

	const code = parseInt(_code)

	if (!code)
		return res.sendStatus(406)

	try {
		const vm = await new VM().loadFromAuthenticationCode(code),
			token = vm.signToken()

		await vm.link()

		res.send({ id: vm.id, token, vm })
	} catch (error) {
		handleError(error, res)
	}
})

export default app
