'use strict'

const Libp2p = require('libp2p')

const TCP = require('libp2p-tcp')
const WS = require('libp2p-websockets')
const WStar = require('libp2p-webrtc-star')
const Wrtc = require('wrtc')
const Plaintext = require('libp2p/src/insecure/plaintext')

const transportKey = WStar.prototype[Symbol.toStringTag]

let options = {
    modules: {
        transport: [ TCP, WS, WStar ],
        connEncryption: [ Plaintext ]
    },
    config: {
        transport: {
            [transportKey]: {
                Wrtc
            }
        }
    }
}

async function main() {
    // Create a libp2p instance
    let libp2p = await Libp2p.create(options)

    libp2p.on('peer:connect', (peerInfo) => {
        console.info(`Connected to ${peerInfo.id.toB58String()}!`)
    })

    libp2p.peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
    libp2p.peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0/ws')

    await libp2p.start();
    console.info(`Libp2p Started`)
    libp2p.peerInfo.multiaddrs.forEach(ma => console.log(ma.toString()))
}

main()