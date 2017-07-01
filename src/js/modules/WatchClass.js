class Watch {
  constructor(hands, offset = null, format = 12) {
    try {
      if (!hands)
        throw "The Watch class needs an objbect containing the HTML elements for the hands.";
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
    this.setSecondary = false;

    this.init();
  }

  updateManualTime() {
    this.manualTime = !this.manualTime;
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

  setSecondaryTime() {
    this.setSecondary = !this.setSecondary;
  }

  rotateHands(dir = 'forward') {
    let hourOffset = this.setSecondary
      ? this.rotateValues.hourJump
      : this.rotateValues.hoursRotateValOffset;
    let rotateVal;
    if (this.hands.hour && (this.manualTime && !this.interval || (this.interval && this.currentTime.seconds === 0))) {
      if (dir === 'forward') {
        this.hands.hour.style.transform = `rotate(${this.getCurrentRotateValue(this.hands.hour) + hourOffset}deg)`;
      } else {
        this.hands.hour.style.transform = `rotate(${this.getCurrentRotateValue(this.hands.hour) - hourOffset}deg)`;
      }
    } else if (this.hands.hour && !this.manualTime) {
      rotateVal = (this.currentTime.hours * this.rotateValues.hoursRotateVal) + (this.currentTime.minutes * this.rotateValues.hoursRotateValOffset);

      if (rotateVal === 0) {
        this.hands.hour.classList.add('jumping');
      } else if (rotateVal > 0 && this.hands.hour.classList.contains('jumping')) {
        this.hands.hour.classList.remove('jumping');
      }

      this.hands.hour.style.transform = `rotate(${rotateVal}deg)`;
    }
    if (this.hands.minute && (this.manualTime && !this.interval || (this.interval && this.currentTime.seconds === 0))) {
      if (dir === 'forward') {
        this.hands.minute.style.transform = `rotate(${this.getCurrentRotateValue(this.hands.minute) + this.rotateValues.minutesRotateVal}deg)`;
      } else {
        this.hands.minute.style.transform = `rotate(${this.getCurrentRotateValue(this.hands.minute) - this.rotateValues.minutesRotateVal}deg)`;
      }
    } else if (this.hands.minute && !this.manualTime) {
      rotateVal = this.currentTime.minutes * this.rotateValues.minutesRotateVal;

      if (rotateVal === 0) {
        this.hands.minute.classList.add('jumping');
      } else if (rotateVal > 0 && this.hands.minute.classList.contains('jumping')) {
        this.hands.minute.classList.remove('jumping');
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
