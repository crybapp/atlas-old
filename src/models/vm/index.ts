import StoredVM from '../../schemas/vm.schema'
import IVM from './defs'

import { sign } from 'jsonwebtoken'
import { generateAuthenticationCode, generateFlake } from '../../utils/generate.utils'

export default class VM {
	public id: string
	public createdAt: number

	public firstAuthenticatedAt: number
	public lastAuthenticatedAt: number

	public linked: boolean
	public connected: boolean
	public authenticationCode?: number

	public room: string
	public owner: string

	constructor(json?: IVM) {
		if (!json) return

		this.setup(json)
	}

	public load = (id: string) => new Promise<VM>(async (resolve, reject) => {
		try {
			const doc = await StoredVM.findOne({ 'info.id': id })
			if (!doc) throw 'VMNotFound'

			this.setup(doc)

			resolve(this)
		} catch (error) {
			reject(error)
		}
	})

	public loadFromAuthenticationCode = (code: number) => new Promise<VM>(async (resolve, reject) => {
		try {
			const doc = await StoredVM.findOne({ 'info.authenticationCode': code })
			if (!doc) throw 'VMNotFound'

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

					room: null,
					owner: userId
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
		if(this.linked)
			return reject('VMAlreadyLinked')

		try {
			await this.regenerateAuthenticationCode()

			resolve(this.updateLinkStatus(true))
		} catch (error) {
			reject(error)
		}
	})

	public unlink = () => new Promise<VM>(async (resolve, reject) => {
		try {
			resolve(await this.updateLinkStatus(false))
		} catch (error) {
			reject(error)
		}
	})

	public signToken = () => sign({ id: this.id, type: 'vm' }, process.env.JWT_KEY)

	public regenerateAuthenticationCode = () => new Promise<VM>(async (resolve, reject) => {
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
		this.authenticationCode = json.info.authenticationCode

		this.room = json.info.room
		this.owner = json.info.owner
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
}
