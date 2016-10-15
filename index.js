'use strict'

const atHandler = require('./src/at')
const navdataHandler = require('./src/navdata')
const navdataModes = require('./src/navdata/modes')
const controlModes = require('./src/control/modes')

const client = {
  /**
   * Stores info about movement.
   * @type {Object}
   */
  movement: {
    /**
     * Move forward (-1) or back (+1).
     * @type {Number}
     */
    pitch: 0,

    /**
     * Move left (-1) or right (+1)
     * @type {Number}
     */
    roll: 0,

    /**
     * Move down (-1) or up (+1)
     * @type {Number}
     */
    gaz: 0,

    /**
     * Spin left (-1) or right (+1)
     * @type {Number}
     */
    yaw: 0
  },

  init () {
    // Listen for changes in NAVDATA UDP Connection.
    navdataHandler.on('mode', (mode) => {
      switch (mode) {
        case navdataModes.BOOTSTRAP: {
          // When AR-Drone is sending NAVDATA in BOOTSTRAP mode, we need to
          // inform it to include navdata_demo option.
          this.config('general:navdata_demo', 'TRUE')
          break
        }
        case navdataModes.HANDSHAKE: {
          // When AR-Drone sends a NAVDATA with 'controlCommandAck' flag set to
          // 'true' in the NAVDATA Header State, it means that the AR-Drone will
          // be sending NAVDATA_DEMO and it awaits an acknowledgment.
          // File: ARDroneLib/Soft/Lib/ardrone_tool/AT/ardrone_at_mutex.c
          // Line: 680
          this.ctrl(controlModes.ACK_CONTROL_MODE, 0)
          break
        }
      }
    })

    // Initialize AT Handler
    return atHandler.init()
      // Initialize NAVDATA Handler
      .then(navdataHandler.init.bind(navdataHandler))
      // Listen for changes in movement.
      .then(this.move.bind(this))
  },

  wait (ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`drone waited for ${ms / 1000} seconds`)
      }, ms)
    })
  },

  trim () {
    return new Promise((resolve, reject) => {
      atHandler.addEntry({
        cmd (seqNo) {
          return `AT*FTRIM=${seqNo}\r`
        },
        tick () {
          resolve('trimmed finalized')
          return true
        },
        ignored (msg) {
          reject(msg)
        }
      })
    })
  },

  takeOff () {
    return new Promise((resolve, reject) => {
      atHandler.addEntry({
        cmd (seqNo) {
          return `AT*REF=${seqNo},290718208\r`
        },
        tick () {
          if (navdataHandler.data.state.fly === false) return true
          resolve('drone took off')
        },
        ignored (msg) {
          reject(msg)
        }
      })
    })
  },

  land () {
    return new Promise((resolve, reject) => {
      atHandler.addEntry({
        cmd (seqNo) {
          return `AT*REF=${seqNo},290717696\r`
        },
        tick () {
          if (navdataHandler.data.state.fly === true) return true
          resolve('drone landed')
        },
        ignored (msg) {
          reject(msg)
        }
      })
    })
  },

  mayday () {
    return new Promise((resolve, reject) => {
      atHandler.addEntry({
        cmd (seqNo) {
          return `AT*REF=${seqNo},290717952\r`
        },
        tick () {
          if (navdataHandler.data.state.emergencyLanding === false) return true
          resolve('drone landed due to an emergency order')
        },
        ignored (msg) {
          reject(msg)
        }
      })
    })
  },

  resetWatchdog () {
    return new Promise((resolve, reject) => {
      atHandler.addEntry({
        cmd (seqNo) {
          return `AT*COMWDG=${seqNo},\r`
        },
        tick () {
          resolve('watchdog resetted')
          return true
        },
        ignored (msg) {
          reject(msg)
        }
      })
    })
  },

  config (key, value) {
    return new Promise((resolve, reject) => {
      atHandler.addEntry({
        cmd (seqNo) {
          return `AT*CONFIG=${seqNo},"${key}","${value}"\r`
        },
        tick () {
          resolve('configured.')
          return true
        },
        ignored (msg) {
          reject(msg)
        }
      })
    })
  },

  ctrl (mode, value) {
    return new Promise((resolve, reject) => {
      atHandler.addEntry({
        cmd (seqNo) {
          return `AT*CTRL=${seqNo},${mode},${value}\r`
        },
        tick () {
          resolve('configured.')
          return true
        },
        ignored (msg) {
          reject(msg)
        }
      })
    })
  },

  move () {
    return new Promise((resolve, reject) => {
      const self = this

      atHandler.addEntry({
        cmd (seqNo) {
          const dirNeg = -1090519040 // -0.5
          const dirPos = 1056964608 // 0.5

          let pitch = 0
          let roll = 0
          let gaz = 0
          let yaw = 0

          if (self.movement.pitch !== 0) {
            pitch = (self.movement.pitch > 0) ? dirPos : dirNeg
          }

          if (self.movement.roll !== 0) {
            roll = (self.movement.roll > 0) ? dirPos : dirNeg
          }

          if (self.movement.gaz !== 0) {
            gaz = (self.movement.gaz > 0) ? dirPos : dirNeg
          }

          if (self.movement.yaw !== 0) {
            yaw = (self.movement.yaw > 0) ? dirPos : dirNeg
          }

          if (pitch === 0 && roll === 0 && gaz === 0 && yaw === 0) {
            return `AT*PCMD=${seqNo},0,0,0,0,0\r`
          } else {
            return `AT*PCMD=${seqNo},1,${roll},${pitch},${gaz},${yaw}\r`
          }
        },
        tick () {
          resolve()
          return true
        },
        ignored (msg) {
          reject(msg)
        }
      })
    })
  },

  moveForward (ms = 0) {
    this.movement.pitch = -1

    if (ms > 0) {
      setTimeout(() => {
        this.movement.pitch = 0
      }, ms)
    }

    return Promise.resolve()
  },

  moveBack (ms = 0) {
    this.movement.pitch = 1

    if (ms > 0) {
      setTimeout(() => {
        this.movement.pitch = 0
      }, ms)
    }

    return Promise.resolve()
  },

  moveLeft (ms = 0) {
    this.movement.roll = -1

    if (ms > 0) {
      setTimeout(() => {
        this.movement.roll = 0
      }, ms)
    }

    return Promise.resolve()
  },

  moveRight (ms = 0) {
    this.movement.roll = 1

    if (ms > 0) {
      setTimeout(() => {
        this.movement.roll = 0
      }, ms)
    }

    return Promise.resolve()
  },

  moveUp (ms = 0) {
    this.movement.gaz = 1

    if (ms > 0) {
      setTimeout(() => {
        this.movement.gaz = 0
      }, ms)
    }

    return Promise.resolve()
  },

  moveDown (ms = 0) {
    this.movement.gaz = -1

    if (ms > 0) {
      setTimeout(() => {
        this.movement.gaz = 0
      }, ms)
    }

    return Promise.resolve()
  },

  spinLeft (ms = 0) {
    this.movement.yaw = -1

    if (ms > 0) {
      setTimeout(() => {
        this.movement.yaw = 0
      }, ms)
    }

    return Promise.resolve()
  },

  spinRight (ms = 0) {
    this.movement.yaw = 1

    if (ms > 0) {
      setTimeout(() => {
        this.movement.yaw = 0
      }, ms)
    }

    return Promise.resolve()
  },

  resetPitch () {
    this.movement.pitch = 0
  },

  resetRoll () {
    this.movement.roll = 0
  },

  resetGaz () {
    this.movement.gaz = 0
  },

  resetYaw () {
    this.movement.yaw = 0
  }
}

const clientAPI = {
  init: client.init.bind(client)
}

;[ 'wait',
   'trim',
   'takeOff',
   'land',
   'mayday',
   'resetWatchdog',
   'config',
   'controlCommand',
   'moveForward',
   'moveBack',
   'moveLeft',
   'moveRight',
   'moveUp',
   'moveDown',
   'spinLeft',
   'spinRight',
   'resetPitch',
   'resetRoll',
   'resetGaz',
   'resetYaw' ]
.forEach((fn) => {
  clientAPI[fn] = (...args) => {
    return client[fn].bind(client, ...args)
  }
})

module.exports = clientAPI
