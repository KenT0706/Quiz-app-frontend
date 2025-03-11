<template>
  <div class="container mt-5">
    <div class="row">
      <!-- Form for Adding/Editing a Question -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">
              {{ editIndex === -1 ? "Add Quiz Question" : "Edit Quiz Question" }}
            </h3>
            <form @submit.prevent="addOrEditQuestion">
              <!-- Time Limit (in minutes) -->
              <div class="form-group mb-3">
                <label for="timeLimit">Time Limit (minutes)</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="timeLimitInMinutes"
                  required
                />
              </div>
              <!-- Question Text -->
              <div class="form-group mb-3">
                <label>Question Text</label>
                <textarea
                  class="form-control"
                  v-model="question.questionText"
                  required
                  rows="4"
                ></textarea>
              </div>
              <!-- Question Type Selector -->
              <div class="form-group mb-3">
                <label for="questionType">Question Type</label>
                <select class="form-control" v-model="question.questionType" required>
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="open-ended">Open Ended</option>
                </select>
              </div>
              <!-- Multiple Choice Section -->
              <div v-if="question.questionType === 'multiple-choice'">
                <div
                  class="form-group mb-3"
                  v-for="option in ['A','B','C','D','E','F']"
                  :key="option"
                >
                  <label :for="'option' + option">Option {{ option }}</label>
                  <input
                    type="text"
                    class="form-control"
                    :id="'option' + option"
                    v-model="question['option' + option]"
                    required
                  />
                </div>
                <div class="form-group mb-3">
                  <label>Correct Answer(s)</label>
                  <div v-for="option in ['A','B','C','D','E','F']" :key="option">
                    <input
                      type="checkbox"
                      :value="option"
                      v-model="question.correctAnswer"
                    />
                    <label>Option {{ option }}</label>
                  </div>
                </div>
                <div class="form-group mb-3">
                  <label for="scorePerQuestion">Score per Question</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="question.scorePerQuestion"
                    required
                  />
                </div>
                <div class="form-group mb-3">
                  <label for="bonusScore">Bonus Score for Quick Answer</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="question.bonusScore"
                    required
                  />
                </div>
                <div class="form-group mb-3">
                  <label for="bonusTimeLimit">Bonus Time Limit (seconds)</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model.number="question.bonusTimeLimit"
                    required
                  />
                </div>
              </div>
              <button type="submit" class="btn btn-primary">
                {{ editIndex === -1 ? "Add Question" : "Edit Question" }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- List of Added Questions -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Added Questions</h3>
            <ul class="list-group">
              <li
                class="list-group-item"
                v-for="(q, index) in addedQuestions"
                :key="q._id || index"
              >
                <div class="d-flex justify-content-between">
                  <div>
                    <strong>{{ q.questionText }}</strong>
                    <br />
                    <span class="badge bg-secondary">{{ q.questionType }}</span>
                    <div v-if="q.questionType === 'multiple-choice'" style="font-size: 12px">
                      <div>Score: {{ q.scorePerQuestion }} (+{{ q.bonusScore }} bonus)</div>
                      <div
                        v-for="option in ['A','B','C','D','E','F']"
                        :key="option"
                        style="font-size: 12px"
                        :class="{
                          'text-success fw-bold': q.correctAnswer.includes(option),
                          'text-secondary': !q.correctAnswer.includes(option)
                        }"
                      >
                        Option {{ option }}: {{ q['option' + option] }}
                      </div>
                    </div>
                    <div v-else style="font-size: 12px">
                      Open-ended question
                    </div>
                    <div style="font-size: 12px">
                      Time Limit: {{ q.timeLimit / 60 }} minutes
                    </div>
                  </div>
                  <div class="btn-group">
                    <button class="btn btn-warning btn-sm" @click="editQuestion(index)">
                      Edit
                    </button>
                    <button class="btn btn-danger btn-sm" @click="showDeleteConfirmation(index)">
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Open-Ended Answers -->
      <div class="col-md-12 mt-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Open-Ended Answers</h3>
            <div class="answer-grid">
              <div v-for="answer in openEndedAnswers" :key="answer._id" class="answer-box">
  <h6>{{ answer.userId?.username || 'Anonymous' }}</h6>
  <p class="mb-0">{{ answer.answerText }}</p>
</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Attempt History -->
      <div class="col-md-12 mt-4">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Attempt History</h3>
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Attempt Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in results" :key="r._id">
                  <td>
                    <img width="50" :src="avatars[r.avatarId - 1]" alt="Avatar" />
                  </td>
                  <td>{{ r.name }}</td>
                  <td>{{ r.result }}</td>
                  <td>{{ new Date(r.createdAt).toLocaleString() }}</td>
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
import api from "../api";
import avatar1 from "@/assets/1.jpg";
// Import additional avatars as needed

export default {
  props: {
    quizId: String,
  },
  data() {
    return {
      question: {
        questionType: "multiple-choice",
        questionText: "",
        timeLimit: 60, // Default to 60 seconds (1 minute)
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        optionE: "",
        optionF: "",
        correctAnswer: [],
        scorePerQuestion: 5,
        bonusScore: 5,
        bonusTimeLimit: 25,
      },
      addedQuestions: [],
      openEndedAnswers: [],
      results: [],
      editIndex: -1,
      deleteIndex: -1,
      avatars: [avatar1 /*, add other avatars here */],
    };
  },
  computed: {
    timeLimitInMinutes: {
      get() {
        return Math.floor(this.question.timeLimit / 60);
      },
      set(value) {
        this.question.timeLimit = parseInt(value) * 60;
      },
    },
  },
  methods: {
    async addOrEditQuestion() {
      if (this.validateQuestion()) {
        try {
          // Remove _id if exists and build payload
          const { _id, ...questionData } = this.question;
          let payload = { ...questionData };

          if (this.question.questionType === "open-ended") {
            // For open-ended questions, clear extra multiple-choice fields
            payload.optionA = "";
            payload.optionB = "";
            payload.optionC = "";
            payload.optionD = "";
            payload.optionE = "";
            payload.optionF = "";
            payload.correctAnswer = [];
            payload.scorePerQuestion = 0;
            payload.bonusScore = 0;
            payload.bonusTimeLimit = 0;
          } else {
            // For multiple-choice, ensure correct answers are uppercase
            payload.correctAnswer = this.question.correctAnswer.map((ans) =>
              ans.toUpperCase()
            );
          }

          if (this.editIndex === -1) {
            const response = await api.createQuestion(this.quizId, payload);
            this.addedQuestions.push(response.data);
          } else {
            const questionId = this.addedQuestions[this.editIndex]._id;
            const response = await api.putQuestion(this.quizId, questionId, payload);
            this.addedQuestions.splice(this.editIndex, 1, response.data);
            this.editIndex = -1;
          }
          this.resetQuestion();
          this.fetchOpenEndedAnswers();
        } catch (error) {
          console.error("Full Error:", error.response?.data);
          alert(`Error: ${error.response?.data?.message || error.message}`);
        }
      }
    },
    validateQuestion() {
      if (!this.question.questionText) {
        alert("Please enter a question text.");
        return false;
      }
      if (this.question.timeLimit <= 0) {
        alert("Please enter a valid time limit.");
        return false;
      }
      if (this.question.questionType === "multiple-choice") {
        if (!this.question.optionA || !this.question.optionB) {
          alert("Options A and B are required for multiple-choice questions.");
          return false;
        }
        if (this.question.correctAnswer.length === 0) {
          alert("Please select at least one correct answer.");
          return false;
        }
        const validOptions = ["A", "B", "C", "D", "E", "F"];
        const invalidAnswers = this.question.correctAnswer.filter(
          (ans) => !validOptions.includes(ans.toUpperCase())
        );
        if (invalidAnswers.length) {
          alert("Invalid correct answer(s) selected.");
          return false;
        }
      }
      return true;
    },
    resetQuestion() {
      this.question = {
        questionType: "multiple-choice",
        questionText: "",
        timeLimit: 60,
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        optionE: "",
        optionF: "",
        correctAnswer: [],
        scorePerQuestion: 5,
        bonusScore: 5,
        bonusTimeLimit: 25,
      };
      this.editIndex = -1;
    },
    async fetchAddedQuestions() {
      try {
        const response = await api.getQuestions(this.quizId);
        this.addedQuestions = response.data.questions;
        this.results = response.data.results;
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    },
    async fetchOpenEndedAnswers() {
  try {
    const openEndedIds = this.addedQuestions
      .filter(q => q.questionType === 'open-ended')
      .map(q => q._id);

    const allAnswers = await Promise.all(
      openEndedIds.map(id =>
        api.getAnswers(id).then(res => res.data).catch(error => {
          console.error(`Error fetching answers for question ${id}:`, error);
          return [];
        })
      )
    );

    this.openEndedAnswers = allAnswers.flat();
  } catch (error) {
    console.error("Error fetching answers:", error);
  }
},
    editQuestion(index) {
      this.question = { ...this.addedQuestions[index] };
      this.editIndex = index;
    },
    showDeleteConfirmation(index) {
      if (confirm("Are you sure you want to delete this question?")) {
        this.deleteIndex = index;
        this.deleteQuestion();
      }
    },
    async deleteQuestion() {
      try {
        const questionId = this.addedQuestions[this.deleteIndex]._id;
        await api.deleteQuestion(this.quizId, questionId);
        this.addedQuestions.splice(this.deleteIndex, 1);
        this.deleteIndex = -1;
        this.fetchOpenEndedAnswers();
      } catch (error) {
        console.error(error);
        alert("Error deleting question.");
      }
    },
    async initializeData() {
  await this.fetchAddedQuestions();
  await this.fetchOpenEndedAnswers();
},
async refreshData() {
  await this.fetchAddedQuestions();
  await this.fetchOpenEndedAnswers();
},
  },
  created() {
    this.fetchAddedQuestions();
    this.fetchOpenEndedAnswers();
    this.refreshData();
    this.initializeData();
    this.polling = setInterval(this.refreshData, 10000);
  },
  beforeUnmount() {
    clearInterval(this.polling);
  }
};
</script>

<style scoped>
.answer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
  max-height: 500px;
  overflow-y: auto;
}

.answer-box {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
}

.answer-box h6 {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.answer-box p {
  font-size: 0.85rem;
  color: #4a5568;
}
</style>
