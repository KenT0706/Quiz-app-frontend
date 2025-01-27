<template>
  <div class="countdown-timer">
    <div class="timer">
      <div class="dial">
        <div class="indicator" :style="indicatorStyle"></div>
      </div>
      <div class="time">{{ formattedTime }}</div>
      <div>
        <label for="timeLimit">Set Time Limit (minutes):</label>
        <input type="number" id="timeLimit" v-model.number="totalTimeInMinutes" @input="updateTotalTime">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      totalTime: 600, // Total time in seconds, initial value
      remainingTime: 600, // Initial remaining time in seconds
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
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },
    totalTimeInMinutes: {
      get() {
        return this.totalTime / 60;
      },
      set(value) {
        this.totalTime = value * 60;
        this.remainingTime = this.totalTime; // Reset remaining time whenever total time is updated
      }
    }
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
    updateTotalTime() {
      this.startCountdown(); // Restart the countdown with the new total time
    }
  },
  created() {
    this.startCountdown();
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer); // Clear the timer when component is destroyed
  },
  props: {
    elapsed: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
  },
};
</script>