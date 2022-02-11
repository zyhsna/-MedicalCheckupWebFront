<template>
  <div>
    <el-carousel :interval="4000" type="card" arrow="always">
      <el-carousel-item v-for="item in 2" :key="item">
        <el-image
          :src="require('../assets/'+item+'.png')"
          style="height: 100%;width: 100%"
          fit="fill"
        />
      </el-carousel-item>
    </el-carousel>
    <el-row>
      <el-col :span="5" v-for="(index) in questionnairePreviewList.length" :key="index" :offset="index > 0 ? 2 : 0">
        <el-card class="clearfix box-card" shadow="hover" >
          <div slot="header" class="clearfix" style="text-align: center">
            <!--        问卷题目-->
            <p>{{questionnairePreviewList[index - 1].questionnaireTitle }}</p>
            <p>已有{{questionnairePreviewList[index - 1].accomplishmentNum }}人做过</p>
          </div>
          <div class="bottom ">
            <el-button type="text" class="button" @click="goToSelectedQuestionnaire(index-1)">立即回答问卷</el-button>
          </div>
        </el-card>

      </el-col>

    </el-row>




  </div>
</template>

<script>
import {getHotQuestionnaireApi} from "../api/questionnaireApis";

export default {
  name: "Home",
  data() {
    return {
      name: "hello",
      screenWidth: 10,
      screenHeight: 10,
      questionnairePreviewList: []
    }
  },
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
  methods: {
    getHotQuestionnaire() {
      let const_this = this;
      getHotQuestionnaireApi().then((response) => {
        if (response.data.stateCode === 0) {
          for (let i = 0; i <response.data.data.length ; i++) {
            this.questionnairePreviewList.push(response.data.data[i])
          }
        }
      }).catch((err) => {
        const_this.fail("获取热门答卷失败")
      })
    },

    //选中后跳到相应的问卷
    goToSelectedQuestionnaire(index){
      let questionnaireId = this.questionnairePreviewList[index].questionnaireId;
      console.log(questionnaireId)
      this.$store.dispatch("setQuestionnaireId", questionnaireId);
      this.$router.push({
        path:"/Questionnaire"
      })
    }
  },
  created() {
    this.screenWidth = document.body.clientWidth;
    this.screenHeight = document.body.clientHeight;
    this.getHotQuestionnaire();
  },

}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.bottom {
  float: right;
}


.box-card {
  width: 200px;
  margin-left: 20px;
  margin-top: 10px;
  margin-right: 20px;
}
</style>
