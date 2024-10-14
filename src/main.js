import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import naive from 'naive-ui';

import "vue3-toastify/dist/index.css";

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

const app = createApp(App);

app.use(router);
app.use(naive);

app.mount('#app');