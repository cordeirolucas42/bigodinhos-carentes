// configurando pacotes npm
const {TwitterApi} = require("twitter-api-v2");
const EnvVar = require("dotenv");
EnvVar.config();

//definindo constantes referentes a localização da ONG
const UERJ = {long: -43.23620, lat: -22.91099}
// const RJCoord = {minLong:-43.791373, maxLong:-43.158286, minLat:-23.073988, maxLat: -22.802710}
//bbox: [ -43.795449, -23.08302, -43.0877068, -22.7398234 ]

//mensagem padrão
const defaultMsg = "Olá! Somos a Bigodinhos Carentes. Quer adotar um gatinho? Fale com a gente pelo instagram https://www.instagram.com/bigodinhoscarentes/ ou pela DM aqui no Twitter. Temos vários gatos precisando de amor e cuidados em busca de adoção responsável (Rio de Janeiro/RJ)."

//até quantos minutos atrás buscar tweets
const min_ago = 9.9;

//critérios de busca
const query = "adotar um gato"

const client = new TwitterApi({
    appKey: process.env.API_KEY,
    appSecret: process.env.API_SECRET_KEY,
    accessToken: process.env.ACCESS_TOKEN,
    accessSecret: process.env.ACCESS_TOKEN_SECRET
})

// código a ser executado a cada hora para checar se houve tweets relacionados a adoção de gatos
const getTweets = async () => {
    //calcula o start_time para a query a partir do tempo atual
    let start_time = (new Date(Date.now() - (min_ago*60*1000))).toISOString()
    //recupera o tweet fixado para utilizar como mensagem padrão do bot
    let twitter_pinned = await client.v2.userByUsername('BigodinhosRJ',{ expansions: "pinned_tweet_id"});
    let msg = twitter_pinned ? twitter_pinned.includes.tweets[0].text : defaultMsg

    //realiza query de tweets que não sejam retweets, a partir do start_time, adicionando campos de localização do tweet e do usuário, recuperando o máximo de tweets (100)
    const result = await client.v2.get('tweets/search/recent', { query: `${query} -is:retweet`, start_time:start_time, expansions: "geo.place_id,author_id","user.fields":"location", "place.fields": "full_name,geo,id","tweet.fields": "geo,created_at", max_results:100});

    // itera por todos os tweets que atendem aos critérios
    if (result.data) {
        for (const tweet of result.data) {
            // checa se o tweet tem localização
            if (tweet.geo) {
                let place = result.includes.places.filter(place => place.id === tweet.geo.place_id)[0]
                // checa se a ONG está inclusa na área em que o tweet foi feito
                if (place.geo.bbox[0] < UERJ.long && UERJ.long < place.geo.bbox[2] && place.geo.bbox[1] < UERJ.lat && UERJ.lat < place.geo.bbox[3]) {
                    console.log(tweet);
                    // envia repply para o tweet que achou, utilizando a mensagem fixada ou a mensagem padrão
                    await client.v1.reply(msg, tweet.id);
                }
            } else {
                // checa se o usuário adicionou localização no perfil e verifica se é RJ
                let userLocation = result.includes.users.filter(user => user.id === tweet.author_id)[0].location
                if (userLocation && userLocation.match(/(rj)|(janeiro|janero)|((?<=rio)\s*de\s*)/mgi)) {
                    console.log(tweet);
                    // envia repply para o tweet que achou, utilizando a mensagem fixada ou a mensagem padrão
                    await client.v1.reply(msg, tweet.id);
                }
            }
        }
    }    
}
getTweets()