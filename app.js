
var util = require('util'),
    Twit = require('twit'),
    args = process.argv.slice(2),
    _ = require('underscore'),
    Hapi = require('hapi'),
    Good = require('good');

var server = new Hapi.Server('localhost', process.env.PORT || 3001);

var twit = new Twit({
    consumer_key: args[0],
    consumer_secret: args[1],
    access_token: args[2],
    access_token_secret: args[3]
});

server.route({
    method: 'GET',
    path: '/',
    handler: function(req, reply) {
        reply({
            _links: {
                'self': { href: '/' },
                '/retweets': { href: '/retweets/{screen_name}', templated: true }
            }
        });
    }
});
server.route({
    method: 'GET',
    path: '/retweets/{screen_name}',
    handler: function(req, reply) {

        twit.get('statuses/user_timeline', 
         {
             screen_name: req.params.screen_name, 
             exclude_replies: true, 
             include_rts: true, 
             count: req.query.count || 100
         }, 
         function(err, data, res) {

            var retweets = _.chain(data)
                .map(function(tweet) {
                    if (tweet.retweeted_status){
                        return {
                            id: tweet.retweeted_status.id_str,
                            created_at: tweet.created_at,
                            text: tweet.retweeted_status.text,
                            screen_name: tweet.retweeted_status.user.screen_name,
                            name: tweet.retweeted_status.user.name
                        };
                    } 
                })
                .filter(function(x) { return !!x; })
                .value();

                reply({
                    retweets: retweets,
                    _links: {
                        'self': { href: '/retweets/' + req.params.screen_name },
                        '/retweets': { href: '/retweets/{screen_name}', templated: true }
                    }
                });
        });
    }
});

var options = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        args:[{ log: '*', request: '*' }]
    }]
};

server.pack.register({
    plugin: require('good'),
    options: options
    }, function (err) {
        if (err) {
            console.log(err);
            return;
        }

        server.start(function() {
            console.log('Server started at: ' + server.info.uri);
        });

});
