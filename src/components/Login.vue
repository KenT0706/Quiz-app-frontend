<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-body">
            <alert :message="error" type="danger" v-show="error"></alert>
            <h3 class="card-title text-center">User Login</h3>
            <form @submit.prevent="loginUser">
              <div class="form-group mb-3">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" v-model="formData.email" required>
              </div>
              <div class="form-group mb-3">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" v-model="formData.password" required>
              </div>
              <div class="d-flex justify-content-between">
                <RouterLink style="color:white; text-decoration: none;" to="/Register">
                  <button type="button" class="btn btn-secondary me-auto">
                    Register
                  </button>
                </RouterLink>
                <button type="submit" class="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  
<script>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import api from '../api';

export default {
  props: {
    navbarRefreshHandler: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const formData = ref({
      email: "",
      password: ""
    });
    const error = ref(false);


    const router = useRouter();

    const loginUser = async () => {
      
      try {
        const response = await api.login(formData.value);
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('username', response.data.username);
          props.navbarRefreshHandler()
          router.push("/create-quiz");
        } else {
        }
      } catch (err) {
        error.value = err.response.data.message;
      }

    };

    return {
      error,
      formData,
      loginUser
    };
  }
};
</script>

  