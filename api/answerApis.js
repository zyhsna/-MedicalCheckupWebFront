import axios from '../request'

/**
 * 主要用来获取答卷的相关api
 */

//获取问卷详情的get请求
export const getAnswerDetailApi = (answerId, userId) => axios.get("/answer/pri/getAnswerDetail", {
  params: {
    answerId,
    userId
  }
})
