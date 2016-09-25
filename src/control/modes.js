'use strict'

/**
 * Possible states of the drone 'control' thread.
 * File: ARDroneLib/Soft/Common/ardrone_api.h
 * Enum: ARDRONE_CONTROL_MODE
 * @type {Object}
 */
module.exports = {
  /**
   * Doing nothing.
   * @type {Number}
   */
  NO_CONTROL_MODE: 0,

  /**
   * Send active configuration file to a client through the 'control' socket UDP
   * 5559.
   * @type {Number}
   */
  CFG_GET_CONTROL_MODE: 4,

  /**
   * Reset command mask in navdata.
   * @type {Number}
   */
  ACK_CONTROL_MODE: 5,

  /**
   * Requests the list of custom configuration IDs.
   * @type {Number}
   */
  CUSTOM_CFG_GET_CONTROL_MODE: 6
}
