import Vue from 'vue'
import App from './App'
// import Vuex from 'vuex'
import store from "./store";
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from "./router";

Vue.use(ElementUI)
// Vue.use(Vuex)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
