<template>
  <div>
    <div ref="div_container" style="margin-top: 8%">

    </div>
    <el-main style="align-content: center; margin: auto;">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
               style="align-content: center;width: 500px;margin: auto">
        <el-form-item label="电话">
          <el-input type="telephone" v-model="ruleForm.telephone" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="ruleForm.pass" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <div style="float: right">
            <el-button type="info" @click="register()">注册</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>

<script>
import {loginApi} from "../api/userApis";

export default {
  name: "Login",
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"))
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    return {
      ruleForm: {
        telephone: "",
        pass: '',
      },
      rules: {
        telephone: [
          {validator: validateUsername, trigger: 'blur'}
        ],
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    loginSuccess() {
      this.$notify({
        title: '成功',
        message: '登录成功',
        type: 'success',
        duration: 2000
      });
    },
    loginFailed(msg) {
      this.$notify.error({
        title: '错误',
        message: msg,
        duration: 4500
      });
    }, submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.login()
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    register() {
      this.$router.push("/Register")
    },
    login() {
      let const_this = this;

      loginApi(this.ruleForm.telephone, this.ruleForm.pass).then(
        (response) => {
          if (response.data.stateCode === 0) {
            const_this.loginSuccess();
            let userId = response.data.data;
            const_this.$store.dispatch("setUserId", userId);
            const_this.$store.dispatch("setLoginFlag", true);
            window.localStorage.setItem("userId", userId)
            const_this.$router.push("PersonalInfo");
          } else if (response.data.stateCode === 1) {
            const_this.loginFailed("手机号不存在！");
          } else if (response.data.stateCode === 2) {
            const_this.loginFailed("手机号和密码不匹配！");
          }
        }
      ).catch(function (error) {
        const_this.loginFailed("登录失败")
      })
    }
  },
  created() {
    let userId = this.$store.getters.getUserId;
    if (!(userId === "" || userId == null || userId === '') || window.localStorage.getItem("userId") != null) {
      this.$router.push("/PersonalInfo");
    }

  },
  mounted() {
    this.$refs.div_container.style.marginTop = window.screen.height * 0.3;
    // console.log(marginTop)
  }
}
</script>

<style scoped>

</style>
