declare module "trystero" {
  interface Config {
    /** A unique string identifying your app. If using Firebase this should be the database ID (also see firebaseApp below for an alternative way of configuring the Firebase strategy). */
    appId: string;
    /** Specifies a custom RTCConfiguration for all peer connections. */
    rtcConfig?: RTCConfiguration;
    /** A string to namespace peers and events within a room. */

    namespace?: string;

    // 🌊 BitTorrent only
    /** Custom list of torrent tracker URLs to use. They must support WebSocket connections. */
    trackerUrls?: string[];
    /** BitTorrent only) Integer specifying how many torrent trackers to connect to simultaneously in case some fail. Defaults to 2, maximum of 3. Passing a trackerUrls option will cause this option to be ignored as the entire list will be used. */
    trackerRedundancy?: number;

    // 🔥 Firebase only
    /** You can pass an already initialized Firebase app instance instead of an appId. Normally Trystero will initialize a Firebase app based on the appId but this will fail if youʼve already initialized it for use elsewhere. */
    firebaseApp?: any;
    /** String specifying path where Trystero writes its matchmaking data in your database ('__trystero__' by default). Changing this is useful if you want to run multiple apps using the same database and don't want to worry about namespace collisions. */
    rootPath?: string;

    // 🪐 IPFS only
    swarmAddresses?: string[]; // List of IPFS multiaddrs to be passed to config.Addresses.Swarm.
  }

  interface Room {
    /** Remove local user from room and unsubscribe from room events. */
    leave: () => void;
    /** Returns a list of peer IDs present in room (not including the local user). */
    getPeers: () => string[];
    /**
     * Broadcasts media stream to other peers.
     * stream - A MediaStream with audio and/or video to send to peers in the room.
     * peerId - (optional) If specified, the stream is sent only to the target peer ID (string) or list of peer IDs (array).
     * metadata - (optional) Additional metadata (any serializable type) to be sent with the stream. This is useful when sending multiple streams so recipients know which is which (e.g. a webcam versus a screen capture). If you want to broadcast a stream to all peers in the room with a metadata argument, pass null as the second argument.
     */
    addStream: (stream: any, peerId?: string, metadata?: any) => void;

    /*
addStream(stream, [peerId], [metadata])

stream - A MediaStream with audio and/or video to send to peers in the room.

peerId - (optional) If specified, the stream is sent only to the target peer ID (string) or list of peer IDs (array).

metadata - (optional) Additional metadata (any serializable type) to be sent with the stream. This is useful when sending multiple streams so recipients know which is which (e.g. a webcam versus a screen capture). If you want to broadcast a stream to all peers in the room with a metadata argument, pass null as the second argument.

removeStream(stream, [peerId])
Stops sending previously sent media stream to other peers.

stream - A previously sent MediaStream to stop sending.

peerId - (optional) If specified, the stream is removed only from the target peer ID (string) or list of peer IDs (array).

addTrack(track, stream, [peerId], [metadata])
Adds a new media track to a stream.

track - A MediaStreamTrack to add to an existing stream.

stream - The target MediaStream to attach the new track to.

peerId - (optional) If specified, the track is sent only to the target peer ID (string) or list of peer IDs (array).

metadata - (optional) Additional metadata (any serializable type) to be sent with the track. See metadata notes for addStream() above for more details.

removeTrack(track, stream, [peerId])
Removes a media track from a stream.

track - The MediaStreamTrack to remove.

stream - The MediaStream the track is attached to.

peerId - (optional) If specified, the track is removed only from the target peer ID (string) or list of peer IDs (array).

replaceTrack(oldTrack, newTrack, stream, [peerId])
Replaces a media track with a new one.

oldTrack - The MediaStreamTrack to remove.

newTrack - A MediaStreamTrack to attach.

stream - The MediaStream the oldTrack is attached to.

peerId - (optional) If specified, the track is replaced only for the target peer ID (string) or list of peer IDs (array).

onPeerJoin(callback)
Registers a callback function that will be called when a peer joins the room. If called more than once, only the latest callback registered is ever called.

callback(peerId) - Function to run whenever a peer joins, called with the peer's ID.
Example:

onPeerJoin(id => console.log(`${id} joined`))
onPeerLeave(callback)
Registers a callback function that will be called when a peer leaves the room. If called more than once, only the latest callback registered is ever called.

callback(peerId) - Function to run whenever a peer leaves, called with the peer's ID.
Example:

onPeerLeave(id => console.log(`${id} left`))
onPeerStream(callback)
Registers a callback function that will be called when a peer sends a media stream. If called more than once, only the latest callback registered is ever called.

callback(stream, peerId, metadata) - Function to run whenever a peer sends a media stream, called with the the peer's stream, ID, and optional metadata (see addStream() above for details).
Example:

onPeerStream((stream, id) => console.log(`got stream from ${id}`, stream))
onPeerTrack(callback)
Registers a callback function that will be called when a peer sends a media track. If called more than once, only the latest callback registered is ever called.

callback(track, stream, peerId, metadata) - Function to run whenever a peer sends a media track, called with the the peer's track, attached stream, ID, and optional metadata (see addTrack() above for details).
Example:

onPeerTrack((track, stream, id) => console.log(`got track from ${id}`, track))
makeAction(namespace)
Listen for and send custom data actions.

namespace - A string to register this action consistently among all peers.
Returns a pair containing a function to send the action to peers and a function to register a listener. The sender function takes any JSON-serializable value (primitive or object) or binary data as its first argument and takes an optional second argument of a peer ID or a list of peer IDs to send to. By default it will broadcast the value to all peers in the room. If the sender function is called with binary data (Blob, TypedArray), it will be received on the other end as an ArrayBuffer of agnostic bytes. The sender function returns a promise that resolves when all target peers are finished receiving data.

Example:

const [sendCursor, getCursor] = room.makeAction('cursormove')

window.addEventListener('mousemove', e => sendCursor([e.clientX, e.clientY]))

getCursor(([x, y], id) => {
  const peerCursor = cursorMap[id]
  peerCursor.style.left = x + 'px'
  peerCursor.style.top = y + 'px'
})
ping(peerId)
Takes a peer ID and returns a promise that resolves to the milliseconds the round-trip to that peer took. Use this for measuring latency.

peerId - Peer ID string of the target peer.
Example:

// log round-trip time every 2 seconds
room.onPeerJoin(id =>
  setInterval(async () => console.log(`took ${await room.ping(id)}ms`), 2000)
)
selfId
  */
  }

  export function joinRoom(config: Config, name: string): any;
  export const selfId: string;
}
