var URL = "http://qa.ailao.eu:4568/q"; //URL of YodaQA endpoint
var CLIENT_URL="http://live.ailao.eu/"; //URL of YodaQA client

/*
* Main function to run the twitter bot
*/
function main(){
  getQuestionsFromTwitter();
  answerQuestionsToTwitter();
}

/*
* Search twitter for questions
*/
function getQuestionsFromTwitter(){
  var props = PropertiesService.getScriptProperties();
  var twit = new Twitterlib.OAuth(props);
  var options = {"multi": true,
                 "since_id": getLastQuestionID().toString()};
  var tweets = twit.fetchTweets("@askYodaQA",null,options);
  for(var i=0; i < tweets.length; i++){
    var tweet = tweets[i];
    if (i==0){
      setLastQuestionID(tweet["id_str"]);
      log("Setting last question id to: "+tweet["id_str"]);
    }
    if ("retweeted_status" in tweet){
      log("This is retweet. I skip this tweet")
      continue;
    }
    var otherUsersMentions = getUserMentions(tweet["text"]);
    log("Asked question: "+tweet["user"].screen_name+" | "+tweet["text"]+" | "+tweet["id_str"]+" | "+ otherUsersMentions);
    askedQuestion(tweet["user"].screen_name, tweet["text"].replace(/(@\S+)\s/gi,"").replaceAll("#",""), tweet["id_str"], otherUsersMentions);
  }
}


/*
* Answer questions
*/
function answerQuestionsToTwitter(){
  var props = PropertiesService.getScriptProperties();
  var twit = new Twitterlib.OAuth(props);
  var answeredQuestionsVar = answeredQuestions();
  for (var i = 0; i < answeredQuestionsVar.length; i++){
    var user = answeredQuestionsVar[i].user;
    var answer = answeredQuestionsVar[i].answer;
    var qid = answeredQuestionsVar[i].qid;
    var did = answeredQuestionsVar[i].did;
    var otherUsersMentions = answeredQuestionsVar[i].otherUsersMentions;
    var responseTweetID = answeredQuestionsVar[i].responseTweetID;
    var options = {"in_reply_to_status_id": responseTweetID};
    var tweetText=createTweetText(user, otherUsersMentions, answer, qid, did, twit);
    log("Answered question: "+tweetText+" | "+responseTweetID);
    twit.sendTweet(tweetText, options);
  }
}

/*
* Create text of final tweet
* user - user to answer
* otherUsersMentions - other users, who was mention in question tweet
* answer - answer of YodaQA
* qid - question id
* did - dialog id
* twit - connection to twitter
*/
function createTweetText(user, otherUsersMentions, answer, qid, did, twit){
  var text;
  if (otherUsersMentions == "" || otherUsersMentions == undefined){
    text = "@"+user+" "+answer;
  }else{
    text = "@"+user+" "+otherUsersMentions+" "+answer;
  }
  var lengthOfLink=twit.getShortUrlLength();
  lengthOfLink++; //add space between answer and link
  if (text.length>140-lengthOfLink){
        text = text.trunc(140-lengthOfLink,true);
  }
  text+=" "+CLIENT_URL+"?dID="+did+"&qID="+qid;
  return text;
}
  
/*
* Shorten the text to max n chars
* n - number of chars
* useWordBoundary - 
*/
String.prototype.trunc =
  function(n, useWordBoundary ){
    var isTooLong = this.length > n,
      s_ = isTooLong ? this.substr(0,n-3) : this;
    s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
    return  isTooLong ? s_ + '...' : s_;
  };
    
/*
* Get other users mentioned in the question tweet
* tweetText - text of question tweet
* return - all mentioned users
*/
function getUserMentions(tweetText){
  var pattern = /\B@[a-z0-9_-]+/gi;
  var mentions = tweetText.match(pattern);
  mentions = mentions.filter(isNotYodaQAMention);
  var userMentions = mentions.join([separator = ' ']);
  return userMentions;
}
    
/*
* Filter function, which keeps only strings not equal to @askyodaqa
* value - value to check
* return - true if value is not equal to @askyodaqa
*/
function isNotYodaQAMention(value) {
  return value.toLowerCase() != "@askyodaqa";
}