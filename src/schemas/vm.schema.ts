import { Schema, model } from 'mongoose'

import { IStoredVM } from '../models/vm/defs'

const VMSchema = new Schema({
    info: {
        id: String,
        createdAt: String,

        linked: Boolean,
        connected: Boolean,
        authenticationCode: Number,

        room: String,
        owner: String
    }
})

const StoredVM = model<IStoredVM>('VM', VMSchema)
export default StoredVM