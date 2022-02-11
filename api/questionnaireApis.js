import axios from '../request'

/**
 * 问卷问题的相关api
 */

//获取问卷详情的get请求
export const getQuestionnaireApi = (questionnaireId) => axios.get("/question/pri/getQuestionsByQuestionnaireId", {
  params: {
    questionnaireId
  }
})

export const commitQuestionnaireApi = (answerUserId, questionnaireId, answerDetailList) => axios.post("/answer/pri/addAnswer", {
  answerUserId,
  questionnaireId,
  answerDetailList
})

export const addNewQuestionnaireApi = (doctorId, questionnaireType, accomplishmentNum, questionnaireTitle,questionList) => axios.post("/question/pri/addQuestionnaire", {
  doctorId,
  questionnaireType,
  accomplishmentNum,
  questionList,
  questionnaireTitle
})

export const getHotQuestionnaireApi = ()=>axios.get("question/getHotQuestionnaire")
