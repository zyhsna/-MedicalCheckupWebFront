import Vuex from 'vuex'
import Vue from 'vue'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //存储数据
    userId: null,
    userLevel: null,
    loginFlag: false,
    answerId: null,
    questionnaireId: 6
  },
  mutations: {
    //修改值
    SET_USERID: (state, userId) => (
      state.userId = userId
    ),
    SET_USER_LEVEL: (state, userLevel) => (
      state.userLevel = userLevel
    ),
    SET_LOGIN_FLAG: (state, loginFlag) => (
      state.loginFlag = loginFlag
    ),
    SET_ANSWER_ID: (state, answerId) => {
      state.answerId = answerId;
    },
    SET_QUESTIONNAIRE_ID:(state, questionnaireId)=>{
      state.questionnaireId = questionnaireId;
    }
  },

  //通过this.$store.dispatch触发
  //this.$store.dispatch(actions里面方法名,参数)
  actions: {
    //异步调用mutations方法
    //修改用户ID
    setUserId(context, userId) {
      context.commit('SET_USERID', userId)
    },
    //修改用户等级
    setUserLevel(context, userLevel) {
      context.commit('SET_USER_LEVEL', userLevel)
    },

    setLoginFlag(context, loginFlag) {
      context.commit('SET_LOGIN_FLAG', loginFlag)
    },

    setAnswerId(context, answerId) {
      context.commit('SET_ANSWER_ID', answerId)
    },
    setQuestionnaireId(context, questionnaireId){
      context.commit('SET_QUESTIONNAIRE_ID', questionnaireId)
    },
    //清除信息
    clearAll(context) {
      context.commit('SET_USERID', '');
      context.commit('SET_USER_LEVEL', '');
      context.commit('SET_USER_LEVEL', false);
    }
  },
  getters: {
    getUserId: state => {
      return state.userId
    },
    getLoginFlag: state => {
      return state.loginFlag
    },
    getUserLevel: state => {
      return state.userLevel
    },
    getAnswerId: state => {
      return state.answerId;
    },
    getQuestionnaireId: state =>{
      return state.questionnaireId;
    }
  },
  modules: {}
})
