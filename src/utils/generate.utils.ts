import { sign, verify, SignOptions } from 'jsonwebtoken'

import FlakeId from 'flake-idgen'
import intformat from 'biguint-format'

const flake = new FlakeId({
    epoch: new Date(2000, 7, 25)
})

export const generateFlake = () => intformat(flake.next(), 'dec')
export const generateAuthenticationCode = () => Math.floor(100000 + Math.random() * 900000)

export const signToken = (data: any, headers: SignOptions = {}) => new Promise<string>((resolve, reject) => {
    try {
        const token = sign(data, process.env.JWT_KEY, headers)

        resolve(token)
    } catch(error) {
        console.error(error)
        
        reject(error)
    }
})

export const verifyToken = (token: string) => new Promise<any>((resolve, reject) => {
    try {
        const data = verify(token, process.env.JWT_KEY)

        resolve(data)
    } catch(error) {
        console.error(error)
        
        reject(error)
    }
})
