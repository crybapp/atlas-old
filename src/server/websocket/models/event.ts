type WSEventIncomingType = string
type WSEventIncomingMouseEventType = string

type WSEventEmittingType =  string

export type WSEventType = WSEventIncomingType | WSEventIncomingMouseEventType | WSEventEmittingType

export default interface WSEvent {
    op: number
    d: any
    t?: WSEventType
}
