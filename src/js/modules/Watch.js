const Dial = require('./Dial');
const Crown = require('./Crown');
const PowerReserve = require('./PowerReserve');
const MoonPhase = require('./MoonPhase');

class Watch {
  constructor(settings) {
    this.dialInstances = [];
    this.globalInterval = null;
    this.rightNow = new Date();

    settings.dials.forEach((dial) => {
      let tempDial = new Dial(dial, this);
      this.dialInstances.push(tempDial);
    });

    if (settings.crown) {
      this.crown = new Crown(settings.crown, this);
    }

    if (settings.reserve) {
      this.powerReserve = new PowerReserve(settings.reserve, this);
    }

    if (settings.moonphase) {
      this.moonphase = new MoonPhase(settings.moonphase, this);
    }

    this.init();
  }

  keyBindings() {
    window.addEventListener('keydown', () => {
      switch (event.keyCode) {
        case 37:
          if (this.powerReserve)
            this.powerReserve.incrementReserve();
          break;
        case 13:
          if (this.crown)
            this.crown.toggleCrown();
          break;
      }

      if (this.crown) {
        if (this.crown.crownActive) {
          switch (event.keyCode) {
            case 37:
              if (this.powerReserve)
                this.powerReserve.incrementReserve();
              break;
            case 38:
              this.dialInstances.forEach((dial) => {
                if (dial.setSecondary && dial.id === this.dialInstances[this.dialInstances.length - 1].id) {
                  dial.rotateHands();
                } else if (!dial.setSecondary) {
                  dial.rotateHands();
                }
              });
              break;
            case 39:
              if (this.crown)
                this.crown.toggleBlackout();

              this.dialInstances.forEach((dial) => {
                dial.toggleSecondaryTime();
              });
              break;
            case 40:
              this.dialInstances.forEach((dial) => {
                if (dial.setSecondary && dial.id === this.dialInstances[this.dialInstances.length - 1].id) {
                  dial.rotateHands('back');
                } else if (!dial.setSecondary) {
                  dial.rotateHands('back');
                }
              });
              break;
          }
        }
      }

    });
  }

  startInterval() {
    this.globalInterval = setInterval(() => {

      this.dialInstances.forEach((dial) => {
        dial.getCurrentTime();
        dial.rotateHands();
      });

      if (this.powerReserve) {
        this.powerReserve.decrementReserve();
      }

      /**
      To be accurate, yes, the moonphase should stop if the power reserve empties
      But is that worth making this call every second?
      **/
      if (this.moonphase) {
        this.moonphase.getCurrentPhase();
      }

    }, 1000);
  }

  stopInterval() {
    clearInterval(this.globalInterval);
    this.globalInterval = null;
  }

  init() {
    this.startInterval();
    this.keyBindings();
  }
}

module.exports = Watch;
