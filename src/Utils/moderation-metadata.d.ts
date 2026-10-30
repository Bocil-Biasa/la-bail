import { proto } from '../../WAProto/index.js'

export interface MessageModerationMetadata {
    id?: string
    remoteJid?: string
    participant?: string
    fromMe?: boolean
    pushName?: string
    messageTimestamp?: number
    contentType?: string
    isStatusBroadcast: boolean
    isGroupStatus: boolean
    isGroupStatusMention: boolean
    senderDeviceId?: number
    senderDeviceType: 'unknown'
}

export declare function isGroupStatusMessage(input: proto.IWebMessageInfo | { message?: proto.IMessage } | proto.IMessage): boolean
export declare function isGroupStatusMention(input: proto.IWebMessageInfo | { message?: proto.IMessage } | proto.IMessage): boolean
export declare function getMessageModerationMetadata(input: proto.IWebMessageInfo | Record<string, any>): MessageModerationMetadata
