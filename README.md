# LIRI Application

## Commands
1. movie-this
2. do-what-it-says
3. spotify-this-song
4. my-tweets

### Movie This
The movie-this command grabs a provided movie's information from omdb.  Use the command as follows:

```shell 
node liri.js movie-this ghostbusters
``` 

### Do What It Says
The do-what-it-says command will check the contents of random.txt and based on the contents run another command.  Use the command as follows:

```shell 
node liri.js do-what-it-says
``` 

### Spotify This Song
The spotify this song command will grab the details of a provided song and print the details to the screen.

```shell
node liri.js spotify-this-song Stranglehold
```

Note that the above command will grab a lesser known version of Stranglehold.  If the user wanted the version of Stranglehold by Ted Nugent, the he/she could run the following command:

```shell
node liri.js spotify-this-song Stranglehold Ted Nugent
```

### My Tweets
The my tweets command will retrieve the tweets for the user specified in the project's .env file.

### Setting Up .env
The user should create a .env file with the following format, replacing values in the curly braces with the values generated while setting up their twitter and spotify applications:

```shell    
SPOTIFY_ID={YOUR_SPOTIFY_ID}
SPOTIFY_SECRET={YOUR_SPOTIFY_SECRET_KEY}

TWITTER_CONSUMER_KEY={YOUR_TWITTER_CONSUMER_KEY}
TWITTER_CONSUMER_SECRET={YOUR_TWITTER_CONSUMER_SECRET_KEY}
TWITTER_ACCESS_TOKEN_KEY={YOUR_TWITTER_ACCESS_TOKEN_KEY}
TWITTER_ACCESS_TOKEN_SECRET={YOUR_TWITTER_ACCESS_TOKEN_SECRET_KEY}
```