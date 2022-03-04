const { response } = require('express');
const request = require('request');

const apiKey = '9ccec11754969db5aea54915fff5d365';

const forecast = (latitude,longitude, callback) =>
{
const apiKey = '9ccec11754969db5aea54915fff5d365';
    const weatherAPIUrl = 'http://api.weatherstack.com/current?access_key='+apiKey+'&query='+latitude+','+longitude;

    request({url: weatherAPIUrl, json: true}, (error,reponse) => 
    {
        if(error)
        {
            callback('Unable to conenction to weather services!', undefined);
        }
        else if (reponse.body.error)
        {   
            callback('Error : '+reponse.body.error.info,undefined);
        }
        else
        {
            callback(undefined, 
                {
                    conditions: reponse.body.current.weather_descriptions,
                    temperature : reponse.body.current.temperature,
                    feelslike : reponse.body.current.feelslike,
                    precipitation : reponse.body.current.precip,
                    icons : reponse.body.current.weather_icons
                });
        }
    });
};

//forecast('49.9','97.13', (req,res) => {console.log(res)} );

module.exports = forecast;