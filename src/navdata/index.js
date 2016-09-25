'use strict'

const dgram = require('dgram')
const events = require('events')
const constants = require('../constants')
const modes = require('./modes')
const headerState = require('./models/headerState')
const navdataDemo = require('./models/navdataDemo')

const navdataHandler = Object.create(events.prototype)

/**
 * The current mode of UDP Connection.
 * @type {[type]}
 */
navdataHandler.__mode = modes.OFFLINE

/**
 * The sequence number of the last processed UDP packet. This will be used to
 * only process new UDP packets.
 * @type {Number}
 */
navdataHandler.__seqNo = null

/**
 * UDP Socket used to recieve NAVDATA from AR-Drone.
 * @type {Socket}
 */
navdataHandler.__socket = null

/**
 * Latest NAVDATA recieved from AR-Drone
 * @type {Object}
 */
navdataHandler.data = {
  /**
   * Header state info.
   * @type {Object}
   */
  state: headerState,

  /**
   * NAVDATA_DEMO info.
   * @type {Object}
   */
  demo: navdataDemo
}

/**
 * Method used to initialize the NAVDATA Handler.
 */
navdataHandler.init = function init () {
  return new Promise((resolve, reject) => {
    // Create a UDP Socket which will recieving NAVDATA from AR-Drone.
    this.__socket = dgram.createSocket('udp4')

    // Listen for new messages.
    this.__socket.on('message', this.__message.bind(this))

    // Why '1'? Because 'some data' === '1'... (joking... DOCS ARE WRONG!!)
    // File: ARDroneLib/Soft/Lib/ardrone_tool/Navdata/ardrone_navdata_client.c
    // Line: 71
    // Meth: ardrone_navdata_open_server()
    this.__socket.send(Buffer.from([1], 'ascii'), 0, 1, constants.NAVDATA_PORT,
      constants.IP, (err, no) => {
        if (err) {
          reject(err)
          return
        }

        resolve()
      })
  })
}

/**
 * Listener for any new recieved NAVATA Payloads/
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
navdataHandler.__message = function __message (msg) {
  // Header is always 0x55667788
  if (msg.readInt32LE(0) !== 1432778632) return

  // Retrieve packet sequence number.
  const seqNo = msg.readInt32LE(8)

  // Ignore old packets
  if (this.__seqNo > seqNo) return

  // Store sequence number of processed packet.
  this.__seqNo = seqNo

  // Parse state
  headerState.parse(msg.readInt32LE(4))

  // Refresh State
  this.__refreshMode()

  // Parse NAVDATA_DEMO only if we are reciving it.
  if (this.__mode === modes.NAVDATA_DEMO) {
    navdataDemo.parse(msg.slice(16))
  }
}

/**
 * Method used to refresh the UDP Connection mode.
 */
navdataHandler.__refreshMode = function __refreshMode () {
  let mode = modes.OFFLINE
  const bootstrap = this.data.state.navdataBootstrap
  const control = this.data.state.controlCommandAck

  if (bootstrap === true) mode = modes.BOOTSTRAP
  if (control === true) mode = modes.HANDSHAKE
  if (bootstrap === false && control === false) mode = modes.NAVDATA_DEMO

  // If mode hasn't changed, stop process.
  if (this.__mode === mode) return

  // If mode has changed, update the mode, and emit event to inform any
  // listeners.
  this.__mode = mode
  this.emit('mode', mode)
}

module.exports = navdataHandler
