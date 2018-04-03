require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var Request = require('request');
var keys = require('./keys');
var spotifyClient = new Spotify(keys.spotify);
var twitterClient = new Twitter(keys.twitter);

var command = {
    tweets: 'MY-TWEETS',
    spotify: 'SPOTIFY-THIS-SONG',
    do: 'DO-WHAT-IT-SAYS',
    movie: 'MOVIE-THIS'
};

// converting command to upper case by default for sanity's sake
function getUserCommand() {
    var userCommand = process.argv[2];
    userCommand = userCommand.toUpperCase();
    return userCommand;
}

function getUserCommandArg() {
    var userCommandArg = process.argv[3];
    return userCommandArg;
}

function showTweets() {
    twitterClient.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=URBootCampUser&count=5', 
        function (error, tweets, response) {
        
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
                console.log('\n');
            }
        }
        else {
            console.log('ERROR: ' + error);
        }
    });
}

function doWhatItSays() {
    console.log('Inside doWhatItSays function.');
}

function spotify(songName) {
    spotifyClient.search({ 
        type: 'track', 
        query: songName,
        limit: 1
    }).then(function(response) {
        console.log(response);
    }).catch(function(err) {
        console.log(err);
    });
}

function movie() {
    console.log('Inside movie function.');
}

switch (getUserCommand()) {
    case command.tweets: 
        showTweets();
        break;
    case command.do:
        doWhatItSays();
        break;
    case command.spotify: 
        var songName = getUserCommandArg();
        spotify(songName);
        break;
    case command.movie:
        movie();
        break;
    default: 
        console.log('Unknown command entered.');
        break; 
}