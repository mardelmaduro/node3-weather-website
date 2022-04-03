const axios = require('axios').default;

const apiKey = 'SlRsOY9UuDtxgC9PdhAP9cNVqEcwt5Ik';
const getRandomNumber = (min,max) =>
{
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const forecastGiphy =  (query, callback) =>
{
//query = 'cold';
//offset = 0;
//limit = 25;
//giphyResultArray = [];




const giphyAPIURL = 'https://api.giphy.com/v1/gifs/search?api_key=SlRsOY9UuDtxgC9PdhAP9cNVqEcwt5Ik&q='+query+'&limit='+getRandomNumber(25,35)+'&offset='+getRandomNumber(0,15)+'&rating=g&lang=en';

axios.get(giphyAPIURL)
  .then(function (response) {
    // handle success
    //console.log(typeof (response.data));

    var obj = response.data;
    var giphyResultArray = Object.entries(obj);

    //console.log(giphyResultArray ['0'][1][getRandomNumber(0,24)].embed_url);
    callback(giphyResultArray ['0'][1][getRandomNumber(0,24)].images['original'].url);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
    callback(error);
  });
};

module.exports = forecastGiphy;