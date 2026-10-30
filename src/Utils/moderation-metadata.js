const MESSAGE_WRAPPERS = Object.freeze([
    'ephemeralMessage',
    'viewOnceMessage',
    'viewOnceMessageV2',
    'viewOnceMessageV2Extension',
    'documentWithCaptionMessage',
    'editedMessage',
    'deviceSentMessage',
    'groupStatusMessage',
    'groupStatusMessageV2',
    'groupStatusMentionMessage',
    'statusMentionMessage',
    'associatedChildMessage'
])

const getInnerMessage = input => {
    let message = input?.message && typeof input.message === 'object' ? input.message : input
    const visited = new Set()
    while (message && typeof message === 'object' && !visited.has(message)) {
        visited.add(message)
        const wrapper = MESSAGE_WRAPPERS.find(key => message[key]?.message && typeof message[key].message === 'object')
        if (!wrapper) break
        message = message[wrapper].message
    }
    return message && typeof message === 'object' ? message : {}
}

const getContentType = message => {
    const keys = Object.keys(message || {})
    return keys.find(key => key.endsWith('Message') || key === 'conversation')
}

const parseExplicitDeviceId = jid => {
    if (typeof jid !== 'string') return undefined
    const match = jid.match(/:(\d+)@/)
    return match ? Number(match[1]) : undefined
}

const toUnixSeconds = value => {
    if (value instanceof Date) return Math.floor(value.getTime() / 1000)
    if (typeof value === 'number' && Number.isFinite(value)) return value > 1e12 ? Math.floor(value / 1000) : value
    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value)
        if (Number.isFinite(parsed)) return parsed > 1e12 ? Math.floor(parsed / 1000) : parsed
    }
    return undefined
}

const walkMessages = input => {
    const found = []
    let message = input?.message && typeof input.message === 'object' ? input.message : input
    const visited = new Set()
    while (message && typeof message === 'object' && !visited.has(message)) {
        visited.add(message)
        found.push(message)
        const wrapper = MESSAGE_WRAPPERS.find(key => message[key]?.message && typeof message[key].message === 'object')
        if (!wrapper) break
        message = message[wrapper].message
    }
    return found
}

export const isGroupStatusMessage = input => walkMessages(input).some(message =>
    Boolean(
        message.groupStatusMessage ||
        message.groupStatusMessageV2 ||
        message.groupStatusMentionMessage ||
        Object.values(message).some(value => value?.contextInfo?.isGroupStatus === true)
    )
)

export const isGroupStatusMention = input => walkMessages(input).some(message => Boolean(message.groupStatusMentionMessage))

export const getMessageModerationMetadata = input => {
    const source = input && typeof input === 'object' ? input : {}
    const key = source.key || {}
    const participant = key.participant || source.participant || undefined
    const remoteJid = key.remoteJid || source.remoteJid || undefined
    const message = getInnerMessage(source)
    const timestamp = toUnixSeconds(source.messageTimestamp ?? source.messageTimestampMs ?? source.timestamp)
    const isStatusBroadcast = remoteJid === 'status@broadcast'
    const isGroupStatus = isGroupStatusMessage(source)
    const isGroupStatusMentionMessage = isGroupStatusMention(source)
    return {
        id: key.id || source.id || undefined,
        remoteJid,
        participant,
        fromMe: typeof key.fromMe === 'boolean' ? key.fromMe : undefined,
        pushName: typeof source.pushName === 'string' ? source.pushName : undefined,
        messageTimestamp: timestamp,
        contentType: getContentType(message),
        isStatusBroadcast,
        isGroupStatus,
        isGroupStatusMention: isGroupStatusMentionMessage,
        senderDeviceId: parseExplicitDeviceId(participant),
        senderDeviceType: 'unknown'
    }
}
