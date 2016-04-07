# YodaQA-twitter-bot
Twitter bot for YodaQA written in the Google's App Script. This bot searches Twitter for tweets with ``@askYodaQA``, takes its text, sends it to YodaQA and reply by answer from it.

##Try it
Ask bot by tweeting question with ``@askYodaQA``! Its Twitter account is https://twitter.com/askYodaQA.
You can use hashtags. You can tag other users and they will recieve answer also.

##Setup
* Create App Script project on the Google Drive
* Copy files from ``YodaQATwitterBot`` folder to project
* Create two documents on the Google Drive (one is for loging, the second for debuging)
* Copy their ids to ``Log.gs`` to ``LOG_DOCUMENT`` and ``DEBUG_DOCUMENT`` variables (Document's id is in the url. https://docs.google.com/spreadsheets/d/1Xn2Q0LnhXHjp0zxMICMjnYKOX3GuLcBC0pzXN7O0eXs/edit#gid=0 has id ``1Xn2Q0LnhXHjp0zxMICMjnYKOX3GuLcBC0pzXN7O0eXs`` for example)
* Create spreadsheet with three sheets named ``Users``, ``Questions`` and ``LastQuestion``. It will be used as memmory
* Copy its id to ``Memmory.gs`` ``SHEET`` variable
* Add project variables ``TWITTER_ACCESS_TOKEN``, ``TWITTER_CONSUMER_SECRET``, ``TWITTER_CONSUMER_KEY`` and ``TWITTER_ACCESS_SECRET`` (in the ``File - Project Settings - Script variables``) from Twitter app setting (which you have to create)
* Add libraries to project (in the ``Sources - Libraries``) ``Mb2Vpd5nfD3Pz-_a-39Q4VfxhMjh3Sh48`` and ``MKvHYYdYA4G5JJHj7hxIcoh8V4oX7X1M_``
* (Optional) change YodaQA's endpoint and client urls in the ``Main.gs`` by modifiing ``URL`` and ``CLIENT_URL`` variables
* Set projects triggers to run ``main`` every minute

##How does it work?
The trigger runs bot every minute. Bot searches for all tweets with ``@askYodaQA`` which has not been founded yet. It parses only question from tweet (deletes ``#`` from hashtags and ``@user``) and sends it to YodaQA. It saves user, question id, dialog id and tweet id to memmory sheet. It asks YodaQA for answer to all saved questions in the memmory sheet. It send's answer to author and all mentioned users in the tweet, right after the answer is completed.

It supports dialogs. When the question is asked in the interval of five minutes after the last question, than they are connected into one dialog.
