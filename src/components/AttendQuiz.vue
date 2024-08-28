<template>
  <div class="container mt-5 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="mb-4 smaller-title">HR Training Consultancy<br>Trainer / Consultant - Serene Yap</h1>
        <!-- Avatar Selection -->
        <div class="form-group mb-3">
          <label for="" class="form-label">Select your avatar</label>
          <div class="avatar-selection">
            <div v-for="avatar in avatars" :key="avatar.id" @click="selectAvatar(avatar.id)"
              :class="{ selected: selectedAvatar === avatar.id }">
              <img :src="requireAvatar(avatar.filename)" alt="Avatar">
            </div>
          </div>
          <span class="text-danger">{{ errors.selectedAvatar }}</span>
        </div>
        <div class="form-group mb-3">
          <label for="" class="form-label">Quiz Pin</label>
          <input type="text" :class="`form-control ${errors.enteredQuizPin != null ? 'is-invalid' : ''}`"
          placeholder="Enter Quiz Pin" v-model="enteredQuizPin">
          <span class="text-danger">{{ errors.enteredQuizPin }}</span>
        </div>
        <div class="form-group mb-3">
          <label for="" class="form-label">Name</label>
          <input type="text" :class="`form-control ${errors.enteredQuizTakerName != null ? 'is-invalid' : ''}`"
          placeholder="Enter Name" v-model="enteredQuizTakerName">
          <span class="text-danger">{{ errors.enteredQuizTakerName }}</span>
        </div>
        <div class="input-group-append">
          <button class="btn btn-primary" @click="startQuiz">Start Quiz</button>
          <div style="float:right">
            Want to create Quiz?
            <router-link v-if="!loggedIn" to="register">Register</router-link>
            <router-link v-else to="create-quiz">Create</router-link>
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
.smaller-title {
  font-size: 1.5rem; /* Adjust the size as needed */
}
.avatar-selection {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 10px;
  cursor: pointer;
}

.avatar-selection img {
  width: 100px;
  height: 150px;
  border: 2px solid transparent;
}

.avatar-selection .selected img {
  border-color: #007bff;
  /* Highlight the selected avatar */
}
</style>
