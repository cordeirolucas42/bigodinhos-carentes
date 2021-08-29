const {TwitterApi} = require("twitter-api-v2");
const EnvVar = require("dotenv");
EnvVar.config();

const client = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET_KEY,
    accessToken: process.env.BEARER_TOKEN
})

const getTweets = async () => {
    const jsTweets = await client.v2.search('JavaScript', { 'media.fields': 'url' });

    // Consume every possible tweet of jsTweets (until rate limit is hit)
    for await (const tweet of jsTweets) {
        console.log(tweet);
    }

}
getTweets()