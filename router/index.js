import Vue from 'vue'
import Router from 'vue-router'
import Home from "../views/Home";
import Login from "../views/Login";
Vue.use(Router)


const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Register',
      name: 'Register',
      component: ()=>import("../views/Register") //按需引入，只有访问时候才会加载
    },
    {
      path: '/PersonalInfo',
      name: 'PersonalInfo',
      component: ()=>import("../views/PersonalInfo") //按需引入，只有访问时候才会加载
    },
    {
      path: '/AnswerDetail',
      name: 'AnswerDetail',
      component:()=>import("../views/AnswerDetail")
    },
    {
      path:'/Questionnaire',
      name: 'Questionnaire',
      component:()=>import("../views/Questionnaire")
    },
    {
      path:'/AddNewQuestionnaire',
      name:'AddNewQuestionnaire',
      component:()=>import("../views/AddNewQuestionnaire")
    }
  ]
})
