import { createApp } from 'vue'; // Import 'createApp' from Vue 3
import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Use the full bundle
import Alert from './components/Alert.vue';
import Navbar from './components/Navbar.vue';

const app = createApp(App);

// Register global components
app.component('Alert', Alert); // Use PascalCase for consistency
app.component('Navbar', Navbar);

// Use Vue Router
app.use(router);

// Mount the app
app.mount('#app');