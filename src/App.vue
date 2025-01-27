

<template>
  <navbar :username="username" :key="username"></navbar>
  <div id="app">
    <router-view :navbarRefreshHandler="updateUsername"></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: localStorage.getItem('username', null)
    };
  },
  methods: {
    updateUsername() {
      this.username = localStorage.getItem('username', null);
    }
  }
}
</script>

