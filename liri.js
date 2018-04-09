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

function showTweets() {
    var tweetsUrl = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=URBootCampUser&count=5';
    twitterClient.get(tweetsUrl, 
        function (error, tweets, response) {
        var tweetsString = '';

        if (!error) {
            tweetsString = '\n';
            for (var i = 0; i < tweets.length; i++) {
                tweetsString += tweets[i].text + '\n';
            }
            console.log(tweetsString);
            log(tweetsString);
        }
        else {
            console.log('ERROR: ' + error);
            log(error);
        }
    });
}

function doWhatItSays(fileName) {
    var command = null, 
        arg = null, 
        openQuoteNdx = null,
        closeQuoteNdx = null;
    
    log('\nReceived command do-what-it-says with the file ' + 
        fileName + ' as the argument.\n');

    fs.readFile(fileName, "utf8", function(error, data) {
        data = data.split('');
        var commaNdx = data.indexOf(',');
        var firstString = data.slice(0, commaNdx).join('');
        var secondString = data.slice(commaNdx + 1).join('');
        handleInput(firstString, secondString);
    });    
}

function spotify(songName) {
    var responseString = null;
    if (!songName) {
        songName = 'The Sign, Ace of Base';
    }

    spotifyClient.search({ 
        type: 'track', 
        query: songName,
        limit: 1
    }).then(function(response) {
        responseString = createSpotifyResponse(response);
        console.log(responseString);
        log(responseString);
    }).catch(function(err) {
        console.log(err);
        log(err);
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
    var responseString = null;
    
    request(fullUrl, function (error, response, body) {
        responseString = createOmdbResponse(body);
        console.log(responseString);
        log(responseString);    
    });
}

function createSpotifyResponse(spotifyResponse) {
    var responseItem = spotifyResponse.tracks.items[0];
    var artistsString = '';
    
    // build a string with artists names
    for (var i = 0; i < responseItem.artists.length; i++) {
        artistsString += responseItem.artists[i].name + ' ';
    }

    var responseString = '\nArtist(s): ' + artistsString + '\n' +
        'Song Name: ' + responseItem.name + '\n' +
        'Preview Link: ' + responseItem.preview_url + '\n' +
        'Album: ' + responseItem.album.name + '\n';
    return responseString;
}

function createOmdbResponse(responseBody) {
    var omdbResponse = JSON.parse(responseBody);

    if (!omdbResponse.Response) {
        return omdbResponse.Error;
    }

    // indexes of ratings objects within the Ratings array
    var ratings = {
        imdb: 0,
        rottenTomatoes: 1,
        metacritic: 2
    };
    
    var responseString = '\nTitle: ' + omdbResponse.Title + '\n' + 
        'Released: ' + omdbResponse.Released + '\n' +
        'IMDB Rating: ' + omdbResponse.Ratings[ratings.imdb].Value + '\n' +
        'Rotten Tomatoes Rating: ' + omdbResponse.Ratings[ratings.rottenTomatoes].Value + '\n' +
        'Country: ' + omdbResponse.Country + '\n' +
        'Language: ' + omdbResponse.Language + '\n' +
        'Plot: ' + omdbResponse.Plot + '\n' +
        'Actors: ' + omdbResponse.Actors + '\n';
    return responseString;
}

function log(outputString) {
    outputString += '\n-----------------------------------------------\n'
    fs.appendFile('log.txt', outputString, function (error) {
        if (error) throw error;
    });
}

function handleInput(userCommand, commandArg) {
    userCommand = userCommand.toUpperCase();
    
    switch (userCommand) {
        case command.tweets: 
            showTweets();
            break;
        case command.do:
            doWhatItSays('random.txt');
            break;
        case command.spotify: 
            if (!commandArg) {
                commandArg = getUserCommandArg();
            }
            spotify(commandArg);            
            break;
        case command.movie:
            var movieTitle = getUserCommandArg() || 'Mr. Nobody';
            movie(movieTitle);
            break;
        default:
            var unknownCommandErr = '\nUnknown command entered\n'; 
            log(unknownCommandErr);
            console.log(unknownCommandErr);
            break; 
    }
}

handleInput(getUserCommand());