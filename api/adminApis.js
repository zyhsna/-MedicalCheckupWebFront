import axios from '../request'

/**
 * 主要用来获取答卷的相关api
 */

//获取问卷详情的get请求
export const getUserInfoListApi = (pageNum, pageSize) => axios.get("/admin/getUserInfoList", {
  params: {
    pageNum, pageSize
  }
})

export const deleteUserApi = (userId) => axios.get("/admin/deleteUser", {
  params: {
    userId
  }
})
