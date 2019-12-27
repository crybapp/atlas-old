import axios from 'axios'
import { Request, Response, NextFunction } from 'express'
import { handleError } from './errors.utils'

const authenticate = (token: string) => new Promise(async (resolve, reject) => {
    try {
        const user = await axios.post(`${process.env.AUTH_BASE_URL}`, { token })

        resolve(user)
    } catch(error) {
        reject(error)
    }
})

export default async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization) return res.status(401)

    try {
        const token = req.headers.authorization.split(' ')[1],
                user = await authenticate(token)

        req.user = user

        next()
    } catch(error) {
        handleError(error, res)
    }
}