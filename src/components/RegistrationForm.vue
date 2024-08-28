
<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <div class="card">
          <div class="card-body">
            <alert :message="error" type="danger" v-show="error"></alert>

            <h3 class="card-title text-center">User Registration</h3>
            <form @submit.prevent="registerUser">
              <div class="form-group mb-3">
                <label for="username">Username</label>
                <input type="text" class="form-control" id="username" v-model="formData.username" required>
              </div>
              <div class="form-group mb-3">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" v-model="formData.email" required>
              </div>
              <div class="form-group mb-3">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" v-model="formData.password" required>
              </div>
              <!-- End of user type dropdown -->
              <div class="d-flex justify-content-between">
                <RouterLink style="color:white; text-decoration: none;" to="/Login">
                  <button type="button" class="btn btn-secondary">
                    Login
                  </button>
                </RouterLink>
                <button type="submit" class="btn btn-primary">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import api from '../api';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const formData = ref({
      username: '',
      email: '',
      password: '',
    });

    const router = useRouter();
    const error = ref(null);

    const registerUser = async () => {
      try {
        const response = await api.registerUser(formData.value);
        console.log('Registration successful:', response.data);
        router.push('/login');
      } catch (err) {
        // console.error('Registration error:', error);
        error.value = err.response.data.message;

      }
    };

    return {
      error,
      formData,
      registerUser,
    };
  },
};
</script>
