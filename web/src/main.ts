import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/bootstrap'
import './plugins/codemirror'
import './plugins/fontawesome'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
