import IVM from './defs'
import StoredVM from '../../schemas/vm.schema'

import { generateFlake, generateAuthenticationCode } from '../../utils/generate.utils'
import { sign } from 'jsonwebtoken'

export default class VM {
    id: string
    createdAt: number

    firstAuthenticatedAt: number
    lastAuthenticatedAt: number

    linked: boolean
    connected: boolean
    authenticationCode: number

    room: string
    owner: string

    constructor(json?: IVM) {
        if(!json) return
        
        this.setup(json)
    }

    load = (id: string) => new Promise<VM>(async (resolve, reject) => {
        try {
            const doc = await StoredVM.findOne({ 'info.id': id })
            if(!doc) throw 'VMNotFound'

            this.setup(doc)

            resolve(this)
        } catch(error) {
            reject(error)
        }
    })
    
    loadFromAuthenticationCode = (code: number) => new Promise<VM>(async (resolve, reject) => {
        try {
            const doc = await StoredVM.findOne({ 'info.authenticationCode': code })
            if(!doc) throw 'VMNotFound'

            this.setup(doc)

            resolve(this)
        } catch(error) {
            reject(error)
        }
    })

    create = (userId: string) => new Promise<VM>(async (resolve, reject) => {
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
        } catch(error) {
            reject(error)
        }
    })

    signToken = () => sign({ id: this.id, type: 'vm' }, process.env.JWT_KEY)

    regenerateAuthenticationCode = () => new Promise<VM>(async (resolve, reject) => {
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
        } catch(error) {
            reject(error)
        }
    })

    destroy = () => new Promise(async (resolve, reject) => {
        try {
            await StoredVM.deleteOne({ 'info.id': this.id })

            resolve()
        } catch(error) {
            reject(error)
        }
    })

    setup(json: IVM) {
        this.id = json.info.id
        this.createdAt = json.info.createdAt

        this.linked = json.info.linked
        this.connected = json.info.connected

        this.room = json.info.room
        this.owner = json.info.owner
    }
}