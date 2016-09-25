'use strict'

/**
 * Contains values used to communicate with the AR-Drone.
 * @type {Object}
 */
module.exports = {
  /**
   * The IP used by AR-Drone in the LAN it creates.
   * @type {String}
   */
  IP: '192.168.1.1',

  /**
   * Port for sending AT Commands.
   * @type {Number}
   */
  AT_PORT: 5556,

  /**
   * Port used to initiate the transfer of NAVDATA.
   * @type {Number}
   */
  NAVDATA_PORT: 5554
}
