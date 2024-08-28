<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Add Quiz Question</h3>
            <form @submit.prevent="addOrEditQuiz">
              <div class="form-group mb-3">
                <label for="optionF">Title</label>
                <input type="text" class="form-control" id="optionF" v-model="quiz.title" required>
              </div>
              <div class="form-group mb-3">
                <label for="correctAnswer">scenario</label>
                <textarea class="form-control" id="scenario" v-model="quiz.scenario" required rows="4"></textarea>
              </div>
              <button type="submit" class="btn btn-primary">
                {{ editIndex === -1 ? 'Create Quiz' :
                  'Edit Quiz' }}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">Added Quizzes</h3>
            <ul class="list-group">
              <li class="list-group-item" v-for="(q, index) in addedQuizzes" :key="index">
                <div class="d-flex justify-content-between">
                  <div class="">
                    <span>
                      <RouterLink :to="`/quiz/${q._id}/questions`">
                        {{ q.title }}
                      </RouterLink>
                    </span>
                    <br>
                    <span style="font-size: 12px;" class="text-secondary">
                      Quiz Pin: {{ q.quizPin }}
                    </span>
                  </div>
                  <div class="btn-group">
                    <button class="btn-sm btn btn-warning" @click="editQuiz(index)">Edit</button>
                    <button class="btn-sm btn btn-danger" @click="showDeleteConfirmation(index)">Delete</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import api from "../api";
export default {
  data() {
    return {
      quiz: {
        scenario: "",
        title: ""
      },
      addedQuizzes: [],
      editIndex: -1,
      deleteIndex: -1
    };
  },
  methods: {
    async addOrEditQuiz() {
      console.log("Quiz before saving:", {
   _id: this.quiz._id,
   title: this.quiz.title,
   createdBy: this.quiz.createdBy,
   quizPin: this.quiz.quizPin,
   scenario: this.quiz.scenario,
   __v: this.quiz.__v
})

   console.log("Quiz before saving:", this.quiz);  // Check if scenario is present here
   if (this.validateQuiz(this.quiz)) {
    try {
   if (this.editIndex === -1) {
      const response = await api.createQuiz(this.quiz);
      console.log("API Response:", response.data);
      this.addedQuizzes.push(response.data);
   } else {
      const quizId = this.addedQuizzes[this.editIndex]._id;
      const response = await api.putQuiz(quizId, this.quiz);
      console.log("API Response:", response.data);
      this.addedQuizzes[this.editIndex] = {
         ...this.addedQuizzes[this.editIndex],
         ...response.data
      };
   }
   this.resetQuiz();
} catch (error) {
   console.error("Error in addOrEditQuiz:", error.response ? error.response.data : error.message);
   alert("Error adding/editing the quiz. Please try again.");
}
   }
}
,
    async editQuiz(index) {
  this.quiz = { ...this.addedQuizzes[index] };
  this.editIndex = index;
},
    // async getTimeLimit() {
    //   try {
    //     if (this.editIndex === -1) {
    //       const response = await api.getQuestionTime(this.question.quizPin);
    //       this.question.timeLimit = response.data;
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     alert("Error adding/editing the question. Please try again.");
    //   }
    // },
    async showDeleteConfirmation(index) {
      this.deleteIndex = index;
      if (window.confirm("Are you sure you want to delete this quiz?")) {
        this.deleteQuiz();
      } else {
        this.deleteIndex = -1;
      }
    },
    async deleteQuiz() {
      try {
        const questionId = this.addedQuizzes[this.deleteIndex]._id;
        await api.deleteQuiz(questionId);
        this.addedQuizzes.splice(this.deleteIndex, 1);
        this.deleteIndex = -1;
      } catch (error) {
        console.error(error);
        alert("Error deleting the question. Please try again.");
      }
    },
    validateQuiz(quiz) {

      if (!quiz.scenario) {
        alert("Please enter a scenario.");
        return false;
      }


      if (!quiz.title) {
        alert("Please quiz title.");
        return false;
      }

      return true;
    },
    resetQuiz() {
   this.quiz = {
      scenario: "",
      title: "",
   };
   this.editIndex = -1;
},
    async fetchAddedQuizzes() {
      try {
        const response = await api.getQuizzes();
        this.addedQuizzes = response.data;
      } catch (error) {
        console.error("Error fetching added quizzes:", error);
      }
    }
  },
  created() {
    this.fetchAddedQuizzes();
  }
};
</script>
  