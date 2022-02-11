<template>
  <el-tabs tab-position="left" style="height: 100%;">
    <el-tab-pane label="个人信息">
      <el-main style="align-content: center;margin: auto">
        <el-form :model="ruleForm" style="width: 500px;align-content: center;margin: auto" ref="ruleForm"
                 label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <!--            <el-input type="username" v-model="ruleForm.username" auto-complete="off"></el-input>-->
            {{ ruleForm.username }}
          </el-form-item>
          <el-form-item label="手机号" prop="telephone">
            {{ ruleForm.telephone }}
          </el-form-item>
          <el-form-item label="年龄" prop="age" filterable placeholder="请选择" v-model.age="ruleForm.age">
            {{ ruleForm.age }}
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="ruleForm.sex" label="1" value="1" border size="medium" :disabled="true">男</el-radio>
            <el-radio v-model="ruleForm.sex" label="2" value="2" border size="medium" :disabled="true">女</el-radio>
          </el-form-item>
          <el-form-item label="身份">
            <el-radio v-model="ruleForm.userLevel" label=1 value=1 :disabled="true">普通用户</el-radio>
            <el-radio v-model="ruleForm.userLevel" label=2 value=2 :disabled="true">医师</el-radio>
            <el-radio v-model="ruleForm.userLevel" label=3 value=3 :disabled="true">管理员</el-radio>
          </el-form-item>
        </el-form>
      </el-main>
    </el-tab-pane>
    <el-tab-pane label="修改密码">
      <el-form ref="changePasswordForm" :model="changePasswordForm"
               style="width: 500px;align-content: center;margin: auto" :rules="changePassWordRules">
        <el-form-item label="原来密码" prop="oldPass">
          <el-input type="password" v-model="changePasswordForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input type="password" v-model="changePasswordForm.newPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="再次确认新密码" prop="checkNewPass">
          <el-input type="password" v-model="changePasswordForm.checkNewPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="align-content: center;margin: auto">
          <el-button type="primary" @click="submitForm('changePasswordForm')">修改密码</el-button>
          <el-button @click="resetForm('changePasswordForm')">清空信息</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="查看历史答卷" v-if="this.ruleForm.userLevel === '1'">
      <el-main style="text-align: center" v-if="userAnswerList.length>0">
        <el-table :data="userAnswerList" style="width: 100%">
          <template>
            <el-table-column prop="answerId" label="答卷ID"></el-table-column>
            <el-table-column prop="questionnaireTitle" label="问卷名称"></el-table-column>
            <el-table-column prop="commentDoctorName" label="评测医师姓名"></el-table-column>
            <el-table-column prop="comment" label="评测结果"></el-table-column>
            <el-table-column label="问卷状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.comment != null" type="success">医师已评测</el-tag>
                <el-tag v-if="scope.row.comment == null" type="warning">等待评测</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                <el-button @click="toAnswerDetail(scope.row.answerId)" type="warning">查看详细信息</el-button>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[10, 20, 40, 80]"
          layout="total, sizes, prev, pager, next"
          :total="this.allListSize">
        </el-pagination>
      </el-main>
      <el-main style="text-align: center" v-else>
        <el-empty description="您尚未回答过相关问卷"></el-empty>
      </el-main>
    </el-tab-pane>
    <el-tab-pane label="评测问卷" v-if="this.ruleForm.userLevel === '2'">
      <el-main style="text-align: center" v-if="uncommentAnswersList.length>0">
        <el-table :data="uncommentAnswersList" style="width: 100%">
          <template>
            <el-table-column prop="answerId" label="答卷ID"></el-table-column>
            <el-table-column prop="questionnaireTitle" label="问卷名称"></el-table-column>
            <el-table-column prop="commentDoctorName" label="评测人员姓名"></el-table-column>
            <el-table-column label="">
              <template slot-scope="scope">
                <el-button @click="commentAnswer(scope.row.answerId,scope.row.answerUserId)" type="info">评测问卷
                </el-button>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange_doctor"
          @current-change="handleCurrentChange_doctor"
          :page-sizes="[10, 20, 40, 80]"
          :page-size="100"
          layout="total, sizes, prev, pager, next"
          :total="this.userAnswerList.length">
        </el-pagination>
      </el-main>
      <el-main style="text-align: center" v-else>
        <el-empty description="暂无未评测问卷"></el-empty>
      </el-main>
    </el-tab-pane>
    <el-tab-pane label="新建问卷" v-if="this.ruleForm.userLevel === '2'">
      <div style="text-align: center;margin-top: 50px">
        <el-button type="primary" @click="addNewQuestionnaire">点击新建问卷</el-button>
      </div>
    </el-tab-pane>
    <!--    管理员权限-->
    <el-tab-pane label="人员管理" v-if="this.ruleForm.userLevel === '3'">


      <div style="text-align: center;margin-top: 50px">
        <el-main style="text-align: center" v-if="userList.length>0">
          <el-table :data="userList" style="width: 100%">
            <template>
              <el-table-column prop="userId" label="用户ID"></el-table-column>
              <el-table-column prop="userName" label="用户姓名"></el-table-column>
              <el-table-column label="性别">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.gender === '1'">男</el-tag>
                  <el-tag v-if="scope.row.gender === '2'">女</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="telephone" label="手机号"></el-table-column>
              <el-table-column label="用户等级">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.userLevel === 1" type="success">用户</el-tag>
                  <el-tag v-if="scope.row.userLevel === 2" type="warning">医师</el-tag>
                  <el-tag v-if="scope.row.userLevel === 3" type="warning">管理员</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="deleteUser(scope.row.userId)" type="warning">删除</el-button>
                  <el-button @click="changeUserLevel(scope.row.userId)" type="warning">修改级别</el-button>
                </template>
              </el-table-column>
            </template>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 40, 80]"
            layout="total, sizes, prev, pager, next"
            :total="this.allListSize">
          </el-pagination>
        </el-main>

        <el-main v-else style="text-align: center">
          <el-empty description="暂无未评测问卷"></el-empty>
        </el-main>
      </div>


    </el-tab-pane>
    <el-tab-pane label="数据统计" v-if="this.ruleForm.userLevel === '3'">
      <div style="text-align: center;margin-top: 50px">

      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {changePassWordApi, getUserAnswerPreview, getUserAnswerPreviewApi, getUserInoApi} from "../api/userApis";
import {getUncommentAnswerApi} from "../api/commentApis";
import {deleteUserApi, getUserInfoList, getUserInfoListApi} from "../api/adminApis";

export default {
  name: "PersonalInfo",
  data() {
    //密码校验规则
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.changePasswordForm.newPass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    let validatePass3 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      //存放用户已经答过的问卷信息
      userAnswerList: [],

      //存放用户相关信息，管理员权限管理
      userList: [],

      currentPage: 1,

      //表格数据总量
      allListSize: 0,

      //存放还未评测的答卷ID
      uncommentAnswerIdsList: [],
      //存放为评测的答卷信息
      uncommentAnswersList: [],

      tmpList: [],
      //查看答卷的页数和每页的数量
      pageSize: 10,
      pageNum: 1,
      //个人信息
      ruleForm: {
        username: "",
        age: '',
        telephone: "",
        sex: "",
        userLevel: "",
      },

      //修改密码的相关信息
      changePasswordForm: {
        oldPass: "",
        newPass: "",
        checkNewPass: ""
      },

      //修改密码的校验规则
      changePassWordRules: {
        oldPass: [
          {validator: validatePass3, trigger: 'blur'}
        ],
        newPass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkNewPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
      }

    }
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getUserAnswerPreview()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum;
      this.getUserAnswerPreview()
    },

    handleSizeChange_admin(pageSize) {
      this.pageSize = pageSize;
      this.getUserList()
    },

    handleCurrentChange_admin(pageNum) {
      this.pageNum = pageNum;
      this.getUserList()
    },
    handleSizeChange_doctor(pageSize) {
      this.pageSize = pageSize;
      this.getUncommentList()
    },
    handleCurrentChange_doctor(pageNum) {
      this.pageNum = pageNum;
      this.getUncommentList()
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

    commentAnswer(answerId, answerUserId) {
      this.$store.dispatch("setAnswerId", answerId);
      window.localStorage.setItem("answerUserId", answerUserId);
      this.$router.push("/AnswerDetail");
    },

    addNewQuestionnaire() {
      this.$router.push({
        path: "/AddNewQuestionnaire"
      })
    },

    deleteUser(userId) {
      let const_this = this;
      deleteUserApi(userId).then((response)=>{
        if(response.data.stateCode === 0){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getUserList()
        }else if (response.data.stateCode === 22){
          this.$message.error('删除失败');
        }
      }).catch((err)=>{
        const_this.fail(err)
      })
    },

    //管理员登录获取用户相关信息
    getUserList() {
      getUserInfoListApi(this.pageNum, this.pageSize).then((response) => {
        let stateCode = response.data.stateCode;
        if (stateCode === 0) {
          this.userList = response.data.data.list;
          this.allListSize = response.data.data.total;
        } else if (stateCode === 21) {
          this.fail("获取用户信息列表失败")
        }
      }).catch((err) => {
      })
    },

    //根据答卷ID跳转到具体的答卷
    toAnswerDetail(answerId) {
      this.$store.dispatch("setAnswerId", answerId);
      this.$router.push("/AnswerDetail");
    },

    //提交表单（修改密码用到）
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.changePassword();
        } else {
          this.fail("提交失败");
          return false;
        }
      });
    },

    //重置表单，重置修改密码里的数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    //用户修改密码
    changePassword() {
      let oldPass = this.changePasswordForm.oldPass;
      let newPass = this.changePasswordForm.newPass;
      let userId = this.$store.getters.getUserId;
      let const_this = this;
      changePassWordApi(oldPass, newPass, userId).then((response) => {
        if (response.data.stateCode === 0) {
          const_this.success("修改密码成功,请重新登录");
          window.localStorage.removeItem("userId");
          window.localStorage.removeItem("userLevel");
          const_this.$store.dispatch("setLoginFlag", false);
          const_this.$store.dispatch("setUserId", null);
          const_this.$router.push("/Login");
        } else if (response.data.stateCode === 6) {
          this.fail("新旧密码不能一样");
        } else if (response.data.stateCode === 7) {
          this.fail("修改密码失败")
        } else if (response.data.stateCode === 8) {
          this.fail("用户未登录！")
        } else if (response.data.stateCode === 9) {
          this.fail("旧密码输入错误")
        } else if (response.data.stateCode === 10) {
          this.fail("请求参数丢失")
        }
      }).catch(function (err) {
        this.$notify.error({
          title: '出现未知错误',
          message: err
        })
      })
    },

    //获取用户信息
    getUserInfo() {
      let const_this = this;
      let userId = window.localStorage.getItem("userId");
      getUserInoApi(userId).then((response) => {
        if (response.data.stateCode === 0) {
          this.ruleForm.sex = response.data.data.gender;
          this.ruleForm.age = response.data.data.age;
          this.ruleForm.telephone = response.data.data.telephone;
          this.ruleForm.userLevel = response.data.data.userLevel.toString();
          this.ruleForm.username = response.data.data.userName;
          window.localStorage.setItem("userLevel", response.data.data.userLevel)
          this.switchUserFunction()
        }
      }).catch(function (error) {
        const_this.fail(error)
      })
    },

    //获取已答问卷的preview
    getUserAnswerPreview() {
      this.userAnswerList = []
      let const_this = this;
      let pageNum = this.pageNum;
      let pageSize = this.pageSize;
      getUserAnswerPreviewApi(window.localStorage.getItem("userId"), pageNum, pageSize).then((response) => {
        this.allListSize = response.data.data.total
        this.userAnswerList = response.data.data.list
        // tmpList.pop();
      }).catch(function (err) {
        const_this.fail(err);
      })
    },

    //医师获取还未评测的答卷信息
    getUncommentList() {
      this.uncommentAnswersList = []
      let const_this = this;
      let userId = window.localStorage.getItem("userId");
      getUncommentAnswerApi(userId, this.pageNum, this.pageSize).then((response) => {
        if (response.data.stateCode === 0) {
          let tmpList = [];
          tmpList.push(response.data.data.list);
          let tmpListElement = tmpList[0];
          for (let i = 0; i < tmpListElement.length; i++) {
            this.uncommentAnswersList.push(tmpListElement[i])
          }
        }
      }).catch(function (err) {
        const_this.fail(err);
      })
    },

    //根据不同的用户级别来获取信息
    switchUserFunction() {
      let const_this = this;
      let userLevel = window.localStorage.getItem("userLevel");
      if (parseInt(userLevel) === 1) {
        //如果是普通用户，就获取历史的答卷信息
        this.getUserAnswerPreview()
      } else if (parseInt(userLevel) === 2) {
        //如果是医师，就获取尚未评测的答卷信息
        this.getUncommentList();
      } else if (parseInt(userLevel) === 3) {
        //管理员功能
        this.getUserList();
      }
    }
  },
  created() {
    //判断用户是否登录
    let loginFlag = this.$store.getters.getLoginFlag;
    let const_this = this;
    if (!loginFlag || window.localStorage.getItem("userId") == null) {
      //TODO 上线后放开
      // this.$router.push("/Login");
      // this.fail("请先登录或注册");
    } else {

    }
    //加载个人信息
    this.getUserInfo();

  },

  //渲染完毕后执行
  mounted() {

  }
}
</script>

<style scoped>

</style>
