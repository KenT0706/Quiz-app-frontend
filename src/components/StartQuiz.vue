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
          <!-- Multiple Choice Question -->
          <div v-if="questions[currentQuestionIndex].questionType === 'multiple-choice'">
            <div class="radio-item" v-for="option in ['A', 'B', 'C', 'D', 'E', 'F']" :key="option">
              <input type="radio" :id="'option' + option" class="form-check-input"
                :name="'answer_' + currentQuestionIndex" :value="option"
                v-model="selectedAnswers[currentQuestionIndex]">
              <label :for="'option' + option">{{ questions[currentQuestionIndex]['option' + option] }}</label>
            </div>
          </div>

          <!-- Open-Ended Question -->
          <div v-else>
            <textarea class="form-control" v-model="selectedAnswers[currentQuestionIndex]"
              placeholder="Enter your answer (max 100 words)" rows="4" maxlength="500"></textarea>
          </div>
        </div>
      </div>
    </div>
    <!-- Next Question Button -->
    <div v-if="currentQuestionIndex < questions.length - 1 && !showResults" class="mt-3">
      <button @click="nextQuestion" class="btn btn-primary" :disabled="!selectedAnswers[currentQuestionIndex]">
        Next Question
      </button>
    </div>
    <!-- Submit Button -->
    <div v-else-if="questions.length > 0 && currentQuestionIndex === questions.length - 1 && !showResults"
      class="text-center mt-3">
      <button @click="submitQuiz" class="btn btn-primary" :disabled="disableSubmitButton">
        Submit Answers
      </button>
    </div>
    <div v-if="showResults" class="text-center">
      <h2>Your Score: {{ score }}</h2>
      <button class="btn btn-primary mt-3" v-if="showLeaderBoardButton" @click="goToLeaderBoard">
        Go to Leader Board
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import api from "../api";

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
      timer: 0, // Timer in seconds
      totalTime: 0,
      timeElapsed: 0,
      currentQuestionIndex: 0,
      timerInterval: null,
      disableSubmitButton: false,
      showLeaderBoardButton: false,
      quickAnswer: [],
      answerTimes: [],
      startTime: null,
      showSubmitButton: false
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
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    },
    canProceed() {
      return (
        this.selectedAnswers[this.currentQuestionIndex] !== undefined &&
        this.selectedAnswers[this.currentQuestionIndex] !== null &&
        this.selectedAnswers[this.currentQuestionIndex] !== ""
      );
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
          // Initialize timer for the first question
          this.timer = this.questions[0].timeLimit;
          this.totalTime = this.questions[0].timeLimit;
          this.startTimer();
          this.startTime = Date.now();
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
          clearInterval(this.timerInterval);
          if (this.currentQuestionIndex < this.questions.length - 1) {
            this.nextQuestion();
          } else {
            this.submitQuiz(); // Automatically submit when timer runs out
          }
        }
      }, 1000);
    },
    nextQuestion() {
      if (this.selectedAnswers[this.currentQuestionIndex] || this.timer === 0) {
        const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        this.answerTimes[this.currentQuestionIndex] = elapsedTime;
        if (this.currentQuestionIndex < this.questions.length - 1) {
          if (this.timer > this.totalTime / 2) {
            this.quickAnswer.push(true);
          }
          this.currentQuestionIndex++;
          clearInterval(this.timerInterval);
          this.timer = this.questions[this.currentQuestionIndex].timeLimit;
          this.totalTime = this.questions[this.currentQuestionIndex].timeLimit;
          this.startTimer();
          this.startTime = Date.now();
        }
      }
    },
    async submitQuiz() {
  try {
    // Validate all required data first
    if (!this.quiz?._id) {
      throw new Error('Invalid quiz data');
    }

    // Submit answers for scoring
    const scoreResponse = await api.submitQuiz(this.quiz._id, {
      answers: this.questions.map((q, index) => ({
        questionId: q._id,
        answerText: this.selectedAnswers[index] || "",
        answerTime: this.answerTimes[index] || 0
      }))
    });

    // Save result
    await api.saveQuizResult(this.quiz._id, {
      currentScore: scoreResponse.data.score,
      name: this.quizTakerName,
      avtId: this.avatarId
    });

    const userId = localStorage.getItem('userId');

    // Submit open-ended answers
    const openEndedAnswers = this.questions
      .map((q, index) => ({
        questionId: q._id,
        answerText: this.selectedAnswers[index] || "",
        quizPin: Number(this.quizPin)
      }))
      .filter((a, i) => 
        this.questions[i].questionType === 'open-ended' && 
        a.answerText.trim().length > 0
      );

    const submissionResults = await Promise.allSettled(
      openEndedAnswers.map(answer => 
        api.submitAnswer(answer)
          .then(res => {
            console.log('Answer submitted:', answer.questionId, res.data);
            return res;
          })
          .catch(err => {
            console.error('Error submitting answer:', answer.questionId, err.response?.data || err.message);
            throw err;
          })
      )
    );

    submissionResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error('Failed to submit answer for question:', openEndedAnswers[index].questionId);
      }
    });

    this.score = scoreResponse.data.score;
    this.showResults = true;
  } catch (error) {
    console.error("Submission error:", error);
    alert(`Error submitting quiz: ${error.response?.data?.message || error.message}`);
  }
},
    goToLeaderBoard() {
      this.$router.push({
        name: "Result",
        params: { quizPin: this.quizPin }
      });
    }
  }
};
</script>
