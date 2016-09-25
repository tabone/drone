'use strict'

/**
 * [exports description]
 * @type {Object}
 */
module.exports = {
  /**
   * Navdata block ('option') identifier
   * @type {Number}
   */
  tag: 0,

  /**
   * NAVDATA option size
   * @type {Number}
   */
  size: 0,

  /**
   * Indicates whether the drome is flying or not. This info is retrieved from
   * 'ctrl_state'
   * @type {Boolean}
   */
  fly: false,

  /**
   * Flying state (landed, flying, etc.) defined in ./src/control/states.
   * File: ARDroneLib/Soft/Common/control_states.h
   * Line: 37
   * Enum: CTRL_STATES
   * @type {Number}
   */
  state: 0,

  /**
   * Battery voltage filtered (mV)
   * @type {Number}
   */
  vBatPercentage: 0,

  /**
   * UAV's pitch in milli-degrees
   * @type {Number}
   */
  pitch: 0,

  /**
   * UAV's roll in milli-degrees
   * @type {Number}
   */
  roll: 0,

  /**
   * UAV's yaw in milli-degrees
   * @type {Number}
   */
  yaw: 0,

  /**
   * UAV's altitude in centimeters
   * @type {Number}
   */
  altitude: 0,

  /**
   * UAV's estimated linear velocity
   * @type {Number}
   */
  vx: 0,

  /**
   * UAV's estimated linear velocity
   * @type {Number}
   */
  vy: 0,

  /**
   * UAV's estimated linear velocity
   * @type {Number}
   */
  vz: 0,

  /**
   * streamed frame index
   * @type {Number}
   */
  frames: 0,

  /**
   * Method used to parse a buffer and update the properties of this object.
   * @param  {Buffer} buf NAVDATA payload recieved from AR-Drone.
   */
  parse (buf) {
    this.tag = buf.readUInt16LE(0)
    this.size = buf.readUInt16LE(2)
    this.fly = !!(buf.readUInt16LE(4))
    this.state = buf.readUInt16LE(6)
    this.vBatPercentage = buf.readUInt32LE(8)
    this.pitch = buf.readFloatLE(12)
    this.roll = buf.readFloatLE(16)
    this.yaw = buf.readFloatLE(20)
    this.altitude = buf.readInt32LE(24)
    this.vx = buf.readFloatLE(28)
    this.vy = buf.readFloatLE(32)
    this.vz = buf.readFloatLE(36)
    this.frames = buf.readUInt32LE(40)
  }
}
