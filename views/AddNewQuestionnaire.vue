<template>
  <el-main>
    <div style="width: 500px;margin: auto; text-align: center">
      <span>
        <el-input size="medium" v-model="title" placeholder="请输入问卷题目" clearable></el-input>
      </span>
    </div>

    <el-divider></el-divider>

    <el-card v-for="(index) in this.questionNum" :key="index" class="clearfix box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <!--        问题题目-->
        <span><el-input size="medium" v-model="questionText[index-1]" :placeholder="'请输入问题'+index+'题目'"
                        clearable></el-input></span>
      </div>
      <div v-if="questionType[index-1] === 1" style="text-align: center;">
        <div class="text item" v-for="i in 6" :key="i" style="text-align: center">
          <el-input style="width: inherit;margin-top: 5px" v-model="questionOption[index-1][i-1]" clearable
                    :placeholder="'单选项'+i+'(可空)'">
          </el-input>

        </div>
        <div style="margin-top: 8px">
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-info"
            @confirm="deleteQuestion(index-1)"
            icon-color="red"
            title="确定删除该问题吗？">
            <el-button slot="reference">删除</el-button>
          </el-popconfirm>
        </div>
      </div>
      <div v-if="questionType[index-1] === 2" style="text-align: center">
        <div class="text item" v-for="i in 6" :key="i" style="text-align: center">
          <!--        多选-->
          <el-input style="width: inherit;margin-top: 5px" v-model="questionOption[index-1][i-1]" clearable
                    :placeholder="'多选项'+i+'(可空)'">
          </el-input>
        </div>
        <div style="margin-top: 8px">
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-info"
            @confirm="deleteQuestion(index-1)"
            icon-color="red"
            title="确定删除该问题吗？">
            <el-button slot="reference">删除</el-button>
          </el-popconfirm>
        </div>
      </div>
      <div v-if="questionType[index-1] === 3" style="text-align: center">
        <div style="margin-top: 8px">
          <el-popconfirm
            confirm-button-text='确定'
            cancel-button-text='取消'
            icon="el-icon-info"
            @confirm="deleteQuestion(index-1)"
            icon-color="red"
            title="确定删除该问题吗？">
            <el-button slot="reference">删除</el-button>
          </el-popconfirm>
        </div>
      </div>
    </el-card>
    <div style="text-align: center;margin-top: 10px">
      <el-button type="primary" @click="addSingle">新增单选</el-button>
      <el-button type="info" @click="addMulti">新增多选</el-button>
      <el-button type="success" @click="addText">新增文字题目</el-button>
      <el-button type="warning" @click="commit">提交</el-button>
    </div>
  </el-main>


</template>

<script>
import {addNewQuestionnaireApi} from "../api/questionnaireApis";

export default {
  name: "AddNewQuestionnaire",
  data() {
    return {
      visible: [],
      questionNum: 0,
      title: "",
      questionType: [],
      questionText: [],
      questionOption: []
    }
  },
  methods: {
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

    //添加单选题目
    addSingle() {
      this.questionNum += 1;
      this.questionType.push(1);
      this.questionText.push(null);
      let tmpList = [];
      for (let i = 0; i < 6; i++) {
        tmpList.push();
      }
      this.questionOption.push(tmpList)
      this.visible.push(false)
    },

    //添加多选题目
    addMulti() {
      this.questionNum += 1;
      this.questionType.push(2);
      let tmpList = [];
      for (let i = 0; i < 6; i++) {
        tmpList.push();
      }
      this.questionOption.push(tmpList)
      this.visible.push(false)
    },


    //添加的是文字问题
    addText() {
      this.questionNum += 1;
      this.questionType.push(3);
      this.questionText.push();
      this.visible.push(false)
    },

    //删除题目
    deleteQuestion(index) {
      let questionType = this.questionType[index];
      if (questionType === 1 || questionType === 2) {
        this.questionText.splice(index, 1);
        this.questionType.splice(index, 1);
        this.questionOption.splice(index, 1);
        this.questionNum -= 1;
      } else {
        this.questionText.splice(index, 1);
        this.questionType.splice(index, 1);
        this.questionOption.splice(index, 1);
        this.questionNum -= 1;
      }
    },

    //创建新的问卷
    commit() {
      let doctorId = window.localStorage.getItem("userId");
      let questionnaireType = 1;
      let accomplishmentNum = 0;
      let questionnaireTitle = this.title;
      let questionList = [];
      for (let i = 0; i < this.questionNum; i++) {
        let tmpQuestion = {};
        tmpQuestion.questionText = this.questionText[i];
        tmpQuestion.questionType = this.questionType[i];
        if (tmpQuestion.questionType !== 3) {
          tmpQuestion.questionOption1 = this.questionOption[i][0];
          tmpQuestion.questionOption2 = this.questionOption[i][1];
          tmpQuestion.questionOption3 = this.questionOption[i][2];
          tmpQuestion.questionOption4 = this.questionOption[i][3];
          tmpQuestion.questionOption5 = this.questionOption[i][4];
          tmpQuestion.questionOption6 = this.questionOption[i][5];

        }else{
          tmpQuestion.questionOption1 = null;
          tmpQuestion.questionOption2 = null;
          tmpQuestion.questionOption3 = null;
          tmpQuestion.questionOption4 = null;
          tmpQuestion.questionOption5 = null;
          tmpQuestion.questionOption6 = null;
        }
        questionList.push(tmpQuestion);
      }
      let const_this = this;
      addNewQuestionnaireApi(doctorId, questionnaireType, accomplishmentNum,questionnaireTitle ,questionList).then((response) => {
        if (response.data.stateCode === 0) {
          this.success("创建问卷成功！");
        } else {
          this.fail("创建失败");
        }
      }).catch((err) => {
        const_this.fail(err);
      })
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
