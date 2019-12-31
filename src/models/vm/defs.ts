import { Document } from 'mongoose'

export default interface IVM {
	info: {
		id: string
		createdAt: number

		linked: boolean
		connected: boolean
		authenticationCode?: number

		room: string
		owner: string
	}
}

export interface IStoredVM extends IVM, Document { }