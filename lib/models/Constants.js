module.exports = {
  projects: {
    exchange: 'exchange',
    middleware: 'middleware',
    chronomint: 'chronomint',
    laborx: 'laborx'
  },
  notifications: {
    exchange: {
      userLoggedIn: `userLoggedIn`,
      profileUpdated: `profileUpdated`,
      transferReceived: `transferReceived`,
      transferSent: `transferSent`,
      limitOrderPublished: `limitOrderPublished`,
      limitOrderFilled: `limitOrderFilled`,
      limitOrderExpired: `limitOrderExpired`,
      marketOrderExecuted: `marketOrderExecuted`
    },
    laborx: {
      userLoggedIn: `userLoggedIn`,
      profileUpdated: `profileUpdated`
    },
    middleware: {
      userLoggedIn: `userLoggedIn`,
      profileUpdated: `profileUpdated`
    },
    chronomint: {
      userLoggedIn: `userLoggedIn`,
      profileUpdated: `profileUpdated`
    }
  }
}
