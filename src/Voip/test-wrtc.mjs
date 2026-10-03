import('@roamhq/wrtc')
  .then(m => {
    console.log('WRTC FILE OK')
    console.log('RTCPeerConnection:', typeof (m.default ?? m).RTCPeerConnection)
  })
  .catch(console.error)