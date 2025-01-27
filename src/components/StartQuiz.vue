<template>
  <div class="container mt-5">
    <div v-if="quiz" class="row">
      <div class="row">
        <div class="col">
          <p>Quiz Taker Name: {{ quizTakerName }}</p>
        </div>
        <div class="col text-end">
          <p>Quiz Pin: {{ quizPin }}</p>
        </div>
      </div>
      <div class="col-12">
        <h1 class="text-center">{{ quiz.title }}</h1>
        <p>{{ quiz.scenario }}</p>
      </div>
      <div v-if="timer > 0" class="col-12 text-end">
        <div class="countdown-timer">
          <div class="timer">
            <div class="dial">
              <div class="indicator" :style="indicatorStyle"></div>
            </div>
            <div class="time">{{ formattedTime }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="row">
      <div class="col">
        <h2 class="text-center">Loading...</h2>
      </div>
      <div v-if="timer > 0" class="col-12 text-end">
        <div class="countdown-timer">
          <div class="timer">
            <div class="dial">
              <div class="indicator" :style="indicatorStyle"></div>
            </div>
            <div class="time">{{ formattedTime }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="questions.length > 0 && currentQuestionIndex < questions.length && !showResults">
      <div class="card mt-3">
        <div class="card-header" style="font-size:18px; font-weight:bold;">
          {{ questions[currentQuestionIndex].questionText }}
        </div>
        <div class="card-body">
          <div class="radio-item" v-for="option in ['A', 'B', 'C', 'D', 'E', 'F']" :key="option">
            <input type="radio" :id="'option' + option" class="form-check-input" :name="'answer_' + currentQuestionIndex" :value="option" v-model="selectedAnswers[currentQuestionIndex]">
            <label :for="'option' + option">{{ questions[currentQuestionIndex]['option' + option] }}</label>
          </div>
        </div>
      </div>
      <button class="btn btn-primary mt-3" v-if="currentQuestionIndex < questions.length - 1" @click="nextQuestion">Next</button>
      <button class="btn btn-primary mt-3" v-if="currentQuestionIndex === questions.length - 1" @click="submitQuiz" :disabled="disableSubmitButton">Submit Quiz</button>
    </div>
    <div v-if="showResults">
      <h2>Your Score: {{ score }}</h2>
      <button class="btn btn-primary mt-3" v-if="showLeaderBoardButton" @click="goToLeaderBoard">Go to Leader Board</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import api from "../api";
import { useRouter } from "vue-router";

const router = useRouter();

export default {
  props: {
    quizPin: String,
    quizTakerName: String,
    avatarId: String
  },
  data() {
    return {
      quiz: null,
      questions: [],
      selectedAnswers: [],
      showResults: false,
      score: 0,
      timer: 0, // Timer in seconds,
      totalTime: 0,
      timeElapsed: 0,
      currentQuestionIndex: 0, // Index of the current question
      timerInterval: null, // Interval for the timer,
      disableSubmitButton: false,
      showLeaderBoardButton: false,
      quickAnswer: []
    };
  },
  created() {
    this.fetchQuestionsFromAPI();
  },
  computed: {
    indicatorStyle() {
      const rotation = 360 - (360 * this.timer) / this.totalTime;
      return { transform: `rotate(${rotation}deg)` };
    },
    formattedTime() {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    }
  },
  methods: {
    fetchQuestionsFromAPI() {
      // Fetch questions from the API for the given quizPin
      api
        .getQuestionsByQuizPin(this.quizPin)
        .then(response => {
          this.questions = response.data.questions;
          this.quiz = response.data.quiz;
          // Initialize the timer with the time limit of the first question
          this.timer = this.questions[0].timeLimit;
          this.totalTime = this.questions[0].timeLimit;
          // Start the timer
          this.startTimer();
        })
        .catch(error => {
          console.error("Error fetching questions:", error);
        });
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          if (this.currentQuestionIndex < this.questions.length - 1) {
            this.timerInterval = null;
            this.nextQuestion();
          } else {
            this.timerInterval = null;
            //  this.submitQuiz();
          }
          clearInterval(this.timerInterval);
        }
      }, 1000); // Update the timer every second
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? "0" : ""
        }${remainingSeconds}`;
    },
    nextQuestion() {
      // Check if an option is selected or the time is up
      if (this.selectedAnswers[this.currentQuestionIndex] || this.timer === 0) {
        if (this.currentQuestionIndex < this.questions.length - 1) {
          if (this.totalTime / 2 < this.timer) {
            this.quickAnswer.push(true);
          }
          // Move to the next question
          this.currentQuestionIndex++;
          this.timerInterval = null;
          // Set the timer with the time limit of the current question
          this.timer = this.questions[this.currentQuestionIndex].timeLimit;
          // Start the timer for the current question
          this.startTimer();
        }
      }
    },
    submitQuiz() {
      const answers = this.selectedAnswers;
      const answerSpeed = this.quickAnswer;
      const quizPin = this.quizPin;
      this.timer = -1;
      this.timerInterval = null;
      clearInterval(this.timerInterval);
      try {
        api
          .submitQuiz(this.quiz._id, {
            answers,
            quizPin,
            answerSpeed
          })
          .then(response => {
            const submitQuizResponse = response.data;
            this.showLeaderBoardButton = true;
            const currentScore = response.data.score;
            this.score = currentScore;
            this.disableSubmitButton = true;
            const name = this.quizTakerName;
            this.showResults = true;
          });
      } catch (error) {
        console.error("Error submitting answers:", error);
      }
    },
    goToLeaderBoard() {
      let quizPin = this.quizPin;
      let currentScore = this.score;
      let name = this.quizTakerName;
      let avtId = this.avatarId;
      console.log(quizPin);
      console.log(currentScore);
      console.log(name);
      console.log(avtId);
      try {
        api
          .saveQuizResult(this.quiz._id, {
            quizPin,
            currentScore,
            name,
            avtId
          })
          .then(secondResponse => {
            this.$router.push({
              name: "Result",
              params: {
                quizPin: this.enteredQuizPin
              }
            });
          });
      } catch (error) {
        console.error("Error submitting answers:", error);
      }
    }
  }
};
</script>

<style scoped>
.radio-item [type="radio"] {
  display: none;
}

.radio-item+.radio-item {
  margin-top: 15px;
}

.radio-item label {
  display: block;
  padding: 20px 60px;
  background: #1d1d42;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-size: 18px;
  font-weight: 400;
  min-width: 250px;
  white-space: normal;
  word-break: break-word;
  position: relative;
  transition: 0.4s ease-in-out 0s;
}


.radio-item label:after,
.radio-item label:before {
  content: "";
  color: white;
  position: absolute;
  border-radius: 50%;
}

.radio-item label:after {
  height: 19px;
  width: 19px;
  border: 2px solid #524eee;
  left: 19px;
  top: calc(50% - 12px);
}

.radio-item label:before {
  background: #524eee;
  height: 20px;
  width: 20px;
  left: 21px;
  top: calc(50%-5px);
  transform: scale(5);
  opacity: 0;
  visibility: hidden;
  transition: 0.4s ease-in-out 0s;
}

.radio-item [type="radio"]:checked~label {
  border-color: #524eee;
}

.radio-item [type="radio"]:checked~label::before {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
}

.countdown-timer {
  display: flex;
  justify-content: end;
  align-items: center;
}

.timer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dial {
  width: 100px;
  height: 100px;
  border: 8px solid #ccc;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  transform: rotate(270deg);
  /* Rotate the dial to start from the top */
  transition: transform 1s linear;
}

.indicator {
  position: absolute;
  width: 50%;
  height: 2px;
  background-color: #f00;
  top: 50%;
  left: 50%;
  transform-origin: left;
  transform: translateX(-50%);
}

.time {
  font-size: 24px;
  margin-top: 10px;
}
</style>
