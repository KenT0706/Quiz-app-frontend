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
  props: {
    timeLimit: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      totalTime: this.timeLimit, // Initialize with prop
      remainingTime: this.timeLimit,
      startTime: null,
      elapsedTime: 0,
      timer: null
    };
  },
  watch: {
    timeLimit(newTimeLimit) {
      // Reset timer when timeLimit prop changes
      this.totalTime = newTimeLimit;
      this.remainingTime = newTimeLimit;
      this.startCountdown();
    }
  },
  computed: {
    // Existing computed properties remain the same
  },
  methods: {
    startCountdown() {
      if (this.timer) clearInterval(this.timer);
      this.remainingTime = this.totalTime; // Reset to current totalTime
      this.timer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
        } else {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    // Existing methods remain the same
  },
  created() {
    this.startCountdown();
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer);
  }
};
</script>