import { model, Schema } from 'mongoose'

import { IStoredVM } from '../models/vm/defs'

const VMSchema = new Schema({
	info: {
		id: String,
		createdAt: Number,

		linked: Boolean,
		connected: Boolean,
		authenticationCode: Number,

		owner: String,
		portal: String
	},
	data: {
		name: String
	}
})

const StoredVM = model<IStoredVM>('VM', VMSchema)
export default StoredVM
