import Chance from 'chance'
import { sign, SignOptions, verify } from 'jsonwebtoken'

import intformat from 'biguint-format'
import FlakeId from 'flake-idgen'

const flake = new FlakeId({
	epoch: new Date(2000, 7, 25)
})

const chance = new Chance()

export const generateFlake = () => intformat(flake.next(), 'dec')
export const generateAuthenticationCode = () => Math.floor(100000 + Math.random() * 900000)

export const generateVMName = (): string => {
	const words = []

	for (let i = 0; i < 4; i++)
		words.push(chance.word({ length: 3 }))

	return [
		words.slice(0, 2).join(''),
		words.slice(2, 4).join('')
	].join('-')
}

export const signToken = (data: any, headers: SignOptions = {}) => new Promise<string>((resolve, reject) => {
	try {
		const token = sign(data, process.env.JWT_KEY, headers)

		resolve(token)
	} catch (error) {
		console.error(error)

		reject(error)
	}
})

export const verifyToken = (token: string) => new Promise<any>((resolve, reject) => {
	try {
		const data = verify(token, process.env.JWT_KEY)

		resolve(data)
	} catch (error) {
		console.error(error)

		reject(error)
	}
})
