class ANIMATION {
    constructor(duration, waitTime,ease) {
      this.startTime = millis() + waitTime*1000;
      this.duration = duration*1000;
      this.ease = ease

    }
  
    getAnimationTime() {
        const timePassedSinceStart = millis() - this.startTime;
        const linearT = Math.min(timePassedSinceStart / this.duration, 1);
        let animT = linearT;
        if(this.ease == "easeInOutSin") animT = this.easeInOutSin(linearT);
        if(this.ease == "easeOutCubic") animT = this.easeOutCubic(linearT);

        return animT;
    }

    easeInOutSin(t) {
      return -1/2 * (Math.cos(Math.PI*t/1) - 1)
    }
    easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }
  }
  