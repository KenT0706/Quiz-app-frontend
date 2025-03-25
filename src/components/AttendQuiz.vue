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
              <!-- Avatar Selection -->
              <div class="mb-4">
                <h3 class="h5 mb-3 text-secondary">Choose Your Avatar</h3>
                <div class="avatar-grid">
                  <div 
                    v-for="avatar in avatars" 
                    :key="avatar.id" 
                    @click="selectAvatar(avatar.id)"
                    class="avatar-item"
                    :class="{ 'avatar-selected': selectedAvatar === avatar.id }"
                  >
                    <img 
                      :src="requireAvatar(avatar.filename)" 
                      alt="Avatar"
                      class="avatar-image"
                    >
                  </div>
                </div>
                <div v-if="errors.selectedAvatar" class="text-danger small mt-2">
                  <i class="fas fa-exclamation-circle me-2"></i>{{ errors.selectedAvatar }}
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
                  >
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
                  @click="startQuiz"
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
            Copyright @ 2025 HR Training Consultancy 201303134852 (002229121-W) [All Rights Reserved]
          </div>
          <div class="col text-end small text-muted">
            Developed by Ken Teng
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

const router = useRouter();

export default {
  data() {
    return {
      loggedIn: localStorage.getItem('userId'),
      errors: {
        enteredQuizPin: null,
        enteredQuizTakerName: null,
        selectedAvatar: null,
      },
      enteredQuizPin: "",
      enteredQuizTakerName: "",
      avatars: [
        { id: 1, filename: avatar1 },
        { id: 2, filename: avatar2 },
        { id: 3, filename: avatar3 },
        { id: 4, filename: avatar4 },
        { id: 5, filename: avatar5 },
        { id: 6, filename: avatar6 },
        { id: 7, filename: avatar7 },
        { id: 8, filename: avatar8 },
        { id: 9, filename: avatar9 },
        { id: 10, filename: avatar10 },
        { id: 11, filename: avatar11 },
        { id: 12, filename: avatar12 },
        { id: 13, filename: avatar13 },
        { id: 14, filename: avatar14 },
        { id: 15, filename: avatar15 },
        { id: 16, filename: avatar16 },
        { id: 17, filename: avatar17 },
        { id: 18, filename: avatar18 }
      ],
      selectedAvatar: null // Track the selected avatar ID
    };
  },
  methods: {
    selectAvatar(avatarId) {
      this.selectedAvatar = avatarId;
    },
    requireAvatar(filename) {
      switch (filename) {
        case avatar1:
          return avatar1;
        case avatar2:
          return avatar2;
        case avatar3:
          return avatar3;
        case avatar4:
          return avatar4;
        case avatar5:
          return avatar5;
        case avatar6:
          return avatar6;
        case avatar7:
          return avatar7;
        case avatar8:
          return avatar8;
        case avatar9:
          return avatar9;
        case avatar10:
          return avatar10;
        case avatar11:
          return avatar11;
        case avatar12:
          return avatar12;
        case avatar13:
          return avatar13;
        case avatar14:
          return avatar14;
        case avatar15:
          return avatar15;
        case avatar16:
          return avatar16;
        case avatar17:
          return avatar17;
        case avatar18:
          return avatar18;
        default:
          return null;
      }
    },
    startQuiz() {
      try {
        this.$router.push({
          name: "StartQuiz",
          params: {
            quizPin: this.enteredQuizPin,
            quizTakerName: this.enteredQuizTakerName,
            avatarId: this.selectedAvatar
          }
        });
      } catch (error) {
        if (!this.enteredQuizPin) {
          this.errors.enteredQuizPin = 'Quiz Pin is required!'
        }
        if (!this.enteredQuizTakerName) {
          this.errors.enteredQuizTakerName = 'Name is required!'
        }
        if (!this.selectedAvatar) {
          this.errors.selectedAvatar = 'Avatar selection is required!'
        }
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

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: 12px;
}

.avatar-item {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.avatar-item:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.avatar-selected {
  border-color: #4e73ff !important;
  box-shadow: 0 4px 15px rgba(78, 115, 255, 0.25);
}

.avatar-image {
  width: 100%;
  height: 60px;
  object-fit: cover;
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

/* Add footer styling */
.footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  z-index: 100;
  box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.05);
}

/* Ensure main content doesn't overflow */
main {
  overflow: auto;
}
</style>