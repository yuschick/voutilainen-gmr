class Watch {
  constructor(hands, offset = null, format = 12) {
    try {
      if (!hands)
        throw "The Watch class needs an object containing the HTML elements for the hands.";
      }
    catch (errorMsg) {
      console.error(errorMsg);
      return;
    }

    this.rightNow = new Date();
    this.currentTime = {};
    this.gmtOffset = offset
      ? offset.toString()
      : null;

    this.hands = hands;
    this.format = format;

    this.rotateValues = {
      hoursRotateVal: this.format === 12
        ? 30
        : 15,
      hoursRotateValOffset: this.format === 12
        ? 0.5
        : 0.25,
      hourJump: 30,
      minutesRotateVal: 6
    };

    this.interval = null;
    this.crownActive = false;
    this.manualTime = false;
    this.settingTime = false;
    this.setSecondary = false;

    this.init();
  }

  toggleSettingTime() {
    this.settingTime = !this.settingTime;
  }

  toggleSecondaryTime() {
    this.setSecondary = !this.setSecondary;
  }

  updateToManualTime() {
    this.manualTime = true;
  }

  toggleBlackout() {
    document.querySelector('.blackout').classList.toggle('active');
    document.getElementById('Main_Dial').classList.toggle('faded');
  }

  stopInterval() {
    this.crownActive = true;
    clearInterval(this.interval);
    this.interval = null;
  }

  startInterval() {
    this.interval = setInterval(() => {
      this.getCurrentTime();
      this.rotateHands();
    }, 1000);
    this.crownActive = false;
  }

  getCurrentTime() {
    this.rightNow = new Date();
    if (this.gmtOffset) {
      /* Shouts to: http://www.techrepublic.com/article/convert-the-local-time-to-another-time-zone-with-this-javascript/6016329/ */
      const gmt = this.rightNow.getTime() + (this.rightNow.getTimezoneOffset() * 60000);
      this.rightNow = new Date(gmt + (3600000 * this.gmtOffset));
    }

    let currentTime = {
      hours: this.rightNow.getHours(),
      minutes: this.rightNow.getMinutes(),
      seconds: this.rightNow.getSeconds()
    }

    this.currentTime = currentTime;
  }

  rotateHands(dir = null) {
    let rotateVal;

    if (this.hands.hour) {
      let hourOffset = this.setSecondary
        ? this.rotateValues.hourJump
        : this.rotateValues.hoursRotateValOffset;
      rotateVal = this.getCurrentRotateValue(this.hands.hour);
      if (this.settingTime) {
        if (dir) {
          rotateVal -= hourOffset;
        } else {
          rotateVal += hourOffset;
        }
      } else if (this.manualTime) {
        if (this.currentTime.seconds === 0) {
          rotateVal = this.getCurrentRotateValue(this.hands.hour) + this.rotateValues.hoursRotateValOffset;
        }
      } else {
        rotateVal = (this.currentTime.hours * this.rotateValues.hoursRotateVal) + (this.currentTime.minutes * this.rotateValues.hoursRotateValOffset);
      }

      this.hands.hour.style.transform = `rotate(${rotateVal}deg)`;
    }

    if (this.hands.minute) {
      rotateVal = this.getCurrentRotateValue(this.hands.minute);
      if (this.settingTime) {
        if (dir) {
          rotateVal -= this.rotateValues.minutesRotateVal;
        } else {
          rotateVal += this.rotateValues.minutesRotateVal;
        }
      } else if (this.manualTime) {
        if (this.currentTime.seconds === 0) {
          rotateVal += this.rotateValues.minutesRotateVal;
        }
      } else {
        rotateVal = this.currentTime.minutes * this.rotateValues.minutesRotateVal;
      }

      this.hands.minute.style.transform = `rotate(${rotateVal}deg)`;
    }

    if (this.hands.second) {
      rotateVal = this.currentTime.seconds * this.rotateValues.minutesRotateVal;

      if (rotateVal === 0) {
        this.hands.second.classList.add('jumping');
      } else if (rotateVal > 0 && this.hands.second.classList.contains('jumping')) {
        this.hands.second.classList.remove('jumping');
      }

      this.hands.second.style.transform = `rotate(${rotateVal}deg)`;
    }
  }

  getCurrentRotateValue(el) {
    let val = el.style.transform;
    let num = val.replace('rotate(', '').replace('deg)', '');
    return Number(num);
  }

  init() {
    setTimeout(() => {
      this.getCurrentTime();
      this.rotateHands();
    }, 350);

    this.startInterval();
  }
}

module.exports = Watch;
