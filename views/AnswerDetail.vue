<!--用来展示答卷详情的-->
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
        <el-radio v-if="questionsOption[6*index+i-7] !== null" :disabled="true" v-model="answers[6*index+i-7]"
                  :label="questionsOption[6 * index + i - 7]" border style="margin-top: 5px">

        </el-radio>
      </div>
      <div v-if="questionsType[index-1] === 2" class="text item" v-for="i in 6" :key="i">
        <!--        多选-->
        <el-checkbox v-if="questionsOption[6*index+i-7] !== null" :disabled="true" v-model="answers[6*index+i-7]"
                     :label="questionsOption[6 * index + i - 7]"></el-checkbox>
      </div>
      <div v-if="questionsType[index] === 3" class="text item" v-for="i in 6" :key="i">
        <!--        文字-->
        <el-input type="textarea"></el-input>
      </div>
    </el-card>
    <div v-if="userLevel === 1">
      <el-card class="box-card" shadow="hover">
        <div v-if="comment === '' || comment == null">
          尚未有医师评测
        </div>
        <div v-else>
          医师评测结果： {{ comment }}
        </div>
      </el-card>
    </div>
    <div v-else>
      <el-card class="box-card" shadow="always">
        <el-input placeholder="请输入评测结果" v-model="comment" clearable type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"></el-input>

        <el-button round type="success" style="text-align: center;margin-top: 15px" @click="addComment">提交</el-button>
      </el-card>

    </div>
  </el-main>


</template>

<script>
import {getAnswerDetailApi} from "../api/answerApis";
import {getQuestionnaireApi} from "../api/questionnaireApis";
import {addCommentApi} from "../api/commentApis";

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

// Question.prototype = {
//   constructor : Question,
// }


export default {
  name: "AnswerDetail",
  data() {
    return {
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
      //存放回答信息
      answers: [],
      comment: "",
      userLevel: 2
    }
  },
  methods: {
    //成功的相关信息
    success(msg) {
      this.$notify({
        title: '成功',
        message: msg,
        type: 'success',
        duration: 2000
      });
    },

    addComment() {
      if (this.comment === '' || this.comment === "") {
        this.$message({
          message: "请先输入内容",
          type: 'warning'
        });
      } else {
        let const_this = this;
        let answerId = this.$store.getters.getAnswerId;
        let doctorId = window.localStorage.getItem("userId");
        let userId = window.localStorage.getItem("answerUserId");
        addCommentApi(this.comment, answerId, userId, doctorId).then((response) => {
          if (response.data.stateCode === 0) {
            this.success("评测成功！");
          } else {
            this.fail("评测失败");
          }
        }).catch((err) => {
          const_this.fail(err);
        })
      }
    },

    //操作失败的提示
    fail(msg) {
      this.$notify.error({
        title: '错误',
        message: msg,
        duration: 4500
      });
    },
    changeMultiAnswerOption() {
      for (let i = 0; i < this.questionsType.length; i++) {

        let questionType = this.questionsType[i];
        if (questionType === 2) {

          for (let j = 0; j < 6; j++) {
            if (this.answers[6*i+j] === this.questionsOption[6*i+j] && this.answers[6*i+j] != null && this.questionsOption[6*i+j] != null) {
              this.answers[6*i+j] = true
            }
          }
        }
      }
    },

    //获取问卷问题信息
    getQuestionnaireById(questionnaireId) {
      let const_this = this;
      getQuestionnaireApi(questionnaireId).then((response) => {
        if (response.data.stateCode === 0) {
          let tmpList = [];
          tmpList.push(response.data.data.questionList);

          let tmpListElement = tmpList[0];
          // let tmpList1 = [];
          for (let i = 0; i < tmpListElement.length; i++) {

            let tmp = tmpListElement[i];
            let question = new Question(tmp.questionId, tmp.questionnaireId, tmp.questionText, tmp.questionType,
              tmp.questionOption1, tmp.questionOption2, tmp.questionOption3, tmp.questionOption4, tmp.questionOption5, tmp.questionOption6)
            this.questionsText.push(question.questionText);
            this.questionsType.push(question.questionType);

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
        };
        this.changeMultiAnswerOption();
      }).catch(function (err) {
        const_this.fail(err);
      })
    },

    getAnswerDetail(answerId, userId) {
      let const_this = this;
      getAnswerDetailApi(answerId, userId).then((response) => {
        if (response.data.stateCode === 0) {
          //数据响应正常
          this.success("获取答卷详情成功！");
          let questionnaireId = response.data.data.questionnaireId;
          this.getQuestionnaireById(questionnaireId);
          this.comment = response.data.data.comment;
          let tmpList = [];
          tmpList.push(response.data.data.answerDetailList);
          let tmpListElement = tmpList[0];
          for (let i = 0; i < tmpListElement.length; i++) {
            this.answers.push(tmpListElement[i].answerOption1);
            this.answers.push(tmpListElement[i].answerOption2);
            this.answers.push(tmpListElement[i].answerOption3);
            this.answers.push(tmpListElement[i].answerOption4);
            this.answers.push(tmpListElement[i].answerOption5);
            this.answers.push(tmpListElement[i].answerOption6);
          }
          this.changeMultiAnswerOption();
        } else if (response.data.stateCode === 17) {
          //数据响应错误
          this.fail("获取答卷详情失败！");
        }
      }).catch(function (err) {
        const_this.fail(err);
      })
    }
  },
  created() {
    let answerId = this.$store.getters.getAnswerId;
    if (answerId == null) {
      // this.$router.push("/");
    } else {
      let userLevel = parseInt(window.localStorage.getItem("userLevel"));
      if (userLevel === 1) {
        this.getAnswerDetail(answerId, window.localStorage.getItem("userId"));
      } else if (userLevel === 2) {
        this.getAnswerDetail(answerId, window.localStorage.getItem("answerUserId"));
        this.changeMultiAnswerOption();
      }
      this.userLevel = userLevel;
    }
  },
  mounted() {

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
