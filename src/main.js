import { createApp } from 'vue'; // Import 'createApp' from Vue 3
import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';
import Alert from './components/Alert.vue'
import Navbar from './components/Navbar.vue'

const app = createApp(App);
app.component('alert', Alert)
.component('navbar', Navbar);
app.use(router);
app.mount('#app');
