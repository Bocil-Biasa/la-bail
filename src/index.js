
<<<<<<< HEAD
=======
import chalk from 'chalk';
import figlet from 'figlet';
>>>>>>> 630bd2b (feat(utils): add calculateReconnectDelay buat exponential backoff & jitter reconnection biar gak kena ratelimit)
import makeWASocket from './Socket/index.js';
import { AIRich, Button, ButtonV2, Carousel, MessageBuilder, Toolkit } from './MessageBuilder/index.js';
import * as messageBuilderExtras from './MessageBuilder/extras.js';
import * as metaAiSections from './MessageBuilder/metaai.js';
import * as botSignature from './MessageBuilder/bot-signature.js';
import * as nativeFlow from './Utils/native-flow.js';
import { nativeFlowButtonsViolateConstraints } from './Utils/messages.js';
export * from '../WAProto/index.js';
export * from './Utils/index.js';
export * from './Types/index.js';
export * from './Store/index.js';
export * from './Defaults/index.js';
export * from './WABinary/index.js';
export * from './WAM/index.js';
export * from './WAUSync/index.js';
export * from './MessageBuilder/index.js';
export * from './MessageBuilder/extras.js';
export * from './MessageBuilder/metaai.js';
export * from './MessageBuilder/bot-signature.js';
export * from './Voip/index.js';

<<<<<<< HEAD
=======
console.log(chalk.cyan(figlet.textSync('La-Bail', { font: 'Standard' })));
console.log(chalk.magenta(' A WhatsApp multi-device library for NodeJS'));
console.log(chalk.gray(' Modified by Bocil-Biasa (c) 2026 - la-bail\n'));

>>>>>>> 630bd2b (feat(utils): add calculateReconnectDelay buat exponential backoff & jitter reconnection biar gak kena ratelimit)
const builderMembers = [
    ...Object.entries(messageBuilderExtras),
    ...Object.entries(metaAiSections),
    ...Object.entries(botSignature),
    ...Object.entries(nativeFlow),
    ['nativeFlowButtonsViolateConstraints', nativeFlowButtonsViolateConstraints]
].filter(([name]) => name !== 'default');

for (const builder of [Button, ButtonV2, Carousel, AIRich, Toolkit]) {
    for (const [name, member] of builderMembers) {
        if (!(name in builder)) {
            Object.defineProperty(builder, name, { value: member, enumerable: true, configurable: true });
        }
    }
}

for (const [name, member] of builderMembers) {
    if (!(name in MessageBuilder)) {
        MessageBuilder[name] = member;
    }
}

Object.freeze(MessageBuilder);

export { makeWASocket };
export default makeWASocket;