require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var Request = require('request');
var keys = require('./keys');
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

var command = {
    tweets: 'MY-TWEETS',
    spotify: 'SPOTIFY-THIS-SONG',
    do: 'DO-WHAT-IT-SAYS',
    movie: 'MOVIE-THIS'
};

// converting command to upper case by default for sanity's sake
var userCommand = process.argv[2];
userCommand = userCommand.toUpperCase();

function showTweets() {
    console.log('Inside showTweets function.');    
}

function doWhatItSays() {
    console.log('Inside doWhatItSays function.');
}

function spotify() {
    console.log('Inside spotify function.');
}

function movie() {
    console.log('Inside movie function.');
}

switch (userCommand) {
    case command.tweets: 
        showTweets();
        break;
    case command.do:
        doWhatItSays();
        break;
    case command.spotify: 
        spotify();
        break;
    case command.movie:
        movie();
        break;
    default: 
        console.log('Unknown command entered.');
        break; 
}