<template>
  <div class="countdown-timer">
    <div class="timer">
      <div class="dial">
        <div class="indicator" :style="indicatorStyle"></div>
      </div>
      <div class="time">{{ formattedTime }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalTime: 600, // Total time in seconds, initial value
      remainingTime: 600, // Initial remaining time in seconds
      startTime: null, // Track when the question is displayed
      elapsedTime: 0, // Track time taken for the current question
    };
  },
  computed: {
    indicatorStyle() {
      const rotation = 360 - (360 * this.remainingTime) / this.totalTime;
      return { transform: `rotate(${rotation}deg)` };
    },
    formattedTime() {
      const minutes = Math.floor(this.remainingTime / 60);
      const seconds = this.remainingTime % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    },
  },
  methods: {
    startCountdown() {
      if (this.timer) clearInterval(this.timer); // Clear any existing timer
      this.timer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
        } else {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    startQuestionTimer() {
      this.startTime = Date.now(); // Record the start time for the current question
    },
    getElapsedTime() {
      if (!this.startTime) return 0;
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000); // Calculate elapsed time in seconds
      return this.elapsedTime;
    },
  },
  created() {
    this.startCountdown();
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer); // Clear the timer when component is destroyed
  },
};
</script>