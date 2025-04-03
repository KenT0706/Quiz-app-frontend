// api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://quiz-app-backend-blue.vercel.app',
  // baseURL: 'http://localhost:3000/',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config } = error;
    if (error.response && error.response.status === 401) {
      // Skip redirect for login/register routes
      if (config.url.includes('/auth/login') || config.url.includes('/auth/register')) {
        return Promise.reject(error);
      }
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default {
  // Auth endpoints.
  login(loginUser) {
    return api.post('/auth/login', loginUser);
  },
  registerUser(user_data) {
    return api.post('/auth/register', user_data);
  },

  // Questions endpoints.
  getQuestions(quiz_id) {
    return api.get(`quiz/${quiz_id}/questions`);
  },
  submitQuiz(quiz_id, quiz_data) {
    return api.post(`/quiz/${quiz_id}/submit`, quiz_data);
  },
  getQuestionsByQuizPin(quiz_pin) {
    return api.get(`quiz/questions/${quiz_pin}`);
  },
  putQuestion(quiz_id, question_id, question) {
    return api.put(`quiz/${quiz_id}/questions/edit/${question_id}`, question);
  },
  deleteQuestion(quiz_id, question_id) {
    return api.delete(`quiz/${quiz_id}/questions/${question_id}/delete`);
  },
  getQuestionTime(question_id) {
    return api.get(`quiz/questions/getTimeLimit/${question_id}`);
  },
  createQuestion(quiz_id,question) {
    return api.post(`quiz/${quiz_id}/questions/add`, question);
  },

  // Quiz endpoints.
  saveQuizResult(quiz_id, quiz_data) {
    return api.post(`/quiz/${quiz_id}/saveResult`, quiz_data);
  },
  getQuizResults(quiz_pin) {
    return api.get(`quiz/results/${quiz_pin}`);
  },
  createQuiz(quiz_data) {
    return api.post('quiz/add', quiz_data);
  },
  putQuiz(quiz_id, quiz) {
    return api.put(`quiz/edit/${quiz_id}`, quiz);
  },
  getQuizzes() {
    return api.get('/quiz');
  },
  deleteQuiz(quiz_id) {
    return api.delete(`quiz/${quiz_id}/delete`);
  },
  submitAnswer(answerData) {
    return api.post('/answers/submit', answerData); // Remove /quiz from path
  },
  getAnswers(questionId) {
    return api.get(`/answers/${questionId}`);
  },
  deleteAnswersByQuestionId(questionId) {
    return api.delete(`/answers/question/${questionId}/delete`);
  },
  deleteAnswer(answerId) {
    return api.delete(`/answers/${answerId}/delete`); // Add this line
  },
  deleteQuizResults(quizId) {
    return api.delete(`quiz/${quizId}/results/delete`);
  },
  duplicateQuiz(quizId) {
    return api.post(`quiz/${quizId}/duplicate`);
  }
};
