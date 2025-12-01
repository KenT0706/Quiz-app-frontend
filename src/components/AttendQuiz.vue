//src/AttendQuiz.vue
<template>
  <div class="min-vh-100 d-flex align-items-center" style="background-color: #EBF3F6;">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <div class="card border-0 shadow-lg rounded-3 overflow-hidden">
            <div class="card-header bg-primary text-white py-4">
              <h1 class="h2 mb-0 text-center font-weight-bold">
                <span class="d-block mb-2">HR Training Consultancy</span>
                <span class="h4 font-weight-normal">Trainer / Consultant - Serene Yap</span>
              </h1>
            </div>

            <div class="card-body px-5 py-4">
              <div class="mb-4">
                <div class="row row-cols-2 row-cols-md-4 g-2">
                  <div class="col">
                    <img src="@/assets/1.png" class="img-fluid rounded" alt="Trainer teaching HR policies 1">
                  </div>
                  <div class="col">
                    <img src="@/assets/2.png" class="img-fluid rounded" alt="Trainer teaching HR policies 2">
                  </div>
                  <div class="col">
                    <img src="@/assets/3.png" class="img-fluid rounded" alt="Trainer teaching HR policies 3">
                  </div>
                  <div class="col">
                    <img src="@/assets/4.png" class="img-fluid rounded" alt="Trainer teaching HR policies 4">
                  </div>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label text-secondary fw-bold">Quiz Pin</label>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="fas fa-key text-primary"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': errors.enteredQuizPin }"
                    placeholder="Enter Quiz Pin"
                    v-model="enteredQuizPin"
                    @keyup.enter="checkQuiz"
                  >
                </div>
                <div v-if="errors.enteredQuizPin" class="text-danger small mt-2">
                  <i class="fas fa-exclamation-circle me-2"></i>{{ errors.enteredQuizPin }}
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label text-secondary fw-bold">Your Name</label>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="fas fa-user text-primary"></i>
                  </span>
                  <input
                    type="text"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': errors.enteredQuizTakerName }"
                    placeholder="Enter Your Name"
                    v-model="enteredQuizTakerName"
                    @keyup.enter="checkQuiz"
                  >
                    <button 
                    class="btn btn-outline-secondary" 
                    type="button" 
                    @click="setAnonymous"
                    :class="{ 'btn-secondary text-white': enteredQuizTakerName === 'Anonymous' }"
                  >
                    Anonymous
                  </button>
                </div>
                <div class="form-text">
                  Enter your name or click "Anonymous" to remain anonymous
                </div>
                <div v-if="errors.enteredQuizTakerName" class="text-danger small mt-2">
                  <i class="fas fa-exclamation-circle me-2"></i>{{ errors.enteredQuizTakerName }}
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-5">
                <div class="text-muted small">
                  Want to create a quiz?
                  <router-link
                    :to="loggedIn ? 'create-quiz' : 'register'"
                    class="text-decoration-none text-primary fw-bold"
                  >
                    {{ loggedIn ? 'Create Now' : 'Register' }}
                  </router-link>
                </div>
                <button
                  class="btn btn-primary btn-lg px-4 rounded-pill fw-bold"
                  @click="checkQuiz"
                >
                  <i class="fas fa-play me-2"></i>Start Quiz
                </button>
              </div>
            </div>
            <footer class="footer mt-auto py-3 bg-white border-top">
              <div class="container">
                <div class="row">
                  <div class="col text-start small text-muted">
                    Contact Us / Website: <a href="http://hr-training-consultancy.strikingly.com/" class="text-decoration-none">http://hr-training-consultancy.strikingly.com/</a><br>
                    Copyright @ 2025 HR Training Consultancy 201303134852 [All Rights Reserved]
                  </div>
                  <div class="col text-end small text-muted">
                    Developed by <b>Ken Teng</b>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import api from "@/api";

const router = useRouter();

export default {
  data() {
    return {
      loggedIn: localStorage.getItem('userId'),
      errors: {
        enteredQuizPin: null,
        enteredQuizTakerName: null,
      },
      enteredQuizPin: "",
      enteredQuizTakerName: "",
    };
  },
  methods: {
   setAnonymous() {
      this.enteredQuizTakerName = 'Anonymous';
    },
    async checkQuiz() {
      // Clear previous errors
      this.errors = {
        enteredQuizPin: null,
        enteredQuizTakerName: null,
      };

      // Validate inputs
      if (!this.enteredQuizPin) {
        this.errors.enteredQuizPin = 'Quiz Pin is required!';
        return;
      }

      if (!this.enteredQuizTakerName) {
        this.errors.enteredQuizTakerName = 'Name is required!';
        return;
      }

      try {
        this.startQuiz();
      } catch (error) {
        console.error('Error checking quiz:', error);
        this.errors.enteredQuizPin = 'Invalid quiz pin or server error';
      }
    },
    startQuiz() {
      try {
        this.$router.push({
          name: "StartQuiz",
          params: {
            quizPin: this.enteredQuizPin,
            quizTakerName: this.enteredQuizTakerName
          }
        });
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  }
};
</script>

<style scoped>
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.form-control {
  border-radius: 8px !important;
  border: 2px solid #e0e0e0;
}

.form-control:focus {
  border-color: #4e73ff;
  box-shadow: 0 0 0 3px rgba(78, 115, 255, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #4e73ff 0%, #3a56cc 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(78, 115, 255, 0.4);
}

.footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  z-index: 100;
  box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.05);
}

main {
  overflow: auto;
}
</style>