# Moderation metadata hooks

File yang benar-benar diekspor oleh `la-bail` adalah `src/Utils/moderation-metadata.js`, yang diekspor ulang dari `src/Utils/index.js` dan entry point paket. API ini hanya membaca metadata pesan; ia tidak menerapkan kebijakan moderasi dan tidak menghapus pesan/status.

```js
import {
  getMessageModerationMetadata,
  isGroupStatusMessage,
  isGroupStatusMention,
} from 'la-bail'

sock.ev.on('messages.upsert', ({ messages }) => {
  for (const message of messages) {
    const metadata = getMessageModerationMetadata(message)
    if (isGroupStatusMessage(message)) {
      console.log('group status', metadata.id, metadata.remoteJid)
    }
    if (isGroupStatusMention(message)) {
      console.log('group status mention', metadata.id, metadata.participant)
    }
  }
})
```

## Field yang dikembalikan

`getMessageModerationMetadata(message)` mengembalikan `id`, `remoteJid`, `participant`, `fromMe`, `pushName`, `messageTimestamp` dalam detik Unix, `contentType`, `isStatusBroadcast`, `isGroupStatus`, `isGroupStatusMention`, `senderDeviceId`, dan `senderDeviceType`. Field yang tidak tersedia bernilai `undefined`; `senderDeviceType` sengaja bernilai `'unknown'` karena ID perangkat numerik bukan bukti tipe perangkat atau bukti bahwa pengirim adalah bot.

`isGroupStatusMessage(message)` mengenali wrapper `groupStatusMessage`, `groupStatusMessageV2`, dan `groupStatusMentionMessage`, termasuk wrapper pesan yang didukung helper. `isGroupStatusMention(message)` hanya menandai wrapper group-status mention. Deteksi ini mengikuti bentuk payload yang terlihat pada pesan yang diterima; bukan jaminan semua versi klien akan mengirim metadata yang sama.

## Batasan penting

- Tidak ada `responseSpeedMs` di API. Untuk heuristik kecepatan, aplikasi harus mengukur interval dari beberapa pesan dan membatasi riwayat per pengirim.
- Helper tidak menyimpulkan bahwa akun adalah bot. LecyMD saat ini menggunakan pola pesan duplikat berulang dalam jendela singkat sebagai sinyal praktis `antibot`; pola itu bukan bukti identitas bot.
- Helper tidak menyediakan operasi untuk menghapus status orang lain. `antiswgc` dan `antitagsw` dapat disimpan sebagai pengaturan grup, tetapi aksi penghapusan status belum diimplementasikan karena API delete yang didukung untuk status milik orang lain belum terverifikasi. Jangan dokumentasikan toggle itu sebagai fitur penghapusan yang aktif.
- Untuk menghapus pesan grup biasa, aplikasi harus memastikan pesan berasal dari grup, bot adalah admin, dan pesan bukan milik admin/owner/bot. Library tidak menegakkan kebijakan tersebut.
- Semua aturan moderasi default OFF dan tetap menjadi tanggung jawab layer bot.
