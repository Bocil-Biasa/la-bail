# Pre-commit compatibility audit

Audit date: 2026-10-27

## Existing support found in this source tree

- A2UI and Bloks builders already exist in `src/MessageBuilder/extras.js`, are re-exported by the package entry points, and have serialization and payload-validation coverage in `test/builder.test.js`.
- Group-status sending is already represented by `groupStatus` handling in `src/Utils/messages.js` and relay metadata handling in `src/Socket/messages-send.js`.
- Album relay handling already exists in `src/Socket/messages-send.js`; message preparation validates album input in `src/Utils/messages.js`.
- Carousel and `externalAdReply` helpers already exist in the integrated MessageBuilder and are documented in `README.md`.
- The README documents an important A2UI limitation: ordinary consumer accounts may only display the fallback text or an empty rich response depending on the WhatsApp client/server eligibility gates. A valid serialized payload does not guarantee that the client will render an A2UI card.

## Changes in this patch

- Add `getMessageModerationMetadata`, `isGroupStatusMessage`, and `isGroupStatusMention` as pure helpers for the consuming bot layer.
- Expose explicit sender device suffix only when it is present in the participant JID. The helper does not guess a device platform from a numeric suffix.
- Expose message timestamps but do not infer response speed from one message. A bot can calculate timing signals from a bounded history of events.
- Detect group-status wrappers through supported nested message wrappers. This is metadata detection only; it does not claim that arbitrary third-party statuses can be deleted.
- Add unit tests and a usage guide. No moderation rules are enabled by this library patch.

## Compatibility and test status

- Package format is ESM (`type: module`), with JavaScript and declaration exports added through `src/Utils/index.js` and `src/Utils/index.d.ts`.
- JavaScript syntax checks passed for all files under `src/` and `test/`.
- The four new moderation metadata tests passed.
- The full existing test suite could not run because required packages such as `@hapi/boom` and `protobufjs` are not installed in this working environment. Dependency installation did not complete, so full integration tests remain unverified.
- No protobuf fields were added or modified. No package version was bumped. No commit or ZIP was created.

## Remaining before release

1. Install the declared dependencies in a network-enabled environment and run the complete test suite.
2. Run `npm run verify:proto` and the repository's WhatsApp bundle audit before changing any protobuf or client revision.
3. Test group-status events with sanitized real fixtures. Do not implement status deletion until a supported protocol operation is demonstrated.
4. Keep `antibot`, `antiswgc`, `antilink`, `antitagsw`, and `antitoxic` policy in the bot layer, with all rules OFF by default and admin checks before destructive actions.
