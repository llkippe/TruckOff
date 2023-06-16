class ANIMATION {
    constructor(duration, waitTime,ease) {
      this.startTime = millis() + waitTime*1000;
      this.duration = duration*1000;
      this.ease = ease;
    }
  
    getAnimationTime() {
        const timePassedSinceStart = millis() - this.startTime;
        const linearT = Math.min(timePassedSinceStart / this.duration, 1);
        const animT = linearT; // easing
        return animT;
    }
  }
  