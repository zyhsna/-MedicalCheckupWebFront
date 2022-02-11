<template>
  <div>
    <el-menu :default-active="activeIndex" mode="horizontal" background-color="#FFFFFF" text-color="#000000"
             active-text-color="#0000FF">
      <el-menu-item index="1" @click="Home">
        首页
      </el-menu-item>
      <el-menu-item index="3" route="true" style="float: right" @click="switchRequest">
        <a v-if="!this.$store.getters.getLoginFlag" @click="login" href="javascript:void(0);"
           style="text-decoration: none; ">
          登录/注册
        </a>
        <a v-else>
          <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
             <i class="el-icon-arrow-down el-icon-user-solid"/>个人界面<i class="el-icon-arrow-down el-icon--right"/>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">切换账号</el-dropdown-item>
              <el-dropdown-item command="2">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </a>
      </el-menu-item>

    </el-menu>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      activeIndex: '2',
      loginFlag: false  //登录标志，未登录为false，登录为true
    }
  },
  methods: {
    Home: function () {
      this.$router.push({
        path: "/"
      })
    },
    PersonalInfo: function () {
      this.$router.push({
        path: "/PersonalInfo"
      })
    },
    login: function () {
      this.$router.push({
        path: "/Login"
      })
    },
    handleCommand(command) {
      console.log(typeof command);
      if (command === "1") {
        this.switchUser();
      } else if (command === "2") {
        this.logout();
      }
    },

    // clickHandler(evt) { // 按钮点击事件的回调函数
    //   let target = evt.target;
    //   if(target.nodeName === "SPAN" || target.nodeName === "a"){
    //     target = evt.target.parentNode;
    //   }
    //   target.blur();
    // },



    switchRequest: function () {

      if (!this.loginFlag) {
        this.login()
      } else {
        this.PersonalInfo()
      }
    },
    switchUser: function () {
      window.localStorage.removeItem("userId");
      window.localStorage.removeItem("userLevel");
      window.localStorage.removeItem("answerUserId");
      this.$store.dispatch("setLoginFlag", false);
      this.$store.dispatch("setUserId", null);
      this.$router.push({
        path: "/Login"
      })

      this.$message("账户退出成功");
    },
    logout: function () {
      window.localStorage.removeItem("userId");
      window.localStorage.removeItem("userLevel");
      window.localStorage.removeItem("answerUserId");
      this.$store.dispatch("setLoginFlag", false);
      this.$store.dispatch("setUserId", null);
      this.$router.push({
        path: "/"
      })
      this.$message("账户退出成功");
    }

  },
  created() {
    //判断是否登录
    let userId = window.localStorage.getItem("userId");

    if (!(userId === '' || userId == null || userId === "")) {
      this.$store.dispatch("setLoginFlag", true);
    }
  },
  mounted() {
    let const_this = this;
    window.onload = function () {
      if (!window.sessionStorage["loginFlag"]) {
        // 关闭浏览器
        window.localStorage.removeItem("userId");
        window.localStorage.removeItem("userLevel");
        window.localStorage.removeItem("answerUserId");
        const_this.$store.dispatch("setLoginFlag", false)
      } else {
        // 刷新
      }
    };
    window.onunload = function () {
      window.sessionStorage["loginFlag"] = true;
    };
    window.onbeforeunload = function () {
      window.sessionStorage["loginFlag"] = true;
    };
  },
  destroyed() {
    this.$store.dispatch("clearAll");
    window.localStorage.clear();
  },
}
</script>

<style>
.title {
  background-color: #123456;
  text-color: #fff;
  active-text-color: #ff04b
}
</style>
