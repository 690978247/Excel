import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/common.css'
// import $ from 'jquery'
import VueDraggableResizable from 'vue-draggable-resizable'

// optionally import default styles
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.component('vue-draggable-resizable', VueDraggableResizable)
Vue.config.productionTip = false
// Vue.prototype.$ = $

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
