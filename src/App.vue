import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueApexChart from 'vue-apexcharts'

Vue.config.productionTip = false

Vue.use(VueApexChart);
Vue.component('apexchart', VueApexChart);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')