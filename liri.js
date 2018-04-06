require("dotenv").config();
var fs = require('fs');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var keys = require('./keys');
var spotifyClient = new Spotify(keys.spotify);
var twitterClient = new Twitter(keys.twitter);

var command = {
    tweets: 'MY-TWEETS',
    spotify: 'SPOTIFY-THIS-SONG',
    do: 'DO-WHAT-IT-SAYS',
    movie: 'MOVIE-THIS'
};

function getUserCommand() {
    var userCommand = process.argv[2];
    // converting command to upper case by default for sanity's sake
    userCommand = userCommand.toUpperCase();
    return userCommand;
}

function getUserCommandArg() {
    var userCommandArg = process.argv.slice(3);
    return userCommandArg.join(' ');
}

function getCommandArgFromFile() {

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

function doWhatItSays(fileName) {
    var command = null, 
        arg = null, 
        openQuoteNdx = null,
        closeQuoteNdx = null;
    
    if (!fileName) {
        fileName = "random.txt";
    }
    
    fs.readFile(fileName, "utf8", function(error, data) {
        data = data.split('');
        var commaNdx = data.indexOf(',');
        var firstString = data.slice(0, commaNdx).join('');
        var secondString = data.slice(commaNdx).join('');
        handleInput(firstString, secondString);
    });    
}

function spotify(songName) {
    spotifyClient.search({ 
        type: 'track', 
        query: songName,
        limit: 10
    }).then(function(response) {
        console.log(response);
        // show the artist name

        // show the preview link from Spotify

        // show the album the song is off of
    }).catch(function(err) {
        console.log(err);
    });
}

function movie(title) {
    // form the omdb request url per documentation found here: omdbapi.com
    var apiKey = 'apikey=trilogy';
    var baseUrl = 'http://www.omdbapi.com/?';
    var plot = 'plot=full';
    var title = 't=' + title;
    var returnType = 'type=json';
    var fullUrl = baseUrl + apiKey + '&' + title + '&' + plot;
    
    var ratings = {
        imdb: 0,
        rottenTomatoes: 1,
        metacritic: 2
    };

    request(fullUrl, function (error, response, body) {
        var omdbResponse = JSON.parse(body);
        console.log('Title: ' + omdbResponse.Title);
        console.log('Release Year: ' + omdbResponse.Released);
        console.log('IMDB Rating: ' + omdbResponse.Ratings[ratings.imdb].Value);
        console.log('Rotten Tomatoes Rating: ' + omdbResponse.Ratings[ratings.rottenTomatoes].Value);
        console.log('Country: ' + omdbResponse.Country);
        console.log('Language: ' + omdbResponse.Language);
        console.log('Plot: ' + omdbResponse.Plot);
        console.log('Actors: ' + omdbResponse.Actors);
    });
}

function handleInput(userCommand, commandArg) {
    userCommand = userCommand.toUpperCase();
    
    switch (userCommand) {
        case command.tweets: 
            showTweets();
            break;
        case command.do:
            doWhatItSays();
            
            break;
        case command.spotify: 
            if (!commandArg) {
                commandArg = getUserCommandArg();
            }
            
            spotify(commandArg);
            break;
        case command.movie:
            var movieTitle = getUserCommandArg();
            movie(movieTitle);
            break;
        default: 
            console.log('Unknown command entered.');
            break; 
    }
}

handleInput(getUserCommand());