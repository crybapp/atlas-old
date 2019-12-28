import express from 'express'

import VM from '../models/vm'

import { handleError } from '../utils/errors.utils'
// import authenticate from '../utils/authenticate.utils'

const app = express()

app.post('/', async (req, res) => {
    const { code: _code } = req.body
    
    let code = parseInt(_code)
    if(!code) return res.sendStatus(406)

    try {
        const vm = await new VM().loadFromAuthenticationCode(code),
                token = vm.signToken()

        res.send({ id: vm.id, token, vm })
    } catch(error) {
        handleError(error, res)
    }
})

export default app
