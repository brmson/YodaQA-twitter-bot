/*
* Process asked question
* user - user, who asked
* question - question to answer
* tweetID - id of tweet with question
* otherUsersMentions - other users, who was mentioned in the tweet
*/
function askedQuestion(user, question, tweetID, otherUsersMentions){
  var doc = SpreadsheetApp.openById(SHEET);
  var sheet = doc.getSheetByName(USERS_SHEET);
  var userIndex = findValue(user, sheet, 0);
  if (userIndex == -1){
    var responseJSON = sendQuestion(question, "");
    saveNewUser(user, responseJSON.dialogID);
  }else{
    var did = getUserDid(userIndex);
    var responseJSON = sendQuestion(question, did);
    if (did==""){
      did=responseJSON.dialogID;
    }
    actualizeUser(userIndex+1, did);
  }
  saveQuestionID(user, responseJSON.id, responseJSON.dialogID, tweetID, otherUsersMentions);
}

/*
* Process answered question
* return - array containing JSONs with information about answers
*/
function answeredQuestions(){
  var toReturn = [];
  var questions = getAllQuestions();
  for (var i = 0; i < questions.length; i++){
    if (questions[i][1]=="" || questions[i][1]==undefined || questions[i][2]=="" || questions[i][2]==undefined){
      continue;
    }
    var answerJSON = getJSONAnswer(questions[i][1],questions[i][2]);
    if (isFinishedAnswer(answerJSON)){
      var answer = makeAnswer(answerJSON)
      var user = questions[i][0];
      var responseTweetID = questions[i][3];
      deleteQuestion(i+1);
      
      toReturn.push({"user": user, "answer": answer, "responseTweetID": responseTweetID, "qid": questions[i][1], "did": questions[i][2],"otherUsersMentions": questions[i][4]});
    }
  }
  return toReturn;
}

/*
* Create answer text from JSON with all informations about answer
* answerJSON - JSON with answer
* return - text of answer
*/
function makeAnswer(answerJSON){
  var answer = getAnswerSentence(answerJSON);
  if (answer == "" || answer == undefined){
    answer = getBestAnswer(answerJSON);
  }
  if (answer == "" || answer == undefined){
    answer="Sorry, I didn't find the answer."
  }
  return answer;
}