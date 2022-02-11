import axios from '../request'
import {data} from "autoprefixer";
import {config} from "shelljs";
import request from "../request";

/**
 * 用户相关api
 * */


//注册接口 post请求
export const registerApi = (userName, age, gender, telephone, userLevel, password) => axios.post("/user/register", {
    "userName": userName,
    "age": age,
    "gender": gender,
    "telephone": telephone,
    "userLevel": userLevel,
    "password": password
  },
  // {
  //   headers: {'Access-Control-Allow-Origin': "*"}
  // }
)

//登录接口 get请求
export const loginApi = (telephone, password) => axios.get("/user/login", {
  params: {
    telephone: telephone,
    password: password
  }
})

export const changePassWordApi = (oldPassword, newPassword, userId) => axios.get("/user/pri/changePassword", {
  params: {
    oldPassword,
    newPassword,
    userId
  }
})

export const getUserInoApi = (userId) => axios.get("/user/pri/getPersonInfo", {
  params: {
    userId
  }
})

export const getUserAnswerPreviewApi = (userId, pageNum, pageSize) => axios.get("/answer/pri/getAnswerPreview", {
  params: {
    userId,
    pageNum,
    pageSize
  }
})
