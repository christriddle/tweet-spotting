var util = require('util'),
    Twit = require('twit'),
    arguments = process.argv.slice(2),
    _ = require('underscore');

var twit = new Twit({
    consumer_key: arguments[0],
    consumer_secret: arguments[1],
    access_token: arguments[2],
    access_token_secret: arguments[3]
});

twit.get('statuses/user_timeline', {screen_name: 'thefoodjoint', exclude_replies: true, include_rts: true, count: 10}, function(err, data, res) {
    _.each(data, function(tweet) {
        if (tweet.retweeted_status){
            console.log(tweet.retweeted_status.text);
            console.log(util.inspect(tweet));
            console.log('------------');
        }
    });
});
