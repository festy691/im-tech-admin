/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import mitt from 'mitt';
import Messaging from '@/js/firebase.config';

const emitter = mitt();

const app = createApp(App);

app.config.globalProperties.emitter = emitter;
app.config.globalProperties.$messaging = Messaging

registerPlugins(app)

app.mount('#app')
