import { createRouter, createWebHistory } from "vue-router";
import RegistrationForm from "./components/RegistrationForm.vue";
import LoginForm from "./components/Login.vue";
import CreateQuiz from "./components/CreateQuiz.vue";
import CreateQuestion from "./components/CreateQuestion.vue";
import AttendQuiz from "./components/AttendQuiz.vue";
import StartQuiz from "./components/StartQuiz.vue";
import Result from "./components/Result.vue";
import Logout from './components/Logout.vue'
const routes = [
  {
    path: "/register", component: RegistrationForm, meta: {
      disableOnAuth: true,
    }
  },
  {
    path: "/login", component: LoginForm, meta: {
      disableOnAuth: true,
    }
  },
  {
    path: "/logout", component: Logout,
  },
  {
    path: "/create-quiz", component: CreateQuiz, meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/quiz/:quizId/questions", component: CreateQuestion, meta: {
      requiresAuth: true,
    },
    props: true

  },
  { path: "/", component: AttendQuiz },
  {
    path: "/start-quiz/:quizPin/:quizTakerName/:avatarId",
    name: "StartQuiz",
    component: StartQuiz,
    props: true
  },
  { path: "/result/:quizPin", name: "Result", component: Result, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && localStorage.getItem('userId') == null) {
    next("login");
  } else if (to.meta.disableOnAuth && localStorage.getItem('userId') != null) {
    next("/");
  } else {
    next();
  }
});


export default router;
