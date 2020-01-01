import { sign } from 'jsonwebtoken'

import StoredVM from '../../schemas/vm.schema'
import IVM from './defs'

import { VMNotFound } from '../../utils/errors.utils'
import { generateAuthenticationCode, generateFlake, generateVMName } from '../../utils/generate.utils'

export default class VM {
	public id: string
	public createdAt: number

	public firstAuthenticatedAt: number
	public lastAuthenticatedAt: number

	public linked: boolean
	public connected: boolean
	public authenticationCode?: number

	public owner: string
	public portal?: string

	public name: string

	constructor(json?: IVM) {
		if (!json) return

		this.setup(json)
	}

	public load = (id: string) => new Promise<VM>(async (resolve, reject) => {
		try {
			const doc = await StoredVM.findOne({ 'info.id': id })

			if (!doc)
				throw VMNotFound

			this.setup(doc)

			resolve(this)
		} catch (error) {
			reject(error)
		}
	})

	public loadFromAuthenticationCode = (code: number) => new Promise<VM>(async (resolve, reject) => {
		try {
			const doc = await StoredVM.findOne({ 'info.authenticationCode': code })

			if (!doc)
				throw VMNotFound

			this.setup(doc)

			resolve(this)
		} catch (error) {
			reject(error)
		}
	})

	public create = (userId: string) => new Promise<VM>(async (resolve, reject) => {
		try {
			const json: IVM = {
				info: {
					id: generateFlake(),
					createdAt: Date.now(),

					linked: false,
					connected: false,

					authenticationCode: generateAuthenticationCode(),

					owner: userId
				},
				data: {
					name: generateVMName()
				}
			}

			const stored = new StoredVM(json)
			await stored.save()

			this.setup(json)

			resolve(this)
		} catch (error) {
			reject(error)
		}
	})

	public link = () => new Promise<VM>(async (resolve, reject) => {
		if (this.linked)
			return reject('VMAlreadyLinked')

		try {
			await this.deleteAuthenticationCode()

			resolve(this.updateLinkStatus(true))
		} catch (error) {
			reject(error)
		}
	})

	public unlink = () => new Promise<VM>(async (resolve, reject) => {
		try {
			await this.regenerateAuthenticationCode()

			resolve(await this.updateLinkStatus(false))
		} catch (error) {
			reject(error)
		}
	})

	public signToken = () => sign({ id: this.id, type: 'vm' }, process.env.JWT_KEY)

	public destroy = () => new Promise(async (resolve, reject) => {
		try {
			await StoredVM.deleteOne({ 'info.id': this.id })

			resolve()
		} catch (error) {
			reject(error)
		}
	})

	public setup(json: IVM) {
		this.id = json.info.id
		this.createdAt = json.info.createdAt

		this.linked = json.info.linked
		this.connected = json.info.connected

		if (json.info.authenticationCode)
			this.authenticationCode = json.info.authenticationCode

		if (json.info.portal)
			this.portal = json.info.portal

		this.owner = json.info.owner

		this.name = json.data.name
	}

	private updateLinkStatus = (isLinked: boolean) => new Promise<VM>(async (resolve, reject) => {
		try {
			const update = {}

			update['info.linked'] = isLinked

			if (!isLinked)
				update['info.connected'] = false

			await StoredVM.updateOne({
				'info.id': this.id
			}, {
				$set: update
			})

			this.linked = isLinked

			resolve(this)
		} catch (error) {
			reject(error)
		}
	})

	private regenerateAuthenticationCode = () => new Promise<VM>(async (resolve, reject) => {
		try {
			const authenticationCode = generateAuthenticationCode()

			await StoredVM.updateOne({
				'info.id': this.id
			}, {
				$set: {
					'info.authenticationCode': authenticationCode
				}
			})

			this.authenticationCode = authenticationCode

			resolve(this)
		} catch (error) {
			reject(error)
		}
	})

	private deleteAuthenticationCode = () => new Promise<VM>(async (resolve, reject) => {
		try {
			await StoredVM.updateOne({
				'info.id': this.id
			}, {
				$unset: {
					'info.authenticationCode': ''
				}
			})

			delete this.authenticationCode

			resolve(this)
		} catch (error) {
			reject(error)
		}
	})
}
