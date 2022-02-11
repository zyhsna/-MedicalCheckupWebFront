<template>
  <el-main style="align-content: center;margin: auto">
    <el-form :model="ruleForm" style="width: 500px;align-content: center;margin: auto"
             status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input type="username" v-model="ruleForm.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="checkTelephone">
        <el-input v-model.number="ruleForm.checkTelephone" autocomplete="off"></el-input>
      </el-form-item>
      <!--      <el-form-item label="地址" prop="address">-->
      <!--        <el-select v-model="value" filterable placeholder="请选择" v-model.address="ruleForm.address">-->
      <!--          <el-option-->
      <!--            v-for="item in options"-->
      <!--            :key="item.value"-->
      <!--            :label="item.label"-->
      <!--            :value="item.value">-->
      <!--          </el-option>-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item label="年龄" prop="age"  filterable placeholder="请选择"  v-model.age="ruleForm.age">
        <el-input  v-model="ruleForm.age" auto-complete="off"> </el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio v-model.sex="ruleForm.sex" label="男" value="男">男</el-radio>
        <el-radio v-model.sex="ruleForm.sex" label="女" value="女">女</el-radio>
      </el-form-item>
      <el-form-item label="身份">
        <el-radio v-model.userLevel="ruleForm.userLevel" label="1" value="1">普通用户</el-radio>
        <el-radio v-model.userLevel="ruleForm.userLevel" label="2" value="2">医师</el-radio>
      </el-form-item>
      <el-form-item style="align-content: center;margin: auto">
        <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <div style="float: right">
          <el-button type="info" @click="login()">登录</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
import {registerApi} from "../api/userApis";

export default {
  name: "Register",
  data() {
    // var const_this = this;
    var validateTelephone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('电话不能为空'));
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
        if (String(value).length !== 11) {
          callback(new Error('必须正确的位数'));
        } else {
          callback();
        }
      }

    };
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
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validateAddress = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择地址"))
      } else {
        callback();
      }
    };
    var validateAge = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入年龄"))
      } else {
        callback();
      }
    };

    return {
      sex: "男",
      ruleForm: {
        username: "",
        pass: '',
        checkPass: '',
        age: '',
        // address: "",
        checkTelephone: "",
        sex: "",
        userLevel: ""
      },
      rules: {
        username: [
          {validator: validateUsername, trigger: "blur"}
        ],
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
        age: [
          {validator: validateAge, trigger: 'blur'}
        ],

        address: [
          {validator: validateAddress, trigger: "blur"}
        ],
        checkTelephone: [
          {validator: validateTelephone, triggerL: "blur"}
        ]
      },
      // address option
      options: [{
        value: '河北省',
        label: '河北省'
      }, {
        value: '山西省',
        label: '山西省'
      }, {
        value: '辽宁省',
        label: '辽宁省'
      }, {
        value: '吉林省',
        label: '吉林省'
      }, {
        value: '黑龙江省',
        label: '黑龙江省'
      }, {
        value: '江苏省',
        label: '江苏省'
      }, {
        value: '浙江省',
        label: '浙江省'
      }, {
        value: '安徽省',
        label: '安徽省'
      }, {
        value: '福建省',
        label: '福建省'
      }, {
        value: '江西省',
        label: '江西省'
      }, {
        value: '山东省',
        label: '山东省'
      }, {
        value: '河南省',
        label: '河南省'
      }, {
        value: '湖北省',
        label: '湖北省'
      }, {
        value: '湖南省',
        label: '湖南省'
      }, {
        value: '广东省',
        label: '广东省'
      }, {
        value: '海南省',
        label: '海南省'
      }, {
        value: '四川省',
        label: '四川省'
      }, {
        value: '贵州省',
        label: '贵州省'
      }, {
        value: '云南省',
        label: '云南省'
      }, {
        value: '陕西省',
        label: '陕西省'
      }, {
        value: '甘肃省',
        label: '甘肃省'
      }, {
        value: '台湾省',
        label: '台湾省'
      }, {
        value: '青海省',
        label: '青海省'
      }, {
        value: '内蒙古自治区',
        label: '内蒙古自治区'
      }, {
        value: '广西壮族自治区',
        label: '广西壮族自治区'
      }, {
        value: '西藏自治区',
        label: '西藏自治区'
      }, {
        value: '宁夏回族自治区',
        label: '宁夏回族自治区'
      }, {
        value: '新疆维吾尔自治区',
        label: '新疆维吾尔自治区'
      }, {
        value: '北京市',
        label: '北京市'
      }, {
        value: '天津市',
        label: '天津市'
      }, {
        value: '上海市',
        label: '上海市'
      }, {
        value: '重庆市',
        label: '重庆市'
      }, {
        value: '香港特别行政区',
        label: '香港特别行政区'
      }, {
        value: '澳门特别行政区',
        label: '澳门特别行政区'
      }
      ]
    };
  },
  methods: {
    login: function () {
      this.$router.push("/Login");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    registerSuccess() {
      this.$notify({
        title: '成功',
        message: '注册成功',
        type: 'success',
        duration: 1000
      });
    },
    registerFail(msg) {
      this.$notify.error({
        title: '注册失败',
        message: msg,
        duration: 4500
      });
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.register()
        } else {
          this.registerFail("提交失败")
          return false;
        }
      });
    },

    register() {
      let const_this = this;

      registerApi(this.ruleForm.username, this.ruleForm.age, this.ruleForm.sex,
        this.ruleForm.checkTelephone, this.ruleForm.userLevel, this.ruleForm.pass).then((response) => {
        if (response.data.stateCode === 0){
          const_this.registerSuccess();
          this.$router.push({
            path:"/Login"
          })
        }else if (response.data.stateCode === 4){
          const_this.registerFail("手机号已经存在");
        }else if (response.data.stateCode === 5){
          const_this.registerFail("未知错误，请联系客服");
        }
      }).catch(function (error) {
        const_this.registerFail(error)
      })
    }
  },
  created() {
    let userId = this.$store.getters.getUserId;
    if (!(userId==="" ||userId == null|| userId ==='') || window.localStorage.getItem("userId")!=null) {
      this.$router.push("/PersonalInfo");
    }
  }
}
</script>

<style scoped>

</style>
