/*
* Sends question to YodaQA
* question - question text to send
* did - id of dialog
* return - JSON with answer form YodaQA
*/
function sendQuestion(question, did){
  var options = {
    "method": "post",
    "payload": {
      "text": question,
      "numberOfConcepts": "0",
      "dialogID": did.toString()
    }
  };
  var response = UrlFetchApp.fetch(URL, options);
  var responseText = response.getContentText();
  var responseJSON = JSON.parse(responseText);
  
  return responseJSON;
}

/*
* Parses best answer from YodaQA answer JSON
* answerJSON - YodaQA answer JSON
* return - best answer
*/
function getBestAnswer(answerJSON){
  var bestAnswer = answerJSON.answers[0].text;
  return bestAnswer;
}

/*
* Parse answer sentence from YodaQA answer JSON
* answerJSON - YodaQA answer JSON
* return - answer sentence
*/
function getAnswerSentence(answerJSON){
  var answerSentence = answerJSON.answerSentence;
  return answerSentence;
}

/*
* Checks if the answer was finished
* answerJSON - YodaQA answer JSON
* return - true if answer has been finished
*/
function isFinishedAnswer(answerJSON){
  var isFinished = answerJSON.finished;
  return isFinished;
}

/*
* Get answer JSON from YodaQA
* qid - question id
* did - dialog id
* return - JSON with answers
*/
function getJSONAnswer(qid,did){
  var response = UrlFetchApp.fetch(URL+'/'+qid+'/'+did);
  var answerJSON = JSON.parse(response);
  return answerJSON;
}

/*
* Replace all occurences of regex
* search - regex which will be replace
* replacement - replacement to regex
* return - new string
*/
String.prototype.replaceAll = function(search, replacement) {
  var regEx = new RegExp(search, "ig");
  var target = this;
  return target.replace(regEx, replacement);
};