<template>
  <el-main style="margin: auto; text-align: center">
    <div>
      <span>{{ questionnaireTitle }}</span>
      <el-divider direction="vertical"/>
      <el-tag>完成人数：{{ accomplishmentNum }}</el-tag>
    </div>
    <el-divider></el-divider>
    <el-card v-for="(index)  in this.questionsText.length" :key="index" class="box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <!--        问题题目-->
        <span>{{ index + ":" + questionsText[index - 1] }}</span>
      </div>
      <div v-if="questionsType[index-1] === 1" class="text item" v-for="i in 6" :key="i">
        <!--        单选-->
        <el-radio v-if="questionsOption[6*index+i-7] !== null" v-model="answers[index-1]" :label="questionsOption[6 * index + i - 7]" border style="margin-top: 5px"></el-radio>
      </div>
      <div v-if="questionsType[index-1] === 2" class="text item" v-for="i in 6" :key="i">
        <!--        多选-->
        <el-checkbox  v-if="questionsOption[6*index+i-7] !== null" v-model="answers[index-1][i-1]"  :label="questionsOption[6 * index + i - 7]"></el-checkbox>
      </div>
      <div v-if="questionsType[index-1] === 3" class="text item" v-for="i in 6" :key="i">
        <!--        文字-->
        <el-input v-model="answers[index-1]" type="textarea"></el-input>
      </div>
    </el-card>
    <el-card class="box-card" shadow="hover">
      <el-button round type="success" @click="commitQuestionnaire" style="text-align: center;margin-top: 15px" >提交</el-button>
    </el-card>
  </el-main>
</template>

<script>
import {commitQuestionnaireApi, getQuestionnaireApi} from "../api/questionnaireApis";

function Question(questionId, questionnaireId, questionText, questionType, questionOption1, questionOption2, questionOption3, questionOption4, questionOption5, questionOption6) {
  this.questionId = questionId;
  this.questionnaireId = questionnaireId;
  this.questionText = questionText;
  this.questionType = questionType;
  this.questionOption1 = questionOption1;
  this.questionOption2 = questionOption2;
  this.questionOption3 = questionOption3;
  this.questionOption4 = questionOption4;
  this.questionOption5 = questionOption5;
  this.questionOption6 = questionOption6;
}

export default {
  name: "Questionnaire",
  data(){
    return{
      //问卷标题
      questionnaireTitle: "",
      //完成人数
      accomplishmentNum: 0,
      //存放问题信息
      questionsText: [],
      //存放问题类别，多选单选等等
      questionsType: [],
      //问题的选项
      questionsOption: [],
      questionsId:[],
      answers : []
    }
  },
  methods:{
    //成功的相关信息
    success(msg) {
      this.$notify({
        title: '成功',
        message: msg,
        type: 'success',
        duration: 2000
      });
    },
    //操作失败的提示
    fail(msg) {
      this.$notify.error({
        title: '错误',
        message: msg,
        duration: 4500
      });
    },
    commitQuestionnaire(){
      let answerUserId = window.localStorage.getItem("userId");
      let questionnaireId = this.$store.getters.getQuestionnaireId.toString();
      let answerDetailList = []
      for (let i=0;i<this.questionsText.length;i++){
        //把AnswerDetail放入
        let questionId = this.questionsId[i];
        let userId = answerUserId;
        let questionType = this.questionsType[i];
        let tmpAnswerDetail = {};
        tmpAnswerDetail.userId = userId;
        tmpAnswerDetail.questionId = questionId;
        tmpAnswerDetail.answerOptions = []
        if (questionType === 1){

          //单选
          for (let j = 0; j < 6; j++) {
            if (this.answers[i] === this.questionsOption[i*6+j]){
              //如果单选的那个选项和option相同
              tmpAnswerDetail.answerOptions.push(this.answers[i]);
            }else{
              tmpAnswerDetail.answerOptions.push(0);
            }
          }
        }else if(questionType === 2){
          //多选
          for (let j = 0; j < 6; j++) {
            if (this.answers[i][j]!=null && this.answers[i][j]){
              //如果单选的那个选项和option相同
              tmpAnswerDetail.answerOptions.push(this.questionsOption[i*6+j]);
            }else{
              tmpAnswerDetail.answerOptions.push(0);
            }
          }
        }else if (questionType === 3){
          //文字输入
          for (let j = 0; j < 6; j++) {
            if (j === 0){
              //如果单选的那个选项和option相同
              tmpAnswerDetail.answerOptions.push(this.answers[i]);
            }else{
              tmpAnswerDetail.answerOptions.push(0);
            }
          }
        }
        answerDetailList.push(tmpAnswerDetail)
      }
      let const_this = this;
      commitQuestionnaireApi(answerUserId, questionnaireId, answerDetailList).then((response)=>{
        if (response.data.stateCode === 0){
          this.success("答卷提交成功！")
        }
      }).catch((err)=>{
        const_this.fail(err);
      })
    },
    //获取问卷问题信息
    getQuestionnaireById(questionnaireId) {
      let const_this = this;
      getQuestionnaireApi(questionnaireId).then((response) => {
        if (response.data.stateCode === 0) {
          let tmpList = [];
          tmpList.push(response.data.data.questionList);
          let tmpListElement = tmpList[0];
          for (let i = 0; i < tmpListElement.length; i++) {
            let tmp = tmpListElement[i];
            let question = new Question(tmp.questionId, tmp.questionnaireId, tmp.questionText, tmp.questionType,
              tmp.questionOption1, tmp.questionOption2, tmp.questionOption3, tmp.questionOption4, tmp.questionOption5, tmp.questionOption6)
            this.questionsText.push(question.questionText);
            this.questionsType.push(question.questionType);
            this.questionsId.push(question.questionId)
            let tmpAnswerList = []
            if (question.questionType === 2) {
              tmpAnswerList.push(null)
              tmpAnswerList.push(null)
              tmpAnswerList.push(null)
              tmpAnswerList.push(null)
              tmpAnswerList.push(null)
              tmpAnswerList.push(null)
              this.answers.push(tmpAnswerList);
            }
            if (question.questionType === 1){
              tmpAnswerList.push(null)
              this.answers.push(tmpAnswerList);
            }
            if (question.questionType === 3){
              tmpAnswerList.push(null)
              this.answers.push(tmpAnswerList);
            }
            this.questionsOption.push(question.questionOption1)
            this.questionsOption.push(question.questionOption2)
            this.questionsOption.push(question.questionOption3)
            this.questionsOption.push(question.questionOption4)
            this.questionsOption.push(question.questionOption5)
            this.questionsOption.push(question.questionOption6)
          }
          // this.questions = tmpList1;
          this.questionnaireTitle = response.data.data.questionnaireTitle
          this.accomplishmentNum = response.data.data.accomplishmentNum
        }
      }).catch(function (err) {
        const_this.fail(err);
      })
    },
  },
  created() {
      let questionnaireId = this.$store.getters.getQuestionnaireId;
      if (questionnaireId === null){
        this.$router.push({
          path:"/"
        })
      }
      let userId = this.$store.getters.getUserId;
      if (userId === null || userId === '' || userId === ""||window.localStorage.getItem("userId") == null){
          this.fail("请先登录或者注册")
          this.$router.push({
            path:"/Login"
          })
      }else {
        this.getQuestionnaireById(questionnaireId);
      }
  }
}
</script>

<style scoped>

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
  margin-left: auto;
  margin-top: 10px;
  margin-right: auto;
}
</style>
