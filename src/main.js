import { createApp } from 'vue';
import App from './App.vue';
import i18n from './i18n';
import router from './router';
import naive from 'naive-ui';

import "vue3-toastify/dist/index.css";

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

const app = createApp(App);

app.use(i18n);
app.use(router);
app.use(naive);

app.mount('#app');