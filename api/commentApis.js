import axios from '../request'

/**
 * 主要用来医师评测问卷的相关api
 */

//获取问卷详情的get请求
export const getUncommentAnswerApi = (doctorId, pageNum, pageSize) => axios.get("/comment/pri/getNoComment", {
  params: {
    doctorId,
    pageNum,
    pageSize
  }
})

export const addCommentApi = (comment, answerId, userId, doctorId) => axios.get("comment/pri/addComment", {
  params: {
    comment,
    answerId,
    userId,
    doctorId
  }
})
