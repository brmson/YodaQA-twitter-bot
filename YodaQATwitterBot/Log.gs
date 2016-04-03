var LOG_DOCUMENT = "1j3S_mio1JgBrEevnIM1ae97lt_f94EMwbMA1RekqYEQ"; //id of log document
var DEBUG_DOCUMENT = "1LomG0uG-CoRxenfWR2ouy82m6-EQy_iXOnCE7ytUBfE"; //id of debug document

/*
* Log to log document
* log - message to log
*/
function log(log){
  var doc = DocumentApp.openById(LOG_DOCUMENT);
  var date = new Date();
  var dateToShow = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" "+date.getDate()+"."+date.getMonth()+"."+date.getFullYear();
  doc.getBody().appendParagraph(dateToShow+" "+log);
}

/*
* Write to debug document
* text - text to write
*/
function debug(text){
  var doc = DocumentApp.openById(DEBUG_DOCUMENT);
  doc.getBody().appendParagraph(text);
}