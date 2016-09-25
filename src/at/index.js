'use strict'

const debug = require('debug')('AT Handler')
const dgram = require('dgram')
const constants = require('../constants')

module.exports = {
  /**
   * In order to prevent processing old commands, AR-Drone requires each AT
   * Command to have a sequence number. When recieving an AT Command, AR-Drone
   * will only process it if its sequence number is greater than sequence number
   * of the last processed AT Command.
   * @type {Number}
   */
  __seqNo: 0,

  /**
   * Contains info about the payload to be sent on each loop.
   * @type {Object}
   */
  __payload: {
    /**
     * The maximum number of bytes (ASCII Characters) AR-Drone will process per
     * UDP Packet. If this is exceeded, AR-Drone will ignore the whole packet.
     * @type {Number}
     */
    size: 1024,

    /**
     * Contains the commands to be sent to AR-Drone in each loop.
     * @type {String}
     */
    buf: null,

    /**
     * Contains AT Command entries which should be considered to be included
     * with the next payload to be sent. These entries come in the following
     * form:
     *
     * @param  {Function} tick     Function invoked each time the command is
     *                             being considered. If this function doesn't
     *                             return 'true' the command is not included in
     *                             the payload buffer and is also removed from
     *                             the list of commands to consider.
     * @param  {Function} ignored  Function invoked when the command is ignored.
     *                             ex. when the command is invalid or the size
     *                             of the payload has been exceeded.
     * @param  {String}   cmd      The command to include in the payload to be
     *                             sent.
     * @type {Array}
     */
    queue: []
  },

  /**
   * UDP Socket used to send AT Commands. This is binded on port 5556 and sends
   * UDP Packets containing the AT Commands which AR-Drone should process to
   * 192.168.1.1:5556.
   * @type {Socket}
   */
  __socket: null,

  /**
   * Interval ID used to stop the loop.
   * @type {Number}
   */
  __loopIntervalID: null,

  /**
   * Method used to initialize the AT Handler.
   */
  init () {
    return new Promise((resolve, reject) => {
      debug('initializing AT Handler')

      debug('setting up buffer')
      // Initialize payload buffer.
      this.__payload.buf = ''

      debug('setting up udp socket')
      // Create a UDP Socket which will be used to send AT Commands to the
      // AR-Drone
      this.__socket = dgram.createSocket('udp4')

      // Bind the socket to the same port as the port used by AR-Drone to accept
      // AT Commands.
      this.__socket.bind(constants.AT_PORT, () => {
        debug(`udp socket binded on port ${constants.AT_PORT}`)

        debug('starting loop')
        // Start the loop.
        this.loopIntervalID = setInterval(this.__loop.bind(this), 30)
        resolve()
      })
    })
  },

  /**
   * Method used to add new AT Commands.
   */
  addEntry (entry) {
    debug('new command entered', entry.cmd('%s'))
    this.__payload.queue.push(entry)
  },

  /**
   * Method used to stop the session.
   */
  close () {
    debug('closing at handler')
    // Stops the loop
    clearInterval(this.loopIntervalID)
  },

  __loop () {
    debug('creating payload for next AT Command transfer')
    this.__payload.queue = this.__payload.queue.filter((entry, pos) => {
      if (entry.tick() !== true) return false

      this.__seqNo++

      const result = this.__writeToBuffer(entry.cmd(this.__seqNo))

      if (result === undefined) return true

      entry.ignored(result)
    })

    this.__sendPayload()
  },

  /**
   * Method used to write commands inside the payload buffer. This will then be
   * sent to AR-Drone once the loop is over.
   * @param  {Buffer} cmd AT Command.
   */
  __writeToBuffer (cmd) {
    if (typeof cmd !== 'string') {
      debug('command not written due to type')
      return 'command must be of type string'
    }

    // Before including the command inside the buffer, check whether it fits. If
    // it doesn't remove it from the entries list.
    if ((this.__payload.buf.length + cmd.length) > this.__payload.size) {
      debug('command not written due to payload size')
      return 'maximum payload length exceeded'
    }

    debug('writing command to buffer:', cmd)
    // Else include it in the buffer.
    this.__payload.buf += cmd
  },

  /**
   * Method used to send the payload to the AR-Drone.
   */
  __sendPayload () {
    if (this.__payload.buf.length === 0) return
    debug('sending payload to AR-Drone', this.__payload.buf)
    // Send the payload to AR-Drone
    this.__socket.send(Buffer.from(this.__payload.buf, 'ascii'), 0,
      this.__payload.buf.length, constants.AT_PORT, constants.IP, (err, no) => {
        if (err) {
          debug('error when sending payload to AR-Drone:', err)
          this.close()
        }

        debug('payload sent successfully')
      })

    // Reset buffer.
    this.__resetBuffer()
  },

  /**
   * Method used to reset the payload buffer.
   */
  __resetBuffer () {
    debug('resetting payload buffer')
    // Flush payload buffer.
    this.__payload.buf = ''
  }
}
