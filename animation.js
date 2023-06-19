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
        if(this.ease == "easePlateau") animT = this.easePlateau(linearT);

        return animT;
    }

    getLinearTime() {
      const timePassedSinceStart = millis() - this.startTime;
      return Math.min(timePassedSinceStart / this.duration, 1);
    }

    easeInOutSin(t) {
      return -1/2 * (Math.cos(Math.PI*t/1) - 1)
    }
    easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }
    easeOutQuadratic(t) {
      return 1 - Math.pow(1 - t, 2);
    }
    easePlateau(t) {
      if (t <= 0) {
        return 0;
      } else if (t >= 1) {
        return 0;
      } else if (t <= 0.5) {
        // Easing towards the peak
        return this.easeOutCubic(t / 0.5);
      } else {
        // Easing back from the peak
        return this.easeOutCubic(lerp(1,0, (t-0.5)*2));
      }
    }
  }
  