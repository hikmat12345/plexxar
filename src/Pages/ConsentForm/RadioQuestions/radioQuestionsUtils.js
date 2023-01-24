export const getAnswerObject = (question) => {
  return [{ questionId: question.qid, answerId: question.answer }];
};
