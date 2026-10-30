import test from 'node:test'
import assert from 'node:assert/strict'
import { getMessageModerationMetadata, isGroupStatusMessage, isGroupStatusMention } from '../src/Utils/moderation-metadata.js'

test('moderation metadata extracts ordinary group message fields without guessing device type', () => {
    const metadata = getMessageModerationMetadata({
        key: { id: 'msg-1', remoteJid: '123@g.us', participant: '12345:7@s.whatsapp.net', fromMe: false },
        pushName: 'Sender',
        messageTimestamp: 1_800_000_000,
        message: { conversation: 'hello' }
    })
    assert.deepEqual(metadata, {
        id: 'msg-1',
        remoteJid: '123@g.us',
        participant: '12345:7@s.whatsapp.net',
        fromMe: false,
        pushName: 'Sender',
        messageTimestamp: 1_800_000_000,
        contentType: 'conversation',
        isStatusBroadcast: false,
        isGroupStatus: false,
        isGroupStatusMention: false,
        senderDeviceId: 7,
        senderDeviceType: 'unknown'
    })
})

test('moderation metadata recognizes group status wrappers through common wrappers', () => {
    const message = {
        key: { id: 'status-1', remoteJid: 'status@broadcast', participant: '12345@s.whatsapp.net' },
        message: {
            ephemeralMessage: {
                message: {
                    groupStatusMessageV2: {
                        message: { imageMessage: { caption: 'group status' } }
                    }
                }
            }
        }
    }
    assert.equal(isGroupStatusMessage(message), true)
    assert.equal(isGroupStatusMention(message), false)
    assert.deepEqual(getMessageModerationMetadata(message), {
        id: 'status-1',
        remoteJid: 'status@broadcast',
        participant: '12345@s.whatsapp.net',
        fromMe: undefined,
        pushName: undefined,
        messageTimestamp: undefined,
        contentType: 'imageMessage',
        isStatusBroadcast: true,
        isGroupStatus: true,
        isGroupStatusMention: false,
        senderDeviceId: undefined,
        senderDeviceType: 'unknown'
    })
})

test('moderation metadata identifies group status mentions separately', () => {
    const message = { message: { groupStatusMentionMessage: { message: { extendedTextMessage: { text: 'mentioned group' } } } } }
    assert.equal(isGroupStatusMessage(message), true)
    assert.equal(isGroupStatusMention(message), true)
    assert.equal(getMessageModerationMetadata(message).isGroupStatusMention, true)
})

test('moderation metadata does not infer device id from ordinary JIDs or response speed from one message', () => {
    const metadata = getMessageModerationMetadata({
        key: { remoteJid: '123@g.us', participant: '12345@s.whatsapp.net' },
        messageTimestamp: new Date(1_800_000_000_000),
        message: { extendedTextMessage: { text: 'hello' } }
    })
    assert.equal(metadata.senderDeviceId, undefined)
    assert.equal(metadata.messageTimestamp, 1_800_000_000)
    assert.equal('responseSpeedMs' in metadata, false)
})
