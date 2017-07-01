const Watch = require('./modules/WatchClass');

(function() {
  "use strict"

  /**
  Crown
  **/
  let crownActive = false;
  let setSecondary = false;
  const crown = document.getElementById('crown');
  crown.addEventListener('click', () => {
    crownActive = !crownActive;
    if (crownActive) {
      crown.classList.add('active');
      primary.stopInterval();
      secondary.stopInterval();
      primary.updateManualTime();
      secondary.updateManualTime();
    } else {
      crown.classList.remove('active');
      primary.startInterval();
      secondary.startInterval();
    }
  });
  /**
  Power Reserve
  **/
  class PowerReserve {
    constructor(id) {
      this.element = document.getElementById(id);
      this.interval = null;
      this.init();
    }

    decrementReserve() {
      let currentRotate = primary.getCurrentRotateValue(this.element);

      if (currentRotate <= -90) {
        this.interval = null;
        primary.stopInterval();
        secondary.stopInterval();
      } else {
        let newRotate = Number(currentRotate) - 0.25;
        this.element.style.transform = `rotate(${newRotate}deg)`;
      }
    }

    incrementReserve() {
      let currentRotate = primary.getCurrentRotateValue(this.element);

      if (currentRotate <= 89.5 && currentRotate >= -90) {
        let newRotate = Number(currentRotate) + 0.5;
        this.element.style.transform = `rotate(${newRotate}deg)`;
      }
    }

    init() {
      this.element.style.transform = 'rotate(90deg)';
      this.interval = setInterval(() => {
        this.decrementReserve();
      }, 1000);
    }
  }
  const reserve = new PowerReserve('power-reserve-hand');
  window.addEventListener('keydown', () => {
    if (event.keyCode === 37) {
      reserve.incrementReserve();
    }

    if (crownActive) {
      switch (event.keyCode) {
        case 37:
          reserve.incrementReserve();
          break;
        case 38:
          if (setSecondary) {
            secondary.rotateHands();
          } else {
            primary.rotateHands();
            secondary.rotateHands();
          }
          break;
        case 39:
          setSecondary = !setSecondary;
          secondary.setSecondaryTime();
          let blackout = document.querySelector('.blackout');
          blackout.classList.toggle('active');
          break;
        case 40:
          if (setSecondary) {
            secondary.rotateHands('back');
          } else {
            primary.rotateHands('back');
            secondary.rotateHands('back');
          }
          break;
      }
    }
  });

  /**
  Dials
  **/
  const localhands = {
    hour: document.getElementById('primary-hours-hand'),
    minute: document.getElementById('primary-minutes-hand')
  };
  const homeHands = {
    hour: document.getElementById('secondary-hours-hand'),
    second: document.getElementById('secondary-minutes-hand')
  };

  let primary = new Watch(localhands, '+3');
  let secondary = new Watch(homeHands, '-4', 24);

  const homeTime = document.getElementById('home-field');
  const localTime = document.getElementById('local-field');

  homeTime.addEventListener('change', () => {
    secondary.stopInterval();
    secondary = new Watch(homeHands, homeTime.value.toString(), 24);
  });
  localTime.addEventListener('change', () => {
    primary.stopInterval();
    primary = new Watch(localhands, localTime.value.toString(), 12);
  });
})();
