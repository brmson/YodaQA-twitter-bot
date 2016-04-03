var SHEET = "1Xn2Q0LnhXHjp0zxMICMjnYKOX3GuLcBC0pzXN7O0eXs"; //memory sheet id
var USERS_SHEET = "Users";
var QUESTIONS_SHEET = "Questions";
var LAST_QUESTION_SHEET = "LastQuestion";

var DIALOG_MAX_TIME = 3600000;

/*
* Saves question to question sheet
* user - user who asked
* qid - questio id
* did - dialog id
* tweetID - id of tweet with the question
* otherUsersMentions - twitter users mentioned in the tweet
*/
function saveQuestionID(user, qid, did, tweetID, otherUsersMentions) {
  var doc = SpreadsheetApp.openById(SHEET);
  var sheet = doc.getSheetByName(QUESTIONS_SHEET);
  sheet.appendRow([user, qid, did, tweetID, otherUsersMentions]);
}

/*
* Saves new user to user sheet
* user - name of user
* did - dialog id
*/
function saveNewUser(user, did) {
  var doc = SpreadsheetApp.openById(SHEET);
  var sheet = doc.getSheetByName(USERS_SHEET);
  sheet.appendRow([user, new Date(), did]);
}

/*
* Actualize user in user sheet
* userIndex - index of user
* did - dialog id
*/
function actualizeUser(userIndex, did){
  var doc = SpreadsheetApp.openById(SHEET);
  var sheet = doc.getSheetByName(USERS_SHEET);
  var didRange = sheet.getRange(userIndex, 3);
  var dateRange = sheet.getRange(userIndex, 2);
  didRange.setValue(did);
  dateRange.setValue(new Date());
}

/*
* Get user dialog id, or create new one when time interval is longer than DIALOG_MAX_TIME
* userIndex - index of user
* return - user's dialog id
*/
function getUserDid(userIndex){
  var doc = SpreadsheetApp.openById(SHEET);
  var sheet = doc.getSheetByName(USERS_SHEET);
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var date = new Date(values[userIndex][1]);
  if ((new Date() - date)>DIALOG_MAX_TIME){
    return "";
  }else{
    return values[userIndex][2];
  }
}

/*
* Get all questions from question sheet
* return - all questions
*/
function getAllQuestions(){
  var doc = SpreadsheetApp.openById(SHEET);
  var sheet = doc.getSheetByName(QUESTIONS_SHEET);
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  return values;
}

/*
* Deletes question from question sheet
* index - index of question
*/
function deleteQuestion(index){
  var doc = SpreadsheetApp.openById(SHEET);
  var sheet = doc.getSheetByName(QUESTIONS_SHEET);
  sheet.deleteRow(index);
}

/*
* Set id of last tweet with question to last question sheet
* lastQuestionID - id of the last question
*/
function setLastQuestionID(lastQuestionId){
  var doc = SpreadsheetApp.openById(SHEET);
  var sheet = doc.getSheetByName(LAST_QUESTION_SHEET);
  var lastQuestionRange = sheet.getRange(1, 1);
  lastQuestionRange.setValue(lastQuestionId);
}

/*
* Get id of last tweet with question
* return - id of last tweet with question
*/
function getLastQuestionID(){
  var doc = SpreadsheetApp.openById(SHEET);
  var sheet = doc.getSheetByName(LAST_QUESTION_SHEET);
  var dataRange = sheet.getRange(1, 1);
  var id = dataRange.getValues();
  return id;
}

/*
* Find value in the sheet's column 
* value - value to search
* sheet - sheet in which to search
* column - column in which to search
* return - index of founded value or -1
*/
function findValue(value, sheet, column) {
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  for (var i = 0; i < values.length; i++) {
    if (values[i][column] == value){
      return i;
    }
  }
  return -1;
}