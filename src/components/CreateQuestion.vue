<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Add Quiz Question</h3>
            <form @submit.prevent="addOrEditQuestion">
              <div class="form-group mb-3">
                <label for="timeLimit">Time Limit (minutes)</label>
                <input
                  type="number"
                  class="form-control"
                  id="timeLimit"
                  v-model.number="timeLimitInMinutes"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <label for="questionText">Question</label>
                <input
                  type="text"
                  class="form-control"
                  id="questionText"
                  v-model="question.questionText"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <label for="optionA">Option A</label>
                <input
                  type="text"
                  class="form-control"
                  id="optionA"
                  v-model="question.optionA"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <label for="optionB">Option B</label>
                <input
                  type="text"
                  class="form-control"
                  id="optionB"
                  v-model="question.optionB"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <label for="optionC">Option C</label>
                <input
                  type="text"
                  class="form-control"
                  id="optionC"
                  v-model="question.optionC"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <label for="optionD">Option D</label>
                <input
                  type="text"
                  class="form-control"
                  id="optionD"
                  v-model="question.optionD"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <label for="optionE">Option E</label>
                <input
                  type="text"
                  class="form-control"
                  id="optionE"
                  v-model="question.optionE"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <label for="optionF">Option F</label>
                <input
                  type="text"
                  class="form-control"
                  id="optionF"
                  v-model="question.optionF"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <label>Correct Answer(s)</label>
                <div v-for="option in ['A', 'B', 'C', 'D', 'E', 'F']" :key="option">
                  <input
                    type="checkbox"
                    :id="'correctAnswer' + option"
                    :value="option"
                    v-model="question.correctAnswer"
                  />
                  <label :for="'correctAnswer' + option">Option {{ option }}</label>
                </div>
              </div>
              <div class="form-group mb-3">
                <label for="scorePerQuestion">Score per Question</label>
                <input
                  type="number"
                  class="form-control"
                  id="scorePerQuestion"
                  v-model.number="question.scorePerQuestion"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <label for="bonusScore">Bonus Score for Quick Answer</label>
                <input
                  type="number"
                  class="form-control"
                  id="bonusScore"
                  v-model.number="question.bonusScore"
                  required
                />
              </div>
              <div class="form-group mb-3">
                <label for="bonusTimeLimit">Bonus Time Limit (seconds)</label>
                <input
                  type="number"
                  class="form-control"
                  id="bonusTimeLimit"
                  v-model.number="question.bonusTimeLimit"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary">
                {{ editIndex === -1 ? "Add Question" : "Edit Question" }}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Added Questions</h3>
            <ul class="list-group">
              <li
                class="list-group-item"
                v-for="(q, index) in addedQuestions"
                :key="index"
              >
                <div class="d-flex justify-content-between">
                  <div class="">
                    <span>
                      {{ q.questionText }}
                    </span>
                    <br />
                    <div
                      style="font-size: 12px"
                      :class="{'text-success fw-bold': q.correctAnswer.includes('A'), 'text-secondary': !q.correctAnswer.includes('A'), 'me-1': true}"
                    >
                      Option A: {{ q.optionA }}
                    </div>
                    <div
                      style="font-size: 12px"
                      :class="{'text-success fw-bold': q.correctAnswer.includes('B'), 'text-secondary': !q.correctAnswer.includes('B'), 'me-1': true}"
                    >
                      Option B: {{ q.optionB }}
                    </div>
                    <div
                      style="font-size: 12px"
                      :class="{'text-success fw-bold': q.correctAnswer.includes('C'), 'text-secondary': !q.correctAnswer.includes('C'), 'me-1': true}"
                    >
                      Option C: {{ q.optionC }}
                    </div>
                    <div
                      style="font-size: 12px"
                      :class="{'text-success fw-bold': q.correctAnswer.includes('D'), 'text-secondary': !q.correctAnswer.includes('D'), 'me-1': true}"
                    >
                      Option D: {{ q.optionD }}
                    </div>
                    <div
                      style="font-size: 12px"
                      :class="{'text-success fw-bold': q.correctAnswer.includes('E'), 'text-secondary': !q.correctAnswer.includes('E'), 'me-1': true}"
                    >
                      Option E: {{ q.optionE }}
                    </div>
                    <div
                      style="font-size: 12px"
                      :class="{'text-success fw-bold': q.correctAnswer.includes('F'), 'text-secondary': !q.correctAnswer.includes('F'), 'me-1': true}"
                    >
                      Option F: {{ q.optionF }}
                    </div>
                    <div style="font-size: 12px">
                      Score per Question: {{ q.scorePerQuestion }}
                    </div>
                    <div style="font-size: 12px">
                      Bonus Score: {{ q.bonusScore }}
                    </div>
                  </div>
                  <div class="btn-group">
                    <button
                      class="btn-sm btn btn-warning"
                      @click="editQuestion(index)"
                    >
                      Edit
                    </button>
                    <button
                      class="btn-sm btn btn-danger"
                      @click="showDeleteConfirmation(index)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Attempt History</h3>
            <table class="table table-striped">
              <thead>
                <th>Avatar</th>
                <th>Name</th>
                <th>Score</th>
                <th>Attempt Date</th>
              </thead>
              <tbody>
                <tr v-for="r in results">
                  <td>
                    <img
  width="50"
  :src="avatars[r.avatarId - 1]"
  alt=""
/>
                  </td>
                  <td>{{ r.name }}</td>
                  <td>{{ r.result }}</td>
                  <td>{{ r.createdAt }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import api from "../api";

import avatar1 from "@/assets/1.jpg";
import avatar2 from "@/assets/2.jpg";
import avatar3 from "@/assets/3.jpg";
import avatar4 from "@/assets/4.jpg";
import avatar5 from "@/assets/5.jpg";
import avatar6 from "@/assets/6.jpg";
import avatar7 from "@/assets/7.jpg";
import avatar8 from "@/assets/8.jpg";
import avatar9 from "@/assets/9.jpg";
import avatar10 from "@/assets/10.jpg";
import avatar11 from "@/assets/11.jpg";
import avatar12 from "@/assets/12.jpg";
import avatar13 from "@/assets/13.jpg";
import avatar14 from "@/assets/14.jpg";
import avatar15 from "@/assets/15.jpg";
import avatar16 from "@/assets/16.jpg";
import avatar17 from "@/assets/17.jpg";
import avatar18 from "@/assets/18.jpg";

export default {
  props: {
    quizId: String,
  },
  data() {
    return {
      question: {
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        optionE: "",
        optionF: "",
        correctAnswer: [], // Now an array
        timeLimit: 0,
        scorePerQuestion: 5, // Default score per question
        bonusScore: 5, // Default bonus score
      },
      addedQuestions: [],
      results: [],
      editIndex: -1,
      deleteIndex: -1,
      avatars: [
        avatar1,
        avatar2,
        avatar3,
        avatar4,
        avatar5,
        avatar6,
        avatar7,
        avatar8,
        avatar9,
        avatar10,
        avatar11,
        avatar12,
        avatar13,
        avatar14,
        avatar15,
        avatar16,
        avatar17,
        avatar18,
      ],
    };
  },
  computed: {
    timeLimitInMinutes: {
      get() {
        return this.question.timeLimit / 60;
      },
      set(value) {
        this.question.timeLimit = value * 60;
      },
    },
  },
  methods: {
    async addOrEditQuestion() {
      if (this.validateQuestion(this.question)) {
        try {
          // Convert correctAnswer to an array
          const payload = {
            ...this.question,
            correctAnswer: this.question.correctAnswer.map(answer => answer.toUpperCase()),
            scorePerQuestion: this.question.scorePerQuestion,
            bonusScore: this.question.bonusScore,
            bonusTimeLimit: this.question.bonusTimeLimit,
          };

          if (this.editIndex === -1) {
            const response = await api.createQuestion(this.quizId, payload);
            this.addedQuestions.push(response.data);
          } else {
            const questionId = this.addedQuestions[this.editIndex]._id;
            const response = await api.putQuestion(
              this.quizId,
              questionId,
              payload
            );
            this.addedQuestions[this.editIndex] = response.data;
            this.editIndex = -1;
          }
          this.resetQuestion();
        } catch (error) {
          console.error(error);
          alert("Error adding/editing the question. Please try again.");
        }
      }
    },
    async editQuestion(index) {
      this.question = { ...this.addedQuestions[index] };
      this.editIndex = index;
    },
    async showDeleteConfirmation(index) {
      this.deleteIndex = index;
      if (window.confirm("Are you sure you want to delete this question?")) {
        this.deleteQuestion();
      } else {
        this.deleteIndex = -1;
      }
    },
    async deleteQuestion() {
      try {
        const questionId = this.addedQuestions[this.deleteIndex]._id;
        await api.deleteQuestion(this.quizId, questionId);
        this.addedQuestions.splice(this.deleteIndex, 1);
        this.deleteIndex = -1;
      } catch (error) {
        console.error(error);
        alert("Error deleting the question. Please try again.");
      }
    },
    validateQuestion(question) {
      if (!question.questionText) {
        alert("Please enter a Question.");
        return false;
      }

      if (
        !question.optionA ||
        !question.optionB ||
        !question.optionC ||
        !question.optionD ||
        !question.optionE ||
        !question.optionF
      ) {
        alert("Please provide all answer options (A, B, C, D, E, F).");
        return false;
      }

      if (!question.correctAnswer.length) {
        alert("Please select at least one correct answer.");
        return false;
      }

      // Check that all selected answers are valid options
      const validOptions = ["A", "B", "C", "D", "E", "F"];
      const invalidAnswers = question.correctAnswer.filter(
        (answer) => !validOptions.includes(answer.toUpperCase())
      );

      if (invalidAnswers.length) {
        alert("Invalid correct answer(s) selected.");
        return false;
      }

      return true;
    },
    resetQuestion() {
      this.question = {
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        optionE: "",
        optionF: "",
        correctAnswer: [],
        timeLimit: 0,
        scorePerQuestion: 5,
        bonusScore: 5,
        bonusTimeLimit: 25,
      };
      this.editIndex = -1;
    },
    async fetchAddedQuestions() {
  try {
    const response = await api.getQuestions(this.quizId);
    console.log("Fetched questions:", response.data.questions); // Check if scores exist
    this.addedQuestions = response.data.questions;
    this.results = response.data.results;
  } catch (error) {
    console.error("Error fetching added questions:", error);
  }
},
  },
  created() {
    this.fetchAddedQuestions();
  },
};
</script>