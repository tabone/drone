'use strict'

/**
 * NAVDATA state stored in the NAVDATA header section.
 * File: ARDroneLib/Soft/Common/config.h
 * Line: 219
 * Enum: def_ardrone_state_mask_t
 * @type {Object}
 */
module.exports = {
  /**
   * FLY MASK : (0) ardrone is landed, (1) ardrone is flying
   * @type {Boolean}
   */
  fly: false,

  /**
   * VIDEO MASK : (0) video disable, (1) video enable
   * @type {Boolean}
   */
  video: false,

  /**
   * VISION MASK : (0) vision disable, (1) vision enable
   * @type {Boolean}
   */
  vision: false,

  /**
   * CONTROL ALGO : (0) euler angles control, (1) angular speed control
   * @type {Boolean}
   */
  controlAlgo: false,

  /**
   * ALTITUDE CONTROL ALGO : (0) altitude control inactive (1) altitude control
   * active
   * @type {Boolean}
   */
  altitudeControlAlgo: false,

  /**
   * USER feedback : Start button state
   * @type {Boolean}
   */
  userFeedback: false,

  /**
   * Control command ACK : (0) None, (1) one received
   * @type {Boolean}
   */
  controlCommandAck: false,

  /**
   * CAMERA MASK : (0) camera not ready, (1) Camera ready
   * @type {Boolean}
   */
  cameraEnabled: false,

  /**
   * Travelling mask : (0) disable, (1) enable
   * @type {Boolean}
   */
  travellingEnabled: false,

  /**
   * USB key : (0) usb key not ready, (1) usb key ready
   * @type {Boolean}
   */
  usbKey: false,

  /**
   * Navdata demo : (0) All navdata, (1) only navdata demo
   * @type {Boolean}
   */
  navdataDemo: false,

  /**
   * Navdata bootstrap : (0) options sent in all or demo mode, (1) no navdata
   * options sent
   * @type {Boolean}
   */
  navdataBootstrap: false,

  /**
   * Motors status : (0) Ok, (1) Motors problem
   * @type {Boolean}
   */
  motorStatus: false,

  /**
   * Communication Lost : (1) com problem, (0) Com is ok
   * @type {Boolean}
   */
  communicationLost: false,

  /**
   * Software fault detected - user should land as quick as possible (1)
   * @type {Boolean}
   */
  softwareFault: false,

  /**
   * VBat low : (1) too low, (0) Ok
   * @type {Boolean}
   */
  vBatLow: false,

  /**
   * User Emergency Landing : (1) User EL is ON, (0) User EL is OFF
   * @type {Boolean}
   */
  userEmergencyLanding: false,

  /**
   * Timer elapsed : (1) elapsed, (0) not elapsed
   * @type {Boolean}
   */
  timerElapsed: false,

  /**
   * Magnetometer calibration state : (0) Ok, no calibration needed, (1) not ok,
   * calibration needed
   * @type {Boolean}
   */
  magnetometerCalibrationState: false,

  /**
   * Angles : (0) Ok, (1) out of range
   * @type {Boolean}
   */
  angles: false,

  /**
   * WIND MASK: (0) ok, (1) Too much wind
   * @type {Boolean}
   */
  windMask: false,

  /**
   * Ultrasonic sensor : (0) Ok, (1) deaf
   * @type {Boolean}
   */
  ultrasonicSensor: false,

  /**
   * Cutout system detection : (0) Not detected, (1) detected
   * @type {Boolean}
   */
  cutoutSystemDetection: false,

  /**
   * PIC Version number OK : (0) a bad version number, (1) version number is OK
   * @type {Boolean}
   */
  picVersionNumber: false,

  /**
   * ATCodec thread ON : (0) thread OFF (1) thread ON
   * @type {Boolean}
   */
  atCodecThread: false,

  /**
   * Navdata thread ON : (0) thread OFF (1) thread ON
   * @type {Boolean}
   */
  navdataThread: false,

  /**
   * Video thread ON : (0) thread OFF (1) thread ON
   * @type {Boolean}
   */
  videoThread: false,

  /**
   * Acquisition thread ON : (0) thread OFF (1) thread ON
   * @type {Boolean}
   */
  acquisitionThread: false,

  /**
   * CTRL watchdog : (1) delay in control execution (> 5ms), (0) control is well
   * scheduled
   * @type {Boolean}
   */
  ctrlWatchdog: false,

  /**
   * ADC Watchdog : (1) delay in uart2 dsr (> 5ms), (0) uart2 is good
   * @type {Boolean}
   */
  adcWatchdog: false,

  /**
   * Communication Watchdog : (1) com problem, (0) Com is ok
   * @type {Boolean}
   */
  communicationWatchdog: false,

  /**
   * Emergency landing : (0) no emergency, (1) emergency
   * @type {Boolean}
   */
  emergencyLanding: false,

  /**
   * Method used to parse a buffer and update the properties of this object.
   * @param  {Buffer} buf NAVDATA payload recieved from AR-Drone.
   */
  parse (buf) {
    this.fly = !!(buf & 1)
    this.video = !!(buf & (1 << 1))
    this.vision = !!(buf & (1 << 2))
    this.controlAlgo = !!(buf & (1 << 3))
    this.altitudeControlAlgo = !!(buf & (1 << 4))
    this.userFeedback = !!(buf & (1 << 5))
    this.controlCommandAck = !!(buf & (1 << 6))
    this.cameraEnabled = !!(buf & (1 << 7))
    this.travellingEnabled = !!(buf & (1 << 8))
    this.usbKey = !!(buf & (1 << 9))
    this.navdataDemo = !!(buf & (1 << 10))
    this.navdataBootstrap = !!(buf & (1 << 11))
    this.motorStatus = !!(buf & (1 << 12))
    this.communicationLost = !!(buf & (1 << 13))
    this.softwareFault = !!(buf & (1 << 14))
    this.vBatLow = !!(buf & (1 << 15))
    this.userEmergencyLanding = !!(buf & (1 << 16))
    this.timerElapsed = !!(buf & (1 << 17))
    this.magnetometerCalibrationState = !!(buf & (1 << 18))
    this.angles = !!(buf & (1 << 19))
    this.windMask = !!(buf & (1 << 20))
    this.ultrasonicSensor = !!(buf & (1 << 21))
    this.cutoutSystemDetection = !!(buf & (1 << 22))
    this.picVersionNumber = !!(buf & (1 << 23))
    this.atCodecThread = !!(buf & (1 << 24))
    this.navdataThread = !!(buf & (1 << 25))
    this.videoThread = !!(buf & (1 << 26))
    this.acquisitionThread = !!(buf & (1 << 27))
    this.ctrlWatchdog = !!(buf & (1 << 28))
    this.adcWatchdog = !!(buf & (1 << 29))
    this.communicationWatchdog = !!(buf & (1 << 30))
    this.emergencyLanding = !!(buf & (1 << 31))
  }
}
