'use strict'

/**
 * Possible states of NAVDATA communication.
 * @type {Object}
 */
module.exports = {
  /**
   * Client has not yet recieved any NAVDATA.
   * @type {Number}
   */
  OFFLINE: 0,

  /**
   * Client is recieving NAVDATA in Bootstrap mode.
   * @type {Number}
   */
  BOOTSTRAP: 1,

  /**
   * Client has recieved acknowledgement for change in NAVDATA mode and AR-Drone
   * waits for the acknowledgement by the client.
   * @type {Number}
   */
  HANDSHAKE: 2,

  /**
   * Client is recieving NAVDATA in navdata_demo mode.
   * AR-Drone sends NAVDATA packets containing navedata_demo.
   * @type {Number}
   */
  NAVDATA_DEMO: 3
}
